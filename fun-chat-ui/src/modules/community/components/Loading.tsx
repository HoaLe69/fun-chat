export const PostContainerLoadingSkeleton = () => (
  <div className="animate-pulse px-4 pt-4">
    {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
      <PostItemLoadingSkeleton key={index} />
    ))}
  </div>
)

const PostItemLoadingSkeleton = () => (
  <div className="py-2 px-4">
    <div className="flex items-center w-full">
      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="h-4 rounded-full ml-2 w-20 bg-gray-300 dark:bg-gray-600" />
      <div className="h-6 ml-auto w-14  rounded-full bg-gray-300 dark:bg-gray-600" />
    </div>
    <div>
      <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 my-2 rounded-xl"></div>
      <div className="h-28 w-full bg-gray-300 dark:bg-gray-700 my-2 rounded-xl"></div>
    </div>
  </div>
)
export const NotificationItemLoadingSkeleton = () => (
  <div className="flex items-center gap-2 py-4 animate-pulse">
    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
    <div className="w-full flex-1">
      <div className="w-full h-5 rounded-2xl bg-gray-300 dark:bg-gray-600" />
      <div className="w-40 h-3 rounded-2xl bg-gray-300 dark:bg-gray-600 mt-2" />
    </div>
  </div>
)
