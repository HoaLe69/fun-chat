import { useState, useEffect, useCallback } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { postServices } from '../services'
import { useInView } from 'react-intersection-observer'
import type { IPostCustom } from '../types'

const usePostContainer = () => {
  const { ref, inView } = useInView()
  const [posts, setPosts] = useState<IPostCustom[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const { id, userId } = useParams()
  const location = useLocation()
  const { getPostByCommunityId, getAllPostPopulateCommunity, getListPostByCreatorId } = postServices

  const isHomeCommunity = location.pathname === '/'
  const isProfilePage = location.pathname.includes('/user/profile')

  const loadPostAsync = useCallback(async () => {
    if (loading || !hasMore) return

    try {
      setLoading(true)
      let apiCallFunc = getAllPostPopulateCommunity(page)

      if (isProfilePage) {
        if (!userId) return
        apiCallFunc = getListPostByCreatorId(userId, page)
      } else if (!isHomeCommunity) {
        if (!id) return
        apiCallFunc = getPostByCommunityId(id, page)
      }

      const response = await apiCallFunc
      const { data } = response
      if (!data?.length) {
        setHasMore(false)
        return
      }
      setPosts((pre) => [...pre, ...data])
      setPage((pre) => pre + 1)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [page, hasMore, id, loading])

  // Reset states when the URL changes
  useEffect(() => {
    setPosts([])
    setLoading(false)
    setPage(1)
    setHasMore(true)

    // Optionally, fetch posts for the new community
  }, [id, location.pathname, userId]) // Dependen

  useEffect(() => {
    if (inView) {
      loadPostAsync()
    }
  }, [inView, hasMore])

  return { posts, loading, ref, page, hasMore }
}

export default usePostContainer
