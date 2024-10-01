import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authServices } from '../services/authServices'
import { Input } from 'modules/core/components/form'
import ReactLoading from 'react-loading'
import classNames from 'classnames'
import OTPForm from './OTPForm'

type RegisterFormType = {
  email: string
  displayName: string
  password: string
}

export type CredentialInformationType = {
  token: string
  otp: string
}
const RegisterForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<RegisterFormType>({
    email: '',
    displayName: '',
    password: '',
  })
  const [credentialInformation, setCredentialInformation] =
    useState<CredentialInformationType>({
      token: '',
      otp: '',
    })
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [isFormValid, setIsFormValid] = useState<boolean>(false)
  const [isValidEmail, setIsValidEmail] = useState<boolean>(false)

  const handleRegisterWithEmail = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    const { email, password, displayName } = formData
    const { token, otp } = credentialInformation
    setIsProcessing(true)
    try {
      await authServices.registerWithEmail({
        email: email.trim(),
        password,
        display_name: displayName.trim(),
        token,
        otp,
      })
      setIsProcessing(false)
      navigate('/', { replace: true })
    } catch (error: any) {
      console.log({ error })
      const message = error?.response?.data?.message || 'Something went wrong1'
      setErrors(pre => ({ ...pre, apiErrorMessage: message }))
    }
    setIsProcessing(false)
  }

  //@ts-ignore // check email is valid
  const handleInputBlur = async (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    try {
      const isValidEmail = validateField(name, value)
      if (isValidEmail) return
      await authServices.checkEmailAbleToUse(value)
      setIsValidEmail(true)
    } catch (error: any) {
      setIsValidEmail(false)
      const message = error?.response.data.message
      setErrors(pre => ({ ...pre, [name]: message }))
    }
  }
  const validateField = (name: string, value: string): string => {
    if (!value.trim()) return 'Required field'
    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return !emailRegex.test(value) ? 'Invalid email format' : ''
      case 'password':
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{6,}$/
        return !passwordRegex.test(value.trim())
          ? 'Password must have at least one lowercase letter, one uppercase letter, one number, and no spaces'
          : ''
      case 'displayName':
        const nameRegex = /^\w+(\s\w+)+$/
        return !nameRegex.test(value.trim())
          ? 'Please enter a valid name consisting of at least two words separated by a space'
          : ''
      default:
        return ''
    }
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(pre => ({ ...pre, [name]: value }))

    //validate the field on change on register form
    const error = validateField(name, value)
    setErrors(pre => ({ ...pre, [name]: error }))
  }

  useEffect(() => {
    const isAllFieldFill = Object.values(formData).every(value => value !== '')
    const isErrors = Object.keys(errors).every(
      key => errors[key] === '' || key === 'apiErrorMessage',
    )
    setIsFormValid(isAllFieldFill && isErrors)
  }, [formData, errors])

  const allowSubmitRegisterForm = () => {
    if (!isFormValid) return true
    if (!credentialInformation?.otp) return true
    return false
  }

  return (
    <div className="flex items-center justify-center">
      <form className="max-w-80 flex-1 " onSubmit={handleRegisterWithEmail}>
        <Input
          type="text"
          placeholder="Enter your name"
          name="displayName"
          label="How everyone can call you ?"
          errorMessage={errors?.displayName}
          value={formData.displayName}
          onChange={e => handleInputChange(e)}
        />
        <Input
          type="email"
          placeholder="Enter your email"
          name="email"
          errorMessage={errors?.email}
          label="Email"
          value={formData.email}
          onBlur={e => handleInputBlur(e)}
          onChange={e => handleInputChange(e)}
        />
        <Input
          type="password"
          errorMessage={errors?.password}
          placeholder="Enter your password"
          name="password"
          value={formData.password}
          onChange={e => handleInputChange(e)}
        />
        <OTPForm
          email={formData.email}
          inputValue={credentialInformation.otp}
          setCredentialInformation={setCredentialInformation}
          disabled={!isValidEmail || !isFormValid}
        />
        <div className="flex items-center my-2">
          {errors?.apiErrorMessage && (
            <p className="text-left text-red-500 text-sm font-semibold">
              {errors.apiErrorMessage}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={allowSubmitRegisterForm()}
          className={classNames(
            'py-3 px-2 h-12  bg-blue-500 text-grey-50 font-bold w-full rounded-full my-4 flex justify-center items-center',
            { 'opacity-75': allowSubmitRegisterForm() },
          )}
        >
          {isProcessing ? (
            <ReactLoading type="spinningBubbles" width="20px" height="20px" />
          ) : (
            'Sign up now'
          )}
        </button>
      </form>
    </div>
  )
}

export default RegisterForm
