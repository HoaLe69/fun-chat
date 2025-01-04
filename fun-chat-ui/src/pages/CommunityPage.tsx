import PostContainer from 'modules/community/components/PostContainer'
import MainLayout from 'modules/community/components/Layout'
import { PlusRawIcon, SearchIcon } from 'modules/core/components/icons'
import { useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounce } from 'modules/core/hooks'
import classNames from 'classnames'
import Tippy from '@tippyjs/react/headless'
import { userServices } from 'modules/user/services'
import { IUser } from 'modules/user/types'
import Image from 'modules/core/components/Image'

const CommunityPage = () => {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const refInput = useRef<HTMLInputElement>(null)
  const [searchEmail, setSearchEmail] = useState<string>('')
  const [searchResult, setSearchResult] = useState<IUser[]>([])
  const debouncedSearchEmail = useDebounce(searchEmail, 200)

  useEffect(() => {
    if (!isExpanded) return
    const inputEl = refInput.current
    if (inputEl) {
      inputEl.focus()
    }
  }, [isExpanded])

  useEffect(() => {
    if (!debouncedSearchEmail) return
    userServices
      .searchUser({ q: debouncedSearchEmail })
      .then((res) => {
        setSearchResult(res)
      })
      .catch((err) => console.log(err))
  }, [debouncedSearchEmail])

  const handleNavigateUserProfile = useCallback((userId: string) => {
    navigate(`/user/profile/${userId}`)
  }, [])
  const handleNavigateToMakePost = useCallback(() => {
    navigate('/community/create/post')
  }, [])

  return (
    <MainLayout typeOfSidebarRight="recent">
      <div className="flex justify-end px-8 gap-2">
        <div
          className={classNames('bg-zinc-200 dark:bg-zinc-700 w-9 h-9 rounded-full flex items-center justify-center ', {
            expand: isExpanded,
          })}
        >
          {isExpanded ? (
            <Tippy
              onClickOutside={() => {
                setIsExpanded(false)
                setSearchEmail('')
                setSearchResult([])
              }}
              placement="bottom-end"
              visible={searchResult?.length > 0 || isExpanded}
              zIndex={999}
              interactive
              render={(attrs) => {
                return (
                  refInput?.current && (
                    <div
                      {...attrs}
                      style={{ width: `${refInput?.current?.clientWidth}px` }}
                      className={classNames(
                        'rounded-xl max-h-60 overflow-auto',
                        searchResult?.length === 0 ? 'bg-transparent' : 'bg-zinc-200  shadow-xl dark:bg-zinc-900',
                      )}
                    >
                      <ul className="py-2">
                        {searchResult.map((user) => (
                          <li
                            key={user?._id}
                            onClick={() => handleNavigateUserProfile(user?._id)}
                            className="flex items-center gap-2 py-1 px-2 dark:hover:bg-zinc-700 hover:bg-zinc-300 hover:cursor-pointer"
                          >
                            <Image src={user?.picture} alt={user?.display_name} className="w-8 h-8 rounded-full" />
                            <div>
                              <h3 className="text-sm font-semibold">{user?.display_name}</h3>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{user?.email}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )
              }}
            >
              <input
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                ref={refInput}
                className="w-full outline-none h-full rounded-full bg-transparent px-4 text-sm"
              />
            </Tippy>
          ) : (
            <button
              onClick={() => setIsExpanded(true)}
              className="bg-zinc-200 dark:bg-zinc-700 w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80"
            >
              <SearchIcon />
            </button>
          )}
        </div>

        <button
          onClick={handleNavigateToMakePost}
          className="p-2 rounded-full text-sm font-medium flex items-center gap-2 bg-zinc-200 dark:bg-zinc-700 hover:opacity-90"
        >
          <PlusRawIcon className="w-4 h-4" />
          Create Post
        </button>
      </div>
      <PostContainer />
    </MainLayout>
  )
}

export default CommunityPage
