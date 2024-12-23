import { useCallback, useState } from 'react'
import { useSocket } from 'modules/core/hooks'
import MdxEditor from './MdxEditor'
import SelectCommunity from './SelectCommunity'
import { ICommunity } from '../types'
import { useAppSelector } from 'modules/core/hooks'
import { postServices, notifyServices } from '../services'
import { useNavigate } from 'react-router-dom'
import { SOCKET_EVENTS } from 'const'

const MakePost = () => {
  const { emitEvent } = useSocket()
  const userLogin = useAppSelector((state) => state.auth.user)
  const navigate = useNavigate()
  const [creating, setCreating] = useState<boolean>(false)
  const [postForm, setPostForm] = useState({
    title: '',
    description: '',
  })
  const [selectedCommunity, setSelectedCommunity] = useState<ICommunity | null>(null)

  const handleSelectCommunity = useCallback((community: ICommunity) => {
    setSelectedCommunity(community)
  }, [])

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setPostForm((prev) => ({ ...prev, [name]: value }))
  }, [])
  const handleEditorChange = useCallback(
    (value: string) => {
      setPostForm((prev) => ({ ...prev, description: value }))
    },
    [postForm],
  )

  const handleSubmit = useCallback(async () => {
    if (!userLogin?._id || !selectedCommunity?._id) return
    setCreating(true)
    try {
      const formData = {
        title: postForm.title,
        content: postForm.description,
        community: selectedCommunity?._id,
        creator: userLogin?._id,
      }

      const post = await postServices.createPost(formData)
      const notifyData = await notifyServices.createNotify({
        type: 'new_post',
        sender: userLogin?._id,
        friends: userLogin?.friends,
        resource_url: `/community/${selectedCommunity?.name}/p/${post._id}`,
        message: `<strong>${userLogin?.display_name}</strong> has created a new post in <strong>${selectedCommunity?.name} community</strong>`,
      })

      emitEvent(SOCKET_EVENTS.NOTIFYCATION.SEND, notifyData, (response: any) => {
        console.log(response)
        navigate(`/community/${selectedCommunity?.name}/p/${post._id}`)
      })
    } catch (error) {
      console.log(error)
    } finally {
      setCreating(false)
    }

    //api call  to create post
  }, [postForm, selectedCommunity, userLogin])

  return (
    <div className="pt-3 flex-1">
      <span className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-4 block">Create post</span>

      <SelectCommunity onSelectCommunity={handleSelectCommunity} selectedCommunity={selectedCommunity} />

      <div className="post-form mb-4">
        <div className="post-form-group">
          <label className="block font-semibold">Title</label>
          <span className="text-sm text-slate-700 dark:text-slate-300">
            Be specific and imagine you're asking a question to another person
          </span>
          <input
            onChange={handleInputChange}
            value={postForm.title}
            name="title"
            className="w-full resize-none border border-slate-300 dark:border-slate-800 dark:bg-zinc-900 p-3 rounded-full mt-2 outline-none"
            placeholder="Enter your title"
            maxLength={300}
          />
        </div>
      </div>

      <div className="post-tags mb-4">
        <button className="text-sm bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 hover:bg-slate-300 font-semibold px-3 py-2 rounded-full">
          Add tags
        </button>
      </div>

      <div className="post-form-editor mb-4">
        <label className="block font-semibold">What are the details of your problem ?</label>
        <span className="text-sm text-slate-700 dark:text-slate-300 mb-2 block">
          Introduce the problem and expand on what you put in the title.
        </span>

        <MdxEditor doc={postForm.description} onChange={handleEditorChange} />
      </div>

      <div className="post-form-submition flex justify-end">
        <button
          onClick={handleSubmit}
          className="text-sm font-semibold bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-full"
        >
          {creating ? 'creating' : 'create'}
        </button>
      </div>
    </div>
  )
}

export default MakePost
