import { MessageType } from 'lib/app.type'
import moment from 'moment'

type MessageReactType = {
  emoji: string
  ownerId: string
}

export const groupMessages = (messages: Array<MessageType>) => {
  const timeLines: Record<string, boolean> = {}
  const result: Array<MessageType | any> = []

  for (const message of messages) {
    const timeLine = moment(message.createdAt).format('DD/MM/YYYY')
    if (timeLines[timeLine] === undefined) {
      result.push({ timeLine })
    }
    result.push(message)
    timeLines[timeLine] = true
  }
  return result
}

export const reactsMessageStack = (reacts: Array<MessageReactType>) => {
  if (!reacts.length) return []
  const reactCollections: Record<string, Array<string>> = {}
  for (const react of reacts) {
    if (reactCollections[react.emoji] !== undefined) {
      if (reactCollections[react.emoji].includes(react.ownerId)) continue
      reactCollections[react.emoji].push(react.ownerId)
    } else {
      reactCollections[react.emoji] = [react.ownerId]
    }
  }
  return Object.keys(reactCollections).map(key => ({
    emoji: key,
    ownerIds: reactCollections[key],
  }))
}
