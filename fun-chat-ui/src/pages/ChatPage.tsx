import { ChatArea, ChatList } from 'modules/chat'
import { useSocket, useAppSelector, useAppDispatch } from 'modules/core/hooks'
import { authSelector } from 'modules/auth/states/authSlice'
import { getUsersOnline } from 'modules/user/states/userSlice'
import { useEffect } from 'react'

const ChatPage = (): JSX.Element => {
  const userLogin = useAppSelector(authSelector.selectUser)
  const dispatch = useAppDispatch()

  const { emitEvent, subscribeEvent, unSubcribeEvent } = useSocket()

  useEffect(() => {
    if (userLogin?._id) {
      emitEvent('online', userLogin?._id)
      subscribeEvent('user-online', (msg: any) => {
        dispatch(getUsersOnline(msg))
      })
      subscribeEvent('user-offline', (msg: any) => {
        dispatch(getUsersOnline(msg))
      })
    }
    return () => {
      unSubcribeEvent('user-online')
      unSubcribeEvent('user-offline')
      emitEvent('offline', userLogin?._id)
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
