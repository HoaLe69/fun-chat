import type { IConversation } from 'modules/chat/types'
import ChatListItem from './ChatListItem'
import { useAppDispatch, useSocket } from 'modules/core/hooks'

import HambergerMenu from 'modules/core/components/menus/HambergerMenu'

import { useAppSelector } from 'modules/core/hooks'
import { useState, useEffect } from 'react'
import { authSelector } from 'modules/auth/states/authSlice'

import { SearchIcon, ArrowLeftIcon } from 'modules/core/components/icons'
import SearchUser from './SearchUser'
import {
  addRoom,
  markCurrentRoomCreated,
  selectListRoom,
  updateRoomLatestMessage,
} from '../states/roomSlice'
import { fetchListRoomAsync } from '../states/roomActions'

const ChatList: React.FC = () => {
  const [openSearch, setOpenSearch] = useState<boolean>(false)

  const [searchValue, setSearchValue] = useState<string>('')
  const rooms = useAppSelector(selectListRoom)
  const dispatch = useAppDispatch()

  const userLogin = useAppSelector(authSelector.selectUser)
  const { subscribeEvent, unSubcribeEvent } = useSocket()

  useEffect(() => {
    if (userLogin?._id) dispatch(fetchListRoomAsync({ userId: userLogin?._id }))
  }, [userLogin?._id])

  useEffect(() => {
    subscribeEvent('room:newChat', (res: any) => {
      dispatch(addRoom({ ...res.room }))
      if (res.success) dispatch(markCurrentRoomCreated())
    })
    subscribeEvent('room:syncNewMessage', (res: any) => {
      console.log({ res })
      dispatch(updateRoomLatestMessage(res.latestMessage))
    })
    return () => {
      unSubcribeEvent('room:newChat')
      unSubcribeEvent('room:syncNewMessage')
    }
  }, [])

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
  return (
    <aside className="w-1/4 flex flex-col px-2 bg-grey-50 dark:bg-grey-900 overflow-y-auto border-r-2 border-grey-300 dark:border-grey-700">
      <header className="flex w-full py-3 items-center gap-2">
        {openSearch ?
          <button
            onClick={handleCloseSearchAndClearInput}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-grey-200 dark:hover:bg-grey-800"
          >
            <ArrowLeftIcon />
          </button>
        : <HambergerMenu />}
        <div className="relative group flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2  text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400">
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
            className="w-full pl-10 pr-4 py-3 border border-grey-300 dark:border-grey-700 rounded-3xl dark:bg-grey-900 text-grey-950 dark:text-grey-50 focus:caret-blue-500 focus:border-blue-500 outline-none "
          />
        </div>
      </header>
      <div className="flex-1 overflow-y-auto relative">
        {openSearch ?
          <div className="absolute inset-0">
            <SearchUser searchTerm={searchValue} />
          </div>
        : <div className="h-full">
            <ul className="overflow-x-hidden w-full transition-all">
              {rooms?.map((room: IConversation) => {
                return (
                  <ChatListItem
                    userLoginId={userLogin?._id}
                    key={room._id}
                    {...room}
                  />
                )
              })}
            </ul>
          </div>
        }
      </div>
    </aside>
  )
}

export default ChatList
