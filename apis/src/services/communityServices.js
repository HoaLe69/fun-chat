const { APIError } = require("@errors")
const Community = require("@models/Community")

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

module.exports = {
  createCommunity,
  getCommunityByName,
}