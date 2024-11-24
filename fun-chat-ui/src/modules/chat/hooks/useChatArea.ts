import { useSocket, useAppSelector, useAppDispatch } from 'modules/core/hooks'
import { useCallback, useMemo, useEffect, useRef, useState } from 'react'
import {
  addMessage,
  removeMessage,
  messageSelector,
  updateMessageReaction,
  updateReplyMessageRemoved,
  updateStatusMessage,
  updateStatusMessages,
} from '../states/messageSlice'
import { authSelector } from 'modules/auth/states/authSlice'
import {
  markLatestMessageAsSeen,
  selectCurrentRoomId,
  selectCurrentRoomInfo,
  updateRoomLatestMessage,
} from '../states/roomSlice'
import { userSelector } from 'modules/user/states/userSlice'
import { fetchHistoryMessageAsync } from '../states/messageActions'
import { msgTimeDividerHandler } from '../utils/dateTimeFormat'

const useChatArea = () => {
  const { emitEvent, subscribeEvent, unSubcribeEvent } = useSocket()
  const [typingIndicator, setTypingIndicator] = useState({
    isTyping: false,
    userId: '',
  })

  const dispatch = useAppDispatch()
  const historyMsgs = useAppSelector(messageSelector.selectHistoryMsgs)
  const historyMsgsStatus = useAppSelector(messageSelector.selectHistoryMsgsStatus)
  const roomSelectedId = useAppSelector(selectCurrentRoomId)
  const roomSelectedInfo = useAppSelector(selectCurrentRoomInfo)
  const usersOnline = useAppSelector(userSelector.selectListCurrentUserOnline)
  const userLogin = useAppSelector(authSelector.selectUser)

  const refContainer = useRef<HTMLDivElement>(null)
  const refJumpToButton = useRef<HTMLButtonElement>(null)

  /*----------handle side effect---------------*/

  useEffect(() => {
    if (!roomSelectedId) return
    const containerMsgEl = refContainer.current
    if (containerMsgEl) {
      setTimeout(() => {
        containerMsgEl.scrollTop = containerMsgEl.scrollHeight
      }, 500)
    }
  }, [historyMsgsStatus])

  useEffect(() => {
    if (!roomSelectedId) return

    const containerMsgEl = refContainer.current
    const buttonEl = refJumpToButton.current
    const lastMessage = historyMsgs[historyMsgs.length - 1]
    const scrollHandler = () => {
      //@ts-ignore
      const { scrollHeight, scrollTop, clientHeight } = containerMsgEl
      // current position of scrollbar at bottom
      if (buttonEl) {
        if (!(scrollHeight - scrollTop - clientHeight)) {
          buttonEl.style.visibility = 'hidden'
          return
        }
        buttonEl.style.visibility = 'visible'
      }
    }
    //init scrollbar position
    if (containerMsgEl) {
      if (lastMessage && lastMessage.ownerId === userLogin?._id) {
        containerMsgEl.scrollTop = containerMsgEl.scrollHeight
      }
      containerMsgEl?.addEventListener('scroll', scrollHandler)
    }
    return () => containerMsgEl?.removeEventListener('scroll', scrollHandler)
  }, [historyMsgs.length])

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
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const unSeenMsgEls = containerMsgEl.querySelectorAll('.new-message')
            //un seen message id list
            const msgs = Array.from(unSeenMsgEls).map((msgEl) => msgEl.getAttribute('data-msg-id'))
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
        setTypingIndicator((pre) => ({ ...pre, ...msg }))
      })
      console.log(`user join ${roomSelectedId} `)
      // update single msg
      subscribeEvent('chat:updateStatusMessage', (msg: any) => {
        dispatch(updateStatusMessage(msg))
      })
    }
    // update status multiple messages
    subscribeEvent('chat:updateStatusMessages', (msg: any) => {
      //mean all message in room mark as seen (the other user current online and in conversation)
      if (msg.recipient !== userLogin?._id) {
        dispatch(updateStatusMessages(msg))
      }
      dispatch(markLatestMessageAsSeen(msg))
    })
    subscribeEvent('chat:receiveMessageActions', (msg: any) => {
      if (msg.type === 'deletion') {
        if (msg.info.replyBy.length > 0) {
          // remove all message have been replied this message
          dispatch(updateReplyMessageRemoved(msg.info.replyBy))
        }
        dispatch(updateRoomLatestMessage(msg.info))
        dispatch(removeMessage({ _id: msg.info._id, isDeleted: msg.info.isDeleted }))
      } else if (msg.type == 'reaction') {
        dispatch(updateMessageReaction({ react: msg.info.react, _id: msg.info._id }))
      }
    })

    subscribeEvent('chat:receiveMessage', (msg: any) => {
      console.log({ msg })
      if (roomSelectedId && msg.roomId === roomSelectedId) {
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
      unSubcribeEvent('chat:receiveMessageActions')
      console.log(`user leave ${roomSelectedId} `)
    }
  }, [roomSelectedId])

  useEffect(() => {
    if (roomSelectedId !== undefined) dispatch(fetchHistoryMessageAsync(roomSelectedId))
  }, [roomSelectedId])

  /*-----------Event handler------------------*/
  const handleJumpToBottom = useCallback(() => {
    const containerMsgEl = refContainer.current

    if (containerMsgEl) {
      containerMsgEl.scrollTop = containerMsgEl.scrollHeight
    }
  }, [refContainer])

  /*-----------business logic--------------------*/
  const processMessageStatusAndTime = useMemo(() => {
    let status = {}
    let period: Record<string, string> = {}
    const divider: Record<string, string> = {}
    for (const msg of historyMsgs) {
      // stacking status of message
      if (msg && msg.ownerId === userLogin?._id) {
        //@ts-ignore
        status[msg.status?.type] = msg._id
      }
      //stacking time of message
      const time = msgTimeDividerHandler(msg.createdAt)
      if (!period[time]) {
        period[time] = msg._id
        divider[msg._id] = time
      }
    }
    return { status, divider }
  }, [historyMsgs])

  return {
    userLogin,
    typingIndicator,
    usersOnline,
    roomSelectedId,
    roomSelectedInfo,
    historyMsgs,
    refContainer,
    refJumpToButton,
    processMessageStatusAndTime,
    handleJumpToBottom,
    historyMsgsStatus,
  }
}

export default useChatArea
