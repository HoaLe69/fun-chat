const cheerio = require("cheerio")
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

const fetchLinkPreview = async url => {
  try {
    // Fetch the HTML content
    const response = await fetch(url, { method: "GET" })
    const html = await response.text()
    const $ = cheerio.load(html)

    // Extract metadata
    const metadata = {
      url: url,
      title:
        $('meta[property="og:title"]').attr("content") || $("title").text() || $('meta[name="title"]').attr("content"),

      description:
        $('meta[property="og:description"]').attr("content") || $('meta[name="description"]').attr("content"),

      image: $('meta[property="og:image"]').attr("content") || $('meta[property="twitter:image"]').attr("content"),

      domain: new URL(url).hostname,

      // Additional metadata
      siteName: $('meta[property="og:site_name"]').attr("content"),
      //      type: $('meta[property="og:type"]').attr("content"),
    }

    // Clean up the data
    Object.keys(metadata).forEach(key => {
      if (!metadata[key]) {
        metadata[key] = ""
      }
    })

    return metadata
  } catch (error) {
    console.error("Error fetching link preview:", error)
    throw error
  }
}

module.exports = { getFileDetail, fetchLinkPreview }
