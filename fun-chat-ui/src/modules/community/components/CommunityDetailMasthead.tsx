import { CommunityDetailPictureIconLarge, PlusRawIcon } from 'modules/core/components/icons'
import type { ICommunity } from '../types'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { communityServices } from '../services/communityServices'

const CommunityDetailMasthead = () => {
  const { name } = useParams()
  const [communityInfo, setCommunityInfo] = useState<ICommunity | null>(null)

  useEffect(() => {
    if (!name) return
    const loadCommunityInformation = async () => {
      try {
        const community = await communityServices.getCommunityByName(name)
        setCommunityInfo(community.data)
      } catch (error) {
        console.error(error)
      }
    }
    loadCommunityInformation()
  }, [name])

  console.log({ communityInfo })

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
              <img src={communityInfo?.picture} alt={communityInfo?.name} className="h-[86px] w-[86px] rounded-full" />
            ) : (
              <CommunityDetailPictureIconLarge />
            )}
          </span>
          <h1 className="text-3xl font-bold">d/{communityInfo?.name}</h1>
          <div className="ml-auto flex items-center gap-2">
            <button className="flex gap-2 text-sm font-bold items-center border border-zinc-300 hover:border-zinc-500 rounded-full py-2 px-3">
              <PlusRawIcon />
              Create Post
            </button>
            <button className="py-2 px-3 rounded-full bg-blue-700 hover:bg-blue-800 text-sm text-white font-bold">
              Join
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default CommunityDetailMasthead
