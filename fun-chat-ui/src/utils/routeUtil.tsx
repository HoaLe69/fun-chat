import { ReactNode, lazy, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'hooks'
import { userSelector } from 'redux/user.store'
import { verifyAsync } from 'api/user.api'

export const lazyWithRetry = (componentImport: () => any) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      //@ts-ignore
      window.localStorage.getItem('page-has-been-force-refreshed' || 'false'),
    )
    try {
      // await new Promise(resolve => setTimeout(resolve, 3000))
      const component = await componentImport()
      window.localStorage.setItem('page-has-been-force-refreshed', 'false')
      return component
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        window.localStorage.setItem('page-has-been-force-refreshed', 'true')
        return window.location.reload()
      }
      throw error
    }
  })

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const authenticated = useAppSelector(userSelector.selectAuthenticated)
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
