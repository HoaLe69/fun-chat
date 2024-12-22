import { Dialog, DialogPanel, DialogBackdrop, DialogTitle } from '@headlessui/react'
import { useState, useEffect, useCallback, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import Image from 'modules/core/components/Image'
import type { IUser } from 'modules/user/types'
import type { INotification } from 'modules/community/types'
import { NotificationItemLoadingSkeleton } from 'modules/community/components/Loading'

import { userServices } from 'modules/user/services'
import moment from 'moment'

interface Props {
  open: boolean
  onClose: () => void
  notifications: INotification[]
  onReadNotification: (id: string) => void
}
const NotificationContainer: React.FC<Props> = ({ open, onClose, notifications, onReadNotification }) => {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 left-[72px] bg-zinc-800/80  transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 left-8 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:-translate-x-full sm:duration-700"
            >
              <div className="absolute left-8 top-0 -ml-8 flex pr-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:-ml-10 sm:pr-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <span className="absolute -inset-2.5" />
                  <span className="sr-only">Close panel</span>
                </button>
              </div>
              <div className="flex h-full flex-col overflow-y-scroll dark:bg-zinc-900 bg-zinc-100 py-6 shadow-xl text-zinc-900 dark:text-zinc-100">
                <div className="px-4 sm:px-6">
                  <DialogTitle className="text-2xl font-semibold">Notification</DialogTitle>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                  {notifications?.map((notify) => {
                    return (
                      <NotificationItem
                        key={notify?._id}
                        notification={notify}
                        onReadNotification={onReadNotification}
                        onClose={onClose}
                      />
                    )
                  })}
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

interface INotificationItem {
  notification: INotification
  onReadNotification: (id: string) => void
  onClose: () => void
}

const NotificationItem: React.FC<INotificationItem> = memo(({ notification, onReadNotification, onClose }) => {
  const [sender, setSender] = useState<IUser | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!notification?.sender) return
    setLoading(true)
    userServices
      .getUserById(notification.sender)
      .then((res) => {
        setSender(res)
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false))
  }, [notification])

  const handleClickOnNotificationItem = useCallback(
    (notificationId: string) => {
      if (!notification?.isRead) onReadNotification(notificationId)
      navigate(`${notification?.metadata?.resource_url}`)
      onClose()
    },
    [notification],
  )

  return (
    <>
      {loading ? (
        <NotificationItemLoadingSkeleton />
      ) : (
        <div
          onClick={() => handleClickOnNotificationItem(notification?._id)}
          className="flex items-center gap-2 border-t border-t-zinc-200 dark:border-t-zinc-600 py-4 hover:dark:bg-zinc-800 hover:cursor-pointer px-1"
        >
          <Image src={sender?.picture || ''} alt={sender?.display_name || ''} className="w-12 h-12 rounded-full" />
          <div>
            <div dangerouslySetInnerHTML={{ __html: notification?.metadata?.message }} />
            <span className="text-sm dark:text-gray-400 text-gray-400">
              {moment(notification?.createdAt).fromNow()}
            </span>
          </div>
          {!notification?.isRead && <span className="block w-3 h-3 rounded-full bg-blue-500 ml-auto"></span>}
        </div>
      )}
    </>
  )
})

export default NotificationContainer
