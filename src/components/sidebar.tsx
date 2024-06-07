import { useState } from 'react'
import { MenuBurgerIcon, SearchIcon } from './icons'
import classNames from 'classnames'
const Sidebar = (): JSX.Element => {
  const [isFocus, setIsFocus] = useState(false)
  return (
    <aside className="max-w-aside w-full">
      <header className="px-4 py-3 w-full">
        <div className="flex">
          <div className="w-11 h-11  flex items-center justify-center">
            <MenuBurgerIcon />
          </div>
          <div
            className={classNames(
              'flex-shrink-0 flex-1 flex items-center justify-center ml-2 px-4 border-2  rounded-3xl',
              { 'border-blue-500': isFocus, 'border-grey-300': !isFocus },
            )}
          >
            <span
              className={classNames('text-grey-500', {
                'text-blue-500': isFocus,
              })}
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
                'flex-1 h-full border-none outline-none px-2 text-grey-950',
                { 'caret-blue-500': isFocus },
              )}
            />
          </div>
        </div>
      </header>
      <div className="w-30 h-20 dark:bg-slate-800">he</div>
    </aside>
  )
}

export default Sidebar
