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