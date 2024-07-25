const { faker } = require("@faker-js/faker")
const User = require("@schema/user.schema.js")

async function createRandomUser() {
  try {
    await new User({
      email: faker.internet.email(),
      password: "thisistest",
      picture: faker.image.avatar(),
      display_name: faker.internet.displayName(),
      friends: [],
    }).save()
  } catch (error) {
    console.log(error)
  }
}

module.exports = { createRandomUser }
