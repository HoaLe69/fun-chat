import type { RoomChatType } from 'lib/app.type'
import { UserType } from 'lib/app.type'
import UserAvatar from 'components/user-avatar'

import { useEffect, useState } from 'react'
import { fetchUser } from 'api/user.api'
import { selectRoom } from 'redux/room.store'
import { useAppDispatch, useAppSelector } from 'hooks'
import { userSelector } from 'redux/user.store'

type Props = RoomChatType & {
  userLoginId: string | null
  status?: { userId: string; isTyping: boolean }
}

const RoomChat: React.FC<Props> = props => {
  const { _id, members, userLoginId, latest_message, status } = props
  const [receiveUser, setReceiveUser] = useState<UserType>()
  // @ts-ignore
  const receiver: any = members?.find(m => m?.userId !== userLoginId)
  const user = useAppSelector(userSelector.selectUser)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const getUser = async () => {
      const res = await fetchUser(receiver?.userId)
      if (res) setReceiveUser(res)
    }
    if (receiver?.userId) {
      getUser()
    }
  }, [receiver])

  // change url without reloading page
  const handleSelectRoom = () => {
    dispatch(selectRoom({ id: _id, partnerId: receiver?.userId }))
  }
  return (
    <li
      onClick={handleSelectRoom}
      className="hover:bg-grey-200 dark:hover:bg-grey-800 cursor-pointer"
    >
      <div className="flex items-center px-2 py-3">
        <div>
          {receiveUser && (
            <UserAvatar
              alt={receiveUser?.display_name}
              src={receiveUser?.picture}
              size="lg"
            />
          )}
        </div>
        <div className="pl-2 flex-1 pr-2 flex flex-col">
          {receiveUser && (
            <span className="font-bold">{receiveUser?.display_name}</span>
          )}
          <div className="flex items-center text-grey-500">
            <p className="text-sm  max-w-44 truncate ">
              {status?.userId === user?._id
                ? latest_message ?? 'Not message yet'
                : status?.isTyping
                  ? 'Typing...'
                  : latest_message ?? 'Not message yet'}
            </p>
          </div>
        </div>
      </div>
    </li>
  )
}

export default RoomChat
