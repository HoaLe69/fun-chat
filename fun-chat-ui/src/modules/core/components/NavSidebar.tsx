import { Link } from 'react-router-dom'
import { DiscoverIcon, MessageFillIcon, NotificationIcon } from './icons'
import { useAppSelector, useSocket, useAppDispatch } from 'modules/core/hooks'
import { selectListRoom, updateRoomUnreadMessage } from 'modules/chat/states/roomSlice'
import { useMemo, useEffect, useState, useCallback } from 'react'
import { SOCKET_EVENTS } from 'const'
import { authSelector } from 'modules/auth/states/authSlice'
import { getUsersOnline } from 'modules/user/states/userSlice'
import { useParams } from 'react-router-dom'
import { fetchListRoomAsync } from 'modules/chat/states/roomActions'
import NotificationContainer from './Notification'
import { notifyServices } from 'modules/community/services'
import type { INotification } from 'modules/community/types'

const NavSidebar = () => {
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [openNotification, setOpenNotification] = useState<boolean>(false)
  const userLoginId = useAppSelector(authSelector.selectUserId)
  const { subscribeEvent, unSubcribeEvent, emitEvent } = useSocket()
  const rooms = useAppSelector(selectListRoom)
  const dispatch = useAppDispatch()

  const onClose = useCallback(() => {
    setOpenNotification(false)
  }, [])

  const { roomId } = useParams()

  const numOfUnreadMessage = useMemo(() => {
    return rooms.reduce((acc, room) => {
      const unRead = room.unreadMessage.map((msg) => {
        if (msg.userId === userLoginId) return msg.count
        return 0
      })
      return acc + unRead.reduce((a, b) => a + b, 0)
    }, 0)
  }, [rooms])

  const numOfUnreadNotification = useMemo(() => {
    if (!notifications) return 0
    return notifications.reduce((acc, notify) => {
      if (notify.isRead) return acc
      return acc + 1
    }, 0)
  }, [notifications])

  useEffect(() => {
    if (!userLoginId) return
    emitEvent('online', userLoginId)
    subscribeEvent('user-online', (msg: any) => {
      dispatch(getUsersOnline(msg))
    })
    subscribeEvent('user-offline', (msg: any) => {
      dispatch(getUsersOnline(msg))
    })
    subscribeEvent(SOCKET_EVENTS.NOTIFYCATION.ROOM_UNREAD, (msg: any) => {
      dispatch(updateRoomUnreadMessage(msg))
    })
    subscribeEvent(SOCKET_EVENTS.NOTIFYCATION.SENT, (msg: any) => {
      setNotifications((res) => [msg, ...res])
    })
    return () => {
      unSubcribeEvent(SOCKET_EVENTS.NOTIFYCATION.ROOM_UNREAD)
      unSubcribeEvent('user-online')
      unSubcribeEvent('user-offline')
      unSubcribeEvent(SOCKET_EVENTS.NOTIFYCATION.SENT)
      emitEvent('offline', userLoginId)
    }
  }, [userLoginId])

  useEffect(() => {
    if (!userLoginId) return
    notifyServices
      .getNotifies(userLoginId)
      .then((res) => {
        setNotifications(res.data)
      })
      .catch((error) => console.log(error))
  }, [userLoginId])

  useEffect(() => {
    if (roomId || !userLoginId) return
    dispatch(fetchListRoomAsync({ userId: userLoginId }))
  }, [userLoginId, roomId])

  const onReadNotification = useCallback((notificationId: string) => {
    if (!notificationId) return

    notifyServices
      .readNotificationAsync(notificationId)
      .then((res) => {
        setNotifications((pre) => {
          return pre.map((n) => (n._id === res._id ? { ...n, isRead: res.isRead } : n))
        })
      })
      .catch((error) => console.log(error))
  }, [])

  return (
    <div className="relative z-50 text-gray-950 dark:text-gray-50 w-full h-full bg-zinc-200 dark:bg-zinc-950  flex flex-col gap-4 items-center py-3">
      <Link to="/">
        <button className=" w-12 h-12 bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-800 hover:text-white hover:rounded-xl transition-colors flex items-center justify-center rounded-full ">
          <DiscoverIcon />
        </button>
      </Link>

      <Link to="/devchat/@me">
        <button className="relative w-12 h-12 bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-800 hover:text-white hover:rounded-xl transition-colors flex items-center justify-center rounded-full ">
          <MessageFillIcon />
          {numOfUnreadMessage > 0 && (
            <span className="absolute text-sm font-bold top-0 right-0 translate-x-1/2 w-6 h-6 flex items-center justify-center bg-red-600 rounded-full text-zinc-50">
              {numOfUnreadMessage}
            </span>
          )}
        </button>
      </Link>
      <button
        onClick={() => setOpenNotification(true)}
        className="relative w-12 h-12 bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-800 hover:text-white hover:rounded-xl transition-colors flex items-center justify-center rounded-full "
      >
        <NotificationIcon />
        {numOfUnreadNotification > 0 && (
          <span className="absolute text-sm font-bold top-0 right-0 translate-x-1/2 w-6 h-6 flex items-center justify-center bg-red-600 rounded-full text-zinc-50">
            {numOfUnreadNotification}
          </span>
        )}
      </button>
      <NotificationContainer
        onReadNotification={onReadNotification}
        open={openNotification}
        onClose={onClose}
        notifications={notifications}
      />
    </div>
  )
}

export default NavSidebar
