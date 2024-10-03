export const extractDataFormURL = (key: string): string => {
  const searchParams = window.location.search

  const urlParams = new URLSearchParams(searchParams)

  return urlParams.get(key) || ''
}
