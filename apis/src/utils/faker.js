const { faker } = require("@faker-js/faker")
const User = require("@models/User")
const Community = require("@models/Community")
const Post = require("@models/Post")
const { convertNameToSearchTerm } = require("./convert-search-term")

//remove on production
async function createRandomUser() {
  try {
    const display_name = faker.internet.displayName()
    const normalized_name = convertNameToSearchTerm(display_name)
    await new User({
      email: faker.internet.email(),
      picture: faker.image.avatar(),
      display_name,
      normalized_name,
      friends: [],
    }).save()
  } catch (error) {
    console.log(error)
  }
}

async function generateSampleCommunity() {
  await new Community({
    name: faker.company.name(), // Generate a unique name for the community.
    description: faker.lorem.sentence(), // Generate a random sentence for the description.
    picture: faker.image.avatar(), // Generate a random avatar for the community picture.
    banner: faker.image.imageUrl(800, 200, "abstract", true), // Generate a banner image.
    members: ["67087f0905a73a0aedbd8f6f"], // Predefined members.
    tags: faker.lorem.words(3).split(" "), // Generate random tags as an array of strings.
    moderators: ["67087f0905a73a0aedbd8f6f"], // Predefined moderators.
  }).save()
}

function generateMarkdownContent() {
  return `# ${faker.lorem.sentence()}

## ${faker.lorem.sentence()}

${faker.lorem.paragraphs(2)}

- ${faker.lorem.sentence()}
- ${faker.lorem.sentence()}
- ${faker.lorem.sentence()}

### ${faker.lorem.sentence()}

![Image](${faker.image.imageUrl(400, 300, "nature", true)})

**${faker.lorem.word()}**: ${faker.lorem.sentence()}`
}

async function generateSamplePost() {
  const community = ["6753f72c8c7b4720f92dfe37", "67496b1b5c4bb2c81e989c7a"]
  await new Post({
    title: faker.lorem.sentence(),
    content: generateMarkdownContent(),
    creator: "67087f0905a73a0aedbd8f6f",
    community: community[Math.floor(Math.random() * community.length)],
    tag: faker.lorem.word(),
  }).save()
}
module.exports = { createRandomUser, generateSampleCommunity, generateSamplePost }
