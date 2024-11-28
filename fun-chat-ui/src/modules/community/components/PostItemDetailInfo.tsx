import { useAppSelector } from 'modules/core/hooks'
import moment from 'moment'

const PostItemDetailInfo = () => {
  const userLogin = useAppSelector((state) => state.auth.user)

  return (
    <section className="post-item-detail-info">
      <header className="post-item-detail-info-header">
        <div className="flex items-center">
          <img src={userLogin?.picture} alt={userLogin?.display_name} className="w-8 h-8 rounded-full" />
          <div className="flex flex-col ml-2">
            <div>
              <span className="text-xs font-bold">Javascript</span>
              <span className="inline-block my-0 mx-2">•</span>
              <span className="text-xs text-gray-500">{moment(new Date()).fromNow()}</span>
            </div>
            <span className="text-gray-600 text-xs hover:cursor-pointer">{userLogin?.display_name}</span>
          </div>
        </div>
      </header>
      <div className="post-item-detail-info-body">
        <h1 className="text-2xl font-bold mt-2 mb-4">
          Ukrainian media reports 500 N. Korean soldiers killed in Kyiv's missile strike on Kursk
        </h1>
        <div>post content here</div>
      </div>
    </section>
  )
}

export default PostItemDetailInfo
