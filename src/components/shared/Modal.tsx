'use client'

import { useGeneralStore } from '@/store/generalStore'
import React from 'react'
import { PostDetailModal } from '../custom/PostDetailModal'

function Modal() {
      const { selectedPost, setSelectedPost} = useGeneralStore()
    
  return (
       <PostDetailModal isOpen={selectedPost?.id ? true : false} onClose={() => setSelectedPost(null)} post={selectedPost!} />

  )
}

export default Modal