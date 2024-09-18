import React, { useState, useRef, useEffect } from 'react'
import classNames from 'classnames'
import {
  SendIcon,
  LaughIcon,
  PlusCircleIcon,
} from 'modules/core/components/icons'
import { useSocket } from 'modules/core/hooks'
import { roomServices } from 'modules/chat/services/roomServices'
import { messageServices } from '../services/messageServices'
import { authSelector } from 'modules/auth/states/authSlice'
import {
  addRoomChat,
  selectedRoomId,
  updateLatestMessage,
} from 'modules/chat/states/roomSlice'
import { useAppDispatch, useAppSelector, useDebounce } from 'modules/core/hooks'
import { STATUS_CODES } from 'const'

import EmojiPicker from './EmojiPicker'

type Props = {
  roomId: string | null
  userLoginId: string | null
  recipientId?: string | null
}

const ChatForm: React.FC<Props> = ({ roomId, userLoginId, recipientId }) => {
  const dispatch = useAppDispatch()
  const { sendMessage } = useSocket()
  const [textMessage, setTextMessage] = useState<string>('')
  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState<boolean>(false)
  const refInput = useRef<HTMLInputElement>(null)
  const userLogin = useAppSelector(authSelector.selectUser)

  const debounceTextMessage = useDebounce(textMessage, 300)

  const addNewMessage = async (roomId: string, createdAt?: string) => {
    const message = {
      ownerId: userLogin?._id,
      text: textMessage,
      roomId,
      createdAt,
    }
    const msg = await messageServices.createMessage(message)
    return msg
  }

  const startWithNewChat = async () => {
    try {
      const room = {
        members: [userLoginId, recipientId],
        status: 'spam',
        latestMessage: {
          text: textMessage,
          createdAt: Date.now().toString(),
          ownerId: userLoginId,
        },
      }
      const response = await roomServices.createRoom({ room })
      if (response?.status === STATUS_CODES.CREATED) {
        await addNewMessage(
          response?.data._id,
          response?.data.latestMessage.createdAt,
        )
        dispatch(selectedRoomId(response.data._id))
        dispatch(addRoomChat(response?.data))
        sendMessage({
          destination: 'room:createRoomChat',
          data: { roomInfo: response?.data, recipientId },
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const startWithExistChat = async () => {
    try {
      if (!roomId) return
      const msg = await addNewMessage(roomId)
      sendMessage({
        destination: 'chat:sendMessage',
        data: {
          ...msg,
          recipientId,
        },
      })
      dispatch(
        updateLatestMessage({
          roomId: msg.roomId,
          latestMessage: {
            text: msg.text,
            createdAt: msg.createdAt,
            ownerId: msg.ownerId,
          },
        }),
      )
    } catch (error) {
      console.log(error)
    }
  }

  const resetForm = () => {
    setTextMessage('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!textMessage) return
    if (!roomId) {
      await startWithNewChat()
    } else {
      startWithExistChat()
    }
    resetForm()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setTextMessage(value)
  }

  useEffect(() => {
    setTextMessage('')
  }, [roomId])

  useEffect(() => {
    const timerID = setTimeout(() => {
      console.log('user stop typing')
      sendMessage({
        destination: 'chat:typingStop',
        data: {
          roomId,
          userId: userLoginId,
        },
      })
    }, 1000)
    if (!debounceTextMessage) return
    sendMessage({
      destination: 'chat:typingStart',
      data: { roomId, userId: userLoginId },
    })

    return () => clearTimeout(timerID)
  }, [debounceTextMessage])

  const appendEmojiToText = (emoji: string) => {
    setTextMessage(pre => pre + emoji)
  }

  const onClose = () => {
    setIsOpenEmojiPicker(false)
  }

  return (
    <div className="border-t-2 bg-grey-50 dark:bg-grey-900 border-grey-300 dark:border-grey-700 h-14 py-1">
      <div className="flex items-center h-full px-3">
        <span className="text-grey-500 ">
          <PlusCircleIcon />
        </span>
        <form
          onSubmit={handleSubmit}
          className="h-full w-full flex items-center"
        >
          <div className="flex-1 h-full px-3">
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
                className="h-full flex-1 dark:bg-grey-900 outline-none border-none pr-2"
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
          </div>
          <button
            type="submit"
            className={classNames(
              'w-10 h-10 rounded-full inline-flex items-center justify-center',
              textMessage?.length == 0
                ? 'bg-grey-400 dark:bg-grey-600'
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

export default ChatForm
