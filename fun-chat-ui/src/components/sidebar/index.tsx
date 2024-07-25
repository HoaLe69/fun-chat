import { useEffect, useState } from 'react'
import Channels from '../channel'
import { SearchIcon } from '../icons'
import DropDownMenu from '../drop-menu'
import { ArrowLeftIcon } from '../icons'
import SearchResult from '../search-result'
import useDebounce from '../../hooks/useDebounce'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { searchUser } from '../../api/user.api'
import { userSelector } from '../../redux/user.store'

const Sidebar = (): JSX.Element => {
  const [openSearch, setOpenSearch] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const user = useAppSelector(userSelector.selectUser)
  const dispatch = useAppDispatch()
  const handleStartingSearch = () => {
    setOpenSearch(true)
  }
  const handleEndSearch = () => {
    setOpenSearch(false)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }
  const debounceValue = useDebounce(searchValue, 200)

  useEffect(() => {
    if (debounceValue) {
      dispatch(searchUser({ email: debounceValue, userId: user?._id }))
    }
  }, [debounceValue])
  return (
    <aside className="flex flex-col max-w-aside w-full bg-grey-50 dark:bg-grey-900 h-screen border-r-2 border-grey-300 dark:border-grey-700">
      <header className="px-4 py-3 w-full">
        <div className="flex">
          {openSearch ? (
            <span
              onClick={handleEndSearch}
              className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-grey-200 dark:hover:bg-grey-800 cursor-pointer text-grey-950 dark:text-grey-50"
            >
              <ArrowLeftIcon />
            </span>
          ) : (
            <DropDownMenu />
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
              // onBlur={handleEndSearch}
              id="search"
              className="flex-1 h-full dark:bg-grey-900 border-none outline-none px-2 text-grey-950 dark:text-grey-50 group-focus-within:caret-blue-500"
            />
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto relative">
        {openSearch ? (
          <div className="search absolute inset-0">
            <SearchResult />
          </div>
        ) : (
          <Channels />
        )}
      </div>
    </aside>
  )
}

export default Sidebar
