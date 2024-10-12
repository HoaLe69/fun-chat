import { ChatArea, ChatList } from 'modules/chat'
import { useSocket, useAppSelector } from 'modules/core/hooks'
import { authSelector } from 'modules/auth/states/authSlice'
import { useEffect } from 'react'

const ChatPage = (): JSX.Element => {
  const userLogin = useAppSelector(authSelector.selectUser)
  const { emitEvent } = useSocket()

  useEffect(() => {
    if (userLogin?._id) {
      emitEvent('join', userLogin?._id)
    }
    return () => {
      emitEvent('leave', userLogin?._id)
    }
  }, [userLogin])

  return (
    <main className="flex text-grey-950 dark:text-white h-screen">
      <ChatList />
      <ChatArea />
    </main>
  )
}
export default ChatPage
