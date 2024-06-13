import { GoogleOAuthProvider } from '@react-oauth/google'
import Login from './pages/login'
import Main from './pages/main'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <GoogleOAuthProvider clientId="asdjlasdjasd">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Main />} />
      </Routes>
    </GoogleOAuthProvider>
  )
}

export default App
