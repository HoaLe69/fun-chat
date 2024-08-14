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
  latest_message: string
  members?: Array<string>
  status?: string
}

export type MessageType = {
  _id?: string
  userId: string
  content: string
  createdAt: string
}
