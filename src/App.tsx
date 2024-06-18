import { GoogleOAuthProvider } from '@react-oauth/google'
import Login from './pages/login'
import Main from './pages/main'
import { Routes, Route } from 'react-router-dom'
import { GOOGLE_CLIEN_ID } from './const'

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIEN_ID}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Main />} />
      </Routes>
    </GoogleOAuthProvider>
  )
}

export default App
