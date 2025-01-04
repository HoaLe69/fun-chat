import { useCallback, useEffect, useState } from 'react'
import { SOCKET_EVENTS } from 'const'
import { useAppSelector, useSocket } from 'modules/core/hooks'
import { IConversation } from 'modules/chat/types'
import { authSelector } from 'modules/auth/states/authSlice'
import { useNavigate } from 'react-router-dom'
import { userServices } from 'modules/user/services'
import type { IUser } from 'modules/user/types'
import { roomServices } from 'modules/chat/services'

const useSendImmediateMsg = (userId?: string, isMounted?: boolean) => {
  const [message, setMessage] = useState<string>('')
  const { emitEvent } = useSocket()
  const [loading, setLoading] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<IUser | null>(null)
  const [openChatBox, setOpenChatBox] = useState<boolean>(false)
  const [room, setRoom] = useState<IConversation | null>(null)
  const userLoginId = useAppSelector(authSelector.selectUserId)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const handleOpenChatbox = useCallback(() => {
    setOpenChatBox(true)
  }, [])

  const handleCloseChatbox = useCallback(() => {
    setOpenChatBox(false)
  }, [])
  useEffect(() => {
    if (!userId) return
    userServices
      .getUserById(userId)
      .then((data) => {
        setUserInfo(data)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [userId])

  useEffect(() => {
    if (isMounted || typeof isMounted === 'undefined') return
    setOpenChatBox(false)
  }, [isMounted])

  useEffect(() => {
    if (!openChatBox || !userLoginId || !userInfo) return
    roomServices
      .checkRoomExistAsync([userLoginId, userInfo?._id])
      .then((res) => {
        setRoom(res)
      })
      .catch((error) => {
        console.log(error)
        setRoom(null)
      })
  }, [openChatBox])

  const handleSubmitMessage = useCallback(
    async (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key !== 'Enter') return
      if (!message) return
      try {
        if (!room) {
          emitEvent(
            SOCKET_EVENTS.ROOM.CREATE,
            {
              msg: {
                content: { text: message },
                ownerId: userLoginId,
              },
              room: { members: [userLoginId, userInfo?._id] },
              recipient: userInfo?._id,
            },
            (response: any) => {
              navigate(`/devchat/@me/${response?.room?._id}/${userInfo?._id}`)
            },
          )
          return
        }
        emitEvent(
          SOCKET_EVENTS.MESSAGE.SEND,
          {
            msg: {
              content: { text: message },
              ownerId: userLoginId,
              roomId: room._id,
            },
            recipientId: userInfo?._id,
          },
          (response: any) => {
            //ignore
            console.log(response)
          },
        )
        console.log('send an message')
        navigate(`/devchat/@me/${room?._id}/${userInfo?._id}`)
      } catch (error) {
        console.log(error)
      }
    },
    [message, room, userLoginId, userInfo],
  )
  return {
    openChatBox,
    userLoginId,
    navigate,
    message,
    handleChange,
    userInfo,
    loading,
    handleSubmitMessage,
    handleOpenChatbox,
    handleCloseChatbox,
  }
}

export default useSendImmediateMsg
