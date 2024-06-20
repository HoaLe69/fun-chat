import { useState } from 'react'
import Channels from '../channels'
import { SearchIcon } from '../icons'
import DropDownMenu from '../drop-menu'
import s from './sidebar.module.css'

const Sidebar = (): JSX.Element => {
  const [isFocus, setIsFocus] = useState(false)
  const handleStartingSearch = () => {
    setIsFocus(true)
  }
  return (
    <aside className="flex flex-col max-w-aside w-full bg-grey-50 dark:bg-grey-900 h-screen border-r-2 border-grey-300 dark:border-grey-700">
      <header className="px-4 py-3 w-full">
        <div className="flex">
          <DropDownMenu />
          <div className="flex-shrink-0 flex-1 flex items-center justify-center ml-2 px-4 border-2 group  rounded-3xl border-grey-300 dark:border-grey-700   focus-within:border-blue-500 dark:focus-within:border-blue-400">
            <span className="group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400">
              <SearchIcon />
            </span>
            <input
              name="search"
              placeholder="Search"
              onFocus={handleStartingSearch}
              onBlur={() => setIsFocus(false)}
              id="search"
              className="flex-1 h-full dark:bg-grey-900 border-none outline-none px-2 text-grey-950 dark:text-grey-50 group-focus-within:caret-blue-500"
            />
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        <Channels />
      </div>
    </aside>
  )
}

export default Sidebar
