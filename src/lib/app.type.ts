export type MenuItemType = {
  tag: string
  name: string
  avatar_path?: string
  icon?: JSX.Element
  right?: JSX.Element
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
