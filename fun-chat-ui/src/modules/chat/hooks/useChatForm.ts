import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector, useDebounce, useSocket } from 'modules/core/hooks'
import type { IFileUpload, IMessageContentFile, IMessageContentImage } from '../types'
import { addMessage, cancelReplyMessage, messageSelector } from '../states/messageSlice'
import { authSelector } from 'modules/auth/states/authSlice'
import { messageServices } from '../services'
import { SOCKET_EVENTS } from 'const'
import { useParams } from 'react-router-dom'

const useChatForm = () => {
  const [fileSelections, setFileSelections] = useState<IFileUpload[]>([])
  const [markdownContent, setMarkdownContent] = useState<string>('')

  const [visibleEmojiPicker, setVisibleEmojiPicker] = useState<boolean>(false)
  const [visibleMenuMessageExtra, setVisibleMenuMessageExtra] = useState<boolean>(false)

  const { roomId, userId: recipientId } = useParams()

  const dispatch = useAppDispatch()
  const { emitEvent } = useSocket()
  const replyMessage = useAppSelector(messageSelector.selectReplyMessage)
  const userLoginId = useAppSelector(authSelector.selectUserId)
  const debounceValue = useDebounce(markdownContent, 200)

  /*-----------------Bussiess logic-------------------*/
  const sendMessage = useCallback(
    (uploadedFile?: { images: IMessageContentImage[]; files: IMessageContentFile[] }) => {
      const msg = {
        content: {
          text: markdownContent ? markdownContent.trim() : null,
          images: uploadedFile?.images || [],
          files: uploadedFile?.files || [],
        },
        ownerId: userLoginId,
        roomId,
        replyTo: replyMessage?._id,
      }
      emitEvent(
        SOCKET_EVENTS.MESSAGE.SEND,
        {
          msg,
          replyMessage,
          recipientId,
        },
        (response: any) => {
          dispatch(addMessage(response))
        },
      )
      if (replyMessage) dispatch(cancelReplyMessage())
    },
    [replyMessage, markdownContent],
  )

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
      //FIX: it's doesn't work when change room
      console.log('file change', target)

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
    let uploadedFile
    if (fileSelections.length > 0) {
      uploadedFile = await uploadFilesToServer()
    }
    if (fileSelections.length > 0 && !uploadedFile) return

    try {
      sendMessage(uploadedFile)
      //clear files preview
      setFileSelections([])
      setMarkdownContent('')
    } catch (error) {
      console.log(error)
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
