import Message from './Message'
import { UserAvatar, EmptyState } from 'modules/core/components'
import ChatForm from './ChatForm'
import type { IMessage } from 'modules/chat/types'
import { authSelector } from 'modules/auth/states/authSlice'
import { useState, useRef, useEffect } from 'react'

import { useAppSelector } from 'modules/core/hooks'

import { selectCurrentRoomId, selectCurrentRoomInfo } from '../states/roomSlice'

//mock
import messageSamples from 'modules/chat/mock/message.json'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-1 flex flex-col bg-grey-50 dark:bg-grey-950">
    {children}
  </div>
)

const MessageContainer: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([])
  const refContainer = useRef<HTMLDivElement>(null)

  const userLogin = useAppSelector(authSelector.selectUser)

  const roomSelectedId = useAppSelector(selectCurrentRoomId)
  const roomSelectedInfo = useAppSelector(selectCurrentRoomInfo)

  useEffect(() => {
    const loadHistoryChat = async () => {
      const res = messageSamples.filter(m => m.roomId === roomSelectedId)
      setMessages(res)
    }
    if (roomSelectedId) loadHistoryChat()
  }, [roomSelectedId])

  if (!roomSelectedId)
    return (
      <Wrapper>
        <div>No Room Selected</div>
      </Wrapper>
    )
  return (
    <Wrapper>
      {/*Header*/}
      <div className="p-4 flex items-center bg-grey-50 dark:bg-grey-900 border-b-2 border-grey-300 dark:border-grey-700">
        <UserAvatar
          className="mr-4"
          alt={roomSelectedInfo?.name || ''}
          src={roomSelectedInfo?.picture || ''}
          size="md"
        />
        <div className="flex flex-col justify-start">
          <p className="font-bold leading-5">{roomSelectedInfo?.name}</p>
          <span className="text-grey-500 text-sm">Online for 10 mins</span>
        </div>
      </div>

      {/*Messages*/}
      <div
        ref={refContainer}
        className="flex-1 overflow-y-auto overflow-x-hidden px-2 flex flex-col justify-end"
      >
        <>
          {messages?.length > 0 ?
            <>
              {messages.map((message: IMessage) => {
                return (
                  <Message
                    key={message._id}
                    userLoginId={userLogin?._id}
                    recipient={{
                      _id: roomSelectedInfo?._id,
                      picture: roomSelectedInfo?.picture,
                      displayName: roomSelectedInfo?.name,
                    }}
                    {...message}
                  />
                )
              })}
            </>
          : <div className="h-full flex items-center justify-center">
              <EmptyState content="No chats here yet" />
            </div>
          }
        </>
      </div>
      {/*Input Area */}
      <ChatForm />
    </Wrapper>
  )
}

export default MessageContainer
