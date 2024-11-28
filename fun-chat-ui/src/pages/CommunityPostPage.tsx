import MainLayout from 'modules/community/components/MainLayout'
import PostItemDetailInfo from 'modules/community/components/PostItemDetailInfo'
import PostItemDetailComment from 'modules/community/components/PostItemDetailComment'
import { ArrowLeftSmallIcon } from 'modules/core/components/icons'

const CommunityPostPage = () => {
  return (
    <MainLayout>
      <div className="flex items-start pt-4 flex-1">
        <button className="w-8 h-8 flex items-center justify-center text-base bg-zinc-200 rounded-full">
          <ArrowLeftSmallIcon />
        </button>
        <div className="flex-1 px-4">
          <PostItemDetailInfo />
          <PostItemDetailComment />
        </div>
      </div>
    </MainLayout>
  )
}

export default CommunityPostPage
