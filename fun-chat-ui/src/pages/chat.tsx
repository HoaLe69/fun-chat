import Sidebar from '../components/sidebar'
import MessageContainer from '../components/chat-overview'

const ChatRoom = () => {
  return (
    <div className="flex text-grey-950 dark:text-white">
      <Sidebar />
      <MessageContainer />
    </div>
  )
}

export default ChatRoom
