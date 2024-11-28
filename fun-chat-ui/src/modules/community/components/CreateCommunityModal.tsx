import classNames from 'classnames'
import { AppModalHeadless } from 'modules/core/components'
import { CloseIcon, ImageIcon, CommunityDefaultPictureIcon, DeleteIcon } from 'modules/core/components/icons'
import { useCallback, useState } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const CreateCommunityModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const formDataInitialState = {
    name: '',
    description: '',
    banner: {
      file: null,
      name: '',
      path: '',
    },
    picture: {
      file: null,
      name: '',
      path: '',
    },
  }
  const [ableToSubmit, setAbleToSubmit] = useState<boolean>(false)

  const [formData, setFormData] = useState(formDataInitialState)

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target
      const updatedFormdata = {
        ...formData,
        [name]: value,
      }

      // able to submit if name and description are not empty
      if (updatedFormdata.name.trim() && updatedFormdata.description.trim() && !ableToSubmit) setAbleToSubmit(true)
      else if ((!updatedFormdata.name.trim() || !updatedFormdata.description.trim()) && ableToSubmit)
        setAbleToSubmit(false)

      if (name === 'name') {
        setFormData((prev) => ({ ...prev, name: value.trim() }))
      } else setFormData((prev) => ({ ...prev, [name]: value }))
    },
    [formData, ableToSubmit],
  )

  const handleRemoveFile = useCallback((name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: { file: null, name: '', path: '' },
    }))
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target
    if (files && files[0]) {
      const path = URL.createObjectURL(files[0])
      setFormData((prev) => ({
        ...prev,
        [name]: {
          file: files[0],
          path: path,
          name: files[0].name,
        },
      }))
    }
  }

  const handleSubmit = useCallback(async () => {
    try {
      const form = new FormData()
      form.append('name', formData.name)
      form.append('description', formData.description)
      if (formData.picture.file) form.append('picture', formData.picture.file)
      if (formData.banner.file) form.append('banner', formData.banner.file)
      // api call
    } catch (error) {
      console.log(error)
    }
  }, [formData])

  return (
    <AppModalHeadless isOpen={isOpen} onClose={onClose} title="Tell us about your community">
      <div className="max-w-[768px] w-full bg-white p-4 rounded-xl">
        <header className="flex items-center">
          <h3 className="text-2xl font-bold">Tell us about your community</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 ml-auto"
          >
            <CloseIcon />
          </button>
        </header>
        <p className="text-sm text-gray-500 pb-8">
          A name and description help people understand what your community is all about.
        </p>

        <div className="flex gap-4">
          <div className="min-w-[55%]">
            <div className="form-group">
              <label className="block text-sm font-medium mb-2 text-gray-700">Community name</label>
              <input
                onChange={handleChange}
                value={formData.name}
                className="w-full bg-zinc-200 px-2 py-3 rounded-xl outline-none"
                type="text"
                name="name"
                placeholder="Enter your community name"
                maxLength={21}
              />
            </div>
            <div className="form-group mt-4">
              <label className="block text-sm font-medium mb-2 text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={handleChange}
                className="resize-none w-full bg-zinc-200 px-2 py-3 rounded-xl outline-none min-h-40"
                name="description"
                placeholder="Enter your community name"
              />
            </div>
            <div className="flex items-center mt-4 hover:bg-zinc-100 py-2 px-2 rounded-xl">
              {formData.picture?.name ? (
                <div className="flex items-center gap-1 text-sm font-light">
                  <span>{formData?.picture?.name}</span>
                  <button
                    onClick={() => handleRemoveFile('picture')}
                    className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-zinc-200 rounded-full"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              ) : (
                <span>Thumbnail</span>
              )}
              <div className="ml-auto">
                <label
                  htmlFor="picture"
                  className="flex items-center gap-2 px-3 py-2 rounded-full text-sm bg-zinc-200 cursor-pointer"
                >
                  <ImageIcon />
                  Add
                </label>
                <input
                  id="picture"
                  name="picture"
                  onChange={handleFileChange}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
            <div className="flex items-center mt-2 hover:bg-zinc-100 py-2 px-2 rounded-xl">
              {formData.banner?.name ? (
                <div className="flex items-center gap-1 text-sm font-light">
                  <span>{formData?.banner?.name}</span>
                  <button
                    onClick={() => handleRemoveFile('banner')}
                    className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-zinc-200 rounded-full"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              ) : (
                <span>banner</span>
              )}
              <div className="ml-auto">
                <label
                  htmlFor="banner"
                  className="flex items-center text-sm gap-2 px-3 py-2 rounded-full bg-zinc-200 cursor-pointer"
                >
                  <ImageIcon />
                  Add
                </label>
                <input
                  id="banner"
                  name="banner"
                  onChange={handleFileChange}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>
          <div className="grow">
            <div className="w-full flex justify-center items-start">
              <div className="max-h-[350px] max-w-[268px] flex flex-col grow rounded-xl overflow-auto shadow-xl">
                <div
                  style={{ backgroundImage: `url('${formData.banner.path}')` }}
                  className={classNames('min-h-8 max-h-10 w-full bg-blue-300/80')}
                ></div>
                <div className="mx-4 mt-4 flex items-center gap-2">
                  <span className="grow max-w-max">
                    {formData.picture.file ? (
                      <img src={formData.picture.path} alt="thumbnail" className="w-[50px] h-[50px] rounded-full" />
                    ) : (
                      <CommunityDefaultPictureIcon />
                    )}
                  </span>
                  <div className="flex-1">
                    <p className="text-xl font-semibold block">d/{formData.name ? formData.name : 'communityname'}</p>
                    <span className="text-xs text-gray-500">1 member</span>
                  </div>
                </div>
                <div className="p-3 pt-2">
                  <p className="text-sm w-full text-wrap">
                    {formData.description ? formData.description : 'Your community description'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!ableToSubmit}
            className={classNames(
              'px-3 py-2 rounded-full bg-blue-700 hover:bg-blue-800 text-sm font-semibold text-white',
              {
                'bg-neutral-600': !ableToSubmit,
              },
            )}
          >
            Create
          </button>
        </div>
      </div>
    </AppModalHeadless>
  )
}

export default CreateCommunityModal
