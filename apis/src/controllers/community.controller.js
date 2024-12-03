const communityServices = require("@services/communityServices")

const communityController = {
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
