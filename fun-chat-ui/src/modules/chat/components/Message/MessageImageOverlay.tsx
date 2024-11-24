import { IMessageContentImage } from 'modules/chat/types'
import { ChevronRightIcon, ChevronLeftIcon } from 'modules/core/components/icons'
import { useCallback, useState } from 'react'

interface Props {
  images?: IMessageContentImage[]
  onClose?: () => void
  initialPosImg: number
}
const MessageImageOverlay: React.FC<Props> = ({ images, onClose, initialPosImg }) => {
  const [currentImage, setCurrentImage] = useState(initialPosImg)
  const handlePreviousImage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      if (currentImage === 0) return
      setCurrentImage((pre) => pre - 1)
    },
    [currentImage],
  )

  const handleNextImage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      if (!images) return

      if (currentImage === images?.length - 1) return
      setCurrentImage((pre) => pre + 1)
    },
    [currentImage],
  )
  return (
    <div className="fixed inset-0 z-10">
      <div onClick={onClose} className="bg-black/80 w-full h-full flex items-center justify-center relative">
        <div onClick={(e) => e.stopPropagation()} className="max-w-screen-xl max-h-svh">
          {images && images?.length > 0 && (
            <img className="animate-zoom" src={images[currentImage]?.url} alt={images[currentImage].altText} />
          )}
        </div>
        <button
          onClick={handlePreviousImage}
          className="absolute p-4 bg-zinc-600/20 left-20 text-grey-50  rounded-full flex items-center justify-center"
        >
          <ChevronLeftIcon />
        </button>
        <button
          onClick={handleNextImage}
          className="absolute p-4 bg-zinc-600/20 right-20 text-grey-50 rounded-full flex items-center justify-center"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  )
}

export default MessageImageOverlay
