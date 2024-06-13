import MessageContainer from '../components/message-container'
import Sidebar from '../components/sidebar'

const Main = (): JSX.Element => {
  // support dark mode
  const theme = (() => {
    if (typeof localStorage !== undefined && localStorage.getItem('theme'))
      return localStorage.getItem('theme')
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
    return 'light'
  })()
  if (theme === 'light') document.documentElement.classList.remove('dark')
  else document.documentElement.classList.add('dark')
  return (
    <main className="flex text-grey-950 dark:text-white">
      <Sidebar />
      <MessageContainer />
    </main>
  )
}
export default Main
