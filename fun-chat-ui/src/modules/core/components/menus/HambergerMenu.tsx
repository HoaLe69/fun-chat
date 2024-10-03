import { Wrapper } from 'modules/core/components/menus'
import { MenuItem } from '@headlessui/react'
import { UserAvatar } from 'modules/core/components'

import {
  GroupPeopleIcon,
  MenuBurgerIcon,
  MentionIcon,
  PencilIcon,
  MoonIcon,
  PersonIcon,
} from 'modules/core/components/icons'
import ThemeToggleButton from '../ThemeToggleButton'
import { useAppDispatch, useAppSelector } from 'modules/core/hooks'
import { logOut, authSelector } from 'modules/auth/states/authSlice'
import { apiClient } from 'modules/core/services'

const HambergerMenu = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const _user = useAppSelector(authSelector.selectUser)

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
    {
      tag: '@logout',
      name: 'Sign Out',
      icon: <PersonIcon />,
      onClick: async () => {
        await apiClient.post('/auth/logOut')
        dispatch(logOut())
      },
    },
  ]

  return (
    <Wrapper anchor="bottom start" transition icon={<MenuBurgerIcon />}>
      <div className="bg-white dark:bg-grey-900">
        {_user && (
          <DropMenuUserItem
            display_name={_user?.display_name ?? ''}
            picture={_user?.picture ?? ''}
          />
        )}
        {menus.map((menuItem: MenuItemType) => (
          <DropMenuItem key={menuItem.tag} {...menuItem} />
        ))}
      </div>
    </Wrapper>
  )
}
export default HambergerMenu

type MenuItemType = {
  tag?: string
  name?: string
  icon?: JSX.Element
  right?: JSX.Element
  onClick?: () => void
}

const DropMenuItem: React.FC<MenuItemType> = props => {
  const { name, icon, right, onClick } = props
  return (
    <MenuItem>
      <div
        onClick={e => {
          e.preventDefault()
          if (typeof onClick === 'function') onClick()
        }}
        className="w-full h-14 px-5 flex items-center hover:bg-grey-300 dark:hover:bg-grey-700 cursor-pointer"
      >
        <span className="w-9 flex justify-center text-grey-500">{icon}</span>
        <p className="text-grey-950 dark:text-white font-bold leading-5 ml-2">
          {name}
        </p>
        {right && <div className="ml-auto">{right}</div>}
      </div>
    </MenuItem>
  )
}

type Props = {
  display_name?: string
  picture?: string
}
const DropMenuUserItem: React.FC<Props> = props => {
  const { display_name, picture } = props
  return (
    <MenuItem>
      <div
        onClick={e => {
          e.preventDefault()
        }}
        className="w-full h-14 px-5 flex items-center hover:bg-grey-300 dark:hover:bg-grey-700 cursor-pointer"
      >
        <UserAvatar src={picture ?? ''} alt={display_name ?? ''} size="md" />
        <p className="text-grey-950 dark:text-white font-bold leading-5 ml-2">
          {display_name}
        </p>
      </div>
    </MenuItem>
  )
}
