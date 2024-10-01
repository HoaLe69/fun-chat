import { useEffect, useState } from 'react'
import ReactLoading from 'react-loading'
import { authServices } from '../services/authServices'
import classNames from 'classnames'
import { CredentialInformationType } from './RegisterForm'

type Props = {
  email: string
  disabled: boolean
  inputValue: string
  setCredentialInformation: React.Dispatch<
    React.SetStateAction<CredentialInformationType>
  >
}

const EXPIRY_TIME_OTP = 60

const OTPForm: React.FC<Props> = ({
  email,
  disabled,
  inputValue,
  setCredentialInformation,
}) => {
  const [sendOTPStatus, setSendOTPStatus] = useState<
    'idle' | 'inprogress' | 'success' | 'failure'
  >('idle')
  const [countdown, setCountdown] = useState<number>(EXPIRY_TIME_OTP)
  useEffect(() => {
    if (countdown === 0 || sendOTPStatus !== 'success') return
    const intervalId = setInterval(() => {
      setCountdown(pre => pre - 1)
    }, 1000)
    return () => {
      clearInterval(intervalId)
    }
  }, [email, countdown, sendOTPStatus])

  const handleFetchOTP = async () => {
    setSendOTPStatus('inprogress')
    try {
      //      await new Promise(resolve => setTimeout(resolve, 3000))
      const response = await authServices.getOTP(email)
      setCredentialInformation(pre => ({ ...pre, token: response.token }))
      setCountdown(EXPIRY_TIME_OTP)
      setSendOTPStatus('success')
    } catch (error) {
      console.log(error)
      setSendOTPStatus('failure')
    }
  }

  const renderTextContentButtonSend = () => {
    switch (sendOTPStatus) {
      case 'inprogress':
        return (
          <span className="w-full flex item-center justify-center">
            <ReactLoading type="spinningBubbles" width="20px" height="20px" />
          </span>
        )
      case 'idle':
        return 'Send OTP'
      case 'success':
        return countdown === 0 ? 'Resend OTP' : countdown + 's'
      case 'failure':
        return 'ReSend OTP'
    }
  }
  return (
    <div className="my-4 rounded-3xl shadow-md border focus-within:border-blue-400">
      <div className="flex items-center justify-between h-[50px]">
        <input
          value={inputValue}
          disabled={disabled}
          className="focus:outline-none px-4 h-full rounded-3xl"
          type="number"
          name="opt"
          maxLength={6}
          id="otp"
          placeholder="Enter 6-digit OTP"
          onChange={e =>
            setCredentialInformation(pre => ({ ...pre, otp: e.target.value }))
          }
        />
        <button
          type="button"
          disabled={disabled || (countdown < EXPIRY_TIME_OTP && countdown > 0)}
          className={classNames(
            'rounded-3xl h-full w-24 text-center text-sm text-white font-semibold',
            disabled || (countdown < EXPIRY_TIME_OTP && countdown > 0)
              ? 'bg-gray-400'
              : 'bg-gradient-to-r from-cyan-500 to-blue-500',
          )}
          onClick={handleFetchOTP}
        >
          {renderTextContentButtonSend()}
        </button>
      </div>
    </div>
  )
}

export default OTPForm
