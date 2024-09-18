import type { RoomChatType } from 'lib/app.type'
import { UserType } from 'lib/app.type'
import { UserAvatar } from 'modules/core/components'

import { useEffect, useState } from 'react'
import { userServices } from 'modules/user/services/userServices'
import {
  addSelectedRoomToStack,
  roomSelector,
  selectedRoom,
} from 'modules/chat/states/roomSlice'
import { useAppDispatch, useAppSelector } from 'modules/core/hooks'
import moment from 'moment'

import TypingIndicator from './TypingIndicator'
import classNames from 'classnames'
import { minimalTime } from '../utils/dateTimeFormat'

type Props = RoomChatType & {
  userLoginId: string | null
  t?: {
    userId?: string
    isTyping?: boolean
  }
}

const ChatListItem: React.FC<Props> = props => {
  const { _id, members, userLoginId, latestMessage, t } = props
  const [recipient, setRecipient] = useState<UserType>()

  const roomSelectedId = useAppSelector(roomSelector.selectRoomId)

  const recipientId = members?.find(m => m !== userLoginId)

  const dispatch = useAppDispatch()

  useEffect(() => {
    const getUser = async () => {
      const res = await userServices.getUserById(recipientId)
      if (res) setRecipient(res)
    }
    if (recipientId) {
      getUser()
    }
  }, [recipientId])

  const handleSelectRoom = () => {
    dispatch(selectedRoom({ roomId: _id, recipient, latestMessage }))
    dispatch(addSelectedRoomToStack({ roomId: _id }))
  }
  const renderLatestMessage = () => {
    return (
      <p className="text-[12px] max-w-44 truncate  flex-1">
        {latestMessage?.ownerId === userLoginId
          ? `You: ${latestMessage?.text}`
          : latestMessage.text}
      </p>
    )
  }

  const isActiveRoom = roomSelectedId === _id
  return (
    <li
      onClick={handleSelectRoom}
      className={classNames(
        'hover:bg-grey-200 dark:hover:bg-grey-800 cursor-pointer',
        {
          'bg-grey-300 dark:bg-grey-700': isActiveRoom,
        },
      )}
    >
      <div className="flex items-center px-2 py-3">
        <div>
          {recipient && (
            <UserAvatar
              alt={recipient?.display_name}
              src={recipient?.picture}
              size="lg"
            />
          )}
        </div>
        <div className="pl-2 flex-1 pr-2 flex flex-col">
          {recipient && (
            <span className="font-bold">{recipient?.display_name}</span>
          )}
          <div className="flex items-center text-grey-500 justify-between">
            {t?.isTyping ? (
              t.userId !== userLoginId ? (
                <TypingIndicator />
              ) : (
                renderLatestMessage()
              )
            ) : (
              renderLatestMessage()
            )}
            <p className="text-[12px]">
              {minimalTime(moment(latestMessage?.createdAt).fromNow())}
            </p>
          </div>
        </div>
      </div>
    </li>
  )
}

export default ChatListItem
