const express = require("express")
const router = express.Router()
const communityController = require("@controller/community.controller")
const upload = require("@config/multer")

router.post(
  "/create",
  upload.fields([
    {
      name: "picture",
      maxCount: 1,
    },
    {
      name: "banner",
      maxCount: 1,
    },
  ]),
  communityController.createCommunity,
)

router.get("/get-list-by-name", communityController.searchCommunity)
router.get("/get-by-name/:name", communityController.getCommunityByName)
router.get("/get-list-by-user/:userId", communityController.getCommunityByUserId)
router.patch("/add-member", communityController.addMember)
router.get("/recent/:userId", communityController.getUserRecentCommunitiesVisisted)
router.post("/add-user-recent", communityController.addUserRecentCommunityVisited)

module.exports = router
