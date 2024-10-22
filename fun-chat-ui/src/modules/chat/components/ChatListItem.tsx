//TODO: Move IUser to user module
import type { IConversation, IUser } from 'modules/chat/types'
import { UserAvatar } from 'modules/core/components'

import { useCallback, useEffect, useState } from 'react'
import moment from 'moment'

import { minimalTime } from '../utils/dateTimeFormat'
//import users from 'modules/chat/mock/user.json'
import { useAppDispatch, useAppSelector } from 'modules/core/hooks'
import { selectRoom } from '../states/roomSlice'
import { userServices } from 'modules/user/services'
import { userSelector } from 'modules/user/states/userSlice'
import classNames from 'classnames'

type Props = IConversation & {
  userLoginId: string | undefined
}

const ChatListItem: React.FC<Props> = props => {
  const dispatch = useAppDispatch()
  const { _id, members, userLoginId, latestMessage } = props
  const [recipient, setRecipient] = useState<IUser>()
  const usersOnline = useAppSelector(userSelector.selectListCurrentUserOnline)

  const recipientId = members.find(m => m !== userLoginId)

  useEffect(() => {
    const getRecipientInfo = async () => {
      try {
        const user = await userServices.getUserById(recipientId)
        setRecipient(user)
      } catch (error) {
        console.error(error)
      }
    }
    getRecipientInfo()
  }, [recipientId])

  const latestMessageText = useCallback(() => {
    const ownerMsg = latestMessage.ownerId === userLoginId

    if (latestMessage.isDeleted) {
      if (ownerMsg) {
        return `You was unsent message`
      } else return `${recipient?.display_name} was unsent message`
    } else {
      if (ownerMsg) {
        return `You: ${latestMessage.text}`
      }
      return latestMessage.text
    }
  }, [latestMessage])

  const renderLatestMessage = () => {
    return (
      <p
        className={classNames('text-sm truncate flex-1  text-gray-500 mt-1', {
          'dark:text-grey-50 text-grey-950':
            latestMessage.status?.type !== 'seen' && !latestMessage.isDeleted,
          itatlic: latestMessage.isDeleted,
        })}
      >
        {latestMessageText()}
      </p>
    )
  }

  const renderStatusOfLatestMessage = () => {
    const status = latestMessage?.status?.type
    const isDeleted = latestMessage.isDeleted
    return (
      <div>
        {isDeleted ?
          null
        : status !== 'seen' ?
          <span className="ml-auto inline-block w-3 h-3 rounded-full bg-blue-400" />
        : latestMessage.ownerId === userLoginId ?
          <div className="w-3 h-3">
            <img
              className="rounded-full"
              src={recipient?.picture}
              alt={recipient?.display_name}
            />
          </div>
        : null}
      </div>
    )
  }
  const handleSelectedRoom = (_id: string) => {
    const roomInfo = {
      _id,
      recipientInfo: {
        _id: recipient?._id,
        name: recipient?.display_name,
        picture: recipient?.picture,
        status: usersOnline[recipient?._id || ''],
      },
    }
    dispatch(selectRoom(roomInfo))
  }

  return (
    <li
      onClick={() => handleSelectedRoom(_id)}
      className="hover:bg-grey-200 dark:hover:bg-grey-800 cursor-pointer rounded-md px-2 py-3"
    >
      <div className="flex items-center">
        <div className="relative">
          {recipient && (
            <UserAvatar
              alt={recipient?.display_name}
              src={recipient?.picture}
              size="lg"
            />
          )}
          {usersOnline[recipient?._id || ''] && (
            <div className="absolute w-3 h-3 rounded-full bg-green-500 bottom-0 right-1" />
          )}
        </div>
        <div className="pl-2 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{recipient?.display_name}</span>
            <span className="text-xs text-gray-500 ">
              {minimalTime(moment(latestMessage?.createdAt).fromNow())}
            </span>
          </div>
          <div className="text-grey-500 flex items-center">
            {renderLatestMessage()}
            {renderStatusOfLatestMessage()}
          </div>
        </div>
      </div>
    </li>
  )
}

export default ChatListItem
