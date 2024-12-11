import moment from 'moment'
import type { ICommunity } from '../types'
import { CakeIcon, CommunityDefaultPictureIcon, WorldOutlineIcon } from 'modules/core/components/icons'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { IPostCustom } from '../types'
import { useAppSelector } from 'modules/core/hooks'
import { authSelector } from 'modules/auth/states/authSlice'
import { communityServices, postServices } from '../services'

interface Props {
  typeOfContent?: string
}

const SidebarRightContainer: React.FC<Props> = ({ typeOfContent }) => {
  if (typeOfContent === 'community') {
    return <SidebarRightContainerCommunityInfo />
  }

  if (typeOfContent === 'recent') {
    return <SidebarRightContainerRecentPost />
  }

  return <div></div>
}

const SidebarRightContainerWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-w-[316px] max-h-screen overflow-hidden hover:overflow-auto h-max bg-zinc-100 dark:bg-zinc-900 rounded-xl flex-1 sticky top-4">
      {children}
    </div>
  )
}

const SidebarRightContainerRecentPost = () => {
  const [recentPost, setRecentPost] = useState<IPostCustom[]>([])
  const userLoginId = useAppSelector(authSelector.selectUserId)

  useEffect(() => {
    if (!userLoginId) return
    postServices
      .getRecentPostVisitedAsync(userLoginId)
      .then((data) => {
        setRecentPost(data)
      })
      .catch((error) => console.log(error))
  }, [userLoginId])

  return (
    <SidebarRightContainerWrapper>
      <div className="flex flex-col pb-4  px-4">
        <div className="text-xs tracking-wider font-semibold text-gray-700 dark:text-gray-300 mt-2 uppercase">
          Recent Post
        </div>
        <div className="flex flex-col gap-2 mt-4">
          {recentPost.map((post) => (
            <Link key={post._id} to={`/community/${post?.community.name}/${post?._id}`}>
              <div className="border-b dark:border-zinc-500 pb-3 group">
                <div className="flex items-center gap-2">
                  {post?.community?.picture ? (
                    <img src={post?.community?.picture} alt={post?.community?.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <CommunityDefaultPictureIcon />
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-300">d/{post?.community?.name}</span>
                </div>
                <h3 className="group-hover:underline leading-6 text-sm font-semibold text-gray-600 dark:text-gray-300 my-2">
                  {post?.title}
                </h3>
                <div className="text-xs flex items-center text-gray-500 dark:text-gray-400 gap-3">
                  <div>{post?.upvoted?.length - post?.downvoted?.length} votes</div>
                  <div>{post?.comments} comments</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </SidebarRightContainerWrapper>
  )
}

const SidebarRightContainerCommunityInfo = () => {
  const { name } = useParams()

  const [communityInfo, setCommunityInfo] = useState<ICommunity | null>(null)
  useEffect(() => {
    if (!name) return
    communityServices
      .getCommunityByName(name)
      .then((data) => setCommunityInfo(data))
      .catch((error) => console.log(error))
  }, [name])

  return (
    <SidebarRightContainerWrapper>
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
            <span className="text-sm font-bold text-gray-900 dark:text-gray-50">{communityInfo?.members?.length}</span>
            <span className="text-xs text-gray-500"> members</span>
          </div>
        </div>
      </div>
    </SidebarRightContainerWrapper>
  )
}

export default SidebarRightContainer
