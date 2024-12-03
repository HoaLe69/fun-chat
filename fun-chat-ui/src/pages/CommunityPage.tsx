import PostContainer from 'modules/community/components/PostContainer'
import MainLayout from 'modules/community/components/Layout'
import { useEffect, useState } from 'react'
import type { IPostCustom } from 'modules/community/types'
import { postServices } from 'modules/community/services/postServices'

const CommunityPage = () => {
  const [posts, setPosts] = useState<IPostCustom[]>([])

  useEffect(() => {
    const loadCommunityPosts = async () => {
      try {
        const posts = await postServices.getAllPost()
        setPosts(posts)
      } catch (error) {
        console.error(error)
      }
    }
    loadCommunityPosts()
  }, [])

  return (
    <MainLayout>
      <PostContainer posts={posts} />
    </MainLayout>
  )
}

export default CommunityPage
