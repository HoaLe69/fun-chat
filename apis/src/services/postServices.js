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

const getPostByCommunity = async (communityId, page = 1, limit = 10) => {
  const pageNumber = Math.max(1, parseInt(page)) // Ensure page is at least 1
  const pageSize = Math.max(1, parseInt(limit)) // Ensure limit is at least 1

  // fetch paginate posts
  const posts = await Post.find({ community: communityId, isVerify: true })
    .populate("creator")
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * pageSize) // skip previous pages
    .limit(pageSize) // limit the result

  //Count total post in community
  const totalDocuments = await Post.countDocuments({ community: communityId })

  return {
    data: posts,
    meta: {
      currentPage: page,
      totalPages: Math.ceil(totalDocuments / pageSize),
      pageSize,
      totalDocuments,
    },
  }

  //  return await Post.find({ community: communityId }).populate("creator")
}

const getPostPopulateCreatorAsync = async id => {
  return await Post.findOne({ _id: id }).populate("creator")
}

const getPostPopulateCommunityAsync = async id => {
  return await Post.findOne({ _id: id }).populate("community")
}

const getAllPost = async (page = 1, limit = 10) => {
  const pageNumber = Math.max(1, parseInt(page)) // Ensure page is at least 1
  const pageSize = Math.max(1, parseInt(limit)) //Ensure limit is as least 1

  // fetch paginate posts
  const posts = await Post.find({ isVerify: true })
    .populate("community")
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * pageSize) // skip previous pages
    .limit(pageSize) // limit the result

  //Count total post
  const totalDocuments = await Post.countDocuments()
  return {
    data: posts,
    meta: {
      currentPage: page,
      totalPages: Math.ceil(totalDocuments / pageSize),
      pageSize,
      totalDocuments,
    },
  }
}

const getListPostByCreatorIdAsync = async (userId, page = 1, limit = 10) => {
  const pageNumber = Math.max(1, parseInt(page)) // Ensure page is at least 1
  const pageSize = Math.max(1, parseInt(limit)) //Ensure limit is as least 1

  // fetch paginate posts
  const posts = await Post.find({ creator: userId, isVerify: true })
    .populate("community")
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * pageSize) // skip previous pages
    .limit(pageSize) // limit the result

  //Count total post
  const totalDocuments = await Post.countDocuments()
  return {
    data: posts,
    meta: {
      currentPage: page,
      totalPages: Math.ceil(totalDocuments / pageSize),
      pageSize,
      totalDocuments,
    },
  }
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

const savePostAsync = async (postId, userId) => {
  if (!userId) throw new APIError(400, "userId is required")
  const storedPost = await Post.findOne({ _id: postId })

  if (!storedPost) throw new APIError(404, "Post not found")

  const userActivity = await UserActivity.findOne({ userId })

  let savedPostIds = userActivity.saved_post
  if (savedPostIds.includes(postId)) {
    savedPostIds = savedPostIds.filter(id => id !== postId)
  } else {
    savedPostIds.push(postId)
  }

  userActivity.saved_post = savedPostIds
  return await userActivity.save()
}

const deletePostAsync = async postId => {
  if (!postId) throw new APIError(400, "postId is required")
  const storedPost = await Post.findOne({ _id: postId })

  if (!storedPost) throw new APIError(404, "Post not found")

  return await storedPost.remove()
}

const getPendingPostByCommunityIdAsync = async communityId => {
  if (!communityId) throw new APIError(400, "communityId is required")
  const pendingPosts = await Post.find({ community: communityId, isVerify: false }).populate("creator")
  return pendingPosts
}

const approvePostAsync = async postId => {
  if (!postId) throw new APIError(400, "postId is required")
  const post = await Post.findById(postId)

  post.isVerify = true
  return await post.save()
}

const updatePostContentAsync = async (postId, content) => {
  if (!postId) throw new APIError(400, "postId is required")

  const post = await Post.findById(postId)

  post.content = content
  post.isEdited = true

  return await post.save()
}

module.exports = {
  createPost,
  upvote,
  downvote,
  getAllPost,
  savePostAsync,
  deletePostAsync,
  getPostByCommunity,
  approvePostAsync,
  getPendingPostByCommunityIdAsync,
  getListPostByCreatorIdAsync,
  getPostPopulateCommunityAsync,
  getPostPopulateCreatorAsync,
  getUserRecentPostsVisitedAsync,
  addUserRecentPostVisitedAsync,
  updatePostContentAsync,
}
