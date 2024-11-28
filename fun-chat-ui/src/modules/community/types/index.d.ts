export type Post = {
  id: string
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
