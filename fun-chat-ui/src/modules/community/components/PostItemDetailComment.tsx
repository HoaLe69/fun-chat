import MdxEditor from './MdxEditor'
import CommentContainer from './CommentContainer'
import { usePostComment } from '../hooks/usePostComment'

interface Props {
  postId?: string
}

const PostItemDetailComment: React.FC<Props> = ({ postId }) => {
  const { handleEditorChange, handleOpenEditor, handleCloseEditor, handleSubmit, comment, openEditor } = usePostComment(
    { postId },
  )

  return (
    <section className="post-item-detail-comment mt-8 pb-8 text-zinc-950 dark:text-zinc-50">
      {openEditor ? (
        <MdxEditor onChange={handleEditorChange} doc={comment} autoFocus />
      ) : (
        <input
          onFocus={handleOpenEditor}
          placeholder="Share your thought"
          className="w-full p-3 bg-zinc-100 dark:bg-zinc-800  rounded-full border border-zinc-200 dark:border-zinc-600"
        />
      )}
      <div className="flex justify-end mt-4">
        {openEditor && (
          <>
            <button
              onClick={handleCloseEditor}
              className="text-zinc-100 px-3 py-2 text-sm font-semibold rounded-full bg-zinc-500 hover:bg-zinc-700"
            >
              Cancel
            </button>

            <button
              onClick={() => handleSubmit({ replyTo: null, root: true })}
              className="text-zinc-50 px-3 py-2 ml-3 text-sm font-semibold rounded-full bg-blue-800 hover:bg-blue-700"
            >
              Comment
            </button>
          </>
        )}
      </div>
      <CommentContainer postId={postId} />
    </section>
  )
}

export default PostItemDetailComment
