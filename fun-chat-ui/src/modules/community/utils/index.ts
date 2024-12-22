import { ICommentCustom } from '../types'

export const restructureCommentArray = (comments: ICommentCustom[]) => {
  if (!comments) return []
  // // deep clone the comments
  const cloneComments: ICommentCustom[] = JSON.parse(JSON.stringify(comments))
  cloneComments.forEach((node) => {
    const map: Record<string, ICommentCustom> = {}

    node.replies.forEach((child) => {
      map[child._id] = { ...child, replies: [] }
    })

    node.replies.forEach((child) => {
      if (child.replyTo && map[child.replyTo]) {
        map[child.replyTo].replies.push(map[child._id])
      }
    })
    // // Assign top-level children to the item
    node.replies = node.replies.filter((child) => child.depth === 0).map((child) => map[child._id])
  })

  return cloneComments
}
