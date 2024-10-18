import Message from './Message'
import { UserAvatar, EmptyState } from 'modules/core/components'
import ChatForm from './ChatForm'
import type { IMessage } from 'modules/chat/types'
import { authSelector } from 'modules/auth/states/authSlice'
import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import ReactLoading from 'react-loading'
import { ArrowDownIcon } from 'modules/core/components/icons'

import { useAppDispatch, useAppSelector, useSocket } from 'modules/core/hooks'

import {
  selectCurrentRoomId,
  selectCurrentRoomInfo,
  updateRoomLatestMessage,
} from '../states/roomSlice'

import {
  addMessage,
  messageSelector,
  updateStatusMessage,
  updateStatusMessages,
} from '../states/messageSlice'
import { fetchHistoryMessageAsync } from '../states/messageActions'
import classNames from 'classnames'
import { userSelector } from 'modules/user/states/userSlice'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex-1 flex flex-col bg-grey-50 dark:bg-grey-950">
    {children}
  </div>
)

const ChatArea: React.FC = () => {
  const { emitEvent, subscribeEvent, unSubcribeEvent } = useSocket()
  const [showJumpToButton, setShowJumpToButton] = useState<boolean>(false)
  const [typingIndicator, setTypingIndicator] = useState({
    isTyping: false,
    userId: '',
  })
  const dispatch = useAppDispatch()
  const historyMsgs = useAppSelector(messageSelector.selectHistoryMsgs)
  const userLogin = useAppSelector(authSelector.selectUser)
  const roomSelectedId = useAppSelector(selectCurrentRoomId)
  const roomSelectedInfo = useAppSelector(selectCurrentRoomInfo)
  const usersOnline = useAppSelector(userSelector.selectListCurrentUserOnline)

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
  }, [historyMsgs, typingIndicator.isTyping])

  useEffect(() => {
    const containerMsgEl = refContainer.current
    if (containerMsgEl) {
      let lastMessage = containerMsgEl.querySelector('.last-message')
      if (!lastMessage) return
      console.log({ newMessage: lastMessage.getAttribute('data-msg-id') })
      //      @ts-ignore
      const observerCallback = (entries, observer) => {
        if (!lastMessage) return
        //@ts-ignore
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const unSeenMsgEls = containerMsgEl.querySelectorAll('.new-message')
            //un seen message id list
            const msgs = Array.from(unSeenMsgEls).map(msgEl =>
              msgEl.getAttribute('data-msg-id'),
            )
            emitEvent('chat:statusMessage', {
              msgs,
              recipient: roomSelectedInfo?._id,
              roomId: roomSelectedId,
              status: {
                type: 'seen',
                readBy: [
                  {
                    userId: userLogin?._id,
                    readAt: new Date(),
                  },
                ],
              },
            })
            lastMessage?.classList.remove('last-message')
            lastMessage = null
          }
        })
      }
      const observer = new IntersectionObserver(observerCallback, {
        root: containerMsgEl,
        rootMargin: '0px',
        threshold: 1.0,
      })
      observer.observe(lastMessage)
    }
  }, [historyMsgs])

  useEffect(() => {
    if (roomSelectedId) {
      emitEvent('join', roomSelectedId)
      subscribeEvent('chat:userTypingStatus', (msg: any) => {
        setTypingIndicator(pre => ({ ...pre, ...msg }))
      })
      console.log(`user join ${roomSelectedId} `)
      // update single msg
      subscribeEvent('chat:updateStatusMessage', (msg: any) => {
        dispatch(updateStatusMessage(msg))
      })
      // update status multiple messages
      subscribeEvent('chat:updateStatusMessages', (msg: any) => {
        dispatch(updateStatusMessages(msg))
      })
    }
    subscribeEvent('chat:receiveMessage', (msg: any) => {
      if (roomSelectedId) {
        // hide the tying indicator components when new message came.
        setTypingIndicator({
          userId: '',
          isTyping: false,
        })
        dispatch(addMessage(msg))
        // force scrollbar move to bottom on local machine
        if (msg.ownerId === userLogin?._id) {
          setTimeout(() => {
            handleJumpToBottom()
          }, 0)
        }
      }
      //handler receive message on recipient machine
      if (msg?.ownerId !== userLogin?._id) {
        emitEvent('chat:statusMessage', {
          msg: {
            _id: msg?._id,
            ownerId: msg?.ownerId,
          },
          status: {
            type: 'delivered',
            readBy: [],
          },
        })
      }
      dispatch(updateRoomLatestMessage(msg))
    })
    return () => {
      emitEvent('leave', roomSelectedId)
      unSubcribeEvent('chat:receiveMessage')
      unSubcribeEvent('chat:userTypingStatus')
      unSubcribeEvent('chat:updateStatusMessage')
      unSubcribeEvent('chat:updateStatusMessages')
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

  const groupStatusMessageByCurrentUserId = useMemo(() => {
    let status = {}
    for (const msg of historyMsgs) {
      if (msg && msg.ownerId === userLogin?._id) {
        //@ts-ignore
        status[msg.status?.type] = msg._id
      }
    }
    return status
  }, [historyMsgs])

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
          <span
            className={classNames(
              'text-sm ',
              usersOnline[roomSelectedInfo?._id || '']?.status === 'online' ?
                'text-green-500'
              : 'text-grey-500',
            )}
          >
            {usersOnline[roomSelectedInfo?._id || '']?.status === 'online' ?
              'Online'
            : 'Offline'}
          </span>
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
              {historyMsgs.map((message: IMessage, index: number) => {
                const previous = historyMsgs[index - 1]
                const next = historyMsgs[index + 1]
                const current = message
                let showAvatar = false
                let type = 'single'
                let position = null

                if (
                  current.ownerId !== previous?.ownerId &&
                  current.ownerId !== next?.ownerId
                ) {
                  showAvatar = true
                  type = 'single'
                } else {
                  if (
                    current.ownerId !== previous?.ownerId &&
                    current.ownerId === next?.ownerId
                  ) {
                    showAvatar = false
                    type = 'group'
                    position = 'first'
                  } else if (
                    current.ownerId === previous?.ownerId &&
                    current.ownerId === next?.ownerId
                  ) {
                    showAvatar = false
                    type = 'group'
                    position = 'middle'
                  } else if (
                    current.ownerId === previous?.ownerId &&
                    current.ownerId !== next?.ownerId
                  ) {
                    showAvatar = true
                    type = 'group'
                    position = 'last'
                  }
                }
                const showStatusMsg =
                  //@ts-ignore
                  groupStatusMessageByCurrentUserId[current.status?.type] ===
                  current?._id

                return (
                  <Message
                    type={type}
                    key={message._id}
                    showAvatar={showAvatar}
                    showStatusMsg={showStatusMsg}
                    position={position}
                    userLoginId={userLogin?._id}
                    isLast={index === historyMsgs.length - 1}
                    {...message}
                  />
                )
              })}
            </>
          : <div className="h-full flex items-center justify-center">
              <EmptyState content="No chats here yet" />
            </div>
          }
          {typingIndicator?.isTyping &&
            typingIndicator?.userId !== userLogin?._id && (
              <div className="flex my-2">
                <div className="pl-[6px] pr-4">
                  <UserAvatar
                    src={roomSelectedInfo?.picture || ''}
                    alt={roomSelectedInfo?.name || ''}
                  />
                </div>
                <div className="max-w-max flex items-center justify-center bg-grey-200 dark:bg-grey-800 p-2 rounded-3xl">
                  <ReactLoading type="bubbles" width="25px" height="25px" />
                </div>
              </div>
            )}
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
