import { useEffect } from 'react'
import CommentTreeView from './CommentTreeView'
import { useAppDispatch, useAppSelector } from 'modules/core/hooks'
import { fetchHistoryCommentAsync } from '../states/commentActions'
import { commentSelector } from '../states/commentSlice'
import { restructureCommentArray } from '../utils'

interface Props {
  postId?: string
  userOfPost?: string
}

const CommentContainer: React.FC<Props> = ({ postId, userOfPost }) => {
  const dispatch = useAppDispatch()
  const comments = useAppSelector(commentSelector.selectHistoryCommentData)
  const status = useAppSelector(commentSelector.selecteHistoryCommentStatus)

  useEffect(() => {
    if (!postId) return
    dispatch(fetchHistoryCommentAsync({ postId }))
  }, [postId])

  return (
    <div className="flex flex-col gap-4">
      {status === 'loading' ? (
        <div className="w-full min-h-48 flex items-center justify-center">loading....</div>
      ) : (
        status === 'successful' &&
        (comments.length > 0 ? (
          restructureCommentArray(comments)?.map((comment) => (
            <CommentTreeView userOfPost={userOfPost} key={comment?._id} comment={comment} />
          ))
        ) : (
          <div>
            <p className="text-base font-bold">Be the first to comment</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-4">
              Nobody's responsed to this post yet <br /> Add your thought and get the conversation going
            </p>
          </div>
        ))
      )}
    </div>
  )
}
export default CommentContainer
