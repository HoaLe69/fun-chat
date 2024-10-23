import { current } from '@reduxjs/toolkit'
import moment from 'moment'

export const minimalTime = (time: string) => {
  if (!time) return
  return time
    .replace('ago', '')
    .replace('minutes', 'mins')
    .replace('seconds', 'sec')
}

export const timeToSeconds = (input?: string | null) => {
  if (!input) return
  return moment(input).unix()
}
export const isCurrentDay = (input: string): boolean => {
  if (!input) return false
  const dateToCheck = new Date(input)
  const currentDate = new Date()

  return (
    dateToCheck.getFullYear() === currentDate.getFullYear() &&
    dateToCheck.getMonth() === currentDate.getMonth() &&
    dateToCheck.getDate() === currentDate.getDate()
  )
}
export const msgTimeDividerHandler = (currMsgTime: string) => {
  if (isCurrentDay(currMsgTime)) {
    return 'Today'
  }
  return moment(currMsgTime).format('LL')
}
