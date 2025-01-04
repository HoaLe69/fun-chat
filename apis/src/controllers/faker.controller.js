const fakerUtils = require("@utils/faker.js")

const fakerController = {
  async createFakerUser(req, res, next) {
    try {
      for (let i = 0; i < 20; i++) {
        await fakerUtils.createRandomUser()
      }
      res.status(201).json({ message: "ok" })
    } catch (error) {
      next(error)
    }
  },

  async createFakerCommunity(req, res, next) {
    try {
      for (let i = 0; i < 20; i++) {
        await fakerUtils.generateSampleCommunity()
      }
      res.status(201).json({ message: "ok" })
    } catch (error) {
      next(error)
    }
  },
  async createFakerPost(req, res, next) {
    try {
      const userId = req.params.userId
      for (let i = 0; i < 10; i++) {
        await fakerUtils.generateSamplePost(userId)
      }
      res.status(201).json({ message: "ok" })
    } catch (error) {
      next(error)
    }
  },
}

module.exports = fakerController
