import Message from './message'
import UserAvatar from 'components/user-avatar'
import Empty from 'components/common/empty-sate'
import ChatForm from './chat-form'
import type { MessageType } from 'lib/app.type'
import { userSelector } from 'redux/user.store'
import { useState, useEffect } from 'react'

import { useAppSelector, useAppDispatch } from 'hooks'
import { roomSelector, updateLatestMessage } from 'redux/room.store'

import useSocket from 'hooks/useSocket'
import { apiClient } from 'api/apiClient'

const MessageContainer = (): JSX.Element => {
  const [messages, setMessages] = useState([])
  const { socket } = useSocket()
  const dispatch = useAppDispatch()

  const roomSelectedId = useAppSelector(roomSelector.selectRoomId)
  const recipient = useAppSelector(roomSelector.selectRoomRecipient)
  const userLogin = useAppSelector(userSelector.selectUser)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const messagesRes = await apiClient.get(
          `/message/list/${roomSelectedId}`,
        )
        if (messagesRes) setMessages(messagesRes.data)
      } catch (error) {
        console.log(error)
      }
    }
    if (!roomSelectedId) setMessages([])
    if (roomSelectedId) fetchData()
  }, [roomSelectedId])

  useEffect(() => {
    if (roomSelectedId) {
      console.log(`user join to room ${roomSelectedId}`)
      socket.emit('join', roomSelectedId)
    }
    return () => {
      console.log(`user left room ${roomSelectedId}`)
      socket.emit('leave', roomSelectedId)
    }
  }, [roomSelectedId])

  useEffect(() => {
    if (roomSelectedId) {
      socket.on('chat:getMessage', msg => {
        //@ts-ignore
        setMessages(pre => [...pre, msg])
        // dispatch(
        //   updateLatestMessage({
        //     roomId: msg.roomId,
        //     latestMessage: {
        //       text: msg.text,
        //       createdAt: msg.createdAt,
        //     },
        //   }),
        // )
      })
    }
    return () => {
      socket.off('chat:getMessage')
    }
  }, [roomSelectedId])

  if (!roomSelectedId && !recipient?._id) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen bg-grey-50 dark:bg-grey-950 overflow-x-hidden">
        <Empty content="No room selected" />
      </div>
    )
  }
  return (
    <div className="flex-1 h-screen bg-grey-50 dark:bg-grey-950 overflow-x-hidden">
      <div className="flex flex-col h-full">
        <div className="h-[68px] bg-grey-50 dark:bg-grey-900 border-b-2 border-grey-300 dark:border-grey-700">
          <div className="flex items-center h-full p-2 gap-4">
            <UserAvatar
              alt={recipient?.display_name || ''}
              src={recipient?.picture || ''}
              size="md"
            />
            <div className="flex flex-col justify-start">
              <p className="font-bold leading-5">{recipient?.display_name}</p>
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
                      userLoginId={userLogin?._id}
                      picture={recipient?.picture}
                      ownerName={recipient?.display_name}
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
            roomId={roomSelectedId}
            userLoginId={userLogin?._id}
            recipientId={recipient?._id}
          />
        </div>
      </div>
    </div>
  )
}

export default MessageContainer
