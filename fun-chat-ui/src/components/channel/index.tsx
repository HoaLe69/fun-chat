import Empty from '../common/empty-sate'
import { ChannelType } from '../../lib/app.type'
import { TabGroup, TabList, TabPanel, TabPanels, Tab } from '@headlessui/react'
import s from './channel.module.css'
import classNames from 'classnames'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { roomSelector } from '../../redux/channel.store'
import { useEffect } from 'react'
import { fetchListRoomAsync } from '../../api/room.api'
import { userSelector } from '../../redux/user.store'
import Channel from './channel'

const Channels: React.FC = () => {
  const channels = useAppSelector(roomSelector.selectListRooms)
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
              {channels.map((channel: ChannelType) => {
                return (
                  <Channel
                    userLoginId={user?._id}
                    key={channel._id}
                    {...channel}
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

export default Channels
