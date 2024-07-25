import UserAvatar from '../user-avatar'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { userSelector } from '../../redux/user.store'
import { UserType } from '../../lib/app.type'
import { createRoomAsync } from '../../api/room.api'
import { roomSelector } from '../../redux/channel.store'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SearchResult = () => {
  const searchs = useAppSelector(userSelector.selectSearchResult)
  const loading = useAppSelector(userSelector.selectLoadingSearch)
  const userLogin = useAppSelector(userSelector.selectUser)
  const roomCreated = useAppSelector(roomSelector.selectCreatedRoom)
  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  const handleCreateNewRoom = (senderId: string) => {
    const members: Array<string | null> = [userLogin._id, senderId]
    const room = {
      members,
    }
    dispatch(createRoomAsync({ room }))
  }
  useEffect(() => {
    if (roomCreated?._id) {
      navigate(`/${roomCreated?._id}`)
    }
  }, [roomCreated])
  return (
    <div>
      <div className="h-14 flex items-center px-4 py-2 border-b-2 border-grey-300 dark:border-grey-700">
        <span className="text-grey-500">{searchs.length} results</span>
      </div>
      {loading ? (
        // TODO: add loading spinner
        <span>loading...</span>
      ) : (
        <ul>
          {searchs.length > 0 &&
            searchs?.map((user: UserType) => {
              return (
                <li
                  onClick={() => handleCreateNewRoom(user._id)}
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
