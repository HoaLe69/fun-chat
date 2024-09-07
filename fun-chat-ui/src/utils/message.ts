import { MessageType } from 'lib/app.type'
import moment from 'moment'

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
