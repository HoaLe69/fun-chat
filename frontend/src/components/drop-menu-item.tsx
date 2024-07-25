import { MenuItem } from '@headlessui/react'
import type { MenuItemType, UserType } from '../lib/app.type'
import UserAvatar from './user-avatar'

const DropMenuItem: React.FC<MenuItemType> = props => {
  const { name, icon, right } = props
  return (
    <MenuItem>
      <div
        onClick={e => {
          e.preventDefault()
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
export default DropMenuItem

export const DropMenuUserItem: React.FC<UserType> = props => {
  const { display_name, picture } = props
  return (
    <MenuItem>
      <div
        onClick={e => {
          e.preventDefault()
        }}
        className="w-full h-14 px-5 flex items-center hover:bg-grey-300 dark:hover:bg-grey-700 cursor-pointer"
      >
        <UserAvatar src={picture} alt={display_name} size="md" />
        <p className="text-grey-950 dark:text-white font-bold leading-5 ml-2">
          {display_name}
        </p>
      </div>
    </MenuItem>
  )
}
