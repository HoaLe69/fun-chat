import { Sidebar } from 'modules/chat'
import CommonLayout from 'modules/core/components/CommonLayout'
import FriendArea from 'modules/chat/components/FriendArea'
import { ChatArea } from 'modules/chat'
import { useLocation } from 'react-router-dom'
const ChatMePage = () => {
  const { pathname } = useLocation()

  return (
    <CommonLayout>
      <Sidebar />
      {pathname === '/devchat/@me' ? <FriendArea /> : <ChatArea />}
    </CommonLayout>
  )
}

export default ChatMePage
