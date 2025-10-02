import { gql } from "@apollo/client"

export const USER_STOPPED_TYPING_MUTATION = gql`
  mutation UserStoppedTypingMutation($chatroomId: String!) {
    userStoppedTypingMutation(chatroomId: $chatroomId) {
      id
      firstname
      email
    }
  }
`