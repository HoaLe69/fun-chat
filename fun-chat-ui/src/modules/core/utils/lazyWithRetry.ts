import { lazy } from 'react'

export const lazyWithRetry = (componentImport: () => any) => {
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      //@ts-ignore
      window.localStorage.getItem('page-has-been-force-refreshed' || 'false'),
    )
    try {
      const component = await componentImport()

      window.localStorage.setItem('page-has-been-force-refreshed', 'false')
      return component
    } catch (error) {
      console.error(error)
      if (!pageHasAlreadyBeenForceRefreshed) {
        window.localStorage.setItem('page-has-been-force-refreshed', 'true')
        return window.location.reload()
      }
      throw error
    }
  })
}
