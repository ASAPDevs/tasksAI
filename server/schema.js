const { gql } = require("apollo-server-express");
const { GraphQLError } = require("graphql");
const bcrypt = require("bcrypt");
const db = require("./models/db");

const typeDefs = gql`
  type Query {
    getTasksByDay(date: String!, user_id: Int): [Task]
  }

  type Mutation {
    login(username: String!, password: String!): User!
    signup(email: String!, username: String!, password: String!): User!
    changePassword(userInput: ChangePassWordInput): User!
    createTask(task: TaskInput): Task!
    updateTask(task: UpdateTaskInput): Task
    deleteTask(id: ID!): Boolean
    completeTask(id: ID!): Boolean
    pushTask(id: ID!, newStartTime: String!, newEndTime: String!): Boolean
  }


  input ChangePassWordInput {
    username: String!
    oldPassword: String!
    newPassword: String!
  }

  input TaskInput {
    id: ID
    task_name: String
    task_description: String
    date: String
    time_start: String
    time_finished: String
    completed: Boolean
    user_id: Int
  }

  input UpdateTaskInput {
    id: ID
    task_name: String
    task_description: String
    date: String
    time_start: String
    time_finished: String
    completed: Boolean
  }

  type User {
    id: ID!
    username: String
    email: String
  }

  type Task {
    id: ID!
    task_name: String
    task_description: String
    date: String
    time_start: String
    time_finished: String
    completed: Boolean
    user_id: Int
    user: User
  }
`;
const resolvers = {
  Task: {
    user: async (parent, args) => {
      //Find User from UserTable using parent.userID
      const { user_id } = parent;
      const user = await db.query("SELECT * FROM users WHERE id = $1;", [
        user_id,
      ]);
      console.log("Associated User: " + user.rows[0]);
      return user.rows[0];
    },
  },
  Query: {
    getTasksByDay: async (_, args) => {
      // grab day from args and use to get tasks for the day
      const { date, user_id } = args; //"1670522400000"

      // date: '2022-12-11'   1day = 86.4 mil ms
      // const dateToQuery = new Date(date.split('-').map(el => Number(el)));
      // const startOfDay = dateToQuery.getTime();
      const startOfDay = new Date(date).getTime();
      const endOfDay = startOfDay + 86400000;
      const params = [startOfDay - 1, endOfDay, user_id];
      // console.log('date', date)
      // console.log('startOfDay', startOfDay - 1)
      // console.log('endOfDay', endOfDay)
      const task = await db.query(
        "SELECT * FROM tasks WHERE date > $1 AND date < $2 AND user_id = ($3);",
        params
      );
      console.log("Checking Task in getTaskByday: " + task.rows);
      return task.rows;
    },
  },
  Mutation: {
    login: async (_, args) => {
      // grab username and password from args to verify >>> DB model
      const { username, password } = args;
      // Check if any input field is empty
      if (!username || !password) {
        throw new GraphQLError("Invalid fields");
      }

      const result = await db.query(
        "SELECT * FROM users WHERE username = $1;",
        [username]
      );
      const user = result.rows[0];
      if (!user) {
        throw new GraphQLError("No user");
      }

      // Verify password against hased password in database
      if (await bcrypt.compare(password, user.password)) {
        return user;
      } else {
        throw new GraphQLError("Password is incorrect");
      }

      // if (user.password !== password) {
      //   throw new GraphQLError('Password is incorrect');
      // }
      // return user;
    },
    signup: async (_, args) => {
      // create user with email username and pass from args
      const { username, email, password } = args;
      // Check if any input field is empty
      if (!username || !email || !password) {
        throw new GraphQLError("Invalid fields");
      }

      // Check if email or username are already taken
      const dbResult = await db.query(
        "SELECT username FROM users WHERE username = $1",
        [username]
      );
      const existingUsername = dbResult.rows[0];
      if (existingUsername) {
        throw new GraphQLError(
          "Username is not available. Please choose another"
        );
      }
      const dbResult1 = await db.query(
        "SELECT email FROM users WHERE email = $1",
        [email]
      );
      const existingEmail = dbResult1.rows[0];
      if (existingEmail) {
        throw new GraphQLError("Email is not available. Please choose another");
      }

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await db.query(
        "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id, username, email;",
        [username, hashedPassword, email]
      );

      return newUser.rows[0];
    },
    changePassword: async (_, args) => {
      const { username, oldPassword, newPassword } = args.userInput;
      console.log(username, oldPassword, newPassword);
      // Check if there is a same username exists in database. Throw error if not
      const dbResult = await db.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const existingUser = dbResult.rows[0];
      if (!existingUser) {
        throw new GraphQLError("User does not exist");
      }

      // Verify old password against hashed password in database
      if (await bcrypt.compare(oldPassword, existingUser.password)) {
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);
        const updatedUser = await db.query(
          "UPDATE users SET password = $1 WHERE username = $2 RETURNING id, username, email;",
          [newHashedPassword, username]
        );
        return updatedUser.rows[0];
      } else {
        throw new GraphQLError(
          "Invalid password. Please provide correct password"
        );
      }
    },
    createTask: async (_, args) => {
      // post req to Task db table
      const {
        task_name,
        task_description,
        date,
        time_start,
        time_finished,
        completed,
        user_id,
      } = args.task;

      const newTask = await db.query(
        "INSERT INTO tasks (task_name, task_description, date, time_start, time_finished, completed, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;",
        [
          task_name,
          task_description,
          date,
          time_start,
          time_finished,
          completed,
          user_id,
        ]
      );
      return newTask.rows[0];
    },
    updateTask: async (_, args) => {
      const {
        id,
        task_name,
        task_description,
        date,
        time_start,
        time_finished,
        completed,
      } = args.task;

      const queryString = `UPDATE tasks SET task_name = $1, task_description = $2, date = $3, time_start = $4, time_finished = $5, completed = $6 WHERE id = $7 RETURNING *;`;
      const updatedTask = await db.query(queryString, [
        task_name,
        task_description,
        date,
        time_start,
        time_finished,
        completed,
        id,
      ]);
      return updatedTask.rows[0];
    },
    deleteTask: async (_, args) => {
      const { id } = args;
      const task = await db.query(
        "DELETE FROM tasks WHERE id = $1 RETURNING *;",
        [id]
      );
      return task.rowCount < 1 ? false : true;
    },
    completeTask: async (_, args) => {
      const { id } = args;
      const completedTask = await db.query(
        "UPDATE tasks SET completed = true WHERE id = $1 RETURNING *;",
        [id]
      );
      return completedTask.rowCount < 1 ? false : true;
    },
    pushTask: async (_, args) => {
      const { id, newStartTime, newEndTime } = args;
      console.log("Check args in pushTask: ", args)
      const updatedTask = await db.query("UPDATE tasks SET time_start = $1, time_finished = $2 WHERE id = $3 RETURNING *;", [newStartTime, newEndTime, id])
      console.log("Pushed this task x hours: ", updatedTask)
      return updatedTask.rowCount < 1 ? false : true;
    }
  },
};

module.exports = { typeDefs, resolvers };
