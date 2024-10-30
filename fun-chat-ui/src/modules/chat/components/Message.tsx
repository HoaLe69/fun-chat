//TODO: migrate UI Message like discord
//TODO: Render file ui , preview code if if is programming file
//TODO: Change app theme

import classNames from 'classnames'
import type { IMessage, IMessageContent } from 'modules/chat/types'
import { UserAvatar } from 'modules/core/components'
import MessageActionsMenu from './MessageActionsMenu'
import MessageReactionPicker from './MessageReactionPicker'
import MessageReactionModal from './MessageReactionModal'
import {
  CheckCircle,
  CheckCircleFill,
  ReplyIcon,
} from 'modules/core/components/icons'
import { forwardRef, memo, useCallback, useState } from 'react'
import { useAppSelector } from 'modules/core/hooks'
import { selectCurrentRoomInfo } from '../states/roomSlice'
import { groupReactionByEmoji } from '../utils/message'
import { authSelector } from 'modules/auth/states/authSlice'
import Tippy from '@tippyjs/react/headless'
import moment from 'moment'

type Props = IMessage & {
  isLast?: boolean
  showAvatar: boolean
  showTimeDivider: string
  type: string
  position: string | null
  userLoginId: string | undefined
  showStatusMsg: boolean
}

const Message: React.FC<Props> = (props) => {
  const {
    type,
    isLast,
    userLoginId,
    position,
    showAvatar,
    showTimeDivider,
    showStatusMsg,
    ...message
  } = props
  const [reactionListVisible, setReactionListVisible] = useState<boolean>(false)
  const [contextualMenuOpen, setContextualMenuOpen] = useState<boolean>(false)
  const roomSelectedInfo = useAppSelector(selectCurrentRoomInfo)
  const userLogin = useAppSelector(authSelector.selectUser)
  const viewedAs = userLoginId === message.ownerId ? 'sender' : 'recipient'

  const markMessage = () => {
    let className = ''
    if (viewedAs === 'sender') return
    if (message.status?.type !== 'seen') className += 'new-message '
    if (isLast) className += 'last-message'
    return className
  }

  const handleVisibleReactionList = useCallback(() => {
    setReactionListVisible(true)
  }, [])
  const handleCloseReactionList = useCallback(() => {
    setReactionListVisible(false)
  }, [])

  const displayRepliedText = useCallback(() => {
    let text = ''
    /**
     * viewedAs current user -----> you replied to yourself or replied to the other uesr
     * viewedAs sender ---> sender name replied to you or themself
     * */
    if (viewedAs === 'sender') {
      if (message.replyTo?.ownerId === userLogin?._id) {
        text = message.replyTo?.isDeleted
          ? 'You replied to a removed message'
          : 'You replied to yourself'
      } else {
        text = message.replyTo?.isDeleted
          ? 'You replied to a removed message'
          : `You replied to ${roomSelectedInfo?.name}`
      }
    } else {
      if (message.replyTo?.ownerId === userLogin?._id) {
        text = message.replyTo?.isDeleted
          ? `${roomSelectedInfo?.name} replied to a removed message`
          : `${roomSelectedInfo?.name} replied to you`
      } else {
        text = message.replyTo?.isDeleted
          ? `${roomSelectedInfo?.name} replied to a removed message`
          : `${roomSelectedInfo?.name} replied to themself`
      }
    }

    return text
  }, [message.replyTo])

  const handleMoveToReplyMessage = useCallback(() => {
    if (!message.replyTo) return
    const messageEl = document.getElementById(message.replyTo?._id)
    if (messageEl) {
      messageEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
      messageEl.style.animation = 'highlight ease 2s'
      setTimeout(() => {
        messageEl.style.animation = 'none'
      }, 2000)
    }
  }, [message.replyTo])

  return (
    <>
      {showTimeDivider && (
        <div className="flex items-center justify-center my-2 text-grey-500 font-medium">
          {showTimeDivider}
        </div>
      )}
      <Wrapper
        id={message._id}
        className={classNames(
          markMessage(),
          {
            '!my-[2px]': type === 'group',
          },
          { '!mb-4': message.react.length > 0 && !message.isDeleted },
        )}
      >
        {message.replyTo && (
          <MessageReply
            message={message.replyTo}
            viewedAs={viewedAs}
            replyDirection={displayRepliedText()}
            onClick={handleMoveToReplyMessage}
          />
        )}

        <MessageOuter>
          <MessageAvatar>
            {viewedAs === 'recipient' &&
              (showAvatar ? (
                <UserAvatar
                  src={roomSelectedInfo?.picture || ''}
                  alt={roomSelectedInfo?.name || ''}
                />
              ) : (
                <div className="w-9 h-9" />
              ))}
          </MessageAvatar>
          <MessageInner viewedAs={viewedAs}>
            <MessageBubbleWrapper>
              <MessageReaction
                viewedAs={viewedAs}
                isDeleted={message.isDeleted}
                onClick={handleVisibleReactionList}
                react={message.react}
              />
              <Tippy
                placement="right"
                delay={1000}
                render={(attrs) => (
                  <div
                    {...attrs}
                    className={classNames(
                      'p-2 rounded-xl bg-black/80 text-grey-50 dark:bg-white/80 dark:text-grey-950',
                    )}
                  >
                    <span>{moment(message.createdAt).format('hh:mm A')}</span>
                  </div>
                )}
              >
                <MessageBubble
                  id={message._id}
                  viewedAs={viewedAs}
                  type={type}
                  position={position}
                >
                  {message?.isDeleted ? (
                    <p className="italic text-grey-500 p-2">
                      message was recall
                    </p>
                  ) : (
                    <>
                      {message.content?.images.length > 0 && (
                        <div className="flex items-center w-full justify-center bg-grey-50 dark:bg-grey-950">
                          {message.content?.images.map((img) => (
                            <img
                              loading="lazy"
                              className="w-full h-full max-w-md max-h-80 object-cover"
                              key={img.url}
                              src={img.url}
                              alt={img.altText}
                            />
                          ))}
                        </div>
                      )}
                      {message.content.text && (
                        <div className={classNames('p-2')}>
                          {message.content.text}
                        </div>
                      )}
                    </>
                  )}
                </MessageBubble>
              </Tippy>
            </MessageBubbleWrapper>
            <MessageActions
              tryVisible={contextualMenuOpen}
              visible={!message.isDeleted}
              viewedAs={viewedAs}
            >
              <MessageReactionPicker
                setContextualMenuOpen={setContextualMenuOpen}
                messageId={message._id}
                react={message.react}
              />
              <MessageActionsMenu
                message={message}
                allowDel={message.ownerId === userLoginId}
                setContextualMenuOpen={setContextualMenuOpen}
              />
            </MessageActions>
            <MessageSpacer />
          </MessageInner>
        </MessageOuter>
      </Wrapper>

      <MessageStatus
        visible={showStatusMsg && viewedAs === 'sender'}
        seenIcon={roomSelectedInfo?.picture}
        status={message.status}
      />
      {/*Modal area*/}
      <>
        {reactionListVisible && (
          <MessageReactionModal
            reacts={message.react}
            isOpen={reactionListVisible}
            onClose={handleCloseReactionList}
          />
        )}
      </>
    </>
  )
}
const Wrapper = ({
  id,
  children,
  className,
}: {
  id: string
  children: React.ReactNode
  className?: string
}) => (
  <div data-msg-id={id} className={classNames('group my-2', className)}>
    {children}
  </div>
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

const MessageBubbleWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="relative msg-bubble-wrapper max-w-[calc(100%-5rem)] min-w-14">
    {children}
  </div>
)

