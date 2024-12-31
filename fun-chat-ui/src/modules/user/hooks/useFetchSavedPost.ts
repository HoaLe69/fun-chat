import { useState, useEffect, useCallback } from 'react'
import { useAppSelector } from 'modules/core/hooks'
import { authSelector } from 'modules/auth/states/authSlice'
import { postServices } from 'modules/community/services'
import { userServices } from '../services'
import type { IPostCustom } from 'modules/community/types'

const useFetchSavedPost = () => {
  const userLoginId = useAppSelector(authSelector.selectUserId)

  const [savedPosts, setSavedPost] = useState<IPostCustom[]>([])

  const loadSavedPosts = useCallback(async (userLoginId: string) => {
    const userActivity = await userServices.getUserActivity(userLoginId)

    const processedSavedPosts = userActivity.saved_post.map((postId: string) =>
      postServices.getPostByIdPopulateCommunity(postId),
    )

    const savedPosts = await Promise.all(processedSavedPosts)
    setSavedPost(savedPosts)
  }, [])

  useEffect(() => {
    if (!userLoginId) return
    loadSavedPosts(userLoginId)
  }, [userLoginId])

  return { savedPosts }
}

export default useFetchSavedPost
