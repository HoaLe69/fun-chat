import moment from 'moment'
import type { ICommunity, IPost, IPostCustom } from 'modules/community/types'
import MarkdownPreview from '@uiw/react-markdown-preview'
import './PreviewContent.css'
import PostActionButtons from './PostActionButtons'
import { useCallback, useEffect, useState } from 'react'
import usePostActions from '../hooks/usePostActions'
import UserInformationCardContainer from './UserInformationCard'
import { CommunityDefaultPictureIcon } from 'modules/core/components/icons'

interface Props {
  communityInfo: ICommunity | null
  postInfo: IPostCustom
}

const PostItemDetailInfo: React.FC<Props> = ({ communityInfo, postInfo }) => {
  const [postState, setPostState] = useState<IPost | null>(null)

  useEffect(() => {
    if (!postInfo) return
    setPostState(postInfo)
  }, [postInfo])

  const updatePostState = useCallback((newPost: IPost) => {
    setPostState(newPost)
  }, [])

  const { handleUpvote, handleDownvote, handleComment, activeVoteButton, numberOfVote } = usePostActions({
    postState,
    updatePostState,
  })
  return (
    <section className="post-item-detail-info min-w-0">
      <header className="post-item-detail-info-header">
        <div className="flex items-center">
          {communityInfo?.picture ? (
            <img src={communityInfo?.picture} alt={communityInfo?.name} className="w-8 h-8 rounded-full" />
          ) : (
            <CommunityDefaultPictureIcon className="w-8 h-8" />
          )}
          <div className="flex flex-col ml-2">
            <div>
              <span className="text-xs font-bold">{communityInfo?.name}</span>
              <span className="inline-block my-0 mx-2">•</span>
              <span className="text-xs text-gray-500">{moment(postInfo?.createdAt).format('LL')}</span>
            </div>
            <UserInformationCardContainer userId={postInfo?.creator?._id}>
              <span className="text-gray-600 text-xs hover:text-gray-300 hover:cursor-pointer">
                {postInfo?.creator?.display_name}
              </span>
            </UserInformationCardContainer>
          </div>
        </div>
      </header>
      <div className="post-item-detail-info-body mb-4">
        <h1 className="text-2xl text-zinc-700 dark:text-zinc-100 font-bold mt-2 mb-4">{postInfo?.title}</h1>
        <MarkdownPreview className="post-preview-content" source={postInfo?.content} />
      </div>
      <PostActionButtons
        onDownvote={(event) => handleDownvote(event, postInfo?._id)}
        onUpvote={(event) => handleUpvote(event, postInfo?._id)}
        numberOfComment={postInfo?.comments}
        onComment={handleComment}
        numberOfVote={numberOfVote}
        activeVoteButton={activeVoteButton}
      />
    </section>
  )
}

export default PostItemDetailInfo
