import { useGoogleLogin } from '@react-oauth/google'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from 'modules/core/hooks'
import { authSelector } from 'modules/auth/states/authSlice'
import {
  FacebookIcon,
  GoogleIcon,
  DiscordIcon,
  PersonIcon,
} from 'modules/core/components/icons'
import {
  metaAuthorizeURL,
  discordAuthorizeURL,
  googleAuthorizeURL,
} from 'const'
import RegisterForm from './components/RegisterForm'
import LoginForm from './components/LoginForm'

const LoginModule: React.FC = () => {
  const [isRegister, setIsRegister] = useState<boolean>(false)
  const [isLoginWithEmail, setIsLoginWithEmail] = useState<boolean>(false)
  const navigate = useNavigate()
  const authenticated = useAppSelector(authSelector.selectIsAuthenticate)

  useEffect(() => {
    if (authenticated) {
      navigate('/')
    }
  }, [authenticated])

  const handleFacebookLogin = () => {
    window.location.assign(metaAuthorizeURL())
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: tokenResponse => {
      window.location.assign(googleAuthorizeURL(tokenResponse?.access_token))
    },
  })

  const handleDiscordLogin = () => {
    window.location.assign(discordAuthorizeURL())
  }

  const handleLoginWithEmail = () => {
    setIsLoginWithEmail(true)
  }

  return (
    <div className="h-screen w-screen">
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold my-4 tracking-wide">
            <strong className="text-blue-500">Dev</strong>Chatter
          </h1>
          <p className="my-2 text-grey-600 font-medium text-xl tracking-wider">
            Talk code, build great things 👉 together,live
          </p>
          <p className="text-xl font-medium text-gray-700 leading-9 mt-4">
            {isRegister ? 'Sign Up' : 'Sign In'} DevChatter
          </p>
          {isLoginWithEmail ? (
            isRegister ? (
              <RegisterForm />
            ) : (
              <LoginForm />
            )
          ) : (
            <div className="flex flex-col items-center my-4">
              <SocialLogInButton
                onClick={handleLoginWithEmail}
                type="default"
                isRegister={isRegister}
              />
              <SocialLogInButton
                onClick={handleFacebookLogin}
                type="fb"
                isRegister={isRegister}
              />
              <SocialLogInButton
                onClick={handleGoogleLogin}
                type="google"
                isRegister={isRegister}
              />
              <SocialLogInButton
                onClick={handleDiscordLogin}
                type="discord"
                isRegister={isRegister}
              />
              <div className="mt-2" />
            </div>
          )}
          <div className="">
            <p>
              {isRegister
                ? 'You already have an account ! '
                : 'You are not member ! '}
              <a
                href="#"
                className="text-blue-500 font-medium"
                onClick={() => {
                  setIsRegister(!isRegister)
                }}
              >
                {isRegister ? 'Sign in' : 'Sign up'}
              </a>
            </p>
            {isLoginWithEmail && (
              <p>
                {isRegister ? 'Sign in with ' : 'Sign up with '}
                <a
                  href="#"
                  className="text-blue-500 font-medium"
                  onClick={() => {
                    setIsLoginWithEmail(false)
                  }}
                >
                  other
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginModule

const SocialLogInButton = ({
  type,
  isRegister,
  onClick,
}: {
  type: string
  isRegister: boolean
  onClick?: () => void
}) => {
  const buttons: Record<string, any> = {
    fb: {
      logo: <FacebookIcon />,
      title: (isRegister ? 'Sign up' : 'Sign In') + ' with FaceBook',
      theme: 'bg-[#1877F2] ',
      titleColor: 'text-white',
    },
    google: {
      logo: <GoogleIcon />,
      title: (isRegister ? 'Sign up' : 'Sign In') + ' with Google',
      theme: 'bg-[#ffffff]',
      titleColor: 'text-black/60',
    },
    discord: {
      logo: <DiscordIcon />,
      title: (isRegister ? 'Sign up' : 'Sign In') + ' with Discord',
      theme: 'bg-[#5865F2]',
      titleColor: 'text-white',
    },
    default: {
      logo: <PersonIcon />,
      title: (isRegister ? 'Sign up' : 'Sign In') + ' with Email',
      theme: 'none',
      titleColor: 'none',
    },
  }

  const button = buttons[type]
  return (
    <button
      onClick={onClick}
      className={`max-w-80 w-full ${button.theme} shadow-xl hover:opacity-75 hover:brightness-90 transition-all mt-4 flex items-center justify-between font-bold text-[16px] p-4 py-3 rounded-3xl`}
    >
      <span>{button.logo}</span>
      <p className={`${button.titleColor}`}>{button.title}</p>
      <div />
    </button>
  )
}
