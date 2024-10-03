const nodemailer = require("nodemailer")
const fs = require("fs")
const path = require("path")

//read the email template from the public folder
const emailTemplate = fs.readFileSync(
  path.join(__dirname, "..", "..", "public", "email-template-ui.html"),
  "utf8",
)
//
//Function to replace placeholders in the template
const renderTemplate = (template, data) => {
  return template.replace(/{{(\w+)}}/g, (match, p1) => data[p1] || match)
}

//TODO: dynamic email
const sendEmailToUser = (email, OTP) => {
  const htmlToSend = renderTemplate(emailTemplate, { OTP })
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "devchatterwithlove@gmail.com",
        pass: "qoyo deat kllj qzxv",
      },
    })
    const mailOption = {
      from: "devchatterwithlove@gmail.com",
      to: email,
      subject: "DevChater send OTP",
      html: htmlToSend,
    }

    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.log(error)
      } else {
        console.log("Email sent", info.response)
        console.log("Verification email sent successfully")
      }
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  sendEmailToUser,
}
