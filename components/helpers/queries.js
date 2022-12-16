import { gql } from "@apollo/client";

export const GET_TODAYS_TASKS = gql`
  query getTasksByDay($date: String!, $user_id: Int) {
    getTasksByDay(date: $date, user_id: $user_id) {
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