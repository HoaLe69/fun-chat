import CommonLayout from 'modules/core/components/CommonLayout'
import SidebarLeft from './Sidebar'
import SidebarRightContainer from './SidebarRightContainer'

interface Props {
  children: React.ReactNode
  typeOfSidebarRight?: string
}

const MainLayout: React.FC<Props> = ({ children, typeOfSidebarRight }) => {
  return (
    <CommonLayout>
      <SidebarLeft />
      <div className="main-content-container flex justify-center h-screen overflow-auto bg-zinc-50 dark:bg-zinc-800 text-gray-950 dark:text-gray-50">
        <div className="w-[1120px] max-w-[calc(100vw-272px)] px-3 py-2">
          <div className="w-full flex">
            <div className="max-w-[756px] w-full">{children}</div>
            <SidebarRightContainer typeOfContent={typeOfSidebarRight} />
          </div>
        </div>
      </div>
    </CommonLayout>
  )
}

export const LayoutWithMasthead = ({ children }: { children: React.ReactNode }) => {
  return (
    <CommonLayout>
      <SidebarLeft />
      <div className="main-content-container flex justify-center h-screen overflow-auto bg-zinc-50 dark:bg-zinc-800 text-gray-950 dark:text-gray-50">
        <div className="w-[1120px] max-w-[calc(100vw-272px)] px-3">{children}</div>
      </div>
    </CommonLayout>
  )
}

export default MainLayout
