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
export type ChannelType = {
  _id: string
  picture: string
  channel_name: string
  latest_message: string
  time?: string
  members?: Array<string>
}

export type MessageType = {
  _id?: string
  userId: string
  content: string
  createdAt: string
}
