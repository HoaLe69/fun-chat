import Message from './Message'
import { UserAvatar, EmptyState } from 'modules/core/components'
import ChatForm from './ChatForm'
import type { IMessage } from 'modules/chat/types'
import { authSelector } from 'modules/auth/states/authSlice'
import { useRef, useEffect } from 'react'

import { useAppDispatch, useAppSelector, useSocket } from 'modules/core/hooks'

import { selectCurrentRoomId, selectCurrentRoomInfo } from '../states/roomSlice'

//mock
import { addMessage, messageSelector } from '../states/messageSlice'
import { fetchHistoryMessageAsync } from '../states/messageActions'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-1 flex flex-col bg-grey-50 dark:bg-grey-950">
    {children}
  </div>
)

const ChatArea: React.FC = () => {
  const { emitEvent, subscribeEvent, unSubcribeEvent } = useSocket()
  const dispatch = useAppDispatch()
  const historyMsgs = useAppSelector(messageSelector.selectHistoryMsgs)
  const userLogin = useAppSelector(authSelector.selectUser)
  const roomSelectedId = useAppSelector(selectCurrentRoomId)
  const roomSelectedInfo = useAppSelector(selectCurrentRoomInfo)

  const refContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const containerMsgEl = refContainer.current
    if (containerMsgEl) {
      containerMsgEl.scrollTop = containerMsgEl.scrollHeight
    }
  }, [historyMsgs])

  useEffect(() => {
    if (roomSelectedId) {
      emitEvent('join', roomSelectedId)
      subscribeEvent('chat:receiveMessage', (msg: any) => {
        dispatch(addMessage(msg))
      })
      console.log(`user join ${roomSelectedId} `)
    }
    return () => {
      emitEvent('leave', roomSelectedId)
      unSubcribeEvent('chat:receiveMessage')
      console.log(`user leave ${roomSelectedId} `)
    }
  }, [roomSelectedId])

  useEffect(() => {
    if (roomSelectedId !== undefined)
      dispatch(fetchHistoryMessageAsync(roomSelectedId))
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
        className="flex-1 overflow-y-auto overflow-x-hidden px-2 flex flex-col"
      >
        <>
          {historyMsgs?.length > 0 ?
            <>
              {historyMsgs.map((message: IMessage) => {
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

export default ChatArea
