import { MessageIcon } from '../icons'
const Empty = ({ content }: { content: string }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-grey-400 dark:text-grey-600">
        <MessageIcon />
      </span>
      <p className="font-semibold text-grey-500 text-xl">{content}</p>
    </div>
  )
}

export default Empty
