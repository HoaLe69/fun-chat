import CommonLayout from 'modules/core/components/CommonLayout'
import SidebarLeft from 'modules/community/components/Sidebar'
import UserProfileHeader from 'modules/user/components/UserProfileHeader'
import PostContainer from 'modules/community/components/PostContainer'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import useFetchSavedPost from 'modules/user/hooks/useFetchSavedPost'
import PostItem from 'modules/community/components/PostItem'
import { useParams } from 'react-router-dom'
import { useAppSelector } from 'modules/core/hooks'
import { authSelector } from 'modules/auth/states/authSlice'

const UserProfilePage = () => {
  const { userId } = useParams()
  const userLoginId = useAppSelector(authSelector.selectUserId)
  const { savedPosts } = useFetchSavedPost()

  return (
    <CommonLayout>
      <SidebarLeft />
      <div className="main-content-container flex justify-center h-screen overflow-auto bg-zinc-50 dark:bg-zinc-800 text-gray-950 dark:text-gray-50">
        <div className="w-[1120px] max-w-[calc(100vw-272px)] px-3 py-2">
          <div className="w-full flex">
            <div className="max-w-[756px] w-full">
              <UserProfileHeader userId={userId} userLoginId={userLoginId} />
              <TabGroup>
                <TabList className="px-8 gap-2 flex">
                  <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white">
                    Post
                  </Tab>
                  {userLoginId === userId && (
                    <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white">
                      Saved post
                    </Tab>
                  )}
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <PostContainer />
                  </TabPanel>
                  {userLoginId === userId && (
                    <TabPanel className="px-4 mt-4">
                      {savedPosts.map((post) => (
                        <PostItem key={post._id} postInfo={post} />
                      ))}
                    </TabPanel>
                  )}
                </TabPanels>
              </TabGroup>
            </div>
            <div />
          </div>
        </div>
      </div>
    </CommonLayout>
  )
}

export default UserProfilePage
