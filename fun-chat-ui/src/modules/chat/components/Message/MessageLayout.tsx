import moment from 'moment'
import type { MessageSectionProps } from './type'
import classNames from 'classnames'
import UserInformationCardContainer from 'modules/community/components/UserInformationCard'

export const MessageInner = ({ children }: { children: React.ReactNode }) => {
  return <div className="py-1 flex">{children}</div>
}

export const MessageContainer: React.FC<MessageSectionProps> = ({ children, messageId, className }) => {
  return (
    <div
      id={messageId}
      className={classNames(
        'relative group hover:bg-secondary-bg-light/80  dark:hover:bg-secondary-bg-dark/80 pr-10',
        className,
      )}
    >
      {children}
    </div>
  )
}

export default MessageContainer

export const MessageLeft: React.FC<MessageSectionProps> = ({ children }) => {
  return <div className="max-w-[72px] w-full flex justify-center">{children}</div>
}

export const MessageRightHeader: React.FC<MessageSectionProps> = ({ ownerId, showAvatar, display_name, createdAt }) => {
  if (!showAvatar) return null
  return (
    <header className="flex items-center gap-2">
      <UserInformationCardContainer userId={ownerId}>
        <span className="font-bold text-grey-950/80 dark:text-grey-50 hover:underline hover:cursor-pointer">
          {display_name}
        </span>
      </UserInformationCardContainer>
      <span className="text-xs text-grey-500/90 dark:text-grey-400/90">{moment(createdAt).format('LLLL')}</span>
    </header>
  )
}

export const MessageRight: React.FC<MessageSectionProps> = ({ children }) => {
  return <div className="flex-1">{children}</div>
}
