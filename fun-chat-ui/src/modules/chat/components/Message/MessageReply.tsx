import type { MessageSectionProps } from './type'

const MessageReply: React.FC<MessageSectionProps> = ({ userLogin, replyMessage, handleMoveToReplyMessage }) => {
  return (
    <div className="pl-[72px] text-grey-500 mb-1">
      <div className="flex items-center text-xs gap-2  relative">
        <img src={userLogin?.picture} alt="test" className="w-4 h-4 rounded-full" />
        <span className="dark:text-grey-300/70 text-sm text-grey-600/70">{userLogin?.display_name}</span>
        <p
          onClick={handleMoveToReplyMessage}
          className="text-sm truncate dark:hover:text-grey-50 hover:text-grey-950 text-grey-600/70 dark:text-grey-300/70 hover:cursor-pointer"
        >
          {replyMessage?.content?.text}
        </p>
        <div
          onClick={handleMoveToReplyMessage}
          className="absolute w-9 h-3 border-t-2 border-l-2 border-grey-500 dark:hover:border-grey-50 hover:border-grey-950 cursor-pointer rounded-tl-md -left-1 translate-y-1/2  -translate-x-full"
        />
      </div>
    </div>
  )
}

export default MessageReply
