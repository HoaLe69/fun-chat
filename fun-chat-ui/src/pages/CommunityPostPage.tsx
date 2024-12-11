import MainLayout from 'modules/community/components/Layout'
import PostItemDetailInfo from 'modules/community/components/PostItemDetailInfo'
import PostItemDetailComment from 'modules/community/components/PostItemDetailComment'
import { ArrowLeftSmallIcon } from 'modules/core/components/icons'
import { useCallback, useEffect, useState, useRef } from 'react'
import { postServices } from 'modules/community/services/postServices'
import { communityServices } from 'modules/community/services/communityServices'
import { useNavigate, useParams } from 'react-router-dom'
import type { ICommunity, IPostCustom } from 'modules/community/types'
import { useAppSelector } from 'modules/core/hooks'
import { authSelector } from 'modules/auth/states/authSlice'

const CommunityPostPage = () => {
  const [communityInfo, setCommunityInfo] = useState<ICommunity | null>(null)
  const [postInfo, setPostInfo] = useState<IPostCustom | null>(null)
  const navigate = useNavigate()
  const { postId, name } = useParams()
  const refTimerStayOnPost = useRef<ReturnType<typeof setTimeout> | null>(null)
  const userLoginId = useAppSelector(authSelector.selectUserId)

  useEffect(() => {
    if (!postId) return
    const loadPostInformation = async () => {
      try {
        const post = await postServices.getPostById(postId)
        setPostInfo(post)
      } catch (error) {
        console.error(error)
      }
    }
    loadPostInformation()
  }, [postId])

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
    if (!postInfo?._id || !userLoginId) return
    const addUserRecentPost = async () => {
      try {
        await postServices.addUserRecentPostAsync(postInfo?._id, userLoginId)
      } catch (error) {
        console.error(error)
      }
    }
    refTimerStayOnPost.current = setTimeout(() => {
      addUserRecentPost()
    }, 5000)
    return () => {
      if (refTimerStayOnPost.current) clearTimeout(refTimerStayOnPost.current)
    }
  }, [userLoginId, postInfo])

  const handleNavigateBack = useCallback(() => {
    navigate(-1)
  }, [])
  return (
    <MainLayout typeOfSidebarRight="community">
      <div className="flex items-start pt-4 flex-1">
        <button
          onClick={handleNavigateBack}
          className="w-8 h-8 flex items-center justify-center text-base bg-zinc-200 dark:bg-zinc-900 hover:bg-zinc-300 dark:hover:bg-zinc-800 rounded-full"
        >
          <ArrowLeftSmallIcon />
        </button>
        <div className="flex-1 px-4  min-w-0">
          <PostItemDetailInfo communityInfo={communityInfo} postInfo={postInfo} />
          <PostItemDetailComment postId={postInfo?._id} />
        </div>
      </div>
    </MainLayout>
  )
}

export default CommunityPostPage
