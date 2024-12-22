import Tippy from '@tippyjs/react/headless'
import type { IUser } from 'modules/user/types'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { userServices } from 'modules/user/services'
import ReactLoading from 'react-loading'
import { useNavigate } from 'react-router-dom'
import { CakeIcon, CommentBoxIcon, PlusCircleIcon } from 'modules/core/components/icons'
import moment from 'moment'
import { useAppSelector, useSocket } from 'modules/core/hooks'
import { authSelector } from 'modules/auth/states/authSlice'
import { IConversation } from 'modules/chat/types'
import { roomServices } from 'modules/chat/services'
import { SOCKET_EVENTS } from 'const'
import classNames from 'classnames'
import Image from 'modules/core/components/Image'
import { notifyServices } from '../services'

interface UserInformationCardPros {
  children: JSX.Element
  userId: string
}
const UserInformationCardContainer: React.FC<UserInformationCardPros> = ({ children, userId }) => {
  const [mounted, setMounted] = useState<boolean>(false)
  return (
    <Tippy
      onMount={() => setMounted(true)}
      onHide={() => setMounted(false)}
      delay={500}
      interactive
      placement="bottom-start"
      render={(attrs) => (
        <div {...attrs}>
          <UserInformationCard userId={userId} isMounted={mounted} />
        </div>
      )}
    >
      {children}
    </Tippy>
  )
}
export default UserInformationCardContainer

const UserInformationCard = ({ userId, isMounted }: { userId: string; isMounted: boolean }) => {
  const [message, setMessage] = useState<string>('')
  const { emitEvent } = useSocket()
  const [loading, setLoading] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<IUser | null>(null)
  const [openChatBox, setOpenChatBox] = useState<boolean>(false)
  const [room, setRoom] = useState<IConversation | null>(null)
  const userLoginId = useAppSelector(authSelector.selectUserId)
  const navigate = useNavigate()

  useEffect(() => {
    if (!userId || !isMounted) return
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
  }, [userId, isMounted])

  useEffect(() => {
    if (isMounted) return
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

  return (
    <div className="rounded-xl w-80 min-h-24 shadow-xl bg-zinc-50 dark:bg-zinc-900">
      {loading || !userInfo ? (
        <div className="w-full flex items-center justify-center py-5">
          <ReactLoading type="spin" width={40} height={40} />
        </div>
      ) : (
        <div className="p-3">
          <div className="flex items-center">
            <Image
              src={userInfo?.picture}
              alt={userInfo?.display_name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex flex-col ml-3">
              <p className="dark:text-zinc-100 font-semibold text-base hover:cursor-pointer">
                {userInfo?.display_name}
              </p>
              <p className="dark:text-zinc-500 text-zinc-700 text-sm">{userInfo?.email}</p>
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm gap-2 dark:text-zinc-400 text-zinc-700">
            <CakeIcon />
            <span>{moment(userInfo?.createdAt).format('LL')}</span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            {userLoginId !== userInfo?._id &&
              (openChatBox ? (
                <div className="w-full">
                  <form onSubmit={(e: React.FormEvent) => e.preventDefault()} onKeyDown={handleSubmitMessage}>
                    <input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="outline-none w-full p-1 py-2 rounded-md bg-zinc-950 text-sm"
                      placeholder="Enter your message..."
                      name="message"
                    />
                  </form>
                </div>
              ) : (
                <>
                  <RelationshipButton userLoginId={userLoginId} userDestinationId={userInfo?._id} />
                  <button
                    onClick={() => setOpenChatBox(true)}
                    className="flex items-center gap-2 hover:opacity-80 p-3 py-1 bg-zinc-200 dark:bg-zinc-800 rounded-full text-sm font-semibold"
                  >
                    <CommentBoxIcon /> Chat
                  </button>
                </>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

const RelationshipButton = ({ userLoginId, userDestinationId }: { userLoginId: string; userDestinationId: string }) => {
  const [userLogin, setUserLogin] = useState<IUser | null>(null)
  const { emitEvent } = useSocket()

  useEffect(() => {
    if (!userLoginId) return
    userServices
      .getUserById(userLoginId)
      .then((res) => {
        setUserLogin(res)
      })
      .catch((error) => console.log(error))
  }, [userLoginId])

  const buttonTextContent = useMemo(() => {
    if (!userLogin || !userDestinationId) return

    if (userLogin.friends.includes(userDestinationId)) return 'Friends'
    if (userLogin.friends_waiting.includes(userDestinationId)) return 'Accept'
    if (userLogin.friends_request.includes(userDestinationId)) return 'Friend Request Sent'
    return 'Add Friend'
  }, [userLogin, userDestinationId])

  const handleAddFriend = useCallback(async () => {
    if (!userDestinationId || !userLoginId) return
    try {
      if (buttonTextContent === 'Accept') {
        handleAcceptFriend(userDestinationId, userLoginId)
        const notificationResponse = await notifyServices.createNotify({
          type: 'friend_request',
          senderId: userLoginId,
          recipient: userDestinationId,
          metadata: {
            message: `<strong>${userLogin?.display_name}</strong> accept your friend request`,
            resource_url: '/devchat/@me',
          },
        })
        console.log('accept friend response data', notificationResponse)
        emitEvent(SOCKET_EVENTS.NOTIFYCATION.SEND, [notificationResponse], (response: any) => {
          console.log('socket response', response)
        })
        return
      }
      const response = await userServices.makeFriendRequest({
        userRequestId: userLoginId,
        userDestinationId,
      })
      const notificationResponse = await notifyServices.createNotify({
        type: 'friend_request',
        senderId: userLoginId,
        recipient: userDestinationId,
        metadata: {
          message: `<strong>${userLogin?.display_name}</strong> sent you a friend request`,
          resource_url: '/devchat/@me',
        },
      })
      console.log('NotificationResponse', notificationResponse)

      emitEvent(SOCKET_EVENTS.NOTIFYCATION.SEND, [notificationResponse], (response: any) => {
        console.log('socket response', response)
      })

      setUserLogin(response.userReq)
    } catch (error) {
      console.log(error)
    }
  }, [userLoginId, userDestinationId, userLogin])

  const handleAcceptFriend = useCallback(async (userDestinationId: string, userLoginId: string) => {
    userServices
      .acceptFriendRequestAsync({ userRequestId: userLoginId, userDestinationId: userDestinationId })
      .then((res) => {
        setUserLogin(res.userReq)
      })
      .catch((err) => console.log(err))
  }, [])

  return (
    <button
      onClick={handleAddFriend}
      disabled={buttonTextContent === 'Friends' || buttonTextContent === 'Friend Request Sent'}
      className={classNames(
        'flex items-center gap-2 hover:opacity-80 p-3 py-1 bg-purple-800 rounded-full text-sm font-semibold text-zinc-100',
        { 'opacity-80': buttonTextContent === 'Friends' || buttonTextContent === 'Friend Request Sent' },
      )}
    >
      {buttonTextContent == 'Add Friend' ? (
        <>
          <PlusCircleIcon className="w-4 h-4" />
          {buttonTextContent}
        </>
      ) : (
        buttonTextContent
      )}
    </button>
  )
}
