const { APIError } = require("@errors")
const Community = require("@models/Community")
const UserActivity = require("@models/UserActivity")

const createCommunity = async req => {
  const files = req.files
  const communityInfo = req.body

  if (!communityInfo.name || !communityInfo.description) throw new APIError("Name and description are required", 400)

  const community = new Community({
    ...communityInfo, // name, description, members, tags, moderators
    members: [communityInfo.members],
    moderators: [communityInfo.moderators],
    picture: files.picture ? `${req.protocol}://${req.get("host")}/uploads/${files.picture[0].filename}` : null,
    banner: files.banner ? `${req.protocol}://${req.get("host")}/uploads/${files.banner[0].filename}` : null,
  }).save()

  return community
}

const getCommunityByName = async name => {
  if (!name) throw new APIError("Name is required", 400)

  const community = await Community.findOne({ name })

  return community
}

const searchCommunity = async query => {
  const communities = await Community.find({
    name: { $regex: query, $options: "i" },
  })
  return communities
}

const addMemberAsync = async data => {
  const { communityId, userId } = data
  if (!communityId || !userId) throw new APIError("Community id and user id are required", 400)
  const community = await Community.findById(communityId)
  if (!community) throw new APIError("Community not found", 404)

  if (community.members.includes(userId)) {
    community.members = community.members.filter(member => member !== userId)
  } else community.members.push(userId)

  return await community.save()
}

const getUserRecentCommunitiesVisitedAsync = async userId => {
  if (!userId) throw new APIError("User id is required", 400)
  const userActivity = await UserActivity.findOne({ userId })
  const communities_ids = userActivity.recent_communities_visited

  const communities = await Community.find({
    _id: { $in: communities_ids },
  }).select("name picture")
  return communities
}

const addUserRecentCommunityVisitedAsync = async data => {
  const { userId, communityId } = data
  if (!userId || !communityId) throw new APIError("User id and community id are required", 400)
  const community = await Community.findById(communityId)
  if (!community) throw new APIError("Community not found", 404)
  const userActivity = await UserActivity.findOne({ userId })

  if (!userActivity) {
    return await new UserActivity({
      userId,
      recent_communities_visited: [communityId],
    }).save()
  }

  const currentRecentCommunitites = userActivity.recent_communities_visited

  // ignore case
  if (currentRecentCommunitites.includes(communityId)) return

  if (currentRecentCommunitites.length > 5) {
    currentRecentCommunitites.shift()
  }
  currentRecentCommunitites.push(communityId)

  userActivity.recent_communities_visited = currentRecentCommunitites

  return await userActivity.save()
}

const getCommunityByUserId = async userId => {
  if (userId === undefined) throw new APIError("User id is required", 400)
  const communities = await Community.find({
    members: { $in: [userId] },
  })
  return communities
}

module.exports = {
  createCommunity,
  getCommunityByName,
  searchCommunity,
  addMemberAsync,
  getCommunityByUserId,
  getUserRecentCommunitiesVisitedAsync,
  addUserRecentCommunityVisitedAsync,
}
