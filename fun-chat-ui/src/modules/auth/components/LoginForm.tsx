import { useState } from 'react'
import s from './login.module.css'
import { useNavigate } from 'react-router-dom'
import { PersonIcon, LockIcon } from 'modules/core/components/icons'
import { authServices } from 'modules/auth/services/authServices'

const LoginForm = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const navigate = useNavigate()

  const handleLoginEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (!email || !password) return
      await authServices.login({ type: 'email', email, password })
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form className="text-center" onSubmit={handleLoginEmail}>
      <h1 className="text-3xl font-bold">
        <strong className="text-blue-500">FUN</strong>
        CHAT
      </h1>
      <p className="text-grey-800 mb-6">Connect people around the world</p>
      <div className={s.form_input_group}>
        <span className="text-[#1c1c1c]">
          <PersonIcon />
        </span>
        <input
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          className={s.input}
        />
      </div>
      <div className={s.form_input_group}>
        <span>
          <LockIcon />
        </span>
        <input
          type="password"
          name="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter your password"
          className={s.input}
        />
      </div>
      <button className="px-7 py-4 rounded-2xl bg-gradient-to-r  from-[#9181f4] to-[#5038ed] text-grey-50 font-bold">
        Login now
      </button>
    </form>
  )
}

export default LoginForm
