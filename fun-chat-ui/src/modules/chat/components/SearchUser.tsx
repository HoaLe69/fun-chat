import { UserAvatar } from 'modules/core/components'
import { useState, useEffect } from 'react'
import { useDebounce } from 'modules/core/hooks'
import ReactLoading from 'react-loading'

import type { IUser } from '../types'
import { userServices } from 'modules/user/services'

interface Props {
  searchTerm: string
}

const SearchUser: React.FC<Props> = ({ searchTerm }) => {
  const [users, setUsers] = useState<IUser[]>([])
  const [status, setStatus] = useState({
    isFetching: false,
    error: false,
  })
  const debounceSearchTerm = useDebounce(searchTerm, 400)

  useEffect(() => {
    if (!debounceSearchTerm) return
    const fetchUsersByEmail = async () => {
      setStatus({ error: false, isFetching: true })
      try {
        await new Promise(resolve => setTimeout(resolve, 2000))
        const res = await userServices.searchUser({ q: debounceSearchTerm })
        setUsers(res)
        setStatus(pre => ({ ...pre, isFetching: false }))
      } catch (error) {
        console.log(error)
        setStatus({ error: true, isFetching: false })
      }
    }
    fetchUsersByEmail()
  }, [debounceSearchTerm])

  const LoadingState = () => (
    <div className="flex items-center justify-center py-3">
      <ReactLoading width="40px" height="40px" color="#000000" type="spin" />
    </div>
  )
  const ErrorSearch = () => (
    <div className="flex items-center justify-center py-3">
      <p className="text-rose-500">Something went wrong</p>
    </div>
  )

  if (status.isFetching) return <LoadingState />
  if (!status.isFetching && status.error) return <ErrorSearch />

  if (!users?.length)
    return (
      <div className="flex items-center justify-center py-3">
        <p className="text-grey-500">No search result</p>
      </div>
    )

  return (
    <div>
      {users.map((user: IUser) => (
        <div
          key={user?._id}
          className="hover:bg-grey-200 dark:hover-bg-grey-800 cursor-pointer rounded-lg"
        >
          <div className="flex items-center px-2 py-3">
            <UserAvatar
              alt={user?.display_name}
              src={user?.picture}
              size="lg"
            />
            <div className="pl-2 flex-1">
              <span className="font-bold">{user?.display_name}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SearchUser