import {
  PlusCircleIcon,
  MinusCircleIcon,
  UpvoteIcon,
  UpvoteFillIcon,
  DownvoteIcon,
  DownvoteFillIcon,
  CommentBoxIcon,
} from 'modules/core/components/icons'
import { useAppSelector } from 'modules/core/hooks'
import { ICommentCustom } from '../types'
import { useCallback, useMemo, useState } from 'react'
import { commentServices } from '../services'
import classNames from 'classnames'

interface Props {
  onToggle: () => void
  isExpanded: boolean
  visibleExpandBtn: boolean
  onOpenEditor: () => void
  comment: ICommentCustom
}

const CommentActionButtons: React.FC<Props> = (props) => {
  const { onToggle, isExpanded, visibleExpandBtn, onOpenEditor, comment } = props
  const [commentState, setCommentState] = useState(comment)
  const userLogin = useAppSelector((state) => state.auth.user)

  const handleUpvote = useCallback(async () => {
    if (!commentState._id || !userLogin?._id) return
    try {
      const res = await commentServices.upvoteCommentAsync(commentState._id, userLogin._id)
      setCommentState(res)
    } catch (error) {
      console.log(error)
    }
  }, [userLogin])

  const handleDownvote = useCallback(async () => {
    if (!commentState._id || !userLogin?._id) return
    try {
      const res = await commentServices.downvoteCommentAsync(commentState._id, userLogin._id)
      setCommentState(res)
    } catch (error) {
      console.log(error)
    }
  }, [userLogin])

  const activeVoteButton = useMemo(() => {
    if (!userLogin?._id || !commentState) return null
    if (commentState.upvoted.includes(userLogin._id)) return 'upvote'
    if (commentState.downvoted.includes(userLogin._id)) return 'downvote'
    return null
  }, [commentState])

  const numOfVote = useMemo(() => {
    return commentState.upvoted.length - commentState.downvoted.length
  }, [commentState])

  return (
    <div className="flex items-center pt-2 relative">
      {visibleExpandBtn && (
        <button
          onClick={onToggle}
          className="absolute top-full -translate-y-full left-0 -translate-x-full  text-sm flex items-center justify-center p-2 bg-zinc-50 dark:bg-zinc-800 cursor-pointer"
        >
          {isExpanded ? <MinusCircleIcon className="w-4 h-4" /> : <PlusCircleIcon className="w-4 h-4" />}
        </button>
      )}

      <button
        onClick={handleUpvote}
        className={classNames(
          'w-8 h-8 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-900 rounded-full',
          { 'text-orange-700': activeVoteButton === 'upvote' },
        )}
      >
        {activeVoteButton === 'upvote' ? <UpvoteFillIcon /> : <UpvoteIcon />}
      </button>
      {numOfVote !== 0 && <span className="text-xs font-semibold">{numOfVote}</span>}

      <button
        onClick={handleDownvote}
        className={classNames(
          'w-8 h-8 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-900 rounded-full',
          { 'text-blue-700': activeVoteButton === 'downvote' },
        )}
      >
        {activeVoteButton === 'downvote' ? <DownvoteFillIcon /> : <DownvoteIcon />}
      </button>
      <button
        onClick={onOpenEditor}
        className="w-8 h-8 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-900 rounded-full"
      >
        <CommentBoxIcon />
      </button>
    </div>
  )
}

export default CommentActionButtons
