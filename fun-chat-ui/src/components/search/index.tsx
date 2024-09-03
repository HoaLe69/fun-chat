import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import UserAvatar from 'components/user-avatar'
import { useEffect, useState } from 'react'
import classNames from 'classnames'

import { useAppSelector, useAppDispatch } from 'hooks'
import type { UserType } from 'lib/app.type'
import { selectedRoom } from 'redux/room.store'
import { userSelector } from 'redux/user.store'
import useDebounce from 'hooks/useDebounce'
import { searchUser } from 'api/user.api'
import { apiClient } from 'api/apiClient'

type Props = {
  searchTerm?: string
  handleCloseSearchAndClearInput: () => void
}

const SearchResult: React.FC<Props> = ({
  searchTerm,
  handleCloseSearchAndClearInput,
}) => {
  const dispatch = useAppDispatch()
  const [peoples, setPeoples] = useState([])
  const [activeTab, setActiveTab] = useState<number>(0)
  const user = useAppSelector(userSelector.selectUser)

  const debouncedSearchTerm = useDebounce(searchTerm ?? '', 200)

  useEffect(() => {
    if (!debouncedSearchTerm) return
    const fetchSearch = async () => {
      try {
        const users = await searchUser({
          q: debouncedSearchTerm,
          userId: user._id || 'hi',
        })
        setPeoples(users)
      } catch (error) {
        console.error(error)
      }
    }
    fetchSearch()
  }, [debouncedSearchTerm, activeTab])

  const handleSelectRooms = async (recipient: UserType) => {
    // check if room is exist
    try {
      const response = await apiClient.get('/room/check-room', {
        params: {
          senderId: user?._id,
          recipientId: recipient?._id,
        },
      })
      if (response.status === 200) {
        // navigate to chat
        dispatch(
          selectedRoom({
            roomId: response.data._id,
            recipient,
            latestMessage: response.data.latestMessage,
          }),
        )
      } else {
        // new chat
        dispatch(selectedRoom({ roomId: null, recipient }))
      }
      handleCloseSearchAndClearInput()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <TabGroup onChange={index => setActiveTab(index)}>
        <TabList className="flex px-2 gap-2">
          <Tab className="flex-1">
            {({ hover, selected }) => (
              <span
                className={classNames(
                  'text-grey-950 dark:text-grey-50 block text-sm  rounded-2xl py-1 ',
                  {
                    'hover:bg-grey-200  dark:hover:bg-grey-800': hover,
                    'bg-blue-100 dark:bg-blue-900 font-bold !text-blue-500':
                      selected,
                  },
                )}
              >
                People
              </span>
            )}
          </Tab>
          <Tab className="flex-1">
            {({ hover, selected }) => {
              return (
                <span
                  className={classNames(
                    'text-grey-950 dark:text-grey-50 block text-sm  rounded-2xl py-1 ',
                    {
                      'hover:bg-grey-200 dark:hover:bg-grey-800': hover,
                      'bg-blue-100 dark:bg-blue-900 font-bold !text-blue-500':
                        selected,
                    },
                  )}
                >
                  Chat
                </span>
              )
            }}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel className="pt-2  overflow-hidden">
            {peoples.map((people: UserType) => {
              return (
                <div
                  onClick={() => handleSelectRooms(people)}
                  key={people?._id}
                  className="hover:bg-grey-200 dark:hover:bg-grey-800 cursor-pointer"
                >
                  <div className="flex items-center px-2 py-3">
                    <UserAvatar
                      alt={people?.display_name}
                      src={people?.picture}
                      size="lg"
                    />
                    <div className="pl-2 flex-1">
                      <span className="font-bold">{people?.display_name}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </TabPanel>
          <TabPanel>result about room chat</TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  )
}

export default SearchResult
