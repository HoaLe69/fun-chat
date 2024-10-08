import Message from './Message'
import { UserAvatar } from 'modules/core/components'
import { EmptyState } from 'modules/core/components'
import ChatForm from './ChatForm'
import type { MessageType } from 'lib/app.type'
import { authSelector } from 'modules/auth/states/authSlice'
import { useState, useEffect, useRef } from 'react'

import { useAppDispatch, useAppSelector } from 'modules/core/hooks'
import { quitSelectedRoom, roomSelector } from 'modules/chat/states/roomSlice'

import { useSocket } from 'modules/core/hooks'
import { apiClient } from 'modules/core/services'
import { groupMessagesByTime } from '../utils/message'
import { ArrowLeftIcon } from 'modules/core/components/icons'

const MessageContainer: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([])
  const dispatch = useAppDispatch()
  const { socket } = useSocket()
  const refContainer = useRef<HTMLDivElement>(null)
  // const currentPos = useRef<number>(0)

  const roomSelectedId = useAppSelector(roomSelector.selectRoomId)
  const recipient = useAppSelector(roomSelector.selectRoomRecipient)
  const userLogin = useAppSelector(authSelector.selectUser)

  useEffect(() => {
    const loadMessages = async () => {
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
    if (roomSelectedId) loadMessages()
  }, [roomSelectedId])

  useEffect(() => {
    if (roomSelectedId) {
      socket.on('chat:getMessage', msg => {
        if (msg.roomId == roomSelectedId) setMessages(pre => [...pre, msg])
      })
      socket.on('chat:getReactIcon', msg => {
        const { messageId, emoji, ownerId } = msg
        setMessages(pre => {
          const _messages = pre.map(msg => {
            if (msg._id === messageId)
              return { ...msg, react: [...msg.react, { ownerId, emoji }] }
            return msg
          })
          return _messages
        })
      })
      socket.on('chat:getRecallMessage', msg => {
        const { messageId, isDeleted } = msg
        setMessages(pre =>
          pre.map(msg => {
            if (msg._id === messageId) return { ...msg, isDeleted }
            return msg
          }),
        )
      })
    }
    return () => {
      socket.off('chat:getMessage')
      socket.off('chat:getReactIcon')
      socket.off('chat:getRecallMessage')
    }
  }, [roomSelectedId])

  // useEffect(() => {
  //   const containerEl = refContainer.current
  //   const handleScroll = (event: Event) => {
  //     currentPos.current = event.target.scrollTop
  //   }
  //   if (containerEl) {
  //     containerEl.addEventListener('scroll', handleScroll)
  //   }
  //   return () => {
  //     containerEl?.removeEventListener('scroll', handleScroll)
  //   }
  // }, [refContainer])
  //
  // useEffect(() => {
  //   console.log('currentPosition', currentPos.current)
  //   const containerEl = refContainer.current
  //   if (containerEl) {
  //     containerEl.scrollTop = currentPos.current
  //   }
  // }, [messages])
  //

  const renderTimeLine = (timeLine: string) => (
    <div key={timeLine} className="flex items-center justify-center gap-2">
      <div className="w-12 h-[1px] bg-grey-500 rounded-xl" />
      <p className="text-center text-[12px] my-2 text-gray-500">{timeLine}</p>
      <div className="w-12 h-[1px] bg-grey-500 rounded-xl" />
    </div>
  )

  if (!roomSelectedId && !recipient?._id) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen bg-grey-50 dark:bg-grey-950 overflow-x-hidden">
        <EmptyState content="No room selected" />
      </div>
    )
  }
  return (
    <div className="flex-1 h-screen bg-grey-50 dark:bg-grey-950 overflow-x-hidden absolute md:relative inset-0">
      <div className="flex flex-col h-full">
        <div className="h-[68px] bg-grey-50 dark:bg-grey-900 border-b-2 border-grey-300 dark:border-grey-700">
          <div className="flex items-center h-full p-2 gap-4">
            <button
              onClick={() => {
                dispatch(quitSelectedRoom())
              }}
              className="text-sm md:hidden"
            >
              <ArrowLeftIcon />
            </button>
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
          <div
            ref={refContainer}
            className="h-full overflow-y-auto overflow-x-hidden px-2"
          >
            <>
              {messages?.length > 0 ? (
                <>
                  {groupMessagesByTime(messages).map(
                    (message: MessageType, index: number) => {
                      if (message.timeLine) {
                        return renderTimeLine(message.timeLine)
                      }
                      return (
                        <Message
                          key={index}
                          userLoginId={userLogin?._id}
                          recipient={{
                            _id: recipient?._id,
                            picture: recipient?.picture,
                            displayName: recipient?.display_name,
                          }}
                          {...message}
                        />
                      )
                    },
                  )}
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <EmptyState content="No chats here yet" />
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
