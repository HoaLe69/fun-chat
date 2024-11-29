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

router.get("/:name", communityController.getCommunityByName)

module.exports = router
