import moment from 'moment'
import { useEffect, useState, useCallback } from 'react'
import type { IPost, IPostCustom } from '../types'
import PostActionButtons from './PostActionButtons'
import usePostActions from '../hooks/usePostActions'
import { Link } from 'react-router-dom'
import CommunityCardContainer from './CommunityCard'
import UserInformationCard from './UserInformationCard'
import { CommunityDefaultPictureIcon } from 'modules/core/components/icons'

interface Props {
  postInfo: IPostCustom
  isUserPost?: boolean
  nameOfCommunity?: string
}

const PostItem: React.FC<Props> = ({ postInfo, nameOfCommunity, isUserPost }) => {
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
              {isUserPost ? (
                <UserInformationCard userId={creator?._id}>
                  <Link to={`/community/${nameOfCommunity}`} className="hover:cursor-pointer flex items-center group">
                    <img src={creator?.picture} alt="JavaScript" className="w-6 h-6 rounded-full" />
                    <span className="ml-2 font-semibold text-gray-700 dark:text-gray-200 text-xs group-hover:text-blue-500">
                      {creator?.display_name || community?.name}
                    </span>
                  </Link>
                </UserInformationCard>
              ) : (
                <CommunityCardContainer nameOfCommunity={community?.name}>
                  <Link
                    to={`/community/${community?.name}/${community?._id}`}
                    className="hover:cursor-pointer flex items-center group"
                  >
                    {community?.picture ? (
                      <img src={community?.picture} alt="JavaScript" className="w-6 h-6 rounded-full" />
                    ) : (
                      <CommunityDefaultPictureIcon className="w-6 h-6" />
                    )}
                    <span className="ml-2 font-semibold text-gray-700 dark:text-gray-200 text-xs group-hover:text-blue-500">
                      {creator?.display_name || community?.name}
                    </span>
                  </Link>
                </CommunityCardContainer>
              )}

              <span className="inline-block my-0 mx-2">•</span>
              <span className="text-xs text-gray-500">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
        </header>
        <Link to={`/community/${community?.name || nameOfCommunity}/p/${post?._id}`}>
          <article className="group hover:cursor-pointer">
            <h1 className="text-[18px] font-semibold my-2 group-hover:underline">{post.title}</h1>
            <p className="text-sm line-clamp-6 dark:text-zinc-300 text-zinc-700 ">{post.content}</p>
          </article>
        </Link>

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
