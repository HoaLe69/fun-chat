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

export enum StatusOfReplyMessage {
  REMOVE,
  ACTIVE,
}

export type IMessage = {
  _id: string
  text: string
  roomId: string
  ownerId: string
  isDeleted: boolean
  react: Array<{ ownerId: string; emoji: string }>
  createdAt: string
  replyTo: string | null
  replyBy: Array
  statusOfReplyMessage: StatusOfReplyMessage
  status?: {
    readBy: Array<string>
    type: string
  }
}
