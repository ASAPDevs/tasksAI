const { gql } = require('apollo-server-express');
const { GraphQLError } = require('graphql');
const db = require("./models/db")

const typeDefs = gql`
  type Query {
    getTasksByDay(date: String!, user_id: Int): [Task]
  }

  type Mutation {
    login(username: String!, password: String!): User!
    signup(email: String!, username: String!, password: String!): User!
    createTask(task: TaskInput): Task!
    updateTask(task: TaskInput): Task
    deleteTask(id: ID!): Boolean
  }

  input TaskInput {
    task_name: String,
    task_description: String,
    date: String,
    time_start: String,
    time_finished: String,
    completed: Boolean,
    user_id: Int 
  }
  
  type User {
    id: ID!,
    username: String,
    email: String,
  }

  type Task {
    id: ID!,
    task_name: String,
    task_description: String,
    date: String,
    time_start: String,
    time_finished: String,
    completed: Boolean
    user_id: Int,
    user: User,
  }
`


const resolvers = {
  Task: {
    user: async (parent, args) => {
      //Find User from UserTable using parent.userID
      const { user_id } = parent;
      const user = await db.query('SELECT * FROM users WHERE id = $1;', [user_id]);
      console.log("Associated User: " + user.rows[0]);
      return user.rows[0];
    }
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
      const params = [startOfDay - 1, endOfDay, user_id]
      // console.log('date', date)
      // console.log('startOfDay', startOfDay - 1)
      // console.log('endOfDay', endOfDay)
      const task = await db.query('SELECT * FROM tasks WHERE date > $1 AND date < $2 AND user_id = ($3);', params)
      console.log("Checking Task in getTaskByday: " + task.rows)
      return task.rows;
    }
  },
  Mutation: {
    login: async (_, args) => {
      // grab username and password from args to verify >>> DB model
      const { username, password } = args;
      const result = await db.query('SELECT * FROM users WHERE username = $1;', [username]);
      const user = result.rows[0];
      if (!user) {
        throw new GraphQLError('No user', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        });
      }
      if (user.password !== password) {
        throw new GraphQLError('Password is incorrect', {
          extensions: {
            code: 'BAD_USER_INPUT',
            http: {
              status: 400
            }
          }
        });
      }
      return user;
    },
    signup: async (_, args) => {
      // create user with email username and pass from args
      const { username, email, password } = args;
      const newUser = await db.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *;', [username, password, email]);
      return newUser.rows[0];
    },
    createTask: async (_, args) => {
      // post req to Task db table
      const { task_name, task_description, date, time_start, time_finished, completed, user_id } = args.task;
      // console.log("Checking new task input: ", args.task)
      const newTask = await db.query('INSERT INTO tasks (task_name, task_description, date, time_start, time_finished, completed, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;', [task_name, task_description, date, time_start, time_finished, completed, user_id]);
      return newTask.rows[0];
    },
    // updateTask: async (_, args) => {
    //   const { id, task_name, task_description, date, time_start, time_finished, completed} = args.task;
    //   const updatedTask = await db.

    // },
    deleteTask: async (_, args) => {
      const { id } = args;
      const task = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING *;', [id]);
      return task.rowCount < 1 ? false : true
    }
  }
}


module.exports = { typeDefs, resolvers };