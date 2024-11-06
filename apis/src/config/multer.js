const multer = require("multer")
const path = require("path")

//const config = { dest: "src/uploads" }
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads")
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const fileExtension = path.extname(file.originalname)
    const originalname = file.originalname
    //final file name format : originalname - timestamp-random.extenstion
    cb(null, `${originalname}-${uniqueSuffix}${fileExtension}`)
  },
})
const upload = multer({ storage: storage })

module.exports = upload
