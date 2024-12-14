import { LayoutWithMasthead } from 'modules/community/components/Layout'
import CommunityDetailMasthead from 'modules/community/components/CommunityDetailMasthead'
import PostContainer from 'modules/community/components/PostContainer'
import SidebarRightContainer from 'modules/community/components/SidebarRightContainer'
import type { ICommunity } from 'modules/community/types'
import { useState, useEffect, useRef } from 'react'
import { communityServices } from 'modules/community/services/communityServices'
import { useParams } from 'react-router-dom'
import { useAppSelector } from 'modules/core/hooks'
import { authSelector } from 'modules/auth/states/authSlice'
import { PostContainerLoadingSkeleton } from 'modules/community/components/Loading'

const CommunityDetailPage = () => {
  const { name } = useParams()
  const [communityInfo, setCommunityInfo] = useState<ICommunity | null>(null)
  const userLoginId = useAppSelector(authSelector.selectUserId)
  const refTimeStayOnCommunity = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    if (!userLoginId || !communityInfo) return
    const addUserRecentCommunity = async () => {
      try {
        await communityServices.addUserRecentCommunityAsync(communityInfo?._id, userLoginId)
      } catch (error) {
        console.log(error)
      }
    }
    refTimeStayOnCommunity.current = setTimeout(() => {
      addUserRecentCommunity()
    }, 5000)
    return () => {
      if (refTimeStayOnCommunity.current) clearTimeout(refTimeStayOnCommunity.current)
    }
  }, [userLoginId, communityInfo])

  return (
    <LayoutWithMasthead>
      <CommunityDetailMasthead />
      <div className="w-full flex ">
        <div className="max-w-[756px] w-full">
          <PostContainer name={communityInfo?.name} isUserPost />
        </div>
        <SidebarRightContainer typeOfContent="community" />
      </div>
    </LayoutWithMasthead>
  )
}

export default CommunityDetailPage
