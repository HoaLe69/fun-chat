const Post = require("@models/Post")
const UserActivity = require("@models/UserActivity")
const { APIError } = require("@errors")

const createPost = async postInfo => {
  const newPost = new Post(postInfo)
  return await newPost.save()
}

const addUserRecentPostVisitedAsync = async data => {
  const { userId, postId } = data
  if (!userId) throw new APIError(400, "userId is required")
  if (!postId) throw new APIError(400, "postId is required")
  const userActivity = await UserActivity.findOne({ userId })

  if (!userActivity) {
    await new UserActivity({ userId }).save()
  }

  const currentRecentPosts = userActivity.recent_post_visited

  if (currentRecentPosts.includes(postId)) return

  if (currentRecentPosts.length > 10) {
    currentRecentPosts.shift()
  }
  currentRecentPosts.push(postId)

  return await userActivity.save()
}

const getUserRecentPostsVisitedAsync = async userId => {
  if (!userId) throw new APIError(400, "userId is required")
  const userActivity = await UserActivity.findOne({ userId })

  const postIds = userActivity.recent_post_visited

  const posts = await Post.find({
    _id: { $in: postIds },
  })
    .populate("community", "name picture")
    .select("title createdAt comments upvoted downvoted")
  console.log({ posts, postIds })
  return posts
}

const getPostByCommunity = async communityId => {
  return await Post.find({ community: communityId }).populate("creator")
}

const getPostByCreator = async id => {
  return await Post.findOne({ _id: id }).populate("creator")
}

const getAllPost = async () => {
  return await Post.find().populate("community")
}

const upvote = async (postId, userId) => {
  if (!postId || !userId) throw new APIError(400, "postId and userId are required")
  const post = await Post.findById(postId)
  const isUpvoted = post.upvoted.includes(userId)
  if (isUpvoted) {
    post.upvoted = post.upvoted.filter(id => id !== userId)
    return await post.save()
  }
  post.downvoted = post.downvoted.filter(id => id !== userId)
  post.upvoted.push(userId)
  return await post.save()
}

const downvote = async (postId, userId) => {
  if (!postId || !userId) throw new APIError(400, "postId and userId are required")
  const post = await Post.findById(postId)
  const isDownvoted = post.downvoted.includes(userId)
  if (isDownvoted) {
    post.downvoted = post.downvoted.filter(id => id !== userId)
    return await post.save()
  }
  post.upvoted = post.upvoted.filter(id => id !== userId)
  post.downvoted.push(userId)
  return await post.save()
}

module.exports = {
  createPost,
  getPostByCommunity,
  getPostByCreator,
  upvote,
  downvote,
  getAllPost,
  getUserRecentPostsVisitedAsync,
  addUserRecentPostVisitedAsync,
}
