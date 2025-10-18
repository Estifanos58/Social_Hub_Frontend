'use client'

import { MessageContainer } from '@/components/custom/message/MessageContainer'
import { useGeneralStore } from '@/store/generalStore'
import React, { useEffect } from 'react'

function page() {
  const {setShowPopup, setIsCollapsed, setSelectedPopUp} = useGeneralStore()
  useEffect(()=>{
    setShowPopup(true);
    setIsCollapsed(true);
    setSelectedPopUp("message")
  },[])
  return (
        <MessageContainer message="Select a chat to start messaging." />
  )
}

export default page