import { TabGroup, TabList, TabPanel, TabPanels, Tab } from '@headlessui/react'
import Empty from 'components/common/empty-sate'
import { RoomChatType } from 'lib/app.type'
import RoomChat from './room'

import classNames from 'classnames'
import { useAppSelector, useAppDispatch } from 'hooks'
import { roomSelector } from 'redux/room.store'
import { useEffect } from 'react'
import { fetchListRoomAsync } from 'api/room.api'
import { userSelector } from 'redux/user.store'
import { addRoomChat } from 'redux/room.store'
import useSocket from 'hooks/useSocket'

const RoomChatSpam = () => {
  return (
    <ul className="overflow-x-hidden w-full">
      <Empty content="You currently have no spam messages" />
    </ul>
  )
}

const RoomChats: React.FC = () => {
  const roomChats = useAppSelector(roomSelector.selectListRooms)
  const user = useAppSelector(userSelector.selectUser)
  const dispatch = useAppDispatch()
  const { socket } = useSocket()

  useEffect(() => {
    socket.on('room:getNewChatInfo', room => {
      dispatch(addRoomChat(room))
    })
    return () => {
      socket.off('room:getNewChatInfo')
    }
  }, [])

  useEffect(() => {
    if (user?._id) dispatch(fetchListRoomAsync({ userLoginId: user?._id }))
  }, [user])

  return (
    <div className="h-full">
      <TabGroup>
        <TabList className="px-2 pb-2 flex gap-2">
          <Tab className="flex-1">
            {({ hover, selected }) => (
              <span
                className={classNames(
                  'text-grey-950 dark:text-grey-50 block text-sm  rounded-2xl py-1 ',
                  {
                    'hover:bg-grey-200  dark:hover:bg-grey-800': hover,
                    'bg-blue-100 dark:bg-blue-900 font-bold !text-blue-500':
                      selected,
                  },
                )}
              >
                Inbox
              </span>
            )}
          </Tab>
          <Tab className="flex-1">
            {({ hover, selected }) => (
              <span
                className={classNames(
                  'text-grey-950 dark:text-grey-50 block text-sm  rounded-2xl py-1 ',
                  {
                    'hover:bg-grey-200  dark:hover:bg-grey-800': hover,
                    'bg-blue-100 dark:bg-blue-900 font-bold !text-blue-500':
                      selected,
                  },
                )}
              >
                Spam
              </span>
            )}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ul className="overflow-x-hidden w-full">
              {roomChats.map((roomChat: RoomChatType) => {
                return (
                  <RoomChat
                    userLoginId={user?._id}
                    key={roomChat._id}
                    {...roomChat}
                  />
                )
              })}
            </ul>
          </TabPanel>
          <TabPanel>
            <RoomChatSpam />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  )
}

export default RoomChats
