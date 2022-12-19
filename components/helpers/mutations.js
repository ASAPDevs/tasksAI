import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      email
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $username: String!, $password: String!) {
    signup(email: $email, password: $password, username: $username) {
      id
      username
      email
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($userInput: ChangePassWordInput!) {
    changePassword(userInput: $userInput) {
      id
      username
      email
    }
  }
`;

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
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($task: UpdateTaskInput) {
    updateTask(task: $task) {
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
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($taskId: ID!) {
    deleteTask(id: $taskId)
  }
`;

export const COMPLETE_TASK = gql`
  mutation CompleteTask($taskId: ID!) {
    completeTask(id: $taskId)
  }
`;

export const PUSH_TASK = gql`
  mutation PushTask($id: ID!, $newStartTime: String!, $newEndTime: String!) {
    pushTask(id: $id, newStartTime: $newStartTime, newEndTime: $newEndTime)
  }
`