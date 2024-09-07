import { MessageType } from 'lib/app.type'
import moment from 'moment'

type ReactType = {
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

export const reactsMessageStack = (reacts: Array<ReactType>) => {
  if (!reacts.length) return []
  const reactCollections: Record<
    string,
    {
      ownerId: string
      amount: number
    }
  > = {}
  for (const react of reacts) {
    if (reactCollections[react.emoji]) {
      reactCollections[react.emoji] = {
        ownerId: react.ownerId,
        amount: reactCollections[react.emoji].amount + 1,
      }
    } else
      reactCollections[react.emoji] = {
        ownerId: react.ownerId,
        amount: 1,
      }
  }
  return Object.keys(reactCollections).map(key => ({
    ...reactCollections[key],
    emoji: key,
  }))
}
