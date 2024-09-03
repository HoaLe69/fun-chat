import ReactLoading from 'react-loading'

const LoadingIndicator = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black/10">
      <ReactLoading type="spin" color="#ffffff" height="3%" width="3%" />
    </div>
  )
}

export default LoadingIndicator
