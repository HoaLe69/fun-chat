const User = require("@models/User")
const { APIError } = require("@errors")

const addNewFriendRequestAsync = async (userRequestId, userDestinationId) => {
  if (!userRequestId) throw new APIError(400, "userRequestId is required")
  if (!userDestinationId) throw new APIError(400, "userDestinationId is required")

  const userReq = await User.findOne({ _id: userRequestId })
  const userDes = await User.findOne({ _id: userDestinationId })
  console.log({ userReq, userDes })

  userReq.friends_request.push(userDestinationId)
  userDes.friends_waiting.push(userRequestId)

  await userReq.save()
  await userDes.save()

  return { userReq, userDes }
}

const cancelFriendRequestAsync = async (userRequestId, userDestinationId) => {
  if (!userRequestId) throw new APIError(400, "userRequestId is required")
  if (!userDestinationId) throw new APIError(400, "userDestinationId is required")
  const userReq = await User.findOne({ _id: userRequestId })
  const userDes = await User.findOne({ _id: userDestinationId })

  userReq.friends_request = userReq.friends_request.filter(id => id !== userDestinationId)
  userDes.friends_waiting = userDes.friends_waiting.filter(id => id !== userRequestId)

  await userReq.save()
  await userDes.save()
  return { userReq, userDes }
}
const acceptFriendRequestAsync = async (userRequestId, userDestinationId) => {
  if (!userRequestId) throw new APIError(400, "userRequestId is required")
  if (!userDestinationId) throw new APIError(400, "userDestinationId is required")
  const userReq = await User.findOne({ _id: userRequestId })
  const userDes = await User.findOne({ _id: userDestinationId })
  userReq.friends.push(userDestinationId)
  userDes.friends.push(userRequestId)
  userReq.friends_waiting = userReq.friends_waiting.filter(id => id !== userDestinationId)
  userDes.friends_request = userDes.friends_request.filter(id => id !== userRequestId)
  await userReq.save()
  await userDes.save()
  return { userReq, userDes }
}

const searchUserByEmailAsync = async email => {
  const users = await User.find({ email: { $regex: email, $options: "i" } })
  return users
}

module.exports = {
  addNewFriendRequestAsync,
  acceptFriendRequestAsync,
  cancelFriendRequestAsync,
  searchUserByEmailAsync,
}
