import Message from './Message'
import { UserAvatar, EmptyState } from 'modules/core/components'
import ChatForm from './ChatForm'
import type { IMessage } from 'modules/chat/types'
import { authSelector } from 'modules/auth/states/authSlice'
import { useRef, useState, useEffect, useCallback } from 'react'
import { ArrowDownIcon } from 'modules/core/components/icons'

import { useAppDispatch, useAppSelector, useSocket } from 'modules/core/hooks'

import { selectCurrentRoomId, selectCurrentRoomInfo } from '../states/roomSlice'

//mock
import { addMessage, messageSelector } from '../states/messageSlice'
import { fetchHistoryMessageAsync } from '../states/messageActions'
import classNames from 'classnames'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex-1 flex flex-col bg-grey-50 dark:bg-grey-950">
    {children}
  </div>
)

const ChatArea: React.FC = () => {
  const { emitEvent, subscribeEvent, unSubcribeEvent } = useSocket()
  const [showJumpToButton, setShowJumpToButton] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const historyMsgs = useAppSelector(messageSelector.selectHistoryMsgs)
  const userLogin = useAppSelector(authSelector.selectUser)
  const roomSelectedId = useAppSelector(selectCurrentRoomId)
  const roomSelectedInfo = useAppSelector(selectCurrentRoomInfo)

  const refContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const containerMsgEl = refContainer.current
    const scrollHandler = () => {
      //@ts-ignore
      const { scrollHeight, scrollTop, clientHeight } = containerMsgEl
      // current position of scrollbar at bottom
      if (!(scrollHeight - scrollTop - clientHeight)) {
        setShowJumpToButton(false)
        return
      }
      setShowJumpToButton(true)
    }
    //init scrollbar position
    if (containerMsgEl) {
      if (!showJumpToButton) {
        containerMsgEl.scrollTop = containerMsgEl.scrollHeight
      }
      containerMsgEl?.addEventListener('scroll', scrollHandler)
    }
    return () => containerMsgEl?.removeEventListener('scroll', scrollHandler)
  }, [historyMsgs])

  useEffect(() => {
    if (roomSelectedId) {
      emitEvent('join', roomSelectedId)
      subscribeEvent('chat:receiveMessage', (msg: any) => {
        dispatch(addMessage(msg))
        // force scrollbar move to bottom on sender machine
        setTimeout(() => {
          if (msg.ownerId === userLogin?._id) handleJumpToBottom()
        }, 0)
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

  /*Event handler*/
  const handleJumpToBottom = useCallback(() => {
    const containerMsgEl = refContainer.current

    if (containerMsgEl) {
      containerMsgEl.scrollTop = containerMsgEl.scrollHeight
    }
  }, [refContainer])

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
      <button
        onClick={handleJumpToBottom}
        className={classNames(
          'animate-bounce absolute dark:bg-grey-900 bg-grey-50 bottom-20 left-1/2 -translate-x-1/2 w-10 h-10 items-center justify-center rounded-full shadow-[0px_2px_4px_rgba(0,0,0,0.25)] dark:shadow-[0px_2px_4px_rgba(0,0,0,0.5)] hover:brightness-75',
          showJumpToButton ? 'flex' : 'hidden',
        )}
      >
        <span className="text-blue-500 dark:text-blue-400">
          <ArrowDownIcon />
        </span>
      </button>
      {/*Input Area */}
      <ChatForm />
    </Wrapper>
  )
}

export default ChatArea
