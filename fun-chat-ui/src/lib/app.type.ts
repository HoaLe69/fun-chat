export type MenuItemType = {
  tag?: string
  name?: string
  icon?: JSX.Element
  right?: JSX.Element
}
export type UserType = {
  _id: string
  email: string
  picture: string
  display_name: string
}
export type RoomChatType = {
  _id: string
  latestMessage: {
    text: string
    createdAt: string
  }
  members?: Array<string>
  status?: string
}

export type MessageType = {
  _id?: string
  ownerId: string
  text: string
  roomId: string
  createdAt: string
  isDeleted?: boolean
  react: Array<{ ownerId: string; emoji: string }>
}
