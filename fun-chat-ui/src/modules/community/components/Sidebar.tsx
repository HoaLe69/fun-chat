import classNames from 'classnames'
import { PlusRawIcon } from 'modules/core/components/icons'
import { useState, useCallback, useEffect } from 'react'
import CreateCommunityModal from './CreateCommunityModal'
import { ICommunity } from '../types'
import { useAppSelector } from 'modules/core/hooks'
import { communityServices } from '../services/communityServices'
import { Link } from 'react-router-dom'
import UserSetting from 'modules/core/components/UserSetting'
import { CommunityDefaultPictureIcon } from 'modules/core/components/icons'

const Sidebar = () => {
  const userLogin = useAppSelector((state) => state.auth.user)
  const tags = [
    'Hooks',
    'State Management',
    'Context API',
    'React Router',
    'Redux',
    'Next.js',
    'React Testing',
    'Performance Optimization',
    'Animations',
    'TypeScript',
  ]

  const [communities, setCommunities] = useState<ICommunity[]>([])
  const [recentCommunity, setRecentCommunity] = useState<ICommunity[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleCloseCreateCommunityModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleOpenCreateCommunityModal = useCallback(() => {
    setIsOpen(true)
  }, [])

  useEffect(() => {
    if (!userLogin) return

    const loadCommunities = async () => {
      try {
        const communitiesData = await communityServices.getCommunityByUser(userLogin._id)
        setCommunities(communitiesData)
      } catch (error) {
        console.error(error)
      }
    }
    loadCommunities()
  }, [userLogin])

  useEffect(() => {
    if (!userLogin) return

    const loadRecentCommunities = async () => {
      try {
        const communities = await communityServices.getRecentCommunityVisitedAsync(userLogin._id)
        setRecentCommunity(communities)
      } catch (error) {
        console.error(error)
      }
    }
    loadRecentCommunities()
  }, [userLogin])

  return (
    <aside className="bg-zinc-100 dark:bg-zinc-900 flex flex-col h-screen sticky top-0 text-gray-950 dark:text-gray-50">
      <div className="flex-1 px-2 overflow-hidden hover:overflow-auto">
        <div className="border-b py-3 border-zinc-200  dark:border-zinc-700">
          <h2 className="text-sm uppercase mb-2 tracking-wider text-zinc-400">Categories</h2>
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <span
                className={classNames(
                  'p-2 text-sm rounded-3xl border border-zinc-200  dark:border-zinc-700 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800',
                )}
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="py-3">
          <h2 className="text-sm uppercase mb-2 tracking-wider text-zinc-400">Recent</h2>
          <div>
            {recentCommunity.map((community) => (
              <CommunityItem community={community} key={community?._id} />
            ))}
          </div>
        </div>

        <div className="py-3">
          <h2 className="text-sm uppercase mb-2 tracking-wider text-zinc-400">Communites</h2>
          <div>
            <button
              onClick={handleOpenCreateCommunityModal}
              className="text-sm flex items-center gap-2 p-2 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800  w-full rounded-xl"
            >
              <PlusRawIcon />
              Create a community
            </button>
          </div>
          <div>
            {communities.map((community) => (
              <CommunityItem community={community} key={community?._id} />
            ))}
          </div>
        </div>
        <CreateCommunityModal isOpen={isOpen} onClose={handleCloseCreateCommunityModal} />
      </div>
      <UserSetting />
    </aside>
  )
}

const CommunityItem = ({ community }: { community: ICommunity }) => {
  const [isImageError, setIsImageError] = useState<boolean>(false)
  return (
    <Link to={`/community/${community?.name}/${community?._id}`} key={community?._id}>
      <div className="flex items-center p-2 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl">
        {community.picture ? (
          isImageError ? (
            <CommunityDefaultPictureIcon className="w-8 h-8" />
          ) : (
            <img
              src={community.picture}
              onError={() => setIsImageError(true)}
              alt={community.name}
              className="w-8 h-8 rounded-full"
            />
          )
        ) : (
          <CommunityDefaultPictureIcon className="w-8 h-8" />
        )}
        <span className="ml-2 text-sm">{community.name}</span>
      </div>
    </Link>
  )
}

export default Sidebar
