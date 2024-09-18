import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'

import { useAppSelector } from 'modules/core/hooks'
import { authSelector } from 'modules/auth/states/authSlice'
import classNames from 'classnames'
import { Fragment } from 'react/jsx-runtime'
import { groupEmojiByUserId } from '../utils/message'
import { UserAvatar, AppModal } from 'modules/core/components'

type Props = {
  isOpen: boolean
  onClose: () => void
  reacts: Array<{ emoji: string; ownerId: string }>
  recipient: {
    _id: string | null
    picture: string | null
    displayName: string | null
  }
}

const MessageReactionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  reacts,
  recipient,
}) => {
  const userLogin = useAppSelector(authSelector.selectUser)
  console.log({ reacts })

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
        <TabList className="flex items-center">{renderTab('All')}</TabList>
        <TabPanels className="max-h-80 overflow-auto">
          <TabPanel>
            {groupEmojiByUserId(reacts).map(react => {
              console.log({ react })
              return renderUserReactInfo({
                _id: react.ownerId,
                emoji: react.emojis.join(' ') + ' ' + react.amount,
              })
            })}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </AppModal>
  )
}

export default MessageReactionModal
