import PostItem from './PostItem'
import posts from '../mock/post.json'

const PostContainer = () => {
  return (
    <div className="pt-4 px-4 flex-1">
      <div className="flex-1">
        {posts.map((post) => (
          <PostItem key={post.id} postInfo={post} />
        ))}
      </div>
    </div>
  )
}

export default PostContainer
