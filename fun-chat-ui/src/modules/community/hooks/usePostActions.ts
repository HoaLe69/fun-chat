import { useCallback, useMemo } from 'react'
import { postServices } from '../services/postServices'
import { useAppSelector } from 'modules/core/hooks'

import type { IPost } from '../types'

interface usePostActionsProps {
  updatePostState: (newPost: IPost) => void
  postState: IPost | null
}

const usePostActions = ({ updatePostState, postState }: usePostActionsProps) => {
  const userLogin = useAppSelector((state) => state.auth.user)

  const activeVoteButton = useMemo((): 'upvote' | 'downvote' | null => {
    if (!userLogin?._id || !postState) return null
    if (postState.upvoted.includes(userLogin._id)) return 'upvote'
    if (postState.downvoted.includes(userLogin._id)) return 'downvote'
    return null
  }, [userLogin, postState])

  const numberOfVote = useMemo(() => {
    if (postState === null) return 0
    return postState.upvoted.length - postState.downvoted.length
  }, [postState])

  const handleUpvote = useCallback(
    async (event: React.MouseEvent, postId: string) => {
      event.preventDefault()
      if (!postId || !userLogin?._id) return
      try {
        const res = await postServices.upvotePost(postId, userLogin._id)
        updatePostState(res)
      } catch (error) {
        console.error(error)
      }
    },
    [userLogin],
  )
  const handleDownvote = useCallback(
    async (event: React.MouseEvent, postId: string) => {
      event.preventDefault()
      if (!postId || !userLogin?._id) return
      try {
        const res = await postServices.downvotePost(postId, userLogin._id)
        updatePostState(res)
      } catch (error) {
        console.error(error)
      }
    },
    [userLogin],
  )

  const handleComment = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      console.log('comment click')
    },
    [userLogin],
  )
  return { handleUpvote, handleDownvote, handleComment, activeVoteButton, numberOfVote }
}

export default usePostActions
