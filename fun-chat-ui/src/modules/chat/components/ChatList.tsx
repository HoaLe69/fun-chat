import type { IConversation } from 'modules/chat/types'
import ChatListItem from './ChatListItem'
import { useAppDispatch, useSocket } from 'modules/core/hooks'

import { useAppSelector } from 'modules/core/hooks'
import { useEffect } from 'react'
import { authSelector } from 'modules/auth/states/authSlice'

import { addRoom, markCurrentRoomCreated, selectListRoom } from '../states/roomSlice'
import { fetchListRoomAsync } from '../states/roomActions'
import { addMessage } from '../states/messageSlice'
import UserSettings from 'modules/core/components/UserSetting'

const ChatList: React.FC = () => {
  const rooms = useAppSelector(selectListRoom)
  const dispatch = useAppDispatch()

  const userLogin = useAppSelector(authSelector.selectUser)
  const { emitEvent, subscribeEvent, unSubcribeEvent } = useSocket()

  useEffect(() => {
    if (userLogin?._id) dispatch(fetchListRoomAsync({ userId: userLogin?._id }))
  }, [userLogin?._id])

  useEffect(() => {
    subscribeEvent('room:newChat', (res: any) => {
      if (res.creator === userLogin?._id) {
        dispatch(markCurrentRoomCreated())
        dispatch(addMessage(res.room.latestMessage))
      } else {
        emitEvent('chat:statusMessage', {
          msg: res.room.latestMessage,
          status: {
            type: 'delivered',
            readBy: [],
          },
        })
      }
      dispatch(addRoom({ ...res.room }))
    })
    return () => {
      unSubcribeEvent('room:newChat')
    }
  }, [userLogin])

  return (
    <aside className="flex flex-col bg-secondary-bg-light dark:bg-zinc-900 overflow-y-auto text-gray-950 dark:text-gray-50">
      <div className="flex-1 overflow-y-auto relative">
        <div className="h-full">
          <ul className="overflow-x-hidden w-full transition-all py-2 px-2">
            {rooms?.map((room: IConversation) => {
              return <ChatListItem userLoginId={userLogin?._id} key={room._id} {...room} />
            })}
          </ul>
        </div>
      </div>
      <UserSettings />
    </aside>
  )
}

export default ChatList
