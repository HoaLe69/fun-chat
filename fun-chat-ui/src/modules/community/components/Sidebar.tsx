import classNames from 'classnames'
import { PlusCircleIcon } from 'modules/core/components/icons'
import communities from '../mock/community.json'
import { useState, useCallback } from 'react'
import CreateCommunityModal from './CreateCommunityModal'

const Sidebar = () => {
  const tags = [
    'Hooks',
    'State Management',
    'Context API',
    'React Router',
    'Redux',
    'Next.js',
    'React Testing',
    'Performance Optimization',
    'Animations',
    'TypeScript',
  ]
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleCloseCreateCommunityModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleOpenCreateCommunityModal = useCallback(() => {
    setIsOpen(true)
  }, [])

  return (
    <aside className="px-2">
      <div className="border-b py-3 border-zinc-200">
        <h2 className="text-sm uppercase mb-2 tracking-wider text-zinc-400">Categories</h2>
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <span
              className={classNames('p-2 text-sm rounded-3xl border border-zinc-200 cursor-pointer hover:bg-zinc-200')}
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="py-3">
        <h2 className="text-sm uppercase mb-2 tracking-wider text-zinc-400">Communites</h2>
        <div>
          <button
            onClick={handleOpenCreateCommunityModal}
            className="text-sm flex items-center gap-2 p-2 cursor-pointer hover:bg-zinc-100 w-full rounded-xl"
          >
            <PlusCircleIcon />
            Create a community
          </button>
        </div>
        <ul>
          {communities.map((community) => (
            <li key={community.id} className="flex items-center p-2 cursor-pointer hover:bg-zinc-100 rounded-xl">
              <img src={community.picture} alt={community.name} className="w-8 h-8 rounded-full" />
              <span className="ml-2 text-sm">{community.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <CreateCommunityModal isOpen={isOpen} onClose={handleCloseCreateCommunityModal} />
    </aside>
  )
}

export default Sidebar
