import MessageContainer from 'components/chat-overview'
import Sidebar from 'components/sidebar'
import { socket } from 'hooks/useSocket'
import { useAppSelector, useAppDispatch } from 'hooks'
import { userSelector } from 'redux/user.store'
import { useEffect } from 'react'
import { updateLatestMessage } from 'redux/room.store'

const Main = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const userLogin = useAppSelector(userSelector.selectUser)

  useEffect(() => {
    if (userLogin?._id) {
      socket.emit('join', userLogin?._id)
    }
    return () => {
      socket.emit('leave', userLogin?._id)
    }
  }, [])

  useEffect(() => {
    if (userLogin?._id) {
      socket.on('room:getIncomingMessages', msg => {
        dispatch(
          updateLatestMessage({
            roomId: msg.roomId,
            latestMessage: {
              text: msg.text,
              createdAt: msg.createdAt,
            },
          }),
        )
      })
    }
    return () => {
      socket.off('room:getIncomingMessages')
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
