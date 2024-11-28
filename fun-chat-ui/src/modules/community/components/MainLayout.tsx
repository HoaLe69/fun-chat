import SidebarLeft from './Sidebar'
import SidebarRightContainer from './SidebarRightContainer'

interface Props {
  children: React.ReactNode
}

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <main className="grid grid-cols-[272px_1fr]">
      <SidebarLeft />
      <div className="main-content-container flex justify-center">
        <div className="w-[1120px] max-w-[calc(100vw-272px)] flex">
          <div className="max-w-[756px] w-full">{children}</div>
          <SidebarRightContainer />
        </div>
      </div>
    </main>
  )
}

export default MainLayout
