import MessageContainer from '../components/chat-overview'
import Sidebar from '../components/sidebar'

const Main = (): JSX.Element => {
  return (
    <main className="flex text-grey-950 dark:text-white">
      <Sidebar />
      <MessageContainer />
    </main>
  )
}
export default Main
