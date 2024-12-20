import UserSetting from 'modules/core/components/UserSetting'
import ChatList from './ChatList'
import { PlusRawIcon, FriendUserIcon } from 'modules/core/components/icons'
import { useNavigate } from 'react-router-dom'
import CreateNewDirectMessage from './CreateNewDirectMessage'
const Sidebar = () => {
  const navigate = useNavigate()
  return (
    <aside className="flex flex-col bg-zinc-100 dark:bg-zinc-900 overflow-y-auto text-gray-950 dark:text-gray-50 px-2">
      <ul className="mt-4">
        <li
          onClick={() => navigate('/devchat/@me')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 py-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer"
        >
          <FriendUserIcon />
          <span className="text-sm font-medium">Friend</span>
        </li>
      </ul>
      <div className="flex items-center justify-between  px-2 py-2">
        <span className="uppercase text-xs tracking-wider font-semibold text-gray-600 dark:text-gray-400">
          {' '}
          direct messages
        </span>
        <CreateNewDirectMessage />
      </div>
      <ChatList />
      <UserSetting />
    </aside>
  )
}

export default Sidebar