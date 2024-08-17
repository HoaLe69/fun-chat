import MessageContainer from 'components/chat-overview'
import Sidebar from 'components/sidebar'
import { socket } from 'hooks/useSocket'
import { useAppSelector } from 'hooks'
import { userSelector } from 'redux/user.store'
import { useEffect } from 'react'

const Main = (): JSX.Element => {
  const userLogin = useAppSelector(userSelector.selectUser)

  useEffect(() => {
    if (userLogin?._id) {
      socket.emit('join', userLogin?._id)
    }
    return () => {
      console.log('user leave them room')
      socket.emit('leave', userLogin?._id)
    }
  }, [])

  return (
    <main className="flex text-grey-950 dark:text-white">
      <Sidebar />
      <MessageContainer />
    </main>
  )
}
export default Main
