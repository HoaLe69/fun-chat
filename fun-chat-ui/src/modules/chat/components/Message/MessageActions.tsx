import type { MessageSectionProps } from './type'
import classNames from 'classnames'
import MessageReactionPicker from './MessageReactionPicker'
import MessageActionMenu from './MessageActionMenu'

const MessageActions: React.FC<MessageSectionProps> = ({
  react,
  messageId,
  contextualMenuOpen,
  setContextualMenuOpen,
  originalMessage,
  userLoginId,
}) => {
  return (
    <div
      className={classNames('absolute right-0 top-0 -translate-y-1/2 hidden group-hover:flex px-4', {
        '!flex': contextualMenuOpen,
      })}
    >
      <div
        className={classNames(
          'px-2 py-[1px] flex items-center gap-2  rounded-md border-[1px] dark:border-zinc-700 border-zinc-200 dark:bg-main-bg-dark bg-main-bg-light ',
        )}
      >
        <MessageReactionPicker react={react} messageId={messageId} setContextualMenuOpen={setContextualMenuOpen} />
        <MessageActionMenu
          message={originalMessage}
          allowDel={userLoginId === originalMessage?.ownerId}
          setContextualMenuOpen={setContextualMenuOpen}
        />
      </div>
    </div>
  )
}

export default MessageActions
