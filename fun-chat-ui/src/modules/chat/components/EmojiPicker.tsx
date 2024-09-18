import Picker from '@emoji-mart/react'
import classNames from 'classnames'

type Props = {
  isOpen: boolean
  onClose?: () => void
  appendEmojiToText: (emoji: string) => void
}

type Emoji = {
  id: string
  keywords: Array<string>
  name: string
  native: string
  shortcodes: string
  unified: string
}
const EmojiPicker: React.FC<Props> = ({
  isOpen,
  onClose,
  appendEmojiToText,
}) => {
  return (
    <div className={classNames('bottom-full right-0 absolute')}>
      {isOpen && (
        <Picker
          onClickOutside={onClose}
          onEmojiSelect={(emoji: Emoji) => appendEmojiToText(emoji.native)}
        />
      )}
    </div>
  )
}

export default EmojiPicker
