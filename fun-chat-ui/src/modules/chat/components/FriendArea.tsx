import { Button } from '@headlessui/react'
import { authSelector } from 'modules/auth/states/authSlice'
import Image from 'modules/core/components/Image'
import { CloseIcon, FriendUserIcon } from 'modules/core/components/icons'
import { useAppSelector, useSocket } from 'modules/core/hooks'
import { userServices } from 'modules/user/services'
import { IUser } from 'modules/user/types'
import { useState, useCallback, useEffect } from 'react'
import ReactLoading from 'react-loading'
import { CheckRawIcon } from 'modules/core/components/icons'
import classNames from 'classnames'
import { notifyServices } from 'modules/community/services'
import { SOCKET_EVENTS } from 'const'

const FriendArea = () => {
  const [activeTab, setActiveTab] = useState<string>('All')
  const [userData, setUserData] = useState<IUser[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const userLogin = useAppSelector(authSelector.selectUser)

  const handleChangeTab = useCallback((tab: string) => {
    setActiveTab(tab)
  }, [])

  const processFetchFriendList = useCallback(async (ids: string[]) => {
    const promises = ids.map((id) => userServices.getUserById(id))
    const users = await Promise.all(promises)
    console.log({ users })
    return users
  }, [])

  useEffect(() => {
    if (!userLogin?._id) return
    setLoading(true)
    userServices
      .getUserById(userLogin?._id)
      .then((res) => {
        if (activeTab == 'All') {
          processFetchFriendList(res?.friends).then((users) => setUserData(users))
        } else if (activeTab == 'Pending') {
          const waitListIds = [...res.friends_request, ...res.friends_waiting]
          processFetchFriendList(waitListIds).then((users) => setUserData(users))
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [activeTab, userLogin?._id])

  return (
    <main className="bg-zinc-50 dark:bg-zinc-800">
      <header className="flex items-center text-gray-600 dark:text-gray-400 font-medium p-2 border-b border-b-zinc-200 dark:border-b-zinc-700">
        <div className="flex items-center pr-2 border-r border-r-zinc-200 dark:border-r-zinc-700 gap-2">
          <FriendUserIcon />
          Friend
        </div>
        <div className="flex items-center gap-2 ml-2">
          <TabButton onClick={handleChangeTab} title="Online" active={activeTab === 'Online'} />
          <TabButton onClick={handleChangeTab} title="All" active={activeTab === 'All'} />
          <TabButton onClick={handleChangeTab} title="Pending" active={activeTab === 'Pending'} />
        </div>
      </header>
      <div className="max-w-5xl">
        <TabPanel
          tab={activeTab}
          data={userData}
          loading={loading}
          setUserData={setUserData}
          userLoginId={userLogin?._id}
          userLoginDisplayName={userLogin?.display_name}
        />
      </div>
    </main>
  )
}

const TabButton = ({ title, active, onClick }: { title: string; active: boolean; onClick: (tab: string) => void }) => {
  return (
    <button
      onClick={() => onClick(title)}
      className={classNames('py-1 px-2 hover:bg-zinc-200 hover:dark:bg-zinc-900 rounded-md', {
        'bg-zinc-200 dark:bg-zinc-900': active,
      })}
    >
      {title}
    </button>
  )
}

const TabPanel = ({
  tab,
  data,
  loading,
  userLoginId,
  setUserData,
  userLoginDisplayName,
}: {
  tab: string
  data: IUser[]
  loading: boolean
  userLoginId?: string
  userLoginDisplayName?: string
  setUserData: React.Dispatch<React.SetStateAction<IUser[]>>
}) => {
  const { emitEvent } = useSocket()

  const getTypeOfUserPending = useCallback(
    (user: IUser) => {
      if (tab !== 'Pending') return { text: user?.email, actions: null }
      if (user.friends_request.includes(userLoginId || ''))
        return { text: 'Friend Request', actions: ['Accept', 'Cancel'] }
      if (user.friends_waiting.includes(userLoginId || ''))
        return { text: 'Outgoing Friend Request', actions: ['Cancel'] }
    },
    [userLoginId, tab],
  )

  const handleAcceptFriend = useCallback(
    (userId: string) => {
      if (!userId || !userLoginId) return
      userServices
        .acceptFriendRequestAsync({ userRequestId: userLoginId, userDestinationId: userId })
        .then(() => {
          setUserData((prev) => prev.filter((user) => user._id !== userId))
        })
        .catch((err) => console.log(err))

      notifyServices
        .createNotify({
          type: 'friend_request',
          senderId: userLoginId,
          recipient: userId,
          metadata: {
            message: `<strong>${userLoginDisplayName}</strong> accept your friend request[;`,
            resource_url: '/devchat/@me',
          },
        })
        .then((res) => {
          emitEvent(SOCKET_EVENTS.NOTIFYCATION.SEND, [res], (response: any) => {
            console.log('send notification response', response)
          })
        })
        .catch((error) => console.log(error))
    },
    [userLoginId, userLoginDisplayName],
  )

  const handleCancelFriend = useCallback(
    (userCancelType: string[] | null, userId: string) => {
      if (!userLoginId || !userId) return
      if (userCancelType) {
        const data: Record<string, string> = {}
        if (userCancelType.includes('Accept')) {
          data['userDestinationId'] = userLoginId
          data['userRequestId'] = userId
        } else {
          data['userDestinationId'] = userId
          data['userRequestId'] = userLoginId
        }
        userServices
          //@ts-ignore
          .cancelFriendRequestAsync(data)
          .then(() => {
            setUserData((prev) => prev.filter((user) => user._id !== userId))
          })
          .catch((err) => console.log(err))
      }
    },
    [userLoginId],
  )
  return (
    <div className="px-5">
      <h2 className="my-4 uppercase text-xs font-semibold text-gray-600 dark:text-gray-400">
        {tab} - {data?.length}
      </h2>
      {loading ? (
        <div className="flex items-center justify-center">
          <ReactLoading type="bubbles" width="25px" height="25px" />
        </div>
      ) : (
        <ul className="list-none">
          {data.map((item) => {
            const type = getTypeOfUserPending(item)
            return (
              <li
                key={item?._id}
                className="flex items-center gap-2 py-2 px-2 border-t border-t-zinc-100 dark:border-t-zinc-700 dark:hover:bg-zinc-900 hover:bg-zinc-200 rounded-md cursor-pointer"
              >
                <Image src={item?.picture} alt={item?.display_name} className="w-8 h-8 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-zinc-950 dark:text-zinc-50 font-medium">{item?.display_name}</span>
                  <span className="text-sm dark:text-gray-400 text-gray-600">{type?.text}</span>
                </div>
                {type?.actions && (
                  <div className="ml-auto flex items-center gap-2">
                    {type?.actions.includes('Accept') && (
                      <Button
                        onClick={() => handleAcceptFriend(item?._id)}
                        className="text-zinc-950 dark:text-zinc-50 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-300 dark:bg-zinc-700 hover:text-blue-500 "
                      >
                        <CheckRawIcon />
                      </Button>
                    )}
                    <Button
                      onClick={() => handleCancelFriend(type.actions, item?._id)}
                      className="text-zinc-950 dark:text-zinc-50 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-300 dark:bg-zinc-700  hover:text-rose-700"
                    >
                      <CloseIcon />
                    </Button>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default FriendArea
