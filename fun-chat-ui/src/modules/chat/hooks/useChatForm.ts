import React, { useState, useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector, useDebounce, useSocket } from 'modules/core/hooks'
import type { IFileUpload } from '../types'
import { addMessage, cancelReplyMessage, messageSelector } from '../states/messageSlice'
import { authSelector } from 'modules/auth/states/authSlice'
import { messageServices } from '../services'
import { SOCKET_EVENTS } from 'const'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

type UseChatFormProps = {
  msgContainer: React.RefObject<HTMLDivElement>
}
const useChatForm = ({ msgContainer }: UseChatFormProps) => {
  const [fileSelections, setFileSelections] = useState<IFileUpload[]>([])
  const [markdownContent, setMarkdownContent] = useState<string>('')
  const [isSending, setIsSending] = useState<boolean>(false)

  const [visibleEmojiPicker, setVisibleEmojiPicker] = useState<boolean>(false)
  const [visibleMenuMessageExtra, setVisibleMenuMessageExtra] = useState<boolean>(false)

  const { roomId, userId: recipientId } = useParams()

  const dispatch = useAppDispatch()
  const { emitEvent } = useSocket()
  const replyMessage = useAppSelector(messageSelector.selectReplyMessage)
  const userLoginId = useAppSelector(authSelector.selectUserId)
  const debounceValue = useDebounce(markdownContent, 200)

  /*-----------------Bussiess logic-------------------*/

  const uploadFilesToServer = useCallback(async () => {
    if (!fileSelections.length) return
    try {
      const originalFiles = fileSelections.map((file) => file.original)
      const filePaths = await messageServices.uploadFiles(originalFiles)
      return filePaths
    } catch (error) {
      console.log(error)
    }
  }, [fileSelections])

  const handleFileSelectionAndPreview = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const target = event?.target as HTMLInputElement

      if (target.files?.length) {
        const file = target.files[0]
        const preview = {
          name: file?.name,
          path: file.type.includes('image')
            ? URL.createObjectURL(file)
            : //@ts-ignore
              file?.name,
          size: file?.size,
          type: file?.type,
        }
        setFileSelections((previous) => [
          ...previous,
          {
            preview,
            original: file,
          },
        ])
      }
      handleCloseMenuMessageExtra()
    },
    [fileSelections],
  )

  const handleAppendEmojiToMarkdownContent = useCallback((emoji: string) => {
    setMarkdownContent((pre) => pre + emoji)
  }, [])

  /*----------------------Event handler-----------------*/
  const handleCloseEmojiPicker = useCallback(() => {
    setVisibleEmojiPicker(false)
  }, [])

  const handleOpenEmojiPicker = useCallback((event: MouseEvent<SVGSVGElement>) => {
    event.stopPropagation()
    setVisibleEmojiPicker(true)
  }, [])
  const handleOpenMenuMessageExtra = useCallback(() => {
    setVisibleMenuMessageExtra(true)
  }, [])

  const handleCloseMenuMessageExtra = useCallback(() => {
    setVisibleMenuMessageExtra(false)
  }, [])

  const handleRemoveReplyMessage = useCallback(() => {
    dispatch(cancelReplyMessage())
  }, [])

  const handleEditorChange = useCallback((markdown: string) => {
    setMarkdownContent(markdown)
  }, [])

  const handleSubmit = async () => {
    if (!markdownContent.trim() && !fileSelections.length) return
    setIsSending(true)
    try {
      const formData = new FormData()
      const msg = {
        content: {
          text: markdownContent ? markdownContent.trim() : null,
          images: [],
          files: [],
        },
        ownerId: userLoginId,
        roomId,
        replyTo: replyMessage?._id,
      }
      console.log({ msg })

      formData.append('msg', JSON.stringify(msg))
      formData.append('recipientId', JSON.stringify(recipientId))
      if (replyMessage) {
        formData.append('replyMessage', JSON.stringify(replyMessage))
      }

      if (fileSelections.length > 0) {
        const originalFiles = fileSelections.map((file) => file.original)
        originalFiles.forEach((file) => {
          formData.append('files', file)
        })
      }

      const response = await messageServices.createMessage(formData)

      console.log('respose', response)

      emitEvent(
        SOCKET_EVENTS.MESSAGE.SEND,
        { data: JSON.stringify({ msg: response.message, room: response.room, replyMessage, recipientId }) },
        (response: any) => {
          dispatch(addMessage(response))
          const msgContainerEl = msgContainer.current
          if (msgContainerEl) {
            setTimeout(() => {
              msgContainerEl.scrollTop = msgContainerEl.scrollHeight
            }, 0)
          }
        },
      )
    } catch (error) {
      toast.error('Failed to send message')
      console.log(error)
    } finally {
      setFileSelections([])
      setMarkdownContent('')
      setIsSending(false)
    }
  }

  /*--------------------------Side effect-----------*/

  useEffect(() => {
    // reset
    setMarkdownContent('')
    setFileSelections([])
    if (replyMessage) {
      dispatch(cancelReplyMessage())
    }
  }, [roomId])

  return {
    isSending,
    markdownContent,
    userLoginId,
    replyMessage,
    fileSelections,
    visibleEmojiPicker,
    visibleMenuMessageExtra,
    setFileSelections,
    debounceValue,
    handleAppendEmojiToMarkdownContent,
    handleCloseEmojiPicker,
    handleOpenMenuMessageExtra,
    handleCloseMenuMessageExtra,
    handleRemoveReplyMessage,
    handleEditorChange,
    handleSubmit,
    handleFileSelectionAndPreview,
    handleOpenEmojiPicker,
  }
}

export default useChatForm
