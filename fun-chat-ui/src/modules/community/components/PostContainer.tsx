import PostItem from './PostItem'
import usePostContainer from '../hooks/usePostContainer'
import { PostContainerLoadingSkeleton } from './Loading'

interface Props {
  name?: string // name of the community
  isUserPost?: boolean
}
const PostContainer: React.FC<Props> = ({ name, isUserPost }) => {
  const { posts, loading, ref } = usePostContainer()

  return (
    <div className="pt-4 px-4 flex-1">
      <div className="flex-1">
        {!loading && !posts?.length ? (
          <p className="text-2xl font-medium text-center mt-4">No posts yet</p>
        ) : (
          posts?.map((post) => (
            <PostItem nameOfCommunity={name} isUserPost={isUserPost} key={post?._id} postInfo={post} />
          ))
        )}
      </div>
      <div ref={ref} className="min-h-10">
        {loading && <PostContainerLoadingSkeleton />}
      </div>
    </div>
  )
}

export default PostContainer
