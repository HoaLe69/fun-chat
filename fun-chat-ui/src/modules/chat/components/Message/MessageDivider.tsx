const MessageDivider = ({ divider }: { divider: string }) => {
  return (
    <div className="h-0 border-t-[1px] border-grey-300 dark:border-grey-600/80 flex items-center justify-center mt-6 mb-2 mx-4 pointer-events-none">
      <span className="block p-2 dark:bg-main-bg-dark bg-main-bg-light text-grey-500 dark:text-grey-400 text-sm font-medium  pointer-events-none">
        {divider}
      </span>
    </div>
  )
}

export default MessageDivider
