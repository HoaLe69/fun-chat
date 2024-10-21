import { MessageType } from 'lib/app.type'
import moment from 'moment'

type MessageReactType = {
  emoji: string
  ownerId: string
}

export const groupMessagesByTime = (messages: Array<MessageType>) => {
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

export const groupReactionByEmoji = (reacts: Array<MessageReactType>) => {
  if (!reacts.length) return []
  const reactCollections: Record<
    string,
    {
      ownerIds: Array<string>
      amount: number
    }
  > = {}
  for (const react of reacts) {
    if (reactCollections[react.emoji] !== undefined) {
      if (!reactCollections[react.emoji].ownerIds.includes(react.ownerId))
        reactCollections[react.emoji].ownerIds.push(react.ownerId)
      reactCollections[react.emoji].amount =
        reactCollections[react.emoji].amount + 1
    } else {
      reactCollections[react.emoji] = {
        ownerIds: [react.ownerId],
        amount: 1,
      }
    }
  }
  return Object.keys(reactCollections).map(key => ({
    emoji: key,
    ownerIds: reactCollections[key].ownerIds,
    amount: reactCollections[key].amount,
  }))
}

export const groupEmojiByUserId = (reacts: Array<MessageReactType>) => {
  if (!reacts.length) return []
  const cols: Record<
    string,
    {
      emojis: Array<string>
      amount: number
    }
  > = {}

  for (const react of reacts) {
    if (cols[react.ownerId] !== undefined) {
      if (!cols[react.ownerId].emojis.includes(react.emoji)) {
        cols[react.ownerId] = {
          emojis: [...cols[react.ownerId].emojis, react.emoji],
          amount: cols[react.ownerId].amount + 1,
        }
      } else {
        cols[react.ownerId] = {
          emojis: [...cols[react.ownerId].emojis],
          amount: cols[react.ownerId].amount + 1,
        }
      }
    } else {
      cols[react.ownerId] = {
        emojis: [react.emoji],
        amount: 1,
      }
    }
  }
  return Object.keys(cols).map(key => ({
    ownerId: key,
    emojis: cols[key].emojis,
    amount: cols[key].amount,
  }))
}
