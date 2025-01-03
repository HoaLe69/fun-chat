import { LayoutWithMasthead } from 'modules/community/components/Layout'
import CommunityDetailMasthead from 'modules/community/components/CommunityDetailMasthead'
import PostContainer from 'modules/community/components/PostContainer'
import SidebarRightContainer from 'modules/community/components/SidebarRightContainer'
import { IPostCustom, type ICommunity } from 'modules/community/types'
import { useState, useEffect, useRef, useMemo } from 'react'
import { communityServices } from 'modules/community/services/communityServices'
import { useParams } from 'react-router-dom'
import { useAppSelector } from 'modules/core/hooks'
import { authSelector } from 'modules/auth/states/authSlice'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { notifyServices, postServices } from 'modules/community/services'
import PostItem from 'modules/community/components/PostItem'
import { CheckRawIcon } from 'modules/core/components/icons'
import { useSocket } from 'modules/core/hooks'
import { SOCKET_EVENTS } from 'const'

const CommunityDetailPage = () => {
  const { emitEvent } = useSocket()
  const { name } = useParams()
  const [communityInfo, setCommunityInfo] = useState<ICommunity | null>(null)
  const [pendingPost, setPendingPost] = useState<IPostCustom[]>([])
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

  const isModerator = useMemo(() => {
    if (!userLoginId || !communityInfo) return false
    return communityInfo?.moderators.includes(userLoginId)
  }, [userLoginId, communityInfo])
  useEffect(() => {
    if (!communityInfo || !isModerator) return
    postServices
      .getPendingPostByCommunityId(communityInfo._id)
      .then((data) => {
        console.log(data)
        setPendingPost(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [communityInfo])

  const handleApprovePost = async (postId: string) => {
    try {
      await postServices.approvePostAsync(postId)

      const notifyData = await notifyServices.createNotify({
        type: 'new_post',
        sender: null,
        friends: communityInfo?.members,
        resource_url: `/community/${communityInfo?.name}/p/${postId}`,
        picture_url: communityInfo?.picture,
        message: `The <strong>${communityInfo?.name} community</strong> just added a new post`,
      })
      emitEvent(SOCKET_EVENTS.NOTIFYCATION.SEND, notifyData, (response: any) => {
        setPendingPost((prev) => prev.filter((post) => post._id !== postId))
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <LayoutWithMasthead>
      <CommunityDetailMasthead />
      <div className="w-full flex ">
        <div className="max-w-[756px] w-full">
          <TabGroup>
            <TabList className="px-8 gap-2 flex">
              <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold dark:text-white focus:outline-none dark:data-[selected]:bg-white/10 data-[selected]:bg-black/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 dark:data-[focus]:outline-white">
                All Post
              </Tab>
              {isModerator && (
                <Tab className="relative rounded-full py-1 px-3 text-sm/6 font-semibold dark:text-white focus:outline-none dark:data-[selected]:bg-white/10 data-[selected]:bg-black/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 dark:data-[focus]:outline-white">
                  Post pending
                  {pendingPost?.length > 0 && (
                    <span className="absolute text-xs font-bold top-0 right-0 translate-x-1/2 w-4 h-4 flex items-center justify-center bg-red-600 rounded-full text-zinc-50">
                      {pendingPost?.length}
                    </span>
                  )}
                </Tab>
              )}
            </TabList>
            <TabPanels>
              <TabPanel>
                <PostContainer name={communityInfo?.name} isUserPost />
              </TabPanel>
              {isModerator && (
                <TabPanel className="px-4 mt-4">
                  {pendingPost?.length === 0 ? (
                    <p className="text-2xl font-medium text-center mt-4">No pending post</p>
                  ) : (
                    pendingPost.map((post) => (
                      <div key={post._id}>
                        <PostItem postInfo={post} isUserPost nameOfCommunity={communityInfo?.name} />
                        <div className="w-full flex items-center justify-center">
                          <button
                            onClick={() => handleApprovePost(post?._id)}
                            className="dark:bg-zinc-700 bg-zinc-200 hover:animate-bounce  py-1 w-40 flex items-center justify-center rounded-full"
                          >
                            <CheckRawIcon className="w-7 h-7" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </TabPanel>
              )}
            </TabPanels>
          </TabGroup>
        </div>
        <SidebarRightContainer typeOfContent="community" />
      </div>
    </LayoutWithMasthead>
  )
}

export default CommunityDetailPage
