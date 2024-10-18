import classNames from 'classnames'
import type { IMessage } from 'modules/chat/types'
import { UserAvatar } from 'modules/core/components'
import ContextualMenu from './ContextualMenu'
import ReactionPicker from './ReactionPicker'
import { CheckCircle, CheckCircleFill } from 'modules/core/components/icons'
import { memo, useState } from 'react'
import { useAppSelector } from 'modules/core/hooks'
import { selectCurrentRoomInfo } from '../states/roomSlice'

type Props = IMessage & {
  isLast?: boolean
  showAvatar: boolean
  type: string
  position: string | null
  userLoginId: string | undefined
  showStatusMsg: boolean
}

const Message: React.FC<Props> = props => {
  const {
    _id,
    type,
    text,
    isLast,
    status,
    ownerId,
    userLoginId,
    position,
    showAvatar,
    showStatusMsg,
  } = props
  const [contextualMenuOpen, setContextualMenuOpen] = useState<boolean>(false)
  const roomSelectedInfo = useAppSelector(selectCurrentRoomInfo)
  const viewedAs = userLoginId === ownerId ? 'sender' : 'recipient'

  const markMessage = () => {
    let className = ''
    if (viewedAs === 'sender') return
    if (status?.type !== 'seen') className += 'new-message '
    if (isLast) className += 'last-message'
    return className
  }

  return (
    <>
      <div
        data-msg-id={_id}
        className={classNames('group my-2', markMessage(), {
          '!my-[2px]': type === 'group',
        })}
      >
        <MessageOuter>
          <MessageAvatar>
            {viewedAs === 'recipient' &&
              (showAvatar ?
                <UserAvatar
                  src={roomSelectedInfo?.picture || ''}
                  alt={roomSelectedInfo?.name || ''}
                />
              : <div className="w-9 h-9" />)}
          </MessageAvatar>
          <MessageInner viewedAs={viewedAs}>
            <MessageBubble viewedAs={viewedAs} position={position}>
              {text}
            </MessageBubble>
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
        </MessageOuter>
      </div>
      <div className="flex justify-end">
        {showStatusMsg && viewedAs === 'sender' && (
          <MessageStatus
            seenIcon={roomSelectedInfo?.picture}
            status={status}
          ></MessageStatus>
        )}
      </div>
    </>
  )
}

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
  position,
}: {
  children: React.ReactNode
  viewedAs: string
  position: string | null
}) => {
  const themeMessageBubble =
    viewedAs === 'sender' ?
      'bg-blue-100  dark:bg-blue-900'
    : 'bg-grey-200 dark:bg-grey-800'

  const rounded = (() => {
    switch (position) {
      case 'first':
        return viewedAs === 'sender' ?
            'rounded-l-3xl rounded-tr-3xl'
          : 'rounded-r-3xl rounded-tl-3xl'
      case 'middle':
        return viewedAs === 'sender' ? 'rounded-l-3xl' : 'rounded-r-3xl'
      case 'last':
        return viewedAs === 'sender' ?
            'rounded-l-3xl rounded-br-3xl'
          : 'rounded-r-3xl rounded-bl-3xl'
      case null:
        return 'rounded-3xl'
    }
  })()
  return (
    <div
      className={classNames(
        'max-w-[calc(100%-5rem)] p-2 px-4 break-words',
        themeMessageBubble,
        rounded,
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
  seenIcon,
}: {
  status?: {
    readBy: Array<string>
    type: string
  }
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
      <span className="rounded-full  w-4 h-4 block text-sm text-grey-500 font-semibold">
        <StatusIconComp />
      </span>
    </div>
  )
}

export default memo(Message)
