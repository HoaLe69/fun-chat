import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authServices } from 'modules/auth/services/authServices'
import { Input } from 'modules/core/components/form'
import ReactLoading from 'react-loading'
import classNames from 'classnames'

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState<Record<string, string | undefined>>({})

  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const navigate = useNavigate()

  const login = async () => {
    const { email, password } = formData
    setIsProcessing(true)
    try {
      await authServices.login({ email, password })
      setIsProcessing(false)
      navigate('/')
    } catch (error: any) {
      const message = error?.response.data.message || 'Something went wrong.'
      console.log({ error })
      setError(pre => ({ ...pre, apiErrorMessage: message }))
      setIsProcessing(false)
    }
  }

  const handleLoginWithEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isEnableToSubmitForm) return
    login()
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(pre => ({ ...pre, [name]: value }))
  }

  const isEnableToSubmitForm = useMemo(() => {
    return formData.email !== '' && formData.password !== ''
  }, [formData])

  return (
    <div className="flex items-center justify-center">
      <form className="max-w-80 flex-1 " onSubmit={handleLoginWithEmail}>
        <Input
          type="email"
          placeholder="Enter your email"
          name="email"
          label="Email"
          value={formData.email}
          onChange={e => handleInputChange(e)}
        />
        <Input
          type="password"
          placeholder="Enter your password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={e => handleInputChange(e)}
        />
        <div className="flex items-center my-2">
          {error.apiErrorMessage && (
            <p className="text-left text-red-500 text-sm font-semibold">
              {error.apiErrorMessage}
            </p>
          )}
        </div>
        <button
          disabled={!isEnableToSubmitForm}
          className={classNames(
            'py-3 px-2 h-12  bg-blue-500 text-grey-50 font-bold w-full rounded-full my-4 flex justify-center items-center',
            { 'opacity-75': !isEnableToSubmitForm },
          )}
        >
          {isProcessing ? (
            <ReactLoading type="spinningBubbles" width="20px" height="20px" />
          ) : (
            'Sign in now'
          )}
        </button>
      </form>
    </div>
  )
}

export default LoginForm