const MessageBubble = forwardRef(
  (
    {
      children,
      viewedAs,
      position,
      type,
      id,
    }: {
      children: React.ReactNode
      viewedAs: string
      position: string | null
      type: string
      id: string
    },
    ref,
  ) => {
    const themeMessageBubble =
      viewedAs === 'sender'
        ? 'bg-blue-100  dark:bg-blue-900 text-grey-950 dark:text-grey-50'
        : 'bg-grey-300 dark:bg-grey-700'

    const rounded = (() => {
      if (type === 'single') return 'rounded-3xl'
      switch (position) {
        case 'first':
          return viewedAs === 'sender'
            ? 'rounded-l-3xl rounded-tr-3xl'
            : 'rounded-r-3xl rounded-tl-3xl'
        case 'middle':
          return viewedAs === 'sender' ? 'rounded-l-3xl' : 'rounded-r-3xl'
        case 'last':
          return viewedAs === 'sender'
            ? 'rounded-l-3xl rounded-br-3xl'
            : 'rounded-r-3xl rounded-bl-3xl'
        case null:
          return 'rounded-3xl'
      }
    })()
    return (
      <div
        ref={ref}
        id={id}
        className={classNames(
          'flex flex-col shadow-[0_1px_2px_rgba(0,0,0,0.2)]',
          themeMessageBubble,
          rounded,
        )}
      >
        {children}
      </div>
    )
  },
)
const MessageReply = ({
  message,
  viewedAs,
  replyDirection,
  onClick,
}: {
  message: IMessage
  viewedAs: string
  replyDirection: string
  onClick: () => void
}) => (
  <div className="flex justify-between translate-y-2 min-h-10">
    <div className="w-9 ml-[6px] mr-4"></div>
    <div
      className={classNames('flex items-start flex-col min-w-0 flex-1', {
        'items-end': viewedAs === 'sender',
      })}
    >
      <span className="flex items-center gap-2 text-xs/6 text-grey-500">
        <ReplyIcon />
        {replyDirection}
      </span>
      <div
        onClick={onClick}
        className={classNames(
          'bg-grey-100 dark:bg-grey-900 rounded-2xl p-2 pb-4 max-w-[calc(100%-10rem)]',
          { 'pointer-events-none': message.isDeleted },
        )}
      >
        <div>
          {message.isDeleted ? (
            <i className="text-grey-500 text-sm">Message removed</i>
          ) : message.content &&
            message.content.images &&
            !message.content?.text ? (
            <img
              className="max-w-36 max-h-20 opacity-80 brightness-90"
              alt={message.content.images[0].altText}
              src={message.content.images[0].url}
            />
          ) : (
            <p className="truncate text-sm">{message.content?.text}</p>
          )}
        </div>
      </div>
    </div>
  </div>
)
const MessageReaction = ({
  viewedAs,
  react,
  isDeleted,
  onClick,
}: {
  viewedAs: string
  react: Array<{ ownerId: string; emoji: string }>
  isDeleted: boolean
  onClick: () => void
}) => {
  return (
    //TODO: margin bottom
    <div className="reaction mb-1 absolute top-full -translate-y-1/2 right-2 ">
      <div
        className={classNames('reaction-content flex gap-1 items-center', {
          'justify-end': viewedAs === 'sender',
        })}
      >
        {react.length > 0 && !isDeleted && (
          <span
            onClick={onClick}
            className="text-xs p-1 bg-grey-100 dark:bg-grey-900 rounded-xl cursor-pointer"
          >
            {groupReactionByEmoji(react).map((r) => {
              return `${r.emoji} ${r.amount > 1 ? r.amount : ' '}`
            })}
          </span>
        )}
      </div>
    </div>
  )
}

const MessageAvatar = ({ children }: { children: React.ReactNode }) => (
  <div className="pl-[6px] pr-4 flex flex-col justify-end">{children}</div>
)
const MessageActions = ({
  children,
  viewedAs,
  tryVisible,
  visible,
}: {
  children: React.ReactNode
  viewedAs: string
  tryVisible: boolean
  visible: boolean
}) => {
  const paddingDirections = viewedAs === 'sender' ? 'pr-2' : 'pl-2'
  return (
    <div
      className={classNames(
        'flex w-20 flex-shrink-0  flex-col items-center justify-center',
        paddingDirections,
      )}
    >
      <div
        className={classNames(
          'hidden group-hover:flex items-center gap-1 z-50',
          { '!flex': tryVisible },
        )}
      >
        {visible && children}
      </div>
    </div>
  )
}
const MessageSpacer = () => <div className="flex-1 min-w-28" />

const MessageStatus = ({
  visible,
  status,
  seenIcon,
}: {
  visible: boolean
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
    <div className="flex justify-end">
      {visible && (
        <span className="rounded-full  w-4 h-4 block text-sm text-grey-500 font-semibold">
          <StatusIconComp />
        </span>
      )}
    </div>
  )
}

export default memo(Message)
