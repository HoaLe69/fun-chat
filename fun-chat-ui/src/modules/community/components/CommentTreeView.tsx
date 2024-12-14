import { useState, useCallback, memo, useEffect } from 'react'
import type { ICommentCustom } from '../types'
import MarkdownPreview from '@uiw/react-markdown-preview'
import {
  PlusCircleIcon,
  MinusCircleIcon,
  DownvoteIcon,
  UpvoteIcon,
  CommentBoxIcon,
} from 'modules/core/components/icons'
import MdxEditor from './MdxEditor'
import { usePostComment } from '../hooks/usePostComment'
import classNames from 'classnames'
import moment from 'moment'
import { IUser } from 'modules/user/types'
import { userServices } from 'modules/user/services'
import CommentActionButtons from './CommentActionButtons'
import UserInformationCardContainer from './UserInformationCard'

const CommentTreeNode = ({ node, rootId }: { node: ICommentCustom; rootId: string }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true)
  const [userCommentInfo, setUserCommentInfo] = useState<IUser | null>(null)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await userServices.getUserById(node.ownerId)

        setUserCommentInfo(user)
      } catch (error) {
        console.log(error)
      }
    }
    fetchUser()
  }, [])
  const { handleOpenEditor, handleCloseEditor, handleEditorChange, comment, openEditor, handleSubmit } = usePostComment(
    {
      postId: node.postId,
    },
  )

  const handleToggle = useCallback(() => {
    setIsExpanded(!isExpanded)
  }, [isExpanded])

  const fallback =
    'https://images.unsplash.com/photo-1732919258473-2e99efcfba02?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

  return (
    <div className={classNames('relative w-full')}>
      <div className="flex items-center">
        <img
          src={userCommentInfo?.picture || fallback}
          alt={userCommentInfo?.display_name}
          className="rounded-full w-8 h-8"
        />
        <UserInformationCardContainer userId={userCommentInfo?._id}>
          <p className="text-xs font-medium ml-2 hover:cursor-pointer hover:underline">
            {userCommentInfo?.display_name || 'd/devchatter'}
          </p>
        </UserInformationCardContainer>
        <span className="inline-block my-0 mx-1 text-12 text-neutral-300">•</span>
        <span className="text-xs text-zinc-400">{moment(node.createdAt).fromNow()}</span>
      </div>

      <div className="grid grid-cols-[32px_1fr]">
        <div className="flex items-center justify-center pt-2 flex-col">
          <div className={classNames('h-full bg-zinc-200 dark:bg-zinc-600', { 'w-[1px] ': node.replies.length })} />
        </div>
        <div>
          <div className="ml-2">
            <MarkdownPreview source={node.content} className="post-preview-content" />
          </div>
          <CommentActionButtons
            onToggle={handleToggle}
            isExpanded={isExpanded}
            onOpenEditor={handleOpenEditor}
            visibleExpandBtn={node?.replies?.length > 0}
            comment={node}
          />
          {/* <div className="flex items-center pt-2 relative"> */}
          {/*   {node.replies.length > 0 && ( */}
          {/*     <button */}
          {/*       onClick={handleToggle} */}
          {/*       className="absolute top-full -translate-y-full left-0 -translate-x-full  text-sm flex items-center justify-center p-2 bg-zinc-50 dark:bg-zinc-800 cursor-pointer" */}
          {/*     > */}
          {/*       {isExpanded ? <MinusCircleIcon className="w-4 h-4" /> : <PlusCircleIcon className="w-4 h-4" />} */}
          {/*     </button> */}
          {/*   )} */}
          {/**/}
          {/*   <button className="w-8 h-8 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-900 rounded-full"> */}
          {/*     <UpvoteIcon /> */}
          {/*   </button> */}
          {/*   <button className="w-8 h-8 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-900 rounded-full"> */}
          {/*     <DownvoteIcon /> */}
          {/*   </button> */}
          {/*   <button */}
          {/*     onClick={handleOpenEditor} */}
          {/*     className="w-8 h-8 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-900 rounded-full" */}
          {/*   > */}
          {/*     <CommentBoxIcon /> */}
          {/*   </button> */}
          {/* </div> */}
          {openEditor && (
            <>
              <MdxEditor onChange={handleEditorChange} doc={comment} autoFocus />
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleCloseEditor}
                  className="text-zinc-100 px-3 py-2 text-sm font-semibold rounded-full bg-zinc-500 hover:bg-zinc-700"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleSubmit({ replyTo: node._id, root: false, rootId, depth: node.depth + 1 || 0 })}
                  className="text-zinc-50 px-3 py-2 ml-2 text-sm font-semibold rounded-full bg-blue-800 hover:bg-blue-700"
                >
                  Comment
                </button>
              </div>
            </>
          )}

          {isExpanded && (
            <ul className="list-none">
              {node?.replies?.map((child, index) => {
                const last = index === node.replies.length - 1
                return (
                  <li key={child._id} className="grid grid-cols-[1px_1fr] relative">
                    <div
                      className={classNames('absolute top-0 flex left-0 w-8 h-full -translate-x-full', {
                        'dark:bg-zinc-800 bg-zinc-50': last,
                      })}
                    >
                      <div className="w-4 h-4 ml-auto  border-l border-b rounded-bl-xl border-zinc-200 dark:border-zinc-600" />
                    </div>
                    <div />
                    <CommentTreeNode node={child} rootId={rootId} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

interface Props {
  comment: ICommentCustom
}
const CommentTreeView: React.FC<Props> = ({ comment }) => {
  return <CommentTreeNode node={comment} rootId={comment?._id} />
}

export default memo(CommentTreeView)
