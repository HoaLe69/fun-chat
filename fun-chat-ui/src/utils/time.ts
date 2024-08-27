export const compareTimeWithNow = (
  specificTime: string,
  distance: number = 2,
): boolean => {
  // compare current with specify time in the past
  const specTime = new Date(specificTime)
  const currentTime = new Date()

  if (specTime.getFullYear() != currentTime.getFullYear()) return false
  if (specTime.getMonth() != currentTime.getMonth()) return false
  if (specTime.getDate() != currentTime.getDate()) return false

  if (currentTime.getHours() - specTime.getHours() > distance) return false
  return true
}
