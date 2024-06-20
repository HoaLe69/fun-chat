import { ReactNode, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { userSelector } from '../redux/user.store'
import { verifyAsync } from '../api/user.api'

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const authenticated = useAppSelector(userSelector.selectAuthenticated)
  const user = useAppSelector(userSelector.selectUser)
  console.log(user)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(verifyAsync())
  }, [])
  if (authenticated === null) return null
  if (authenticated === false) {
    return <Navigate to={'/login'} replace={true} />
  }
  return children
}
