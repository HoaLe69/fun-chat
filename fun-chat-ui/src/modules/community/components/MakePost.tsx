import { ChevronDownIcon } from 'modules/core/components/icons'
import { useCallback } from 'react'
import MdxEditor from './MdxEditor'

const MakePost = () => {
  const handleSelectCommunity = useCallback(() => {
    //todo
  }, [])

  const handleSubmit = useCallback(() => {
    //todo
  }, [])

  return (
    <div className="pt-3 flex-1">
      <span className="text-2xl font-bold text-gray-700 mb-4 block">Create post</span>

      <div className="post-select-community-wrapper mb-4">
        <div className="inline-block">
          <button
            className="flex items-center py-2 px-3 bg-slate-200 hover:bg-slate-300 rounded-full"
            onClick={handleSelectCommunity}
          >
            <span className="font-semibold text-sm mr-2">Select a community</span>
            <ChevronDownIcon />
          </button>
        </div>
      </div>

      <div className="post-form mb-4">
        <div className="post-form-group">
          <label className="block font-semibold">Title</label>
          <span className="text-sm text-slate-700">
            Be specific and imagine you're asking a question to another person
          </span>
          <input
            name="title"
            className="w-full resize-none border border-slate-300 p-3 rounded-full mt-2 outline-none"
            placeholder="Enter your title"
            maxLength={300}
          />
        </div>
      </div>

      <div className="post-tags mb-4">
        <button className="text-sm bg-slate-200 hover:bg-slate-300 font-semibold px-3 py-2 rounded-full">
          Add tags
        </button>
      </div>

      <div className="post-form-editor mb-4">
        <label className="block font-semibold">What are the details of your problem ?</label>
        <span className="text-sm text-slate-700 mb-2 block">
          Introduce the problem and expand on what you put in the title.
        </span>

        <MdxEditor />
      </div>

      <div className="post-form-submition flex justify-end">
        <button
          onClick={handleSubmit}
          className="text-sm font-semibold bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-full"
        >
          Post
        </button>
      </div>
    </div>
  )
}

export default MakePost
