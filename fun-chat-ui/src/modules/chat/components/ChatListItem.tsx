//TODO: Move IUser to user module
import type { IConversation, IUser } from 'modules/chat/types'
import { UserAvatar } from 'modules/core/components'

import { useEffect, useState } from 'react'
import moment from 'moment'

import { minimalTime } from '../utils/dateTimeFormat'
//import users from 'modules/chat/mock/user.json'
import { useAppDispatch, useAppSelector } from 'modules/core/hooks'
import { selectRoom } from '../states/roomSlice'
import { userServices } from 'modules/user/services'
import { userSelector } from 'modules/user/states/userSlice'

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

  const renderLatestMessage = () => {
    return (
      <p className="text-sm truncate flex-1  text-gray-500 mt-1">
        {latestMessage.text}
      </p>
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
          <div className="text-grey-500 flex items-center justify-between">
            {renderLatestMessage()}
          </div>
        </div>
      </div>
    </li>
  )
}

export default ChatListItem
