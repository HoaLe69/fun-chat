import { GoogleOAuthProvider } from '@react-oauth/google'
import Login from 'pages/login'
import Main from 'pages/main'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { GOOGLE_CLIEN_ID } from 'const'
import { ProtectedRoute } from 'utils/routeUtil'
import { Provider } from 'react-redux'
import { store } from 'redux/store'

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
      <BrowserRouter>
        <Provider store={store}>
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
        </Provider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App
