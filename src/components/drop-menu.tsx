import { Menu, MenuButton, MenuItems, Transition } from '@headlessui/react'
import {
  GroupPeopleIcon,
  MenuBurgerIcon,
  MentionIcon,
  PencilIcon,
  MoonIcon,
  PersonIcon,
} from './icons'
import { Fragment } from 'react/jsx-runtime'
import DropMenuItem, { DropMenuUserItem } from './drop-menu-item'
import { MenuItemType } from '../lib/app.type'
import classNames from 'classnames'
import ThemeToggleButton from './theme-toggle-button'
import { useAppSelector } from '../hooks'
import { userSelector } from '../redux/user.store'

const menus = [
  { tag: '@mention', name: 'Mentions', icon: <MentionIcon /> },
  { tag: '@dirMess', name: 'New Direct Message', icon: <PencilIcon /> },
  { tag: '@group', name: 'New group', icon: <GroupPeopleIcon /> },
  {
    tag: '@theme',
    name: 'Dark Mode',
    icon: <MoonIcon />,
    right: <ThemeToggleButton />,
  },
  { tag: '@logout', name: 'Sign Out', icon: <PersonIcon /> },
]
const DropDownMenu = (): JSX.Element => {
  const _user = useAppSelector(userSelector.selectUser)
  return (
    <Menu>
      <MenuButton className="w-11 h-11">
        {({ active }) => (
          <span
            className={classNames(
              'w-full h-full rounded-full   flex items-center justify-center',
              {
                'bg-grey-200 dark:bg-grey-800 text-blue-500 dark:text-blue-400':
                  active,
              },
            )}
          >
            <MenuBurgerIcon />
          </span>
        )}
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems
          anchor="bottom start"
          className="w-menu drop-shadow-md dark:drop-shadow-tablet-modal-shadow-dark  rounded-md mt-2 "
        >
          <div className="bg-white dark:bg-grey-900">
            {_user && <DropMenuUserItem {..._user} />}
            {menus.map((menuItem: MenuItemType) => (
              <DropMenuItem key={menuItem.tag} {...menuItem} />
            ))}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  )
}
export default DropDownMenu
