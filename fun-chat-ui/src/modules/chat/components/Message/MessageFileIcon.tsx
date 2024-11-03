import {
  FilePDFIcon,
  FileSheetIcon,
  FileTextIcon,
  FileCodeIcon,
  FileDefaultIcon,
  FilePresentationIcon,
} from 'modules/core/components/icons'
import { FILE_TYPE } from 'modules/chat/const'

interface Props {
  fileName: string
}

const FileIcon: React.FC<Props> = ({ fileName }) => {
  const extention = fileName?.split('.').pop()
  if (extention) {
    if (FILE_TYPE.text.includes(extention)) return <FileTextIcon />
    if (FILE_TYPE.code.includes(extention)) return <FileCodeIcon />
    if (FILE_TYPE.other.includes(extention)) return <FilePDFIcon />
    if (FILE_TYPE.sheet.includes(extention)) return <FileSheetIcon />
    if (FILE_TYPE.presentation.includes(extention)) return <FilePresentationIcon />
  }
  return <FileDefaultIcon />
}

export default FileIcon
