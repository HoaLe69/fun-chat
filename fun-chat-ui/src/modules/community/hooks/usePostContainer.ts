import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { postServices } from '../services'
import type { IPostCustom } from '../types'

const usePostContainer = () => {
  const params = useParams()
  const path = useLocation()
  const [loading, setLoading] = useState<boolean>(false)
  const [posts, setPosts] = useState<IPostCustom[]>([])
  const { getPostByCommunityId, getAllPostPopulateCommunity } = postServices

  const isHomeCommunity = path.pathname === '/community'

  useEffect(() => {
    let apiCallFunc = getAllPostPopulateCommunity()

    if (!isHomeCommunity) {
      const { id } = params
      if (!id) return
      apiCallFunc = getPostByCommunityId(id)
    }
    setLoading(true)

    apiCallFunc
      .then((data) => {
        setPosts(data)
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false))
  }, [isHomeCommunity, params])

  return { posts, loading }
}

export default usePostContainer
