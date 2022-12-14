import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      email
    }
  }
`

export const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $username: String!, $password: String!) {
    signup(email: $email, password: $password, username: $username) {
      id
      username
      email
    }
  }
`

export const CREATE_TASKS = gql`
  mutation CreateTask($task: TaskInput) {
    createTask(task: $task) {
      id
      task_name
      task_description
      date
      time_start
      time_finished
      completed
      user_id
    }
  }
`

export const DELETE_TASK = gql`
  mutation DeleteTask($taskId: ID!) {
    deleteTask(id: $taskId)
  }
`