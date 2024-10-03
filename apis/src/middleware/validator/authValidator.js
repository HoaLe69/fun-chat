const { body } = require("express-validator")

const registerValidation = [
  body("email").notEmpty().isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("display_name").notEmpty().withMessage("Display name is required"),
  body("token").notEmpty().withMessage("Token is required"),
  body("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isNumeric()
    .withMessage("OTP must be a numeric value"),
]

const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
]

module.exports = {
  registerValidation,
  loginValidation,
}
