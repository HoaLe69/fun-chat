//TODO: Move IUser to user module
import type { IConversation, IUser } from 'modules/chat/types'

import { memo, useMemo, useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
//import users from 'modules/chat/mock/user.json'
import { useAppSelector } from 'modules/core/hooks'
import { userServices } from 'modules/user/services'
import { userSelector } from 'modules/user/states/userSlice'
import classNames from 'classnames'

type Props = IConversation & {
  userLoginId: string | undefined
}

const ChatListItem: React.FC<Props> = (props) => {
  const navigate = useNavigate()
  const { roomId } = useParams()
  const { _id, members, userLoginId, unreadMessage } = props
  const [recipient, setRecipient] = useState<IUser>()
  const usersOnline = useAppSelector(userSelector.selectListCurrentUserOnline)

  const recipientId = members.find((m) => m !== userLoginId)

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

  const handleSelectedRoom = (_id: string) => {
    navigate(`/devchat/@me/${_id}/${recipient?._id}`)
  }

  const onImgError = useCallback((event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = '/public/fallback.png'
  }, [])

  const unreadMessageCount = useMemo(() => {
    if (!userLoginId) return
    const msg = unreadMessage?.find((msg) => msg.userId === userLoginId)
    if (!msg) return 0
    return msg.count
  }, [userLoginId, unreadMessage])

  return (
    <li
      onClick={() => handleSelectedRoom(_id)}
      className={classNames('hover:bg-zinc-200 dark:hover:bg-zinc-800/80 cursor-pointer rounded-md h-11 px-2', {
        'bg-zinc-200 dark:bg-zinc-800/80': roomId === _id,
      })}
    >
      <div className="flex items-center h-full">
        <div className="relative">
          {recipient && (
            <img
              alt={recipient?.display_name}
              onError={onImgError}
              src={recipient?.picture}
              className="w-8 h-8 rounded-full"
            />
          )}
          {usersOnline[recipient?._id || ''] && (
            <div className="absolute w-3 h-3 rounded-full bg-green-500 bottom-0 right-1" />
          )}
        </div>
        <div className="pl-2 flex-1 min-w-0 flex items-center">
          <span className="font-medium text-gray-700 dark:text-gray-300 tracking-wide">{recipient?.display_name}</span>
          {unreadMessageCount > 0 && (
            <span className="ml-auto w-6 h-6 text-xs flex items-center justify-center rounded-full bg-red-600 text-zinc-50 font-bold">
              {unreadMessageCount}
            </span>
          )}
        </div>
      </div>
    </li>
  )
}

export default memo(ChatListItem)
