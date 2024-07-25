import { ChannelType } from '../../lib/app.type'
import { useEffect, useState } from 'react'
import { fetchUser } from '../../api/user.api'
import { UserType } from '../../lib/app.type'
import UserAvatar from '../user-avatar'
import { selectRoom } from '../../redux/channel.store'
import { useAppDispatch } from '../../hooks'

type ChannelPropsType = ChannelType & {
  userLoginId: string | null
}

const Channel: React.FC<ChannelPropsType> = props => {
  const { _id, members, userLoginId } = props
  const [receiveUser, setReceiveUser] = useState<UserType>()
  const receiveId = members?.find(m => m !== userLoginId)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const getUser = async () => {
      const res = await fetchUser(receiveId)
      if (res) setReceiveUser(res)
    }
    if (receiveId) {
      getUser()
    }
  }, [receiveId])

  // change url without reloading page
  const handleSelectRoom = () => {
    window.history.replaceState(null, '', `/${_id}/${receiveId}`)
    dispatch(selectRoom({ id: _id, partnerId: receiveId }))
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
            {/* <p className="text-sm  max-w-44 truncate ">{latest_message}</p> */}
            {/* <span className="ml-auto">{time}</span> */}
          </div>
        </div>
      </div>
    </li>
  )
}

export default Channel
