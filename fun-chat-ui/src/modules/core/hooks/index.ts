import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store'

// use through your app instead of plain 'useDispatch' and 'useSelector'
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export { default as useDebounce } from './useDebounce'
export * from './useSocket'
