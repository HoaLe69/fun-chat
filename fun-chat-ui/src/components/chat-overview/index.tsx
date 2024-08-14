import Message from './message'
import UserAvatar from 'components/user-avatar'
import Empty from 'components/common/empty-sate'
import ChatForm from './chat-form'
import type { UserType, MessageType } from 'lib/app.type'
import { useEffect, useState } from 'react'

import { socket } from 'hooks/useSocket'
import { useAppDispatch, useAppSelector } from 'hooks'
import { userSelector } from 'redux/user.store'
import { fetchUser } from 'api/user.api'
import { apiClient } from 'api/apiClient'
import {
  updateLatestMessage,
  updateStatusRoom,
  roomSelector,
} from 'redux/room.store'

const MessageContainer = (): JSX.Element => {
  const [messages, setMessages] = useState([])
  const [partner, setPartner] = useState<UserType>()
  const dispatch = useAppDispatch()

  const roomSelectedId = useAppSelector(roomSelector.selectRoomId)
  const partnerId = useAppSelector(roomSelector.selectRoomPartnerId)

  const typeOfRoom = useAppSelector(roomSelector.selectRoomType)
  const user = useAppSelector(userSelector.selectUser)

  // join room
  useEffect(() => {
    if (roomSelectedId) {
      socket.emit('join', roomSelectedId)
    }
  }, [roomSelectedId])

  useEffect(() => {
    // reveive message realtime
    const handleGetMessage = (msg: any) => {
      //@ts-ignore
      setMessages(pre => [...pre, msg])
      dispatch(
        updateLatestMessage({
          room_id: msg?.roomId,
          latest_message: msg?.content,
        }),
      )
    }

    // check typing of partner
    const handleCheckTyping = (msg: any) => {
      dispatch(updateStatusRoom({ ...msg }))
    }
    socket.on('getMessage', handleGetMessage)
    socket.on('user_typing', handleCheckTyping)
  }, [])

  useEffect(() => {
    // load message and infor of partner on init room
    const fetchData = async () => {
      const res = await fetchUser(partnerId ?? '')
      const msgs = await apiClient.get(`/message/list/${roomSelectedId}`)
      if (res) setPartner(res)
      if (msgs) setMessages(msgs.data)
    }
    if (partnerId && roomSelectedId) fetchData()
  }, [roomSelectedId, partnerId])

  // run when room is not exist in db
  useEffect(() => {
    const getInforOfPartner = async () => {
      const res = await fetchUser(typeOfRoom ?? '')
      setPartner(res)
    }
    if (typeOfRoom) getInforOfPartner()
  }, [typeOfRoom])

  // send message to socket server
  const sendMessage = (
    destination: string,
    data: { content?: string; isTyping?: boolean },
  ) => {
    socket.emit(destination, {
      room_id: roomSelectedId,
      userId: user?._id,
      ...data,
    })
  }

  if ((!roomSelectedId || !partnerId) && !typeOfRoom)
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
            <>
              {messages?.length > 0 ? (
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
              ) : (
                <div className="h-full flex items-center justify-center">
                  <Empty content="No chats here yet" />
                </div>
              )}
            </>
          </div>
          <ChatForm
            sendMessage={sendMessage}
            channelId={roomSelectedId ?? ''}
            senderId={user?._id}
          />
        </div>
      </div>
    </div>
  )
}

export default MessageContainer
