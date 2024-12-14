import PostContainer from 'modules/community/components/PostContainer'
import MainLayout from 'modules/community/components/Layout'

const CommunityPage = () => {
  return (
    <MainLayout typeOfSidebarRight="recent">
      <PostContainer />
    </MainLayout>
  )
}

export default CommunityPage
