import SidebarLeft from './Sidebar'
import SidebarRightContainer from './SidebarRightContainer'
import CommunityDetailMasthead from './CommunityDetailMasthead'

interface Props {
  children: React.ReactNode
  withMasthead?: boolean
}

const MainLayout: React.FC<Props> = ({ children, withMasthead }) => {
  return (
    <main className="grid grid-cols-[272px_1fr]">
      <SidebarLeft />
      <div className="main-content-container flex justify-center">
        <div className="w-[1120px] max-w-[calc(100vw-272px)] px-3">
          {withMasthead && <CommunityDetailMasthead />}
          <div className="w-full flex">
            <div className="max-w-[756px] w-full">{children}</div>
            <SidebarRightContainer />
          </div>
        </div>
      </div>
    </main>
  )
}

export default MainLayout
