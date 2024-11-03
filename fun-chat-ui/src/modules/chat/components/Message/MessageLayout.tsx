import moment from 'moment'
import MessageContentImages, { MessageContentFile } from './MessageContent'
import MessageReaction from './MessageReaction'
import type { MessageSectionProps } from './type'
import classNames from 'classnames'

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

export const MessageRight: React.FC<MessageSectionProps> = ({
  display_name,
  createdAt,
  react,
  content,
  isDeleted,
  showAvatar,
}) => {
  return (
    <div className="flex-1">
      {showAvatar && (
        <header className="flex items-center gap-2">
          <span className="font-bold text-grey-950/80 dark:text-grey-50/80">{display_name}</span>
          <span className="text-xs text-grey-500/90 dark:text-grey-400/90">{moment(createdAt).format('LLLL')}</span>
        </header>
      )}
      <div className={classNames('py-1')}>
        {isDeleted ? (
          <span className="text-grey-500">
            <i> Message was removed</i>
          </span>
        ) : (
          <>
            <p className="text-grey-950/80 dark:text-grey-50/80">{content?.text}</p>
            <MessageContentImages images={content?.images} />
            <MessageContentFile files={content?.files} />
          </>
        )}
      </div>
      <MessageReaction react={react} />
    </div>
  )
}
