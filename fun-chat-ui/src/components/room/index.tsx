import { TabGroup, TabList, TabPanel, TabPanels, Tab } from '@headlessui/react'
import Empty from 'components/common/empty-sate'
import { RoomChatType } from 'lib/app.type'
import RoomChat from './room'

import s from './room.module.css'
import classNames from 'classnames'
import { useAppSelector, useAppDispatch } from 'hooks'
import { roomSelector } from 'redux/room.store'
import { useEffect } from 'react'
import { fetchListRoomAsync } from 'api/room.api'
import { userSelector } from 'redux/user.store'

const RoomChats: React.FC = () => {
  const roomChats = useAppSelector(roomSelector.selectListRooms)
  const user = useAppSelector(userSelector.selectUser)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (user?._id) dispatch(fetchListRoomAsync({ userLoginId: user?._id }))
  }, [user])

  return (
    <div className="h-full">
      <TabGroup>
        <TabList className="px-2 pb-2">
          <Tab>
            {({ hover, selected }) => (
              <span
                className={classNames(
                  'text-grey-950 dark:text-grey-50',
                  s.tab_btn,
                  hover && s.tab_btn_hover,
                  selected && s.tab_btn_active,
                )}
              >
                Inbox
              </span>
            )}
          </Tab>
          <Tab>
            {({ hover, selected }) => (
              <span
                className={classNames(
                  'text-grey-950 dark:text-grey-50',
                  s.tab_btn,
                  'ml-1',
                  hover && s.tab_btn_hover,
                  selected && s.tab_btn_active,
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
            <ul className="overflow-x-hidden w-full">
              <Empty content="You currently have no spam messages" />
            </ul>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  )
}

export default RoomChats
