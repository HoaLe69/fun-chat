import moment from 'moment'
import { useEffect, useState, useCallback } from 'react'
import type { IPost, IPostCustom } from '../types'
import PostActionButtons from './PostActionButtons'
import usePostActions from '../hooks/usePostActions'

interface Props {
  postInfo: IPostCustom
}

const PostItem: React.FC<Props> = ({ postInfo }) => {
  const { creator, community, ...post } = postInfo
  const [postState, setPostState] = useState<IPost | null>(null)

  useEffect(() => {
    if (!postInfo) return
    setPostState(postInfo)
  }, [postInfo])

  const updatePostState = useCallback((newPost: IPost) => {
    setPostState(newPost)
  }, [])

  const { handleUpvote, numberOfVote, handleDownvote, handleComment, activeVoteButton } = usePostActions({
    updatePostState,
    postState,
  })

  return (
    <div className="text-gray-950 dark:text-gray-50">
      <div className="py-2 px-4 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 rounded-xl">
        <header>
          <div className="flex items-center">
            <div className="flex items-center">
              <img src={creator?.picture || community?.picture} alt="JavaScript" className="w-6 h-6 rounded-full" />
              <span className="ml-2 font-semibold text-gray-700 dark:text-gray-200 text-xs">
                {creator?.display_name || community?.name}
              </span>
              <span className="inline-block my-0 mx-2">•</span>
              <span className="text-xs text-gray-500">{moment(post.createdAt).fromNow()}</span>
            </div>
            <div className="flex items-center ml-auto">
              <button className="text-xs px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-full font-semibold">
                Join
              </button>
            </div>
          </div>
        </header>
        <article>
          <h1 className="text-[18px] font-semibold my-2">{post.title}</h1>
          <p className="text-sm line-clamp-6 dark:text-zinc-300 text-zinc-700 ">{post.content}</p>
        </article>
        <PostActionButtons
          onDownvote={(event) => handleDownvote(event, postInfo?._id)}
          onUpvote={(event) => handleUpvote(event, postInfo?._id)}
          numberOfComment={postState?.comments}
          onComment={handleComment}
          numberOfVote={numberOfVote}
          activeVoteButton={activeVoteButton}
        />
      </div>
      <hr className="my-2 " />
    </div>
  )
}

export default PostItem
