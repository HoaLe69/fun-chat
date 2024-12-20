import { memo } from 'react'
import Image from './Image'
import { SettingIcon } from './icons'
import { useAppSelector } from '../hooks'
import Tippy from '@tippyjs/react/headless'
import { ThemeToggleButton } from 'modules/core/components'
import classNames from 'classnames'

const UserSetting = () => {
  const menu = [
    {
      tag: '@theme',
      name: 'Dark Mode',
      right: <ThemeToggleButton />,
    },
    {
      tag: '@logout',
      name: 'Sign Out',
      onClick: async () => { },
      press: true,
    },
  ]

  const userLogin = useAppSelector((state) => state.auth.user)

  return (
    <div className="py-2 px-2 bg-zinc-200 dark:bg-zinc-950 flex items-center justify-between text-gray-950 dark:text-gray-50">
      <div className="flex items-center gap-2">
        <Image src={userLogin?.picture} alt="placeholder" className="w-8 h-8 rounded-full" />
        <span className="text-sm font-semibold">{userLogin?.display_name}</span>
      </div>
      <Tippy
        interactive
        render={(attrs) => (
          <ul {...attrs} className="bg-zinc-200 dark:bg-zinc-950 list-none rounded-xl min-w-[252px] shadow-xl">
            {menu.map((item) => (
              <li
                key={item.name}
                className={classNames('rounded-xl py-1 px-2 ', {
                  'hover:bg-zinc-300 dark:hover:bg-zinc-800': item.press,
                })}
              >
                <button className="w-full p-2 flex items-center  justify-between">
                  <span>{item.name}</span>
                  {item.right}
                </button>
              </li>
            ))}
          </ul>
        )}
      >
        <button className="w-8 h-8 rounded-full hover:bg-zinc-300 flex items-center justify-center">
          <SettingIcon />
        </button>
      </Tippy>
    </div>
  )
}

export default memo(UserSetting)
