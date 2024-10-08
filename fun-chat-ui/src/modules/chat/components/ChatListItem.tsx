//TODO: Move IUser to user module
import type { IConversation, IUser } from 'modules/chat/types'
import { UserAvatar } from 'modules/core/components'

import { useEffect, useState } from 'react'
import moment from 'moment'

import { minimalTime } from '../utils/dateTimeFormat'
import users from 'modules/chat/mock/user.json'
import { useAppDispatch } from 'modules/core/hooks'
import { selectRoom } from '../states/roomSlice'

type Props = IConversation & {
  userLoginId: string | undefined
}

const ChatListItem: React.FC<Props> = props => {
  const dispatch = useAppDispatch()
  const { _id, members, userLoginId, latestMessage } = props
  const [recipient, setRecipient] = useState<IUser>()

  const recipientId = members.find(m => m !== userLoginId)

  useEffect(() => {
    const getRecipientInfo = async () => {
      const res = users.find(user => user._id === recipientId)
      if (res) setRecipient(res)
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
      info: {
        _id: recipient?._id,
        name: recipient?.display_name,
        picture: recipient?.picture,
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
        <div>
          {recipient && (
            <UserAvatar
              alt={recipient?.display_name}
              src={recipient?.picture}
              size="lg"
            />
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
