import moment from 'moment'

export const minimalTime = (time: string) => {
  if (!time) return
  return time.replace('ago', '').replace('minutes', 'mins').replace('seconds', 'sec')
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

export const isTimeDiffInMins = (currTime: string, compareTime: string) => {
  const current = moment(currTime)
  const compare = moment(compareTime)

  const isSameDay = current.date() === compare.date()
  const isSameMonth = current.month() === compare.month()
  const isSameYear = current.year() === compare.year()
  const isSameHour = current.hour() === compare.hour()
  const diffMin = current.diff(compare, 'minutes')

  return isSameDay && isSameMonth && isSameYear && isSameHour && diffMin < 5
}
