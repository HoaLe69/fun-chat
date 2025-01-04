import { IMessage, IMessageContent, IMessageReact, IUser } from 'modules/chat/types'

export interface MessageSectionProps {
  children?: React.ReactNode
  content?: IMessageContent
  display_name?: string
  createdAt?: string
  picture?: string
  react?: IMessageReact[]
  contextualMenuOpen?: boolean
  setContextualMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>
  messageId?: string
  originalMessage?: IMessage
  userLoginId?: string
  userLogin?: IUser
  replyMessage?: IMessage
  handleMoveToReplyMessage?: () => void
  showAvatar?: boolean
  className?: string
  isDeleted?: boolean
  ownerId?: string
}
