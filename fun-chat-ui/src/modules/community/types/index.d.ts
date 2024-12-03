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
  updatedAt: string
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
  members?: string[] // Optional, defaults to []
  tags?: string[] // Optional, defaults to []
  moderators?: string[] // Optional, defaults to []
  createdAt: string
  updatedAt: string
}
