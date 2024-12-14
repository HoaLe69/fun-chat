import classNames from 'classnames'
import {
  UpvoteIcon,
  DownvoteIcon,
  UpvoteFillIcon,
  DownvoteFillIcon,
  CommentBoxIcon,
} from 'modules/core/components/icons'
import { useMemo } from 'react'

interface Props {
  onDownvote: (event: React.MouseEvent) => void
  onUpvote: (event: React.MouseEvent) => void
  numberOfVote: number
  numberOfComment?: number | 0
  onComment: (event: React.MouseEvent) => void
  activeVoteButton: 'upvote' | 'downvote' | null
}
const PostActionButtons: React.FC<Props> = (props) => {
  const { onDownvote, onUpvote, numberOfVote, onComment, numberOfComment, activeVoteButton } = props
  const hoverClass = useMemo(() => {
    if (!activeVoteButton) return null
    if (activeVoteButton === 'upvote') return 'hover:bg-orange-800'
    if (activeVoteButton === 'downvote') return 'hover:bg-blue-800'
  }, [activeVoteButton])
  return (
    <div className="post-actions-button flex mt-2 gap-2">
      <div
        className={classNames(
          'vote-button-group flex items-center bg-zinc-200 dark:bg-zinc-700 rounded-full',
          activeVoteButton === 'upvote' && '!bg-orange-700 text-white',
          activeVoteButton === 'downvote' && '!bg-blue-700 text-white',
        )}
      >
        <button
          onClick={onUpvote}
          className={classNames(
            'w-8 h-8 flex items-center justify-center rounded-full ',
            hoverClass || 'hover:text-orange-700',
          )}
        >
          {activeVoteButton === 'upvote' ? <UpvoteFillIcon /> : <UpvoteIcon />}
        </button>
        <span className="text-xs font-bold">{numberOfVote}</span>
        <button
          onClick={onDownvote}
          className={classNames(
            'w-8 h-8 flex items-center justify-center rounded-full ',
            hoverClass || 'hover:text-blue-700',
          )}
        >
          {activeVoteButton === 'downvote' ? <DownvoteFillIcon /> : <DownvoteIcon />}
        </button>
      </div>
      <div className="comment-button-group px-4 bg-zinc-200 dark:bg-zinc-700  rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-800">
        <button onClick={onComment} className="flex w-8 h-8 items-center justify-center">
          <CommentBoxIcon />
          <span className="text-xs font-bold ml-1">{numberOfComment}</span>
        </button>
      </div>
    </div>
  )
}

export default PostActionButtons
