import { ReactNode, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'modules/core/hooks'
import { verifyUserAsync } from '../states/authAction'
import { authSelector } from '../states/authSlice'

const ProtectRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useAppSelector(authSelector.selectIsAuthenticate)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(verifyUserAsync())
  }, [])
  if (isAuthenticated === null) return null
  if (isAuthenticated === false) {
    return <Navigate to="/login" replace={true} />
  }

  return children
}

export default ProtectRoute
