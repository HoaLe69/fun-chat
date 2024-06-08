import { MenuItem } from '@headlessui/react'
import { MenuItemType } from '../lib/app.type'
import UserAvatar from './user-avatar'

const DropMenuItem: React.FC<MenuItemType> = props => {
  const { name, avatar_path, icon } = props
  return (
    <MenuItem>
      <div className="w-full h-14 px-5 flex items-center hover:bg-grey-300 cursor-pointer">
        {icon ? (
          <span className="w-9 flex justify-center">{icon}</span>
        ) : (
          <UserAvatar alt={name} src={avatar_path ?? 'in'} />
        )}
        <p className="text-grey-950 font-bold leading-5 ml-2">{name}</p>
      </div>
    </MenuItem>
  )
}
export default DropMenuItem
