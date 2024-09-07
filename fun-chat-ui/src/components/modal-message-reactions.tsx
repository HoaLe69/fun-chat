import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'

import AppModal from './common/app-modal'
import { useAppSelector } from 'hooks'
import { userSelector } from 'redux/user.store'
import classNames from 'classnames'
import UserAvatar from './user-avatar'
import { Fragment } from 'react/jsx-runtime'

type Props = {
  isOpen: boolean
  onClose: () => void
  reacts: Array<{ emoji: string; ownerIds: Array<string> }>
  recipient: {
    _id: string | null
    picture: string | null
    displayName: string | null
  }
}
const MessageReactionsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  reacts,
  recipient,
}) => {
  const userLogin = useAppSelector(userSelector.selectUser)

  const renderTab = (emoji: string) => {
    return (
      <Tab as={Fragment} key={emoji}>
        {({ hover, selected }) => (
          <div
            className={classNames(
              'border-b-2',
              selected ? 'border-b-blue-500' : 'border-b-transparent',
            )}
          >
            <button
              className={classNames(
                'py-2 px-3 rounded-md',
                hover && 'bg-grey-300 dark:bg-grey-700',
                selected ? 'text-blue-500' : 'text-grey-950 dark:text-grey-50',
              )}
            >
              {emoji}
            </button>
          </div>
        )}
      </Tab>
    )
  }

  const renderUserReactInfo = ({
    _id,
    emoji,
  }: {
    _id: string
    emoji: string
  }) => {
    const currUser = _id === userLogin._id
    return (
      <div
        className="mt-2 gap-2 flex items-center text-grey-950 dark:text-grey-50"
        key={_id}
      >
        <UserAvatar
          src={(currUser ? userLogin?.picture : recipient?.picture) || ''}
          alt={
            (currUser ? userLogin?.display_name : recipient?.displayName) || ''
          }
        />
        <p className="text-sm">
          {currUser ? userLogin?.display_name : recipient?.displayName}
        </p>
        <span className="ml-auto">{emoji}</span>
      </div>
    )
  }

  return (
    <AppModal isOpen={isOpen} onClose={onClose} title="Message Reactions">
      <TabGroup>
        <TabList className="flex items-center">
          {renderTab('All')}
          {reacts.map(react =>
            renderTab(react.emoji + ' ' + react.ownerIds.length),
          )}
        </TabList>
        <TabPanels className="max-h-80 overflow-auto">
          <TabPanel>
            {reacts.map(react => {
              return react.ownerIds.map((owner: string) => {
                return renderUserReactInfo({ _id: owner, emoji: react.emoji })
              })
            })}
          </TabPanel>
          {reacts.map(react => (
            <TabPanel key={react.emoji}>
              {react.ownerIds.map((owner: string) =>
                renderUserReactInfo({ _id: owner, emoji: react.emoji }),
              )}
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </AppModal>
  )
}

export default MessageReactionsModal
