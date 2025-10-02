import { USER_STARTED_TYPING_MUTATION } from "@/graphql/mutations/message/UserStartedTyping"
import { USER_STOPPED_TYPING_MUTATION } from "@/graphql/mutations/message/UserStopedTyping"
import { USER_STARTED_TYPING_SUBSCRIPTION } from "@/graphql/subscriptions/UserStartedTyping"
import { USER_STOPPED_TYPING_SUBSCRIPTION } from "@/graphql/subscriptions/UserStoppendTyping"
import { useMutation, useSubscription } from "@apollo/client/react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

type TypingUser = {
  id: string
  firstname: string
  email: string
  avatarUrl?: string | null
}

interface TypingSubscriptionData {
  userStartedTyping?: TypingUser | null
}

interface StoppedTypingSubscriptionData {
  userStoppedTyping?: TypingUser | null
}

export const useTypping = (chatroomId: string | null, currentUserId: string | null) => {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])

  const subscriptionVariables = useMemo(() => {
    if (!chatroomId || !currentUserId) return undefined
    return {
      chatroomId,
      userId: currentUserId,
    }
  }, [chatroomId, currentUserId])

  const { data: typingData } = useSubscription<TypingSubscriptionData>(
    USER_STARTED_TYPING_SUBSCRIPTION,
    {
      variables: subscriptionVariables,
      skip: !subscriptionVariables,
    }
  )

  const { data: stoppedTypingData } = useSubscription<StoppedTypingSubscriptionData>(
    USER_STOPPED_TYPING_SUBSCRIPTION,
    {
      variables: subscriptionVariables,
      skip: !subscriptionVariables,
    }
  )

  const [userStartedTypingMutation] = useMutation(USER_STARTED_TYPING_MUTATION)
  const [userStoppedTypingMutation] = useMutation(USER_STOPPED_TYPING_MUTATION)

  useEffect(() => {
    const user = typingData?.userStartedTyping
    if (!user || !user.id) return

    setTypingUsers((prevUsers) => {
      if (prevUsers.some((item) => item.id === user.id)) {
        return prevUsers
      }
      return [...prevUsers, user]
    })
  }, [typingData])

  const typingTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  useEffect(() => {
    const user = stoppedTypingData?.userStoppedTyping
    if (!user || !user.id) return

    const timeoutId = typingTimeoutsRef.current[user.id]
    if (timeoutId) {
      clearTimeout(timeoutId)
      delete typingTimeoutsRef.current[user.id]
    }

    setTypingUsers((prevUsers) => prevUsers.filter((item) => item.id !== user.id))
  }, [stoppedTypingData])

  const handleUserStoppedTyping = useCallback(async () => {
    if (!chatroomId) return
    await userStoppedTypingMutation({ variables: { chatroomId } })
  }, [chatroomId, userStoppedTypingMutation])

  const handleUserStartedTyping = useCallback(async () => {
    if (!chatroomId || !currentUserId) return

    await userStartedTypingMutation({ variables: { chatroomId } })

    const existingTimeout = typingTimeoutsRef.current[currentUserId]
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }

    typingTimeoutsRef.current[currentUserId] = setTimeout(async () => {
      setTypingUsers((prevUsers) => prevUsers.filter((user) => user.id !== currentUserId))
      await handleUserStoppedTyping()
    }, 2000)
  }, [chatroomId, currentUserId, handleUserStoppedTyping, userStartedTypingMutation])

  useEffect(() => {
    return () => {
      Object.values(typingTimeoutsRef.current).forEach((timeoutId) => clearTimeout(timeoutId))
    }
  }, [])

  return {
    typingUsers,
    handleUserStartedTyping,
    handleUserStoppedTyping,
    typingTimeoutsRef,
  }
}