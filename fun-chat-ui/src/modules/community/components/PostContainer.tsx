import PostItem from './PostItem'
import type { IPostCustom } from '../types'
import { Link } from 'react-router-dom'

interface Props {
  name?: string // name of the community
  posts: IPostCustom[]
}
const PostContainer: React.FC<Props> = ({ name, posts }) => {
  return (
    <div className="pt-4 px-4 flex-1">
      <div className="flex-1">
        {posts?.map((post) => (
          <Link key={post?._id} to={`/community/${name || post?.community.name}/${post?._id}`}>
            <PostItem postInfo={post} />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default PostContainer
