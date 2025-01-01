import moment from 'moment'
import type { ICommunity, IPost, IPostCustom } from 'modules/community/types'
import MarkdownPreview from '@uiw/react-markdown-preview'
import './PreviewContent.css'
import PostActionButtons from './PostActionButtons'
import { useCallback, useEffect, useState } from 'react'
import usePostActions from '../hooks/usePostActions'
import UserInformationCardContainer from './UserInformationCard'
import { BookMarkFillIcon, BookMarkOutlineIcon, CommunityDefaultPictureIcon } from 'modules/core/components/icons'
import { useAppSelector } from 'modules/core/hooks'
import { authSelector } from 'modules/auth/states/authSlice'
import MdxEditor from './MdxEditor'
import { postServices } from '../services'
import { userServices } from 'modules/user/services'

interface Props {
  communityInfo: ICommunity | null
  postInfo: IPostCustom
}

const PostItemDetailInfo: React.FC<Props> = ({ communityInfo, postInfo }) => {
  const [postState, setPostState] = useState<IPost | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const userLoginId = useAppSelector(authSelector.selectUserId)
  const [editedContent, setEditedContent] = useState<string>('')
  const [isSaved, setIsSaved] = useState<boolean>(false)

  useEffect(() => {
    if (!postInfo) return
    setPostState(postInfo)
  }, [postInfo])

  useEffect(() => {
    if (!userLoginId) return
    userServices
      .getUserActivity(userLoginId)
      .then((res) => {
        console.log('res', res)
        setIsSaved(res.saved_post.includes(postInfo?._id))
      })
      .catch((err) => console.log(err))
  }, [userLoginId, postInfo])

  const updatePostState = useCallback((newPost: IPost) => {
    setPostState(newPost)
  }, [])

  const { handleUpvote, handleDownvote, handleComment, activeVoteButton, numberOfVote } = usePostActions({
    updatePostState,
    postState,
  })

  const handleEnterEditMode = useCallback(() => {
    setIsEditMode(true)
  }, [])

  const handleEditorChange = useCallback((markdown: string) => {
    setEditedContent(markdown)
  }, [])

  const handelCancelEdit = useCallback(() => {
    setIsEditMode(false)
    setEditedContent('')
  }, [])

  const handleSubmitEdit = useCallback(() => {
    if (editedContent === postInfo.content || !editedContent) {
      setIsEditMode(false)
      return
    }

    postServices
      .editPostContentAsync(postInfo?._id, editedContent)
      .then((res) => {
        setPostState((pre: any) => {
          return { ...pre, content: res.content, isEdited: res.isEdited }
        })
        setIsEditMode(false)
        setEditedContent('')
      })
      .catch((err) => console.log(err))
  }, [editedContent, postInfo])

  const handleSavePost = useCallback(() => {
    if (!userLoginId || !postInfo) return
    postServices
      .savedPostAsync(postInfo?._id, userLoginId)
      .then(() => {
        setIsSaved(!isSaved)
      })
      .catch((err) => console.log(err))
  }, [userLoginId, postInfo, isSaved])

  return (
    <section className="post-item-detail-info min-w-0">
      <header className="post-item-detail-info-header flex items-center">
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
              {postState?.isEdited && (
                <>
                  <span className="inline-block my-0 mx-2">•</span>
                  <span className="text-xs text-blue-500">Edited</span>
                </>
              )}
            </div>
            <UserInformationCardContainer userId={postInfo?.creator?._id}>
              <span className="text-gray-600 text-xs hover:text-gray-300 hover:cursor-pointer">
                {postInfo?.creator?.display_name}
              </span>
            </UserInformationCardContainer>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleSavePost}
            className="ml-auto text-sm font-medium p-2 rounded-full hover:opacity-80 bg-zinc-200 dark:bg-zinc-700"
          >
            {isSaved ? <BookMarkFillIcon className="text-yellow-500" /> : <BookMarkOutlineIcon />}
          </button>
          {userLoginId === postInfo?.creator?._id && (
            <button
              onClick={handleEnterEditMode}
              className="text-sm font-medium p-2 rounded-full hover:opacity-80 bg-zinc-200 dark:bg-zinc-700"
            >
              edit
            </button>
          )}
        </div>
      </header>
      <div className="post-item-detail-info-body mb-4 mt-2">
        <h1 className="text-2xl text-zinc-700 dark:text-zinc-100 font-bold mt-2 mb-4">{postInfo?.title}</h1>
        {isEditMode ? (
          <>
            <MdxEditor onChange={handleEditorChange} doc={editedContent || postState?.content} />
            <div className="flex items-center gap-2 justify-end mt-2">
              <button
                onClick={handelCancelEdit}
                className="text-sm font-semibold bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-2 rounded-full"
              >
                cancel
              </button>
              <button
                onClick={handleSubmitEdit}
                className="text-sm font-semibold bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-full"
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <>
            <MarkdownPreview
              components={{
                img: ({ node, ...props }) => {
                  return (
                    <div className="max-h-[600px] w-full flex items-center justify-center">
                      <img src={props?.src} alt={props?.alt} className="max-w-80 max-h-80 block rounded-md" />
                    </div>
                  )
                },
              }}
              className="post-preview-content"
              source={postState?.content}
            />
          </>
        )}
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
