import type {
  IMessageContent,
  IMessageContentFile,
  IMessageContentImage,
  IMessageContentLinkMetadata,
} from 'modules/chat/types'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MessageImageOverlay from './MessageImageOverlay'
import { SaveIcon } from 'modules/core/components/icons'
import FileIcon from './MessageFileIcon'
import Preview from '../MessageTextPreview'
import { messageServices } from 'modules/chat/services'

interface MessageContentProps {
  content: IMessageContent
  isDeleted?: boolean
  msgId: string
}

const MessageContent: React.FC<MessageContentProps> = ({ content, isDeleted, msgId }) => {
  const [linkMetadatas, setLinkMetadatas] = useState<IMessageContentLinkMetadata[]>(content.links)
  const refContainer = useRef<HTMLDivElement>(null)
  if (isDeleted)
    return (
      <div className="py-1 min-h-6">
        <i className="text-grey-500">Message was removed</i>
      </div>
    )

  useEffect(() => {
    if (content.links.length > 0) return
    const loadLinkMetadata = async (links: Array<string | null>) => {
      try {
        const res = await messageServices.getMessageLinkPreviewMetadata(links, msgId)
        if (res.data) {
          setLinkMetadatas(res.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    const containerEl = refContainer.current
    if (containerEl) {
      const linkElements = containerEl.querySelectorAll('.devchatter-msg-link')
      const links = Array.from(linkElements).map((linkEl) => linkEl?.textContent)
      if (!links.length) return
      loadLinkMetadata(links)
    }
  }, [refContainer])
  return (
    <div ref={refContainer} className="py-1 min-h-6">
      <Preview doc={content.text} />
      <MessageContentLinkPreview linkMetadatas={linkMetadatas} />
      <MessageContentImages images={content?.images} />
      <MessageContentFile files={content?.files} />
    </div>
  )
}

export default MessageContent

const MessageContentLinkPreview = ({ linkMetadatas }: { linkMetadatas: IMessageContentLinkMetadata[] }) => {
  //siteName
  //title
  //description
  //image
  return (
    <div className="max-w-md w-max">
      {linkMetadatas?.map((metadatas) => (
        <div key={metadatas.url} className="bg-grey-300 dark:bg-grey-800 p-4 rounded-md mt-2">
          <span className="text-xs text-gray-500 mt-2">{metadatas?.siteName}</span>
          <a href={metadatas?.url} target="_blank" className="hover:underline block text-blue-400 font-medium">
            {metadatas?.title}
          </a>
          <p className="text-sm mt-2 text-gray-500">{metadatas?.description}</p>
          <div className="mt-2 w-full">
            {metadatas?.image && (
              <img src={metadatas?.image} alt={metadatas?.title} className="rounded-md w-full max-h-96 object-cover" />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

const MessageContentFile = ({ files }: { files?: IMessageContentFile[] }) => {
  const fileSize = useCallback((size: number) => {
    const kb = size / 1024
    const mb = kb / 1024
    if (Math.floor(mb) > 0) {
      return `${mb.toFixed(2)} MB`
    }
    return `${kb.toFixed(2)} KB`
  }, [])

  return (
    <div>
      <ul>
        {files &&
          files.length > 0 &&
          files?.map((file, index) => {
            const stn = Number(file.size)
            const filename = file?.path?.split('/').pop()
            return (
              <li className="pt-1" key={file.path || index}>
                <div className="relative group/file flex items-center p-4 mt-2 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-900 w-max rounded-md">
                  <span>
                    <FileIcon fileName={file.fileName} />
                  </span>
                  <div className="flex flex-col ml-4">
                    <a target="_blank" className="hover:underline text-blue-500 dark:text-blue-600" href={file.path}>
                      {file.fileName}
                    </a>
                    <span className="text-xs text-grey-600 dark:text-grey-500">{fileSize(stn)}</span>
                  </div>
                  <div className="absolute top-0 right-0 -translate-y-1/3 pr-2 opacity-0 group-hover/file:opacity-100 z-10">
                    <a
                      target="_blank"
                      href={`http://localhost:8082/api/v1/message/download/${filename}/${file.fileName}`}
                      className="dark:bg-main-bg-dark bg-main-bg-light p-1 rounded-md dark:text-zinc-300/80 text-zinc-500/80 hover:opacity-75 inline-block"
                    >
                      <SaveIcon />
                    </a>
                  </div>
                </div>
              </li>
            )
          })}
      </ul>
    </div>
  )
}

const MessageContentImages = ({ images }: { images?: IMessageContentImage[] }) => {
  const [imageGallery, setImageGallery] = useState({
    visible: false,
    pos: 0,
  })
  // Determine the grid style based on image count
  const numOfImage = images?.length || 0

  const styleGridImage = useMemo(() => {
    if (numOfImage === 1) {
      return { gridTemplateColumns: '1fr', maxHeight: '350px' } // Single large image
    }
    if (numOfImage === 2) {
      return {
        gridTemplateColumns: '1fr 1fr',
      } // Two side-by-side images
    }
    if (numOfImage > 2 && numOfImage <= 4) {
      return {
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
      } // 2x2 grid for 4+ images
    }
    return {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: `repeat(${Math.round(numOfImage / 3)}, ${550 / 3}px)`,
    }
  }, [numOfImage])

  const handleOpenImageGallery = useCallback((index: number) => {
    setImageGallery({ visible: true, pos: index })
  }, [])
  const handleCloseImageGallery = useCallback(() => {
    setImageGallery({ visible: false, pos: 0 })
  }, [])

  return (
    <>
      <div className="min-h-0 grid h-[fit-content]">
        <div style={styleGridImage} className="max-w-[550px] grid gap-1">
          {images?.map((img, index) => (
            <div key={img.url} style={{ maxHeight: 'inherit' }}>
              <img
                src={img.url}
                alt={img.altText}
                onClick={() => handleOpenImageGallery(index)}
                className="w-full h-full object-cover block rounded-md cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
      {imageGallery.visible && (
        <MessageImageOverlay images={images} initialPosImg={imageGallery.pos} onClose={handleCloseImageGallery} />
      )}
    </>
  )
}
