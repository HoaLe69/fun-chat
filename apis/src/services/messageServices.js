const getFileDetail = (request, files) => {
  const attachements = {
    images: [],
    files: [],
  }
  files.forEach(file => {
    const extention = file.originalname.split(".").pop()
    if (file.mimetype.includes("image"))
      attachements.images.push({
        url: `${request.protocol}://${request.get("host")}/uploads/${file.filename}`,
        altText: file.originalname,
      })
    else {
      attachements.files.push({
        path: `${request.protocol}://${request.get("host")}/uploads/${file.filename}`,
        fileName: file.originalname,
        fileType: extention,
        size: file.size,
      })
    }
  })
  return attachements
}

module.exports = { getFileDetail }
