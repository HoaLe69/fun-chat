import React, { useState, useRef } from 'react'
import classNames from 'classnames'
import {
  SendIcon,
  LaughIcon,
  PlusCircleIcon,
} from 'modules/core/components/icons'

import EmojiPicker from './EmojiPicker'

const ChatForm: React.FC = () => {
  const [textMessage, setTextMessage] = useState<string>('')
  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState<boolean>(false)
  const refInput = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setTextMessage(value)
  }

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
