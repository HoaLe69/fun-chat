import { Link } from 'react-router-dom'
import { DiscoverIcon, MessageFillIcon, NotificationIcon } from './icons'
const NavSidebar = () => {
  return (
    <div className="text-gray-950 dark:text-gray-50 w-full h-full bg-zinc-200 dark:bg-zinc-950  flex flex-col gap-4 items-center py-3">
      <Link to="/community">
        <button className=" w-12 h-12 bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-800 hover:text-white hover:rounded-xl transition-colors flex items-center justify-center rounded-full ">
          <DiscoverIcon />
        </button>
      </Link>

      <Link to="/">
        <button className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-800 hover:text-white hover:rounded-xl transition-colors flex items-center justify-center rounded-full ">
          <MessageFillIcon />
        </button>
      </Link>
      <Link to="/">
        <button className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-800 hover:text-white hover:rounded-xl transition-colors flex items-center justify-center rounded-full ">
          <NotificationIcon />
        </button>
      </Link>
    </div>
  )
}

export default NavSidebar
