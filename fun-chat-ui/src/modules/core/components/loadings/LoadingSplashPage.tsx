import ReactLoading from 'react-loading'

const LoadingSplashPage = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-5xl font-bold flex-1">
          <strong className="text-blue-500">FUN</strong>
          CHAT
        </h1>
        <ReactLoading type="spinningBubbles" color="#005fff" height="20%" width="20%" />
      </div>
    </div>
  )
}

export default LoadingSplashPage
