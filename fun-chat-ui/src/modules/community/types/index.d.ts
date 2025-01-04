import type { IUser } from 'modules/user/types'
export type IPost = {
  _id: string
  community: string
  title: string
  creator: string
  content: string //TODO: adjust type
  comments: number
  upvoted: string[]
  downvoted: string[]
  tags: string[]
  createdAt: string
  isEdited: boolean
  updatedAt: string
  isVerify: boolean
}

export type INotification = {
  _id: string
  recipient: string
  sender: string
  type: string
  metadata: {
    resource_url: string
    message: string
    picture_url: string
  }
  isRead: booleand
  createdAt: string
  updatedAt: string
}
export type IComment = {
  _id: string
  postId: string
  ownerId: string
  content: string
  createdAt: string
  replyTo: string | null
  updatedAt: string
  upvoted: String[]
  downvoted: String[]
  status: { accepted: boolean; acceptedDate: string }
}

export type ICommentCustom = IComment & {
  replies: ICommentCustom[]
  depth: number
}

export type IPostCustom = IPost & {
  creator?: IUser
  community?: ICommunity
}

type ICommunity = {
  _id: string // Required, unique
  name: string // Required, unique
  description: string // Required
  picture?: string // Optional, defaults to null
  banner?: string // Optional, defaults to null
  members: string[] // Optional, defaults to []
  tags: string[] // Optional, defaults to []
  moderators: string[] // Optional, defaults to []
  createdAt: string
  updatedAt: string
}
