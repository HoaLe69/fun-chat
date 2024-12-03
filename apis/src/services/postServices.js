const Post = require("@models/Post")
const { APIError } = require("@errors")

const createPost = async postInfo => {
  const newPost = new Post(postInfo)
  return await newPost.save()
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
}
