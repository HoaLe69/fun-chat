import React, { useState } from 'react'
import classNames from 'classnames'
// type
import type { MessageType } from '../lib/app.type'
// mock data
import { messages } from '../api/mock'
import { user } from '../api/mock'
// -----UI component
import Message from './message'
import UserAvatar from './user-avatar'
import { PlusCircleIcon, SendIcon, LaughIcon } from './icons'

const MessageContainer = (): JSX.Element => {
  return (
    <div className="flex-1 h-screen bg-grey-50 dark:bg-grey-950 overflow-x-hidden">
      <div className="flex flex-col h-full">
        <MessageHeader />
        <div className="flex-1 flex flex-col justify-end h-[calc(100vh-68px)]">
          <div className="h-full overflow-y-auto overflow-x-hidden">
            {messages.map((message: MessageType) => (
              <Message key={message.id} {...message} />
            ))}
          </div>
          <MessageTyping />
        </div>
      </div>
    </div>
  )
}

export default MessageContainer

const MessageHeader: React.FC = () => {
  return (
    <div className="h-[68px] bg-grey-50 dark:bg-grey-900 border-b-2 border-grey-300 dark:border-grey-700">
      <div className="flex items-center h-full p-2 gap-4">
        <UserAvatar alt={user.name} src={user.picture} size="md" />
        <div className="flex flex-col justify-start">
          <p className="font-bold leading-5">{user.name}</p>
          <span className="text-grey-500 text-sm">Online for 10 mins</span>
        </div>
      </div>
    </div>
  )
}

const MessageTyping: React.FC = () => {
  const [isActiveSend, setIsActiveSend] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  // Event handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (!value) {
      setIsActiveSend(false)
      setMessage(value)
      return
    }
    setIsActiveSend(true)
    setMessage(value)
  }
  return (
    <div className="border-t-2 bg-grey-50 dark:bg-grey-900 border-grey-300 dark:border-grey-700 h-14 py-1">
      <div className="flex items-center h-full px-3">
        <span className="text-grey-500">
          <PlusCircleIcon />
        </span>
        <div className="flex-1 h-full px-3">
          <div
            className={classNames(
              'flex items-center h-full border-grey-300 dark:border-grey-700 focus-within:border-blue-500  dark:focus-within:border-blue-400 rounded-3xl flex-1 pl-4 pr-2 border-2 bg-grey-50 dark:bg-grey-900 caret-blue-500 ',
            )}
          >
            <input
              value={message}
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
        <span
          className={classNames(
            'w-10 h-10 rounded-full inline-flex items-center justify-center',
            { 'bg-grey-400 dark:bg-grey-600': !isActiveSend },
            { 'bg-blue-500 dark:bg-blue-400': isActiveSend },
          )}
        >
          <SendIcon />
        </span>
      </div>
    </div>
  )
}
