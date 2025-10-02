import { gql } from "@apollo/client"

export const USER_STARTED_TYPING_SUBSCRIPTION = gql`
  subscription UserStartedTyping($chatroomId: String!, $userId: String!) {
    userStartedTyping(chatroomId: $chatroomId, userId: $userId) {
      id
      firstname
      email
      avatarUrl
    }
  }
`