import { GoogleOAuthProvider } from '@react-oauth/google'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { GOOGLE_CLIEN_ID } from 'const'
import ProtectedRoute from 'modules/auth/components/ProtectRoute'
import { Provider } from 'react-redux'
import { store } from 'modules/core/store'
import { Suspense } from 'react'
import { LoadingSplashScreen } from 'modules/core/components/loadings'
import { LoginPage, ChatPage, LoginLoungePage } from 'pages'

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
          <Suspense fallback={<LoadingSplashScreen />}>
            <Routes>
              <Route
                path="/login/redirect/:method"
                element={<LoginLoungePage />}
              />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <ChatPage />
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
