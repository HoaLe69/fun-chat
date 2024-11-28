import { useAppSelector } from 'modules/core/hooks'
import moment from 'moment'
import { UpvoteIcon, DownvoteIcon, CommentBoxIcon } from 'modules/core/components/icons'
import { useCallback, useMemo } from 'react'
import type { Post } from '../types'

interface Props {
  postInfo: Post
}

const PostItem: React.FC<Props> = ({ postInfo }) => {
  const userLogin = useAppSelector((state) => state.auth.user)

  const numberOfVote = useMemo(() => {
    return postInfo.upvoted.length - postInfo.downvoted.length
  }, [postInfo])

  const handleUpvote = useCallback(() => {
    //todo
  }, [])
  const handleDownvote = useCallback(() => {
    //todo
  }, [])

  return (
    <div>
      <div className="py-2 px-4 hover:bg-zinc-100 rounded-xl">
        <header>
          <div className="flex items-center">
            <div className="flex items-center">
              <img src={userLogin?.picture} alt="JavaScript" className="w-8 h-8 rounded-full" />
              <span className="ml-2 font-semibold text-gray-700">{userLogin?.display_name}</span>
              <span className="inline-block my-0 mx-2">•</span>
              <span className="text-sm text-gray-500">{moment(postInfo.createdAt).fromNow()}</span>
            </div>
            <div className="flex items-center ml-auto">
              <button className="text-xs px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-full font-semibold">
                Join
              </button>
            </div>
          </div>
        </header>
        <article>
          <h1 className="text-xl font-semibold my-2">{postInfo.title}</h1>
          <p className="text-sm text-black/80 line-clamp-6">{postInfo.content}</p>
        </article>
        <div className="post-actions-button flex mt-2 gap-2">
          <div className="vote-button-group flex items-center bg-zinc-200 rounded-full">
            <button onClick={handleUpvote} className="w-8 h-8 flex items-center justify-center hover:text-orange-700">
              <UpvoteIcon />
            </button>
            <span className="text-xs font-bold">{numberOfVote}</span>
            <button onClick={handleDownvote} className="w-8 h-8 flex items-center justify-center hover:text-blue-700">
              <DownvoteIcon />
            </button>
          </div>
          <div className="comment-button-group px-4 bg-zinc-200 rounded-full hover:bg-zinc-300">
            <button className="flex w-8 h-8 items-center justify-center">
              <CommentBoxIcon />
              <span className="text-xs font-bold ml-1">{postInfo.comment}</span>
            </button>
          </div>
        </div>
      </div>
      <hr className="my-2" />
    </div>
  )
}

export default PostItem
