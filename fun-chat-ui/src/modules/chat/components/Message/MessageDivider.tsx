const MessageDivider = ({ divider }: { divider: string }) => {
  return (
    <div className="h-0 border-t-[1px] border-zinc-200 dark:border-zinc-700/80 flex items-center justify-center mt-6 mb-2 mx-4 pointer-events-none">
      <span className="block p-2 dark:bg-zinc-800 bg-zinc-50 text-grey-500 dark:text-grey-400 text-xs font-medium  pointer-events-none">
        {divider}
      </span>
    </div>
  )
}

export default MessageDivider
