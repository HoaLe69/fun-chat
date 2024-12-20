import type { IConversation } from 'modules/chat/types'
import ChatListItem from './ChatListItem'
import { useAppDispatch, useSocket } from 'modules/core/hooks'

import { useAppSelector } from 'modules/core/hooks'
import { useEffect } from 'react'
import { authSelector } from 'modules/auth/states/authSlice'

import { addRoom, selectListRoom } from '../states/roomSlice'
import { fetchListRoomAsync } from '../states/roomActions'
import { SOCKET_EVENTS } from 'const'

const ChatList: React.FC = () => {
  const rooms = useAppSelector(selectListRoom)
  const dispatch = useAppDispatch()

  const userLoginId = useAppSelector(authSelector.selectUserId)
  const { subscribeEvent, unSubcribeEvent } = useSocket()

  useEffect(() => {
    if (userLoginId) dispatch(fetchListRoomAsync({ userId: userLoginId }))
  }, [userLoginId])

  useEffect(() => {
    subscribeEvent(SOCKET_EVENTS.ROOM.CREATED, (res: any) => {
      console.log('room created', res)
      dispatch(addRoom(res.room))
    })
    return () => {
      unSubcribeEvent(SOCKET_EVENTS.ROOM.CREATED)
    }
  }, [userLoginId])

  return (
    <div className="flex-1 overflow-y-auto relative">
      <div className="h-full">
        <ul className="overflow-x-hidden w-full transition-all h-full">
          {rooms?.map((room: IConversation) => {
            return <ChatListItem userLoginId={userLoginId} key={room._id} {...room} />
          })}
        </ul>
      </div>
    </div>
  )
}

export default ChatList
