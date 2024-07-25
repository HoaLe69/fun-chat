import UserAvatar from '../components/user-avatar'
import { useAppSelector } from '../hooks'
import { userSelector } from '../redux/user.store'
import { UserType } from '../lib/app.type'

const SearchResult = () => {
  const searchs = useAppSelector(userSelector.selectSearchResult)
  const loading = useAppSelector(userSelector.selectLoadingSearch)
  return (
    <div>
      <div className="h-14 flex items-center px-4 py-2 border-b-2 border-grey-300 dark:border-grey-700">
        <span className="text-grey-500">{searchs.length} results</span>
      </div>
      {loading ? (
        <span>loading...</span>
      ) : (
        <ul>
          {searchs.length > 0 &&
            searchs?.map((user: UserType) => {
              return (
                <li
                  key={user?._id}
                  className="hover:bg-grey-200 dark:hover:bg-grey-800 cursor-pointer"
                >
                  <div className="flex items-center px-2 py-3 gap-2">
                    <UserAvatar
                      alt={user.display_name}
                      src={user.picture}
                      size="lg"
                    />
                    <span className="font-bold">{user.display_name}</span>
                  </div>
                </li>
              )
            })}
        </ul>
      )}
    </div>
  )
}

export default SearchResult
