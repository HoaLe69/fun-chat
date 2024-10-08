import type { IConversation } from 'modules/chat/types'
import ChatListItem from './ChatListItem'

import SearchResult from 'modules/search'
import HambergerMenu from 'modules/core/components/menus/HambergerMenu'

import { useAppSelector } from 'modules/core/hooks'
import { useState } from 'react'
import { authSelector } from 'modules/auth/states/authSlice'

import { SearchIcon } from 'modules/core/components/icons'
import rooms from 'modules/chat/mock/room.json'

const ChatList: React.FC = () => {
  const [openSearch, setOpenSearch] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const [roomList, setRoomList] = useState(rooms)
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
  return (
    <aside className="w-1/4 px-2 bg-grey-50 dark:bg-grey-900 overflow-y-auto border-r-2 border-grey-300 dark:border-grey-700">
      <header className="flex w-full py-3 items-center gap-2">
        <HambergerMenu />
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
          <div className="search absolute inset-0">
            <SearchResult
              searchTerm={searchValue}
              handleCloseSearchAndClearInput={handleCloseSearchAndClearInput}
            />
          </div>
        : <div className="h-full">
            <ul className="overflow-x-hidden w-full transition-all">
              {roomList.map((room: IConversation) => {
                return (
                  <ChatListItem
                    userLoginId={user?._id}
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
