import moment from 'moment'
import type { ICommunity } from '../types'
import { CakeIcon, WorldOutlineIcon } from 'modules/core/components/icons'
import { useLocation } from 'react-router-dom'

interface Props {
  communityInfo: ICommunity | null
}
const SidebarRightContainer: React.FC<Props> = ({ communityInfo }) => {
  const { pathname } = useLocation()

  const hiddenPageList = ['/community', '/community/create/post']

  return (
    !hiddenPageList.includes(pathname) && (
      <div className="min-w-[316px] h-max bg-zinc-100 dark:bg-zinc-900 rounded-xl flex-1 sticky top-4">
        <div className="flex flex-col pb-4  px-4">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-2">
            Welcome to d/{communityInfo?.name}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{communityInfo?.description}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <CakeIcon />
            <span>Created {moment(communityInfo?.createdAt).format('LL')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
            <WorldOutlineIcon />
            <span>Public</span>
          </div>
          <div className="flex items-center justify-center mt-2">
            <div>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-50">
                {communityInfo?.members?.length}
              </span>
              <span className="text-xs text-gray-500"> members</span>
            </div>
          </div>
        </div>
      </div>
    )
  )
}

export default SidebarRightContainer
