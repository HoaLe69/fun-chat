import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { UserType, type MessageType } from '../../lib/app.type'

import Message from './message'
import UserAvatar from '../user-avatar'
import { PlusCircleIcon, SendIcon, LaughIcon } from '../icons'
import Empty from '../common/empty-sate'
import { socket } from '../../hooks/useSocket'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../hooks'
import { userSelector } from '../../redux/user.store'
import { roomSelector } from '../../redux/channel.store'
import { fetchUser } from '../../api/user.api'
import { createMessageAsync } from '../../api/message.api'
import { apiClient } from '../../api/apiClient'

const MessageContainer = (): JSX.Element => {
  const [messages, setMessages] = useState([])
  const [partner, setPartner] = useState<UserType>()

  // id esstensial from store
  const roomSelectedId = useAppSelector(roomSelector.selectRoomId)
  const partnerId = useAppSelector(roomSelector.selectRoomPartnerId)
  // fallback id use it when user reloading page
  const { roomId: roomIdFromParam, partnerId: partnerIdFromParam } = useParams()
  const user = useAppSelector(userSelector.selectUser)

  const channelId = roomSelectedId || roomIdFromParam
  const otherId = partnerId || partnerIdFromParam

  const isEmpty = false

  useEffect(() => {
    if (channelId) {
      socket.emit('join', channelId)
    }
  }, [channelId])

  useEffect(() => {
    socket.on('getMessage', msg => {
      //@ts-ignore
      setMessages(pre => [...pre, msg])
    })
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchUser(otherId)
      const msgs = await apiClient.get(`/message/list/${channelId}`)
      if (res) setPartner(res)
      if (msgs) setMessages(msgs.data)
    }
    fetchData()
  }, [channelId, otherId])

  const sendMessage = (message: string) => {
    socket.emit('sendMessage', {
      content: message,
      room: channelId,
      userId: user?._id,
    })
  }
  if (!channelId || !otherId)
    return (
      <div className="flex-1 flex items-center justify-center h-screen bg-grey-50 dark:bg-grey-950 overflow-x-hidden">
        <Empty content="No room selected" />
      </div>
    )
  return (
    <div className="flex-1 h-screen bg-grey-50 dark:bg-grey-950 overflow-x-hidden">
      <div className="flex flex-col h-full">
        <div className="h-[68px] bg-grey-50 dark:bg-grey-900 border-b-2 border-grey-300 dark:border-grey-700">
          <div className="flex items-center h-full p-2 gap-4">
            <UserAvatar
              alt={partner?.display_name || ''}
              src={partner?.picture || ''}
              size="md"
            />
            <div className="flex flex-col justify-start">
              <p className="font-bold leading-5">{partner?.display_name}</p>
              <span className="text-grey-500 text-sm">Online for 10 mins</span>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-end h-[calc(100vh-68px)]">
          <div className="h-full overflow-y-auto overflow-x-hidden">
            {isEmpty ? (
              <div className="h-full flex items-center justify-center">
                <Empty content="No chats here yet" />
              </div>
            ) : (
              <>
                {messages.map((message: MessageType, index: number) => (
                  <Message
                    key={index}
                    picture={partner?.picture}
                    name={partner?.display_name}
                    {...message}
                  />
                ))}
              </>
            )}
          </div>
          <MessageTyping
            sendMessage={sendMessage}
            channelId={channelId}
            senderId={user?._id}
          />
        </div>
      </div>
    </div>
  )
}

export default MessageContainer

const MessageTyping = ({
  sendMessage,
  channelId,
  senderId,
}: {
  sendMessage: (m: string) => void
  channelId: string
  senderId: string | null
}): JSX.Element => {
  const [isActiveSend, setIsActiveSend] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage(message)
    setMessage('')
    setIsActiveSend(false)
    const msg = {
      channel_id: channelId,
      userId: senderId,
      content: message,
    }
    await createMessageAsync(msg)
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
