import { Popover, PopoverPanel, PopoverButton } from '@headlessui/react'
import { ThreeDotVerticalIcon, TrashIcon, ReplyIcon } from './icons'
import { useState } from 'react'
import moment from 'moment'

import AppModal from 'components/common/app-modal'

import classNames from 'classnames'
import { useAppSelector } from 'hooks'
import { roomSelector } from 'redux/room.store'
import useSocket from 'hooks/useSocket'
import { apiClient } from 'api/apiClient'

const timeToSeconds = (input?: string | null) => {
  if (!input) return
  return moment(input).unix()
}
type Props = {
  roomId?: string
  createdAt: string
  messageId?: string
  isCurrentUser: boolean
  recipientId: string | null
}
const ContextualMenu: React.FC<Props> = ({
  roomId,
  messageId,
  createdAt,
  recipientId,
  isCurrentUser,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const { sendMessage } = useSocket()

  const latestMessage = useAppSelector(
    roomSelector.selectLatestMessageOfSelectdRoom,
  )

  const onClose = () => {
    setShowModal(false)
  }
  const handleRecallMessage = async () => {
    if (!messageId) return
    const isNotifyRecipient =
      timeToSeconds(createdAt) === timeToSeconds(latestMessage.createdAt)

    const msg = await apiClient.patch(`/message/recall/${messageId}`)
    // update latest message if user recall latest message
    if (isNotifyRecipient) {
      await apiClient.patch(`/room/update/latestMessage/${roomId}`, {
        latestMessage: {
          text: 'Message was recall',
          createdAt: msg.data.updatedAt,
        },
      })
    }

    sendMessage({
      destination: 'chat:recallMessage',
      data: {
        roomId,
        messageId,
        recipientId,
        isNotifyRecipient,
        modifyTime: msg?.data.updatedAt,
      },
    })
    onClose()
  }

  const classes =
    'flex items-center py-3 px-4 cursor-pointer hover:bg-grey-200 dark:hover:bg-grey-800 '
  return (
    <>
      <Popover>
        {({ open }) => (
          <>
            <PopoverButton className="outline-none">
              <span
                className={classNames('btn_icon', {
                  '!opacity-100 text-blue-500 dark:text-blue-400 bg-grey-100 dark:bg-grey-900':
                    open,
                })}
              >
                <ThreeDotVerticalIcon />
              </span>
            </PopoverButton>
            <PopoverPanel
              anchor="top start"
              className="[--anchor-gap:10px] shadow-xl rounded-2xl"
            >
              <ul className="bg-grey-50 dark:bg-grey-900 text-grey-950 dark:text-grey-50 w-60 rounded-2xl overflow-hidden">
                <li className={classes}>
                  <span className="mr-4">
                    <ReplyIcon />
                  </span>
                  Reply
                </li>
                {isCurrentUser && (
                  <li
                    onClick={() => setShowModal(true)}
                    className={`${classes} text-red-600 rounded-b-2xl`}
                  >
                    <span className="mr-4">
                      <TrashIcon />
                    </span>
                    Delete message
                  </li>
                )}
              </ul>
            </PopoverPanel>
          </>
        )}
      </Popover>
      <AppModal
        isOpen={showModal}
        callback={handleRecallMessage}
        onClose={onClose}
        title="Delete Message"
        message="Are you sure you want to permanently delete this message"
      />
    </>
  )
}
export default ContextualMenu
