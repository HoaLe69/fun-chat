import PostContainer from 'modules/community/components/PostContainer'
import MainLayout from 'modules/community/components/Layout'
import { PlusRawIcon } from 'modules/core/components/icons'
import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'

const CommunityPage = () => {
  const navigate = useNavigate()

  const handleNavigate = useCallback(() => {
    navigate('/community/create/post')
  }, [])
  return (
    <MainLayout typeOfSidebarRight="recent">
      <div className='flex justify-end pr-8'>
        <button onClick={handleNavigate} className='p-2 rounded-full text-sm font-medium flex items-center gap-2 bg-zinc-200 dark:bg-zinc-700 hover:opacity-90'><PlusRawIcon className='w-4 h-4' />Create Post</button>
      </div>
      <PostContainer />
    </MainLayout>
  )
}

export default CommunityPage
