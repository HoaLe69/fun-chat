import { CommunityDetailPictureIconLarge, PlusRawIcon } from 'modules/core/components/icons'
import type { ICommunity } from '../types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from 'modules/core/hooks'
import { communityServices } from '../services'
import classNames from 'classnames'
import { useParams } from 'react-router-dom'

interface Props {}

const CommunityDetailMasthead: React.FC<Props> = () => {
  const [joining, setJoining] = useState<boolean>(false)
  const [communityInfo, setCommunityInfo] = useState<ICommunity | null>(null)
  const { name } = useParams()
  const navigate = useNavigate()
  const userLoginId = useAppSelector((state) => state.auth.user?._id)
  const [isMember, setIsMember] = useState<boolean>()

  useEffect(() => {
    if (!userLoginId || !communityInfo) return
    setIsMember(communityInfo?.members.includes(userLoginId))
  }, [userLoginId, communityInfo])

  useEffect(() => {
    if (!name) return
    communityServices
      .getCommunityByName(name)
      .then((community) => {
        setCommunityInfo(community)
      })
      .catch((error) => console.log(error))
  }, [name])

  const handleNavigate = useCallback(() => {
    navigate('/community/create/post')
  }, [])

  const handleJoinCommunity = useCallback(async () => {
    if (!userLoginId || !communityInfo) return
    try {
      const updatedCommunity = await communityServices.joinCommunity(communityInfo?._id, userLoginId)
      setIsMember(() => {
        return updatedCommunity.members.includes(userLoginId)
      })
    } catch (error) {
      console.log(error)
    } finally {
      setJoining(false)
    }
  }, [userLoginId, communityInfo])

  const imageOnError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/public/vite.svg'
    console.log('target', e.target)
  }

  return (
    <header>
      <div className="mt-2 h-20 w-full rounded-xl bg-zinc-200">
        {communityInfo?.banner && (
          <img src={communityInfo.banner} alt={communityInfo?.name} className="w-full h-full object-cover rounded-xl" />
        )}
      </div>
      <div className="relative px-4 -top-10">
        <div className="flex items-end ">
          <span className="inline-block m-1">
            {communityInfo?.picture ? (
              <img
                src={communityInfo?.picture}
                alt={communityInfo?.name}
                onError={imageOnError}
                className="h-[86px] w-[86px] rounded-full"
              />
            ) : (
              <CommunityDetailPictureIconLarge />
            )}
          </span>
          <h1 className="text-3xl font-bold">d/{communityInfo?.name}</h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={handleNavigate}
              className="flex gap-2 text-sm font-bold items-center border border-zinc-300 hover:border-zinc-500 rounded-full py-2 px-3"
            >
              <PlusRawIcon />
              Create Post
            </button>
            <button
              onClick={handleJoinCommunity}
              className={classNames(
                'py-2 px-3 rounded-full  text-sm  font-bold',
                isMember ? 'border text-zinc-950 dark:text-zinc-50' : 'bg-blue-700 hover:bg-blue-800 text-white',
              )}
            >
              {isMember ? 'Joined' : 'Join'}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default CommunityDetailMasthead
