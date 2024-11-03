export type IUser = {
  _id: string
  email: string
  picture: string
  display_name: string
}
export type IConversation = {
  _id: string
  latestMessage: IMessage
  members: Array<string>
  status?: string
}
export type IMessageContentImage = {
  url: string
  altText: string
}
export type IMessageContentFile = {
  path: string
  fileName: string
  fileType: string
  size: number
}
export type IMessageContent = {
  text: string
  images: IMessageContentImage[]
  files: IMessageContentFile[]
  link: {
    url: string
    title: string
    description: string
    thumbnail: string
  }
}

export type IMessageReact = {
  ownerId: string
  emoji: string
}

export type IMessage = {
  _id: string
  content: IMessageContent
  roomId: string
  ownerId: string
  isDeleted: boolean
  react: Array<{ ownerId: string; emoji: string }>
  createdAt: string
  replyTo: IMessage | null
  replyBy: Array
  status?: {
    readBy: Array<string>
    type: string
  }
}

export type IFileUpload = {
  preview: {
    name: string
    size: number
    path: string
    type: string
  }
  original: File
}
