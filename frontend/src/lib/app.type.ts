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
  avatar_path: string
  name: string
  latest_message: string
  time: string
}

export type MessageType = {
  id: number
  userId: string
  avatar_path: string
  name: string
  message: string
  timestamp: string
}
