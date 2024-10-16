import classNames from 'classnames'
import type { IMessage } from 'modules/chat/types'
import { UserAvatar } from 'modules/core/components'
import ContextualMenu from './ContextualMenu'
import ReactionPicker from './ReactionPicker'
import { CheckCircle, CheckCircleFill } from 'modules/core/components/icons'
import { useState } from 'react'

type Props = IMessage & {
  isLast?: boolean
  recipient: {
    _id?: string
    picture?: string
    displayName?: string
  }
  userLoginId: string | undefined
}

const Message: React.FC<Props> = props => {
  const {
    _id,
    roomId,
    isLast,
    userLoginId,
    text,
    ownerId: senderMessageId,
    status,
    recipient,
  } = props
  const [contextualMenuOpen, setContextualMenuOpen] = useState<boolean>(false)
  const viewedAs = userLoginId === senderMessageId ? 'sender' : 'recipient'

  return (
    <div
      data-room-id={roomId}
      data-msg-id={_id}
      className={classNames(
        'group my-2',
        // { 'new-message': status?.type !== 'seen' && viewedAs === 'recipient' },
        {
          'last-message':
            isLast && viewedAs === 'recipient' && status?.type !== 'seen',
        },
      )}
    >
      <MessageOuter>
        <MessageAvatar>
          {viewedAs === 'recipient' && (
            <UserAvatar
              src={recipient.picture || ''}
              alt={recipient.displayName || ''}
            />
          )}
        </MessageAvatar>
        <MessageInner viewedAs={viewedAs}>
          <MessageBubble viewedAs={viewedAs}>{text}</MessageBubble>
          <MessageActions viewedAs={viewedAs}>
            <div
              className={classNames(
                'items-center hidden group-hover:flex gap-1',
                {
                  '!flex': contextualMenuOpen,
                },
              )}
            >
              <ReactionPicker setContextualMenuOpen={setContextualMenuOpen} />
              <ContextualMenu setContextualMenuOpen={setContextualMenuOpen} />
            </div>
          </MessageActions>
          <MessageSpacer />
        </MessageInner>
        <MessageStatus
          seenIcon={recipient?.picture}
          viewedAs={viewedAs}
          status={status}
        ></MessageStatus>
      </MessageOuter>
    </div>
  )
}

const Wrapper = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => <div className={classNames('group my-2', className)}>{children}</div>

const MessageOuter = ({ children }: { children: React.ReactNode }) => (
  <div className="flex">{children}</div>
)

const MessageInner = ({
  children,
  viewedAs,
}: {
  children: React.ReactNode
  viewedAs: string
}) => {
  const direction = viewedAs === 'sender' && 'flex-row-reverse'
  return <div className={classNames('flex-1 flex', direction)}>{children}</div>
}

const MessageBubble = ({
  children,
  viewedAs,
}: {
  children: React.ReactNode
  viewedAs: string
}) => {
  const roundedCorner =
    viewedAs === 'sender' ?
      'rounded-bl-xl rounded-br-sm'
    : 'rounded-br-xl rounded-bl-sm'

  const themeMessageBubble =
    viewedAs === 'sender' ?
      'bg-blue-100  dark:bg-blue-900'
    : 'bg-grey-200 dark:bg-grey-800'

  return (
    <div
      className={classNames(
        'max-w-[calc(100%-5rem)] p-2 break-words  rounded-t-xl',
        roundedCorner,
        themeMessageBubble,
      )}
    >
      {children}
    </div>
  )
}

const MessageAvatar = ({ children }: { children: React.ReactNode }) => (
  <div className="pl-[6px] pr-4">{children}</div>
)
const MessageActions = ({
  children,
  viewedAs,
}: {
  children: React.ReactNode
  viewedAs: string
}) => {
  const paddingDirections = viewedAs === 'sender' ? 'pr-2' : 'pl-2'
  return (
    <div
      className={classNames(
        'flex w-20 flex-shrink-0  flex-col items-center justify-center',
        paddingDirections,
      )}
    >
      {children}
    </div>
  )
}
const MessageSpacer = () => <div className="flex-1 min-w-28" />

const MessageStatus = ({
  status,
  viewedAs,
  seenIcon,
}: {
  status?: {
    readBy: Array<string>
    type: string
  }
  viewedAs: string
  seenIcon?: string
}) => {
  const StatusIconComp = () => {
    switch (status?.type) {
      case 'sent':
        return <CheckCircle />
      case 'delivered':
        return <CheckCircleFill />
      case 'seen':
        //TODO: render the user avatar here
        return <img className="rounded-full" src={seenIcon} alt="seen icon" />
    }
  }
  return (
    <div className="w-5 flex flex-col items-center justify-end ml-1">
      {viewedAs === 'sender' && (
        <span className="rounded-full  w-4 h-4 block text-sm text-grey-500 font-semibold">
          <StatusIconComp />
        </span>
      )}
    </div>
  )
}

export default Message
