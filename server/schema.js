const { ApolloServer, gql } = require('apollo-server-express');
const db = require("./models/db")
// import { startStandaloneServer } from '@apollo/server/standalone';


const typeDefs = gql`
  type Query {
    getTaskByDay(date: Int): [Task!]
  }

  type Mutation {
    login(username: String, password: String): User!
    signup(email: String!, username: String!, password: String!): User!
    createTask(task: TaskInput): Task!
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
    dailyTask: [Task]
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
  User: {
    dailyTask: async (parent, args, context, info) => {
      //use today date to find associated tasks with this user and date?
      //can use parent.id but how will get today date
      const result = await db.query();
    }
  },
  Task: {
    user: async(parent, args, context, info) => {
      //Find User from UserTable using parent.userID
    }
  },
  Query: {
    // getUserData: async(root, args, context, info) => {
    //   // grab username from args to grab user data 
    // },
    getTaskByDay: async(root, args, context, info) => {
      // grab day from args and use to get tasks for the day
    }
  },
  Mutation: {
    login: async(root, args, context, info) => {
      // grab username and password from args to verify >>> DB model
      const {username, password} = args;
      console.log("username: " + username)
      const result = await db.query(`SELECT * FROM users WHERE username = '${username}'`);
      console.log("RESULT: ", result.rows[0])
      return result.rows[0];
    },
    signup: async(root, args, context, info) => {
      // create user with email username and pass from args
      const {username, email, password} = args;
      const newUser = await db.query(`INSERT INTO users (username, password, email) VALUES ('${username}', '${password}', '${email}') RETURNING *`);
      return newUser.rows[0];
    },
    createTask: async(root, args, context, info) => {
      // post req to Task db table
      const {task_name, task_description, date, time_start, time_finished, completed, user_id} = args.task;
      console.log("Checking new task input: ", args)
      const newTask = await db.query(`
      INSERT INTO tasks 
      (task_name, task_description, date, time_start, time_finished, completed, user_id) 
      VALUES 
      ('${task_name}', '${task_description}', '${date}', '${time_start}', '${time_finished}', ${completed}, ${user_id}) 
      RETURNING *
      `)
      console.log("Checking new task: ", newTask.rows[0])
      return newTask.rows[0]
    },
      
  }
}


module.exports = {typeDefs, resolvers};