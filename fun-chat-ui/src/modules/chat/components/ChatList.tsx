import { TabGroup, TabList, TabPanel, TabPanels, Tab } from '@headlessui/react'
import { EmptyState } from 'modules/core/components'
import { RoomChatType } from 'lib/app.type'
import ChatListItem from './ChatListItem'

import SearchResult from 'modules/search'
import HambergerMenu from 'modules/core/components/menus/HambergerMenu'

import classNames from 'classnames'
import { useAppSelector, useAppDispatch } from 'modules/core/hooks'
import {
  roomSelector,
  updateStatusOfLatestMessage,
} from 'modules/chat/states/roomSlice'
import { useEffect, useState } from 'react'
import { fetchListRoomAsync } from 'modules/chat/states/roomActions'
import { addRoomChat } from 'modules/chat/states/roomSlice'
import { authSelector } from 'modules/auth/states/authSlice'
import { useSocket } from 'modules/core/hooks'

import { ArrowLeftIcon, SearchIcon } from 'modules/core/components/icons'

const RoomChatSpam = () => {
  return (
    <ul className="overflow-x-hidden w-full">
      <EmptyState content="You currently have no spam messages" />
    </ul>
  )
}

const ChatList: React.FC = () => {
  const [openSearch, setOpenSearch] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const roomChats = useAppSelector(roomSelector.selectListRooms)
  const user = useAppSelector(authSelector.selectUser)

  const handleStartingSearch = () => {
    setOpenSearch(true)
  }
  const handleCloseSearchAndClearInput = () => {
    setOpenSearch(false)
    setSearchValue('')
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const roomSelectedList = useAppSelector(
    roomSelector.selectListRoomAlreadyVisited,
  )
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
    if (user?._id) dispatch(fetchListRoomAsync({ userId: user?._id }))
  }, [user])

  useEffect(() => {
    socket.on('chat:typingStart', msg => {
      const { roomId, userId } = msg
      dispatch(updateStatusOfLatestMessage({ roomId, userId, isTyping: true }))
    })
    socket.on('chat:typingStop', msg => {
      const { roomId, userId } = msg
      dispatch(updateStatusOfLatestMessage({ roomId, userId, isTyping: false }))
    })
    return () => {
      socket.off('chat:typingStart')
      socket.off('chat:typingStop')
    }
  }, [])

  useEffect(() => {
    roomSelectedList.forEach(room => {
      socket.emit('join', room)
      console.log(`you joined into room ${room}`)
    })

    return () => {
      roomSelectedList.forEach(room => {
        socket.emit('leave', room)
        console.log(`you left room  ${room}`)
      })
    }
  }, [roomSelectedList])

  return (
    <aside className="flex flex-col w-full md:max-w-aside bg-grey-50 dark:bg-grey-900 h-screen border-r-2 border-grey-300 dark:border-grey-700">
      <header className="px-4 py-3 w-full">
        <div className="flex">
          {openSearch ? (
            <span
              onClick={handleCloseSearchAndClearInput}
              className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-grey-200 dark:hover:bg-grey-800 cursor-pointer text-grey-950 dark:text-grey-50"
            >
              <ArrowLeftIcon />
            </span>
          ) : (
            <HambergerMenu />
          )}
          <div className="flex-shrink-0 flex-1 flex items-center justify-center ml-2 px-4 border-2 group  rounded-3xl border-grey-300 dark:border-grey-700   focus-within:border-blue-500 dark:focus-within:border-blue-400">
            <span className="group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400">
              <SearchIcon />
            </span>
            <input
              autoComplete="off"
              onChange={handleChange}
              value={searchValue}
              name="search"
              placeholder="Search"
              onFocus={handleStartingSearch}
              id="search"
              className="flex-1 h-full dark:bg-grey-900 border-none outline-none px-2 text-grey-950 dark:text-grey-50 group-focus-within:caret-blue-500"
            />
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto relative">
        {openSearch ? (
          <div className="search absolute inset-0">
            <SearchResult
              searchTerm={searchValue}
              handleCloseSearchAndClearInput={handleCloseSearchAndClearInput}
            />
          </div>
        ) : (
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
                  <ul className="overflow-x-hidden w-full transition-all">
                    {roomChats.map((roomChat: RoomChatType) => {
                      return (
                        <ChatListItem
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
        )}
      </div>
    </aside>
  )
}

export default ChatList
