import React, { useState, useEffect } from 'react'

const useDebounce = (value: string, delay: number) => {
  const [debounceValue, setDebounceValue] = useState<string>(value)
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebounceValue(value)
    }, delay)
    return () => clearTimeout(timerId)
  }, [value, delay])
  return debounceValue
}

export default useDebounce
