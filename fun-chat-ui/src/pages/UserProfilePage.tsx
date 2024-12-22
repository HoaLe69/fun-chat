import CommonLayout from 'modules/core/components/CommonLayout'
import SidebarLeft from 'modules/community/components/Sidebar'
import UserProfileHeader from 'modules/user/components/UserProfileHeader'
import PostContainer from 'modules/community/components/PostContainer'
const UserProfilePage = () => {
  return (
    <CommonLayout>
      <SidebarLeft />
      <div className="main-content-container flex justify-center h-screen overflow-auto bg-zinc-50 dark:bg-zinc-800 text-gray-950 dark:text-gray-50">
        <div className="w-[1120px] max-w-[calc(100vw-272px)] px-3 py-2">
          <div className="w-full flex">
            <div className="max-w-[756px] w-full">
              <UserProfileHeader />
              <PostContainer />
            </div>
            <div />
          </div>
        </div>
      </div>
    </CommonLayout>
  )
}

export default UserProfilePage
