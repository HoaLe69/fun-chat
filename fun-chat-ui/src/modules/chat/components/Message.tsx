import classNames from 'classnames'
import type { IMessage } from 'modules/chat/types'
import { UserAvatar } from 'modules/core/components'
import ContextualMenu from './ContextualMenu'
import ReactionPicker from './ReactionPicker'
import { useState } from 'react'

type Props = IMessage & {
  recipient: {
    _id?: string
    picture?: string
    displayName?: string
  }
  userLoginId: string | undefined
}

const Message: React.FC<Props> = props => {
  const { userLoginId, text, ownerId: senderMessageId } = props
  const [contextualMenuOpen, setContextualMenuOpen] = useState<boolean>(false)
  const viewedAs = userLoginId === senderMessageId ? 'sender' : 'recipient'

  return (
    <Wrapper>
      <MessageOuter>
        <MessageAvatar>
          {viewedAs === 'recipient' && (
            <UserAvatar
              src={props.recipient.picture || ''}
              alt={props.recipient.displayName || ''}
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
        <MessageStatus>
          <span className="rounded-full bg-gray-300 w-4 h-4 block" />
        </MessageStatus>
      </MessageOuter>
    </Wrapper>
  )
}

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="group my-2">{children}</div>
)

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

const MessageStatus = ({ children }: { children: React.ReactNode }) => (
  <div className="w-5 flex flex-col items-center justify-end">{children}</div>
)

export default Message
