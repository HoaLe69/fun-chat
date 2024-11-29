export type Post = {
  _id: string
  communityId: string
  title: string
  creatorId: string
  content: string //TODO: adjust type
  comment: number
  upvoted: string[]
  downvoted: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
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
}
