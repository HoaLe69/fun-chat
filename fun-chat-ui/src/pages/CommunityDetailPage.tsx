import { LayoutWithMasthead } from 'modules/community/components/Layout'
import CommunityDetailMasthead from 'modules/community/components/CommunityDetailMasthead'
import PostContainer from 'modules/community/components/PostContainer'
import SidebarRightContainer from 'modules/community/components/SidebarRightContainer'
import type { ICommunity, IPostCustom } from 'modules/community/types'
import { useState, useEffect } from 'react'
import { communityServices } from 'modules/community/services/communityServices'
import { useParams } from 'react-router-dom'
import { postServices } from 'modules/community/services/postServices'

const CommunityDetailPage = () => {
  const { name } = useParams()
  const [communityInfo, setCommunityInfo] = useState<ICommunity | null>(null)
  const [posts, setPosts] = useState<IPostCustom[]>([])
  useEffect(() => {
    if (!name) return
    const loadCommunityInformation = async () => {
      try {
        const community = await communityServices.getCommunityByName(name)
        setCommunityInfo(community)
      } catch (error) {
        console.error(error)
      }
    }
    loadCommunityInformation()
  }, [name])

  useEffect(() => {
    if (!communityInfo?._id) return
    const fetchPosts = async () => {
      try {
        const posts = await postServices.getPostByCommunityId(communityInfo?._id)
        setPosts(posts)
      } catch (error) {
        console.error(error)
      }
    }
    fetchPosts()
  }, [communityInfo])

  return (
    <LayoutWithMasthead>
      <CommunityDetailMasthead communityInfo={communityInfo} />
      <div className="w-full flex ">
        <div className="max-w-[756px] w-full">
          <PostContainer name={communityInfo?.name} posts={posts} />
        </div>
        <SidebarRightContainer communityInfo={communityInfo} />
      </div>
    </LayoutWithMasthead>
  )
}

export default CommunityDetailPage
