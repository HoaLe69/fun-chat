import React, { useState, useRef } from 'react'
import classNames from 'classnames'
import { SendIcon, LaughIcon, PlusCircleIcon } from 'components/icons'
import useDebounce from 'hooks/useDebounce'
import useSocket from 'hooks/useSocket'
import { createRoomAsync } from 'api/room.api'
import { createMessageAsync } from 'api/message.api'
import { userSelector } from 'redux/user.store'
import { addRoomChat, selectedRoomId } from 'redux/room.store'
import { useAppDispatch, useAppSelector } from 'hooks'
import { STATUS_CODES } from 'const'

type Props = {
  roomId: string | null
  userLoginId: string | null
  recipientId?: string | null
}

const ChatForm: React.FC<Props> = ({ roomId, userLoginId, recipientId }) => {
  const dispatch = useAppDispatch()
  const userLogin = useAppSelector(userSelector.selectUser)
  const [isActiveSendBtn, setIsActiveSendBtn] = useState<boolean>(false)
  const [textMessage, setTextMessage] = useState<string>('')
  const { sendMessage } = useSocket()
  const refInput = useRef<HTMLInputElement>(null)

  const addNewMessage = async (roomId: string) => {
    const message = {
      ownerId: userLogin?._id,
      text: textMessage,
      roomId,
    }
    await createMessageAsync(message)
  }

  const startWithNewChat = async () => {
    try {
      const room = {
        members: [userLoginId, recipientId],
        status: 'spam',
        latestMessage: {
          text: textMessage,
          createdAt: Date.now(),
        },
      }
      // @ts-ignore
      const response = await createRoomAsync({ room })
      if (response?.status === STATUS_CODES.CREATED) {
        await addNewMessage(response?.data._id)
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

  const debounceValue = useDebounce(textMessage, 200)

  const resetForm = () => {
    setTextMessage('')
    setIsActiveSendBtn(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!debounceValue) return
    if (!roomId) {
      await startWithNewChat()
    }
    resetForm()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setTextMessage(value)
    if (!isActiveSendBtn) {
      setIsActiveSendBtn(true)
    }
  }

  return (
    <div className="border-t-2 bg-grey-50 dark:bg-grey-900 border-grey-300 dark:border-grey-700 h-14 py-1">
      <div className="flex items-center h-full px-3">
        <span className="text-grey-500">
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
                onChange={handleChange}
                className="h-full flex-1 dark:bg-grey-900 outline-none border-none pr-2"
                name="message"
                id="message"
                placeholder="Type your message"
              />
              <span className="text-grey-500 ">
                <LaughIcon />
              </span>
            </div>
          </div>
          <button
            type="submit"
            className={classNames(
              'w-10 h-10 rounded-full inline-flex items-center justify-center',
              { 'bg-grey-400 dark:bg-grey-600': !isActiveSendBtn },
              { 'bg-blue-500 dark:bg-blue-400': isActiveSendBtn },
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
