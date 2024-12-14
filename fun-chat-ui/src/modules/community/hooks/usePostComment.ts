import { useState, useCallback } from 'react'
import { useAppSelector, useAppDispatch } from 'modules/core/hooks'
import { createCommentAsync } from '../states/commentActions'

interface UsePostCommentProps {
  postId?: string
}
export const usePostComment = ({ postId }: UsePostCommentProps) => {
  const [openEditor, setOpenEditor] = useState<boolean>(false)
  const [comment, setComment] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useAppDispatch()

  const userLogin = useAppSelector((state) => state.auth.user)
  const handleOpenEditor = useCallback(() => {
    setOpenEditor(true)
  }, [])

  const handleCloseEditor = useCallback(() => {
    setOpenEditor(false)
  }, [])

  const handleEditorChange = useCallback((val: string) => {
    setComment(val)
  }, [])
  const handleSubmit = useCallback(
    async ({
      replyTo,
      root,
      rootId,
      depth,
    }: {
      replyTo?: string | null
      root: boolean
      rootId?: string
      depth?: number | null
    }) => {
      if (!comment || !userLogin?._id || !postId) return
      setLoading(true)
      try {
        const formData = {
          ownerId: userLogin?._id,
          content: comment,
          postId,
          replyTo,
          root,
          depth,
        }
        dispatch(createCommentAsync({ formData, rootId }))
        setComment('')
        setOpenEditor(false)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    },
    [comment, userLogin, postId],
  )

  return { handleSubmit, handleEditorChange, handleOpenEditor, handleCloseEditor, openEditor, comment, loading }
}
