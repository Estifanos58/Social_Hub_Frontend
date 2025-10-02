import { gql } from "@apollo/client"

export const USER_STARTED_TYPING_MUTATION = gql`
  mutation UserStartedTypingMutation($chatroomId: String!) {
    userStartedTypingMutation(chatroomId: $chatroomId) {
      id
      firstname
      email
    }
  }
`
