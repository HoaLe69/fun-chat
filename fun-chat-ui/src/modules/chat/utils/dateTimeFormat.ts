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
