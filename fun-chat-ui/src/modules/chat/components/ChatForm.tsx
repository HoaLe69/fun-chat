import React, { useState, useRef, useCallback, memo, useEffect } from 'react'
import classNames from 'classnames'
import {
  SendIcon,
  LaughIcon,
  CloseIcon,
  PlusCircleIcon,
} from 'modules/core/components/icons'

import EmojiPicker from './EmojiPicker'
import {
  useAppSelector,
  useSocket,
  useDebounce,
  useAppDispatch,
} from 'modules/core/hooks'
import {
  selectCurrentRoomId,
  selectCurrentRoomInfo,
  selectStatusCurrentRoom,
} from '../states/roomSlice'
import { authSelector } from 'modules/auth/states/authSlice'
import { cancelReplyMessage, messageSelector } from '../states/messageSlice'
import { MDXEditor, MDXEditorMethods, headingsPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import './MdxEditor.css'

const ChatForm: React.FC = () => {
  const [editorKey, setEditorKey] = useState(0)
  const [markdownContent, setMarkdownContent] = useState<string>('')
  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState<boolean>(false)
  const mdxEditorRef = useRef<MDXEditorMethods>(null)
  const refTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dispatch = useAppDispatch()
  const { emitEvent } = useSocket()

  const roomSelectedId = useAppSelector(selectCurrentRoomId)
  const roomSelectedInfo = useAppSelector(selectCurrentRoomInfo)
  const roomSelectedStatus = useAppSelector(selectStatusCurrentRoom)
  const replyMessage = useAppSelector(messageSelector.selectReplyMessage)
  const debounceValue = useDebounce(markdownContent, 200)

  const userLogin = useAppSelector(authSelector.selectUser)

  useEffect(() => {
    // reset
    setMarkdownContent('')
    const mdxEditorEl = mdxEditorRef.current
    if (mdxEditorEl) mdxEditorEl.focus()
  }, [roomSelectedId])

  const createNewChat = useCallback(() => {
    if (!userLogin?._id || !roomSelectedInfo?._id) return
    const data = {
      roomInfo: {
        _id: roomSelectedId,
        sender: userLogin?._id,
        recipient: roomSelectedInfo?._id,
      },
      message: {
        text: markdownContent,
        ownerId: userLogin?._id,
      },
    }
    emitEvent('room:createRoomChat', data)
  }, [markdownContent])

  const chatWithFriend = () => {
    if (replyMessage) dispatch(cancelReplyMessage())
    const msg = {
      text: markdownContent,
      ownerId: userLogin?._id,
      roomId: roomSelectedId,
      replyTo: replyMessage?._id,
    }
    emitEvent('chat:sendMessage', { msg, recipientId: roomSelectedInfo?._id })
  }

  const handleSubmit = () => {
    if (!markdownContent.trim()) return
    try {
      if (roomSelectedStatus) createNewChat()
      else chatWithFriend()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!debounceValue) return
    emitEvent('chat:typing', {
      roomId: roomSelectedId,
      isTyping: true,
      userId: userLogin?._id,
    })
  }, [debounceValue])

  const appendEmojiToText = useCallback(
    (emoji: string) => {
      if (!emoji) return
      const mdxEditorEl = mdxEditorRef.current
      if (mdxEditorEl) {
        mdxEditorEl.focus(() => {
          mdxEditorEl.insertMarkdown(emoji)
        })
      }
      //append emoji to markdownContent
    },
    [mdxEditorRef],
  )
  const onClose = () => {
    setIsOpenEmojiPicker(false)
  }

  const handleCancelReplyMessage = useCallback(() => {
    dispatch(cancelReplyMessage())
  }, [])

  const handleChange = (markdown: string) => {
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
  }

  const handleKeydown = (e: React.KeyboardEvent) => {
    const mdxEditorEl = mdxEditorRef.current
    if (mdxEditorEl) {
      const key = e.key
      // user submit form
      if (key === 'Enter' && !e.shiftKey) {
        handleSubmit()
        // send a message here
        mdxEditorEl.setMarkdown('') // clear editor
        setEditorKey((pre) => pre + 1) // force re-render editor
        setMarkdownContent('')
      }
    }
  }

  return (
    <div className="border-t-2 bg-grey-50 dark:bg-grey-900 border-grey-300 dark:border-grey-700 py-2">
      {replyMessage && (
        <div className="px-3 pb-3">
          <div className="flex items-center justify-between">
            <span className="text-xl/8 block font-semibold">
              Reply to{' '}
              {replyMessage.ownerId === userLogin?._id
                ? 'yourself'
                : roomSelectedInfo?.name}
            </span>
            <button
              onClick={handleCancelReplyMessage}
              className="text-xs text-grey-400 p-3 mr-2 hover:bg-grey-200 hover:dark:bg-grey-800 rounded-full cursor-pointer"
            >
              <CloseIcon />
            </button>
          </div>
          <p className="truncate text-sm text-grey-500">
            {replyMessage.content}
          </p>
        </div>
      )}
      <div className="flex items-center px-3">
        <span className="text-grey-500 ">
          <PlusCircleIcon />
        </span>
        <form
          onSubmit={handleSubmit}
          onKeyDown={handleKeydown}
          className="flex-1 flex gap-2 items-center px-2"
        >
          <MDXEditor
            key={editorKey}
            autoFocus
            ref={mdxEditorRef}
            onChange={(value) => handleChange(value)}
            className="editor"
            markdown={''}
            placeholder="Enter your message..."
            plugins={[headingsPlugin()]}
          />
          <span className="text-grey-500 relative">
            <LaughIcon
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                setIsOpenEmojiPicker(true)
              }}
            />
            <EmojiPicker
              appendEmojiToText={appendEmojiToText}
              isOpen={isOpenEmojiPicker}
              onClose={onClose}
            />
          </span>
        </form>
        <button
          onClick={handleSubmit}
          className={classNames(
            'w-10 h-10 rounded-full inline-flex items-center justify-center',
            markdownContent.trim().length === 0
              ? 'bg-grey-400 dark:bg-grey-600'
              : 'bg-blue-500 dark:bg-blue-400',
          )}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  )
}

export default memo(ChatForm)
