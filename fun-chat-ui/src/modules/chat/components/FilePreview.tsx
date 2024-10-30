import { IFileUpload } from '../types'
import {
  CloseIcon,
  FilePDFIcon,
  FileSheetIcon,
  FileTextIcon,
  FileCodeIcon,
  FileDefaultIcon,
  FilePresentationIcon,
} from 'modules/core/components/icons'

interface Props {
  files: IFileUpload[]
  setFiles: React.Dispatch<React.SetStateAction<IFileUpload[]>>
}

const FILE_TYPE = {
  presentation: ['ppt', 'pptx'],
  sheet: ['xls', 'xlsx', 'xlsm'],
  text: ['doc', 'docx', 'txt', 'rtf'],
  code: ['html', 'java', 'js', 'ts', 'jsx', 'tsx', 'python'],
  other: ['pdf'],
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

  const FileIcon = ({ fileName }: { fileName: string }) => {
    const extention = fileName.split('.').pop()
    if (extention) {
      if (FILE_TYPE.text.includes(extention)) return <FileTextIcon />
      if (FILE_TYPE.code.includes(extention)) return <FileCodeIcon />
      if (FILE_TYPE.other.includes(extention)) return <FilePDFIcon />
      if (FILE_TYPE.sheet.includes(extention)) return <FileSheetIcon />
      if (FILE_TYPE.presentation.includes(extention))
        return <FilePresentationIcon />
    }
    return <FileDefaultIcon />
  }

  return (
    <div className="px-3 pb-3 flex items-center gap-4 flex-wrap">
      {files.map((file) => {
        console.log({ file })
        if (file.preview.type.includes('image'))
          return (
            <div key={file.preview.path} className="w-12 h-12 relative">
              <img
                className="rounded-xl w-full h-full object-cover"
                src={file.preview.path}
                alt={file.preview.name}
              />
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
            className="flex items-center gap-2 relative bg-black/40 p-2 rounded-xl"
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
