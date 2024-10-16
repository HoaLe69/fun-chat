export type IUser = {
  _id: string
  email: string
  picture: string
  display_name: string
}
export type IConversation = {
  _id: string
  latestMessage: {
    text: string
    createdAt: string
    ownerId: string
  }
  members: Array<string>
  status?: string
}

export type IMessage = {
  _id: number
  text: string
  roomId: string
  ownerId: string
  isDeleted: boolean
  react: Array<{ ownerId: string; emoji: string }>
  createdAt: string
  status?: {
    readBy: Array<string>
    type: string
  }
}
