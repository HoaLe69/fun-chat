import Tippy from '@tippyjs/react/headless'
import type { IUser } from 'modules/user/types'
import { useEffect, useState } from 'react'
import { userServices } from 'modules/user/services'
import ReactLoading from 'react-loading'
import { CakeIcon } from 'modules/core/components/icons'
import moment from 'moment'

interface UserInformationCardPros {
  children: JSX.Element
  userId: string
}
const UserInformationCardContainer: React.FC<UserInformationCardPros> = ({ children, userId }) => {
  const [mounted, setMounted] = useState<boolean>(false)
  return (
    <Tippy
      onMount={() => setMounted(true)}
      delay={500}
      interactive
      placement="bottom-start"
      render={(attrs) => (
        <div {...attrs}>
          <UserInformationCard userId={userId} isMounted={mounted} />
        </div>
      )}
    >
      {children}
    </Tippy>
  )
}

export default UserInformationCardContainer

const UserInformationCard = ({ userId, isMounted }: { userId: string; isMounted: boolean }) => {
  const [userInfo, setUserInfo] = useState<IUser | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!userId || !isMounted) return
    userServices
      .getUserById(userId)
      .then((data) => {
        setUserInfo(data)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [userId, isMounted])
  return (
    <div className="rounded-xl w-80 min-h-24 shadow-xl bg-zinc-50 dark:bg-zinc-900">
      {loading || !userInfo ? (
        <div className="w-full flex items-center justify-center py-5">
          <ReactLoading type="spin" width={40} height={40} />
        </div>
      ) : (
        <div className="p-3">
          <div className="flex items-center">
            <img src={userInfo?.picture} alt={userInfo?.display_name} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex flex-col ml-3">
              <p className="dark:text-zinc-100 font-semibold text-base hover:cursor-pointer">
                {userInfo?.display_name}
              </p>
              <p className="dark:text-zinc-500 text-zinc-700 text-sm">{userInfo?.email}</p>
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm gap-2 dark:text-zinc-400 text-zinc-700">
            <CakeIcon />
            <span>{moment(userInfo?.createdAt).format('LL')}</span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button className="hover:opacity-80 p-3 py-1 bg-purple-800 rounded-full text-sm font-semibold text-zinc-100">
              Follow
            </button>
            <button className="hover:opacity-80 p-3 py-1 bg-zinc-200 dark:bg-zinc-800 rounded-full text-sm font-semibold">
              Chat
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
