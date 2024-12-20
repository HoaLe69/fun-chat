import { apiClient } from 'modules/core/services'

export const userServices = {
  /**
   *@param {string} q user email
   * **/
  async searchUser({ q }: { q: string }) {
    const res = await apiClient.get(`/users/search?q=${q}`)
    return res.data
  },

  async getUserById(userId: string | undefined) {
    try {
      const res = await apiClient.get(`/users/getUserById/${userId}`)
      return res.data
    } catch (error) {
      console.log(error)
    }
  },
  async makeFriendRequest({ userRequestId, userDestinationId }: { userRequestId: string; userDestinationId: string }) {
    const res = await apiClient.patch(`/users/add-friend-request`, {
      userRequestId,
      userDestinationId,
    })
    return res.data
  },
  async acceptFriendRequestAsync({
    userRequestId,
    userDestinationId,
  }: {
    userRequestId: string
    userDestinationId: string
  }) {
    const res = await apiClient.patch(`/users/accept-friend-request`, { userRequestId, userDestinationId })
    return res.data
  },
  async cancelFriendRequestAsync({
    userRequestId,
    userDestinationId,
  }: {
    userRequestId: string
    userDestinationId: string
  }) {
    const res = await apiClient.patch(`/users/cancel-friend-request`, { userRequestId, userDestinationId })
    return res.data
  },

  async getUserAsync() {
    return await new Promise((resolve) =>
      setTimeout(() => {
        resolve([
          {
            display_name: 'John Doe',
            email: 'john.doe@example.com',
            picture: 'https://via.placeholder.com/150',
          },
          {
            display_name: 'Jane Smith',
            email: 'jane.smith@example.com',
            picture: 'https://via.placeholder.com/150',
          },
          {
            display_name: 'Alice Johnson',
            email: 'alice.johnson@example.com',
            picture: 'https://via.placeholder.com/150',
          },
          {
            display_name: 'Bob Brown',
            email: 'bob.brown@example.com',
            picture: 'https://via.placeholder.com/150',
          },
          {
            display_name: 'Carol White',
            email: 'carol.white@example.com',
            picture: 'https://via.placeholder.com/150',
          },
          {
            display_name: 'David Black',
            email: 'david.black@example.com',
            picture: 'https://via.placeholder.com/150',
          },
          {
            display_name: 'Emma Green',
            email: 'emma.green@example.com',
            picture: 'https://via.placeholder.com/150',
          },
          {
            display_name: 'Frank Blue',
            email: 'frank.blue@example.com',
            picture: 'https://via.placeholder.com/150',
          },
          {
            display_name: 'Grace Yellow',
            email: 'grace.yellow@example.com',
            picture: 'https://via.placeholder.com/150',
          },
          {
            display_name: 'Henry Purple',
            email: 'henry.purple@example.com',
            picture: 'https://via.placeholder.com/150',
          },
        ])
      }, 2000),
    ).then((res) => {
      return res
    })
  },
}
