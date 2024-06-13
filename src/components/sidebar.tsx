import { useState } from 'react'
import { SearchIcon } from './icons'
import classNames from 'classnames'
import DropDownMenu from './drop-menu'
import Channels from './channels'

const Sidebar = (): JSX.Element => {
  const [isFocus, setIsFocus] = useState(false)
  return (
    <aside className="flex flex-col max-w-aside w-full bg-grey-50 dark:bg-grey-900 h-screen border-r-2 border-grey-300 dark:border-grey-700">
      <header className="px-4 py-3 w-full">
        <div className="flex">
          <DropDownMenu />
          <div
            className={classNames(
              'flex-shrink-0 flex-1 flex items-center justify-center ml-2 px-4 border-2  rounded-3xl',
              {
                'border-blue-500 dark:border-blue-400': isFocus,
                'border-grey-300  dark:border-grey-700': !isFocus,
              },
            )}
          >
            <span
              className={classNames(
                { 'text-grey-500': !isFocus },
                {
                  'text-blue-500 dark:text-blue-400': isFocus,
                },
              )}
            >
              <SearchIcon />
            </span>
            <input
              name="search"
              placeholder="Search"
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              id="search"
              className={classNames(
                'flex-1 h-full dark:bg-grey-900 border-none outline-none px-2 text-grey-950 dark:text-grey-50',
                { 'caret-blue-500': isFocus },
              )}
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
