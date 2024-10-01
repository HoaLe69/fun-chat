import ReactLoading from 'react-loading'
import { useNavigate, useParams } from 'react-router-dom'

import { useEffect, useState } from 'react'
import { extractDataFormURL } from 'modules/auth/utils'
import { authServices } from 'modules/auth/services/authServices'

const LoginLoungePage = () => {
  const { method } = useParams()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const code = extractDataFormURL('code')
    const authenticate = async () => {
      try {
        await authServices.loginWithSocial({
          code,
          platform: method,
        })
        navigate('/', { replace: true })
      } catch (error) {
        setErrorMessage('Opp!! Something went wrong')
        console.log(error)
      }
    }
    authenticate()
  }, [])

  return (
    <div className="h-screen w-screen">
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex items-center">
          {errorMessage ? (
            <span className="text-3xl font-semibold ">{errorMessage} 😩.</span>
          ) : (
            <>
              <p className="flex-1 text-xl text-gray-700">
                It take a while ! Let's chill
              </p>
              <ReactLoading
                type="spinningBubbles"
                color="#005fff"
                height="20%"
                width="20%"
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginLoungePage
