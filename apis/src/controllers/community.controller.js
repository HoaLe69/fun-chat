const communityServices = require("@services/communityServices")

const communityController = {
  async addMember(req, res, next) {
    try {
      const community = await communityServices.addMemberAsync(req.body)
      return res.status(200).json(community)
    } catch (error) {
      next(error)
    }
  },
  async getUserRecentCommunitiesVisisted(req, res, next) {
    try {
      const recentCommunities = await communityServices.getUserRecentCommunitiesVisitedAsync(req.params.userId)
      return res.status(200).json(recentCommunities)
    } catch (error) {
      next(error)
    }
  },
  async addUserRecentCommunityVisited(req, res, next) {
    try {
      await communityServices.addUserRecentCommunityVisitedAsync(req.body)
      return res.status(204).send("ok")
    } catch (error) {
      next(error)
    }
  },

  async createCommunity(req, res, next) {
    try {
      const community = await communityServices.createCommunity(req)
      return res.status(201).json(community)
    } catch (error) {
      next(error)
    }
  },
  async searchCommunity(req, res, next) {
    try {
      const name = req.query.name
      const communities = await communityServices.searchCommunity(name)
      return res.status(200).json(communities)
    } catch (error) {
      next(error)
    }
  },
  async getCommunityByName(req, res, next) {
    try {
      const community = await communityServices.getCommunityByName(req.params.name)
      return res.status(200).json(community)
    } catch (error) {
      next(error)
    }
  },
  async getCommunityByUserId(req, res, next) {
    try {
      const communities = await communityServices.getCommunityByUserId(req.params.userId)
      return res.status(200).json(communities)
    } catch (error) {
      next(error)
    }
  },
}

module.exports = communityController
