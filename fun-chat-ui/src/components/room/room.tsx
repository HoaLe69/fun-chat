import type { RoomChatType } from 'lib/app.type'
import { UserType } from 'lib/app.type'
import UserAvatar from 'components/user-avatar'

import { useEffect, useState } from 'react'
import { fetchUser } from 'api/user.api'
import { selectedRoom } from 'redux/room.store'
import { useAppDispatch } from 'hooks'
import moment from 'moment'

type Props = RoomChatType & {
  userLoginId: string | null
}

const RoomChat: React.FC<Props> = props => {
  const { _id, members, userLoginId, latestMessage } = props
  const [recipient, setRecipient] = useState<UserType>()

  const recipientId = members?.find(m => m !== userLoginId)

  const dispatch = useAppDispatch()

  useEffect(() => {
    const getUser = async () => {
      const res = await fetchUser(recipientId)
      if (res) setRecipient(res)
    }
    if (recipientId) {
      getUser()
    }
  }, [recipientId])

  const handleSelectRoom = () => {
    dispatch(selectedRoom({ roomId: _id, recipient }))
  }
  return (
    <li
      onClick={handleSelectRoom}
      className="hover:bg-grey-200 dark:hover:bg-grey-800 cursor-pointer"
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
            <p className="text-sm  max-w-44 truncate  flex-1">
              {latestMessage?.text}
            </p>
            <p className="text-sm">
              {moment(latestMessage?.createdAt).format('LT')}
            </p>
          </div>
        </div>
      </div>
    </li>
  )
}

export default RoomChat
