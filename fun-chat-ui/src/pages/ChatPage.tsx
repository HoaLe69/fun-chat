import { MessageContainer } from 'modules/chat'
import ChatList from 'modules/chat/components/ChatList'
import { socket, useAppSelector, useAppDispatch } from 'modules/core/hooks'
import { authSelector } from 'modules/auth/states/authSlice'
import { useEffect } from 'react'
import { updateLatestMessage } from 'modules/chat/states/roomSlice'

const ChatPage = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const userLogin = useAppSelector(authSelector.selectUser)

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
      <ChatList />
      <MessageContainer />
    </main>
  )
}
export default ChatPage
