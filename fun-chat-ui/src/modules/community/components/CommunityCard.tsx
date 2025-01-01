import { useEffect, useState } from 'react'
import { ICommunity } from '../types'
import { communityServices } from '../services'
import { CommunityDefaultPictureIcon } from 'modules/core/components/icons'
import { Link } from 'react-router-dom'
import ReactLoading from 'react-loading'
import Tippy from '@tippyjs/react/headless'

interface CommunityCardProps {
  nameOfCommunity: string
  isMounted: boolean
}

interface CommunityCardContainerProps {
  children: JSX.Element
  nameOfCommunity: string
}

const CommunityCardContainer: React.FC<CommunityCardContainerProps> = ({ children, nameOfCommunity }) => {
  const [mounted, setMounted] = useState<boolean>(false)
  return (
    <Tippy
      onMount={() => setMounted(true)}
      delay={500}
      interactive
      placement="bottom-start"
      render={(attrs) => (
        <div {...attrs}>
          <CommunityCard nameOfCommunity={nameOfCommunity} isMounted={mounted} />
        </div>
      )}
    >
      {children}
    </Tippy>
  )
}

const CommunityCard: React.FC<CommunityCardProps> = ({ nameOfCommunity, isMounted }) => {
  const [communityCard, setCommunityCard] = useState<ICommunity | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    if (!nameOfCommunity || !isMounted) return
    setLoading(true)
    communityServices
      .getCommunityByName(nameOfCommunity)
      .then((community) => {
        console.log({ community })
        setCommunityCard(community)
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false)
      })
  }, [nameOfCommunity, isMounted])

  return (
    <div className="rounded-xl w-80 min-h-24 shadow-xl bg-zinc-50 dark:bg-zinc-900">
      {loading || !communityCard ? (
        <div className="w-full flex items-center justify-center py-5">
          <ReactLoading type="spin" width={40} height={40} />
        </div>
      ) : (
        <>
          {communityCard?.banner ? (
            <img
              src={communityCard?.banner}
              alt={communityCard?.name}
              className="w-full h-20 rounded-t-xl object-cover"
            />
          ) : (
            <div className="rounded-t-xl bg-blue-300 h-20" />
          )}
          <div className="p-2">
            <div className="flex items-center">
              {communityCard?.picture ? (
                <img src={communityCard?.picture} alt={communityCard?.name} className="w-12 h-12 rounded-full" />
              ) : (
                <CommunityDefaultPictureIcon />
              )}
              <Link
                to={`/community/${communityCard?.name}/${communityCard?._id}`}
                className="text-xl font-bold ml-4 hover:underline hover:text-blue-800"
              >
                d/{communityCard?.name}
              </Link>
            </div>
            <p className="py-2 border-b text-sm text-gray-600 dark:text-gray-300">{communityCard?.description}</p>
            <span className="mt-2 block text-sm text-gray-500 dark:text-gray-300">
              {communityCard?.members?.length} member
            </span>
          </div>
        </>
      )}
    </div>
  )
}

export default CommunityCardContainer
