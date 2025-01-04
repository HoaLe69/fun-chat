import { IFileUpload } from '../types'
import { CloseIcon } from 'modules/core/components/icons'
import FileIcon from './Message/MessageFileIcon'

interface Props {
  files: IFileUpload[]
  setFiles: React.Dispatch<React.SetStateAction<IFileUpload[]>>
}

const FilePreview: React.FC<Props> = (props) => {
  const files = props.files
  const handleRemoveAttachment = (path: string) => {
    if (!path) return
    props.setFiles((preFiles) => {
      const newFileList = preFiles.filter((file) => file.preview.path !== path)
      return newFileList
    })
  }

  return (
    <div className="bg-zinc-200 dark:bg-zinc-700 px-3 pb-3 flex items-center gap-4 flex-wrap border-b border-b-zinc-300 dark:border-b-zinc-600  rounded-t-md py-2">
      {files.map((file) => {
        console.log({ file })
        if (file.preview.type.includes('image'))
          return (
            <div key={file.preview.path} className="w-12 h-12 relative">
              <img className="rounded-xl w-full h-full object-cover" src={file.preview.path} alt={file.preview.name} />
              <button
                onClick={() => handleRemoveAttachment(file.preview.path)}
                className="absolute left-full -translate-x-1/2 -top-2 p-2 rounded-full bg-white/90 dark:bg-black/80 border-[1px] border-black/20 hover:opacity-80"
              >
                <CloseIcon />
              </button>
            </div>
          )
        return (
          <div
            key={file.preview.path}
            className="flex items-center gap-2 relative bg-black/40 p-2 rounded-xl bg-zinc-200 dark:bg-zinc-800"
          >
            <FileIcon fileName={file.preview.name} />
            <p className="max-w-40 truncate">{file.preview.name} </p>
            <button
              onClick={() => handleRemoveAttachment(file.preview.path)}
              className="absolute left-full -translate-x-1/2 -top-2 p-2 rounded-full bg-white/90 dark:bg-black/80 border-[1px] border-black/20 hover:opacity-80"
            >
              <CloseIcon />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default FilePreview
