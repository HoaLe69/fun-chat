import { GoogleLogin } from '@react-oauth/google'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from 'modules/core/hooks'
import { authSelector } from 'modules/auth/states/authSlice'
import { verifyUserAsync } from './states/authAction'
import LoginForm from './components/LoginForm'
import { authServices } from './services/authServices'

const LoginModule: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const authenticated = useAppSelector(authSelector.selectIsAuthenticate)

  const handleGoolgeLogin = async (token: string) => {
    try {
      if (!token) return
      await authServices.login({ id_token: token })
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    dispatch(verifyUserAsync())
    if (authenticated) {
      navigate('/')
    }
  }, [authenticated])

  return (
    <div className="h-screen w-screen">
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <LoginForm />
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

export default LoginModule
