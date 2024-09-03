import { GoogleOAuthProvider } from '@react-oauth/google'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { GOOGLE_CLIEN_ID } from 'const'
import { ProtectedRoute, lazyWithRetry } from 'utils/routeUtil'
import { Provider } from 'react-redux'
import { store } from 'redux/store'
import { Suspense } from 'react'
import LoadingIndicator from 'components/loading'

const Login = lazyWithRetry(() => import('./pages/login'))
const Main = lazyWithRetry(() => import('./pages/main'))

function App() {
  //  TODO: move logic code to another file
  const theme = (() => {
    if (typeof localStorage !== undefined && localStorage.getItem('theme'))
      return localStorage.getItem('theme')
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
    return 'light'
  })()

  if (theme === 'light') document.documentElement.classList.remove('dark')
  else document.documentElement.classList.add('dark')

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIEN_ID}>
      <Provider store={store}>
        <BrowserRouter>
          <Suspense fallback={<LoadingIndicator />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Main />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  )
}

export default App
