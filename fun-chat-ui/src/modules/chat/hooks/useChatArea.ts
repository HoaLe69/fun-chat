import { useSocket, useAppSelector, useAppDispatch } from 'modules/core/hooks'
import { useCallback, useMemo, useEffect, useRef, useState } from 'react'
import {
  addMessage,
  removeMessage,
  removeReplyMessage,
  messageSelector,
  updateMessageReaction,
} from '../states/messageSlice'
import { authSelector } from 'modules/auth/states/authSlice'
import { userSelector } from 'modules/user/states/userSlice'
import { fetchHistoryMessageAsync } from '../states/messageActions'
import { msgTimeDividerHandler } from '../utils/dateTimeFormat'
import { SOCKET_EVENTS } from 'const'
import { useParams } from 'react-router-dom'
import { userServices } from 'modules/user/services'
import type { IUser } from 'modules/user/types'
import { roomServices } from 'modules/chat/services'
import { updateRoomUnreadMessage } from '../states/roomSlice'

const useChatArea = () => {
  const { emitEvent, subscribeEvent, unSubcribeEvent } = useSocket()
  const [typingIndicator, setTypingIndicator] = useState({
    isTyping: false,
    userId: '',
  })

  const params = useParams()
  const { roomId, userId: partnerId } = params
  const [partner, setPartner] = useState<IUser | null>(null)

  const dispatch = useAppDispatch()
  const historyMsgs = useAppSelector(messageSelector.selectHistoryMsgs)
  const historyMsgsStatus = useAppSelector(messageSelector.selectHistoryMsgsStatus)
  const usersOnline = useAppSelector(userSelector.selectListCurrentUserOnline)
  const userLogin = useAppSelector(authSelector.selectUser)

  const refContainer = useRef<HTMLDivElement>(null)
  const refJumpToButton = useRef<HTMLButtonElement>(null)

  /*----------handle side effect---------------*/

  useEffect(() => {
    if (!partnerId) return
    userServices
      .getUserById(partnerId)
      .then((res) => setPartner(res))
      .catch((error) => console.log(error))
  }, [partnerId])

  useEffect(() => {
    if (!roomId || !userLogin) return
    roomServices
      .markAsRead(roomId, userLogin?._id)
      .then((res) => {
        dispatch(updateRoomUnreadMessage(res))
      })
      .catch((error) => console.log(error))
  }, [userLogin, roomId, historyMsgs])

  useEffect(() => {
    if (!roomId) return
    const containerMsgEl = refContainer.current
    if (containerMsgEl) {
      setTimeout(() => {
        containerMsgEl.scrollTop = containerMsgEl.scrollHeight
      }, 500)
    }
  }, [historyMsgsStatus])

  useEffect(() => {
    if (!roomId) return
    emitEvent('join', roomId)
    console.log(`user join ${roomId} `)
    // update single msg

    subscribeEvent(SOCKET_EVENTS.MESSAGE.DELETED, (msg: any) => {
      dispatch(removeMessage(msg))
      if (msg?.replyBy.length) dispatch(removeReplyMessage(msg.replyBy))
    })

    subscribeEvent(SOCKET_EVENTS.MESSAGE.REACTED, (msg: any) => {
      dispatch(updateMessageReaction({ react: msg.react, _id: msg._id }))
    })
    subscribeEvent(SOCKET_EVENTS.MESSAGE.RECEIVE, (msg: any) => {
      console.log({ msg })

      const containerEl = refContainer.current

      if (containerEl) {
        const { scrollHeight, scrollTop, clientHeight } = containerEl
        const percent = (scrollTop / (scrollHeight - clientHeight)) * 100

        if (percent > 95) {
          containerEl.scrollTop = containerEl.scrollHeight
        }
      }

      if (msg.roomId === roomId) dispatch(addMessage(msg))
    })
    return () => {
      emitEvent('leave', roomId)
      unSubcribeEvent(SOCKET_EVENTS.MESSAGE.RECEIVE)
      unSubcribeEvent(SOCKET_EVENTS.MESSAGE.REACTED)
    }
  }, [roomId])

  useEffect(() => {
    if (roomId !== undefined) dispatch(fetchHistoryMessageAsync(roomId))
  }, [roomId])

  /*-----------Event handler------------------*/
  const handleJumpToBottom = useCallback(() => {
    const containerMsgEl = refContainer.current

    if (containerMsgEl) {
      containerMsgEl.scrollTop = containerMsgEl.scrollHeight
    }
  }, [refContainer])

  /*-----------business logic--------------------*/
  const chatMembers = useMemo(() => {
    return {
      [partner?._id || '']: partner,
      [userLogin?._id || '']: userLogin,
    }
  }, [partner, userLogin])

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
    partner,
    userLogin,
    usersOnline,
    chatMembers,
    historyMsgs,
    refContainer,
    typingIndicator,
    roomSelectedId: roomId,
    refJumpToButton,
    historyMsgsStatus,
    handleJumpToBottom,
    processMessageStatusAndTime,
  }
}

export default useChatArea
