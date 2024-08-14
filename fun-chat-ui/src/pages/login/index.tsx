import s from './login.module.css'
import { LockIcon, PersonIcon } from '../../components/icons'
import { GoogleLogin } from '@react-oauth/google'
import React, { useEffect, useState } from 'react'
import { apiClient } from '../../api/apiClient'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../hooks'
import { userSelector } from '../../redux/user.store'

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const navigate = useNavigate()
  const authenticated = useAppSelector(userSelector.selectAuthenticated)

  // TODO: combine code handleGoogleLogin and handleEmailLogin
  const handleGoolgeLogin = async (token: string) => {
    try {
      if (!token) return
      await apiClient.post('/users/login', {
        id_token: token,
      })
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }
  const handleLoginEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (!email || !password) return
      await apiClient.post('/users/login', { type: 'email', email, password })
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    if (authenticated) {
      navigate('/')
    }
  }, [])
  return (
    <div className="h-screen w-screen">
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <form className="text-center" onSubmit={handleLoginEmail}>
            <h1 className="text-3xl font-bold">
              <strong className="text-blue-500">FUN</strong>
              CHAT
            </h1>
            <p className="text-grey-800 mb-6">
              Connect people around the world
            </p>
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
          <div>
            <div className="my-6 flex items-center gap-2">
              <span className="w-28 h-[1px] bg-grey-200 inline-block" />
              <span className=" inline-block">
                <strong>Login</strong> with other{' '}
              </span>
              <span className="w-28 h-[1px] bg-grey-200 inline-block" />
            </div>
            <GoogleLogin
              onSuccess={credentialResponse =>
                handleGoolgeLogin(credentialResponse.credential ?? '')
              }
              logo_alignment="center"
              text="signin_with"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
