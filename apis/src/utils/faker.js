const { faker } = require("@faker-js/faker")
const User = require("@models/User")
const { convertNameToSearchTerm } = require("./convert-search-term")

//remove on production
async function createRandomUser() {
  try {
    const display_name = faker.internet.displayName()
    const normalized_name = convertNameToSearchTerm(display_name)
    await new User({
      email: faker.internet.email(),
      password: "thisistest",
      picture: faker.image.avatar(),
      display_name,
      normalized_name,
      friends: [],
    }).save()
  } catch (error) {
    console.log(error)
  }
}

module.exports = { createRandomUser }
