import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector, useDebounce, useSocket } from 'modules/core/hooks'
import type { IFileUpload, IMessageContentFile, IMessageContentImage } from '../types'
import { selectCurrentRoomId, selectCurrentRoomInfo, selectStatusCurrentRoom } from '../states/roomSlice'
import { cancelReplyMessage, messageSelector } from '../states/messageSlice'
import { authSelector } from 'modules/auth/states/authSlice'
import { messageServices } from '../services'

const useChatForm = () => {
  const [fileSelections, setFileSelections] = useState<IFileUpload[]>([])
  const [markdownContent, setMarkdownContent] = useState<string>('')

  const [visibleEmojiPicker, setVisibleEmojiPicker] = useState<boolean>(false)
  const [visibleMenuMessageExtra, setVisibleMenuMessageExtra] = useState<boolean>(false)

  const refTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dispatch = useAppDispatch()
  const { emitEvent } = useSocket()
  //room state
  const roomSelectedId = useAppSelector(selectCurrentRoomId)
  const roomSelectedInfo = useAppSelector(selectCurrentRoomInfo)
  const roomSelectedStatus = useAppSelector(selectStatusCurrentRoom)
  //msg state
  const replyMessage = useAppSelector(messageSelector.selectReplyMessage)
  //user state
  const userLogin = useAppSelector(authSelector.selectUser)

  const debounceValue = useDebounce(markdownContent, 200)
  /*-----------------Bussiess logic-------------------*/
  const createNewConversation = useCallback(
    (filePaths: Array<{ url: string; altText: string }>) => {
      if (!userLogin?._id || !roomSelectedInfo?._id) return
      const data = {
        roomInfo: {
          _id: roomSelectedId,
          sender: userLogin?._id,
          recipient: roomSelectedInfo?._id,
        },
        message: {
          content: {
            text: markdownContent,
            images: filePaths,
          },
          ownerId: userLogin?._id,
        },
      }
      emitEvent('room:createRoomChat', data)
    },
    [markdownContent],
  )

  const sendMsgWithExistConversation = useCallback(
    (uploadedFile?: { images: IMessageContentImage[]; files: IMessageContentFile[] }) => {
      const msg = {
        content: {
          text: markdownContent ? markdownContent.trim() : null,
          images: uploadedFile?.images || [],
          files: uploadedFile?.files || [],
        },
        ownerId: userLogin?._id,
        roomId: roomSelectedId,
        replyTo: replyMessage?._id,
      }
      emitEvent('chat:sendMessage', {
        msg,
        replyMessage,
        recipientId: roomSelectedInfo?._id,
      })
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
    // detect user stop typing after one seconds
    if (typeof refTimer.current === 'number') clearTimeout(refTimer.current)
    refTimer.current = setTimeout(() => {
      emitEvent('chat:typing', {
        roomId: roomSelectedId,
        isTyping: false,
        userId: userLogin?._id,
      })
    }, 1000)
  }, [])

  const handleSubmit = async () => {
    if (!markdownContent.trim() && !fileSelections.length) return
    let uploadedFile
    if (fileSelections.length > 0) {
      uploadedFile = await uploadFilesToServer()
    }
    if (fileSelections.length > 0 && !uploadedFile) return

    try {
      if (roomSelectedStatus) createNewConversation(uploadedFile)
      else sendMsgWithExistConversation(uploadedFile)
      //clear files preview
      setFileSelections([])
      setMarkdownContent('')
    } catch (error) {
      console.log(error)
    }
  }

  /*--------------------------Side effect-----------*/

  useEffect(() => {
    if (!debounceValue) return
    emitEvent('chat:typing', {
      roomId: roomSelectedId,
      isTyping: true,
      userId: userLogin?._id,
    })
  }, [debounceValue])

  useEffect(() => {
    // reset
    setMarkdownContent('')
    setFileSelections([])
  }, [roomSelectedId])

  return {
    markdownContent,
    userLogin,
    roomSelectedInfo,
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
