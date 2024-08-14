import React, { useEffect, useState, useRef } from 'react'
import classNames from 'classnames'
import { SendIcon, LaughIcon, PlusCircleIcon } from 'components/icons'
import useDebounce from 'hooks/useDebounce'

import { createMessageAsync } from 'api/message.api'

type Props = {
  sendMessage: (
    destination: string,
    d: { content?: string; isTyping?: boolean },
  ) => void
  channelId?: string
  senderId: string | null
}

const ChatForm: React.FC<Props> = ({ sendMessage, channelId, senderId }) => {
  const [isActiveSend, setIsActiveSend] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const refInput = useRef<HTMLInputElement>(null)

  const debounceValue = useDebounce(message, 200)

  useEffect(() => {
    if (!debounceValue.trim()) return
    sendMessage('typing', { isTyping: true })
  }, [debounceValue])
  // Event handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (!value) {
      setIsActiveSend(false)
      setMessage(value)
      return
    }
    setIsActiveSend(true)
    setMessage(value)
  }

  // detect receive user is stop typing
  useEffect(() => {
    const inputEl = refInput.current
    let timer: number
    const detectStopTyping = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        sendMessage('typing', { isTyping: false })
      }, 1000)
    }
    inputEl?.addEventListener('keyup', detectStopTyping)
    return () => inputEl?.removeEventListener('keyup', detectStopTyping)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!message.trim()) return
    sendMessage('sendMessage', { content: message })
    setMessage('')
    setIsActiveSend(false)
    const msg = {
      channel_id: channelId,
      userId: senderId,
      content: message,
    }
    await createMessageAsync(msg)
    sendMessage('typing', { isTyping: false })
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
                value={message}
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
              { 'bg-grey-400 dark:bg-grey-600': !isActiveSend },
              { 'bg-blue-500 dark:bg-blue-400': isActiveSend },
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
