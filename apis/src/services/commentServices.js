const Comment = require("@models/Comment")
const Post = require("@models/Post")
const { APIError } = require("@errors")

const createCommentAsync = async comment => {
  if (!comment) throw new APIError("Comment is required", 400)
  const postId = comment.postId
  const savedPost = await Post.findById(postId)
  if (!savedPost) throw new APIError("Post not found", 404)
  savedPost.comments = savedPost.comments + 1
  await savedPost.save()
  console.log(comment)
  const newComment = new Comment({ ...comment })
  return await newComment.save()
}

const upvoteCommentAsync = async (commentId, userId) => {
  if (!commentId) throw new APIError("Comment ID is required", 400)
  if (!userId) throw new APIError("User ID is required", 400)
  const comment = await Comment.findById(commentId)
  const isUpvoted = comment.upvoted.includes(userId)
  if (isUpvoted) {
    comment.upvoted = comment.upvoted.filter(id => id !== userId)
    return await comment.save()
  }
  comment.downvoted = comment.downvoted.filter(id => id !== userId)
  comment.upvoted.push(userId)
  return await comment.save()
}

const downvoteCommentAsync = async (commentId, userId) => {
  if (!commentId) throw new APIError("Comment ID is required", 400)
  if (!userId) throw new APIError("User ID is required", 400)
  const comment = await Comment.findById(commentId)
  const isDownvoted = comment.downvoted.includes(userId)
  if (isDownvoted) {
    comment.downvoted = comment.downvoted.filter(id => id !== userId)
    return await comment.save()
  }
  comment.upvoted = comment.upvoted.filter(id => id !== userId)
  comment.downvoted.push(userId)
  return await comment.save()
}

const getCommentByPostIdAsync = async postId => {
  if (!postId) throw new APIError("Post ID is required", 400)
  //  const comments = await Comment.find({ postId })
  const comments = await Comment.aggregate([
    { $match: { postId } },
    // {
    //   $lookup: {
    //     from: "users", //Collection name
    //     localField: "ownerId", //Field from the input documents
    //     foreignField: "_id", //Field from the documents of the "from" collection
    //     as: "owner", //Output array field
    //     pipeline: [
    //       {
    //         $project: {
    //           display_name: 1,
    //           picture: 1,
    //           avatar: 1,
    //         },
    //       },
    //     ],
    //   },
    // },
    // { $unwind: "$owner" },
    {
      $graphLookup: {
        from: "comments", // Collection name
        startWith: "$_id", // Start from the current comment ID
        connectFromField: "_id", // Field to match
        connectToField: "replyTo", // Field indicating the parent comment
        as: "replies", // Output field for nested replies
        depthField: "depth", // Track nesting depth
      },
    },
    // Exclude comments that are replies (i.e., they have a replyTo field)
    { $match: { replyTo: null } },
    // Recursively filter replies to keep only direct children in `replies`
    // Optionally sort by creation date
    { $sort: { createdAt: 1 } },
  ])
  return comments
}
module.exports = {
  createCommentAsync,
  getCommentByPostIdAsync,
  upvoteCommentAsync,
  downvoteCommentAsync,
}
