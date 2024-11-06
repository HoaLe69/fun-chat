import { UserAvatar } from 'modules/core/components'
import {
  GroupPeopleIcon,
  MenuBurgerIcon,
  MentionIcon,
  PencilIcon,
  MoonIcon,
  PersonIcon,
} from 'modules/core/components/icons'
import { useAppDispatch, useAppSelector, useSocket } from 'modules/core/hooks'
import { logOut, authSelector } from 'modules/auth/states/authSlice'
import { authServices } from 'modules/auth/services/authServices'
import { Menu, ThemeToggleButton } from 'modules/core/components'
import classNames from 'classnames'

const HambergerMenu = (): JSX.Element => {
  const _user = useAppSelector(authSelector.selectUser)
  const { emitEvent } = useSocket()
  const dispatch = useAppDispatch()
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
        try {
          await authServices.logOut()
          emitEvent('user-offline', _user?._id)
          dispatch(logOut())
        } catch (error) {
          console.log(error)
        }
      },
    },
  ]

  return (
    <Menu
      triggerButton={(active) => (
        <span
          className={classNames(
            'text-gray-500  w-11 h-11 rounded-full flex items-center justify-center hover:bg-grey-200 hover:dark:bg-grey-800',
            {
              '!text-blue-500 bg-grey-200 dark:bg-grey-800': active,
            },
          )}
        >
          <MenuBurgerIcon />
        </span>
      )}
    >
      <div className="bg-white dark:bg-grey-900 w-[295px] z-50">
        <DropMenuUserItem display_name={_user?.display_name} picture={_user?.picture} />
        {menus.map((menuItem: MenuItemType) => (
          <DropMenuItem key={menuItem.tag} {...menuItem} />
        ))}
      </div>
    </Menu>
  )
}

type MenuItemType = {
  tag?: string
  name?: string
  icon?: JSX.Element
  right?: JSX.Element
  onClick?: () => void
}

const DropMenuItem: React.FC<MenuItemType> = (props) => {
  const { name, icon, right, onClick } = props
  return (
    <div
      onClick={(e) => {
        e.preventDefault()
        if (typeof onClick === 'function') onClick()
      }}
      className="w-full h-14 px-5 flex items-center hover:bg-grey-300 dark:hover:bg-grey-700 cursor-pointer"
    >
      <span className="w-9 flex justify-center text-grey-500">{icon}</span>
      <p className="text-grey-950 dark:text-white font-bold leading-5 ml-2">{name}</p>
      {right && <div className="ml-auto">{right}</div>}
    </div>
  )
}

type Props = {
  display_name?: string
  picture?: string
}
const DropMenuUserItem: React.FC<Props> = (props) => {
  const { display_name, picture } = props
  return (
    <div
      onClick={(e) => {
        e.preventDefault()
      }}
      className="w-full h-14 px-5 flex items-center hover:bg-grey-300 dark:hover:bg-grey-700 cursor-pointer"
    >
      <UserAvatar src={picture ?? ''} alt={display_name ?? ''} size="md" />
      <p className="text-grey-950 dark:text-white font-bold leading-5 ml-2">{display_name}</p>
    </div>
  )
}

export default HambergerMenu
