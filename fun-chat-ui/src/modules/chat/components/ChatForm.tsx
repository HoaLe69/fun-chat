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

const ChatForm: React.FC = () => {
  const [textMessage, setTextMessage] = useState<string>('')
  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState<boolean>(false)
  const refInput = useRef<HTMLInputElement>(null)
  const refTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dispatch = useAppDispatch()
  const { emitEvent } = useSocket()

  const roomSelectedId = useAppSelector(selectCurrentRoomId)
  const roomSelectedInfo = useAppSelector(selectCurrentRoomInfo)
  const roomSelectedStatus = useAppSelector(selectStatusCurrentRoom)
  const replyMessage = useAppSelector(messageSelector.selectReplyMessage)
  const debounceValue = useDebounce(textMessage, 200)

  const userLogin = useAppSelector(authSelector.selectUser)

  const createNewChat = useCallback(() => {
    console.log('start with new chat')
    if (!userLogin?._id || !roomSelectedInfo?._id) return
    const data = {
      roomInfo: {
        _id: roomSelectedId,
        sender: userLogin?._id,
        recipient: roomSelectedInfo?._id,
      },
      message: {
        text: textMessage,
        ownerId: userLogin?._id,
      },
    }
    emitEvent('room:createRoomChat', data)
  }, [textMessage])

  const resetChatForm = useCallback(() => {
    const inputEl = refInput.current
    if (inputEl) {
      inputEl.focus()
    }
    setTextMessage('')
  }, [refInput])

  const chatWithFriend = () => {
    if (replyMessage) dispatch(cancelReplyMessage())
    const msg = {
      text: textMessage,
      ownerId: userLogin?._id,
      roomId: roomSelectedId,
      replyTo: replyMessage?._id,
    }
    emitEvent('chat:sendMessage', { msg, recipientId: roomSelectedInfo?._id })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!textMessage.trim()) return
    try {
      if (roomSelectedStatus) createNewChat()
      else chatWithFriend()
      resetChatForm()
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (!debounceValue) return
    // emit event here
    emitEvent('chat:typing', {
      roomId: roomSelectedId,
      isTyping: true,
      userId: userLogin?._id,
    })
  }, [debounceValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setTextMessage(value)

    //detect user stop typing after two second
    if (typeof refTimer.current === 'number') clearTimeout(refTimer.current)
    refTimer.current = setTimeout(() => {
      //emit event here
      emitEvent('chat:typing', {
        roomId: roomSelectedId,
        isTyping: false,
        userId: userLogin?._id,
      })
    }, 1000)
  }

  const appendEmojiToText = useCallback((emoji: string) => {
    setTextMessage(pre => pre + emoji)
  }, [])

  const onClose = () => {
    setIsOpenEmojiPicker(false)
  }

  const handleCancelReplyMessage = useCallback(() => {
    dispatch(cancelReplyMessage())
  }, [])

  return (
    <div className="border-t-2 bg-grey-50 dark:bg-grey-900 border-grey-300 dark:border-grey-700 py-2">
      {replyMessage && (
        <div className="px-3 pb-3">
          <div className="flex items-center justify-between">
            <span className="text-xl/8 block font-semibold">
              Reply to{' '}
              {replyMessage.ownerId === userLogin?._id ?
                'yourself'
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
          className="flex-1 flex gap-2 items-center px-2"
        >
          <div
            className={classNames(
              'flex items-center h-full border-grey-300 dark:border-grey-700 focus-within:border-blue-500  dark:focus-within:border-blue-400 rounded-3xl flex-1 pl-4 pr-2 border-2 bg-grey-50 dark:bg-grey-900 caret-blue-500 ',
            )}
          >
            <input
              ref={refInput}
              value={textMessage}
              autoComplete="off"
              onChange={handleInputChange}
              className="flex-1 dark:bg-grey-900 outline-none border-none pr-2 py-3"
              name="message"
              id="message"
              placeholder="Type your message"
            />
            <span className="text-grey-500 relative">
              <LaughIcon
                className="cursor-pointer"
                onClick={e => {
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
          </div>
          <button
            type="submit"
            className={classNames(
              'w-10 h-10 rounded-full inline-flex items-center justify-center',
              textMessage.trim().length === 0 ?
                'bg-grey-400 dark:bg-grey-600'
              : 'bg-blue-500 dark:bg-blue-400',
            )}
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  )
}

export default memo(ChatForm)
