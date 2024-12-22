import { useState, useCallback } from 'react'
import { useAppSelector, useAppDispatch } from 'modules/core/hooks'
import { createCommentAsync } from '../states/commentActions'
import { useSocket } from 'modules/core/hooks'
import { useLocation } from 'react-router-dom'
import { notifyServices } from '../services'
import { SOCKET_EVENTS } from 'const'

interface UsePostCommentProps {
  postId?: string
  userOfPost?: string
}
export const usePostComment = ({ postId, userOfPost }: UsePostCommentProps) => {
  const { emitEvent } = useSocket()
  const [openEditor, setOpenEditor] = useState<boolean>(false)
  const [comment, setComment] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const { pathname } = useLocation()

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
      ownerId,
    }: {
      replyTo?: string | null
      root: boolean
      rootId?: string
      depth?: number | null
      ownerId?: string
    }) => {
      if (!userOfPost) {
        console.log('usePostCommnet', 'userOfPost is required')
        return
      }
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
        let notificationRequestData = []
        const notificationData = [
          {
            sender: userLogin?._id,
            recipient: userOfPost,
            type: 'comment',
            metadata: {
              resource_url: pathname,
              message: `You have a new comment from <strong>${userLogin?.display_name}</strong> on your post`,
            },
          },
          {
            sender: userLogin?._id,
            recipient: ownerId,
            type: 'comment',
            metadata: {
              resource_url: pathname,
              message: `<strong>${userLogin?.display_name}</strong> has replied to your comment`,
            },
          },
        ]

        if (userLogin?._id === userOfPost) {
          if (ownerId && userLogin?._id !== ownerId)
            notificationRequestData = notificationData.filter((item) => item.recipient === ownerId)
        } else {
          if (ownerId && userLogin?._id !== ownerId) notificationRequestData = notificationData
          else if (ownerId && userLogin?._id === ownerId) {
            notificationRequestData = notificationData.filter((item) => item.recipient === userOfPost)
          } else if (!ownerId)
            notificationRequestData = notificationData.filter((item) => item.recipient === userOfPost)
        }
        if (notificationRequestData?.length > 0) {
          const responseNotifications = await notifyServices.createNotify({
            type: 'comment',
            notifications: notificationRequestData,
          })
          emitEvent(SOCKET_EVENTS.NOTIFYCATION.SEND, responseNotifications, (response: any) => {
            console.log('comment notification response', response)
          })
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
    [comment, userLogin, postId, userOfPost],
  )

  return { handleSubmit, handleEditorChange, handleOpenEditor, handleCloseEditor, openEditor, comment, loading }
}
