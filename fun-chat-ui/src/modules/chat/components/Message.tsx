import classNames from 'classnames'
import type { IMessage } from 'modules/chat/types'
import { UserAvatar } from 'modules/core/components'
import MessageActionsMenu from './MessageActionsMenu'
import MessageReactionPicker from './MessageReactionPicker'
import MessageReactionModal from './MessageReactionModal'
import {
  CheckCircle,
  CheckCircleFill,
  ReplyIcon,
} from 'modules/core/components/icons'
import { memo, useCallback, useEffect, useState } from 'react'
import { useAppSelector } from 'modules/core/hooks'
import { selectCurrentRoomInfo } from '../states/roomSlice'
import { groupReactionByEmoji } from '../utils/message'
import { messageServices } from '../services'
import { authSelector } from 'modules/auth/states/authSlice'

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
    react,
    replyTo,
    isLast,
    isDeleted,
    status,
    ownerId,
    userLoginId,
    position,
    showAvatar,
    showStatusMsg,
    statusOfReplyMessage,
  } = props
  const [replyMessage, setReplyMessage] = useState<IMessage>()
  const [reactionListVisible, setReactionListVisible] = useState<boolean>(false)
  const [contextualMenuOpen, setContextualMenuOpen] = useState<boolean>(false)
  const roomSelectedInfo = useAppSelector(selectCurrentRoomInfo)
  const userLogin = useAppSelector(authSelector.selectUser)
  const viewedAs = userLoginId === ownerId ? 'sender' : 'recipient'

  const markMessage = () => {
    let className = ''
    if (viewedAs === 'sender') return
    if (status?.type !== 'seen') className += 'new-message '
    if (isLast) className += 'last-message'
    return className
  }

  useEffect(() => {
    if (!replyTo) return
    const fetchMessage = async () => {
      try {
        //@ts-ignore
        const msg = await messageServices.getMessageById(replyTo) // optimize for this api call later

        setReplyMessage(msg)
      } catch (error) {
        console.log(error)
      }
    }
    fetchMessage()
  }, [statusOfReplyMessage])

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
      if (replyMessage?.ownerId === userLogin?._id) {
        text =
          replyMessage?.isDeleted ?
            'You replied to a removed message'
          : 'You replied to yourself'
      } else {
        text =
          replyMessage?.isDeleted ?
            'You replied to a removed message'
          : `You replied to ${roomSelectedInfo?.name}`
      }
    } else {
      if (replyMessage?.ownerId === userLogin?._id) {
        text =
          replyMessage?.isDeleted ?
            `${roomSelectedInfo?.name} replied to a removed message`
          : `${roomSelectedInfo?.name} replied to you`
      } else {
        text =
          replyMessage?.isDeleted ?
            `${roomSelectedInfo?.name} replied to a removed message`
          : `${roomSelectedInfo?.name} replied to themself`
      }
    }

    return text
  }, [replyMessage])

  const handleMoveToReplyMessage = useCallback(() => {
    if (!replyMessage) return
    const messageEl = document.getElementById(replyMessage._id)
    if (messageEl) {
      messageEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
      messageEl.style.animation = 'highlight ease 2s'
      setTimeout(() => {
        messageEl.style.animation = 'none'
      }, 2000)
    }
  }, [replyMessage])

  return (
    <>
      <Wrapper
        id={_id}
        className={classNames(
          markMessage(),
          {
            '!my-[2px]': type === 'group',
          },
          { '!mb-4': react.length > 0 && !isDeleted },
        )}
      >
        {replyTo && replyMessage && !isDeleted && (
          <MessageReply
            text={replyMessage?.text}
            isRemoved={replyMessage.isDeleted}
            viewedAs={viewedAs}
            replyDirection={displayRepliedText()}
            onClick={handleMoveToReplyMessage}
          />
        )}

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
            <MessageBubbleWrapper>
              <MessageReaction
                viewedAs={viewedAs}
                isDeleted={isDeleted}
                onClick={handleVisibleReactionList}
                react={react}
              />
              <MessageBubble id={_id} viewedAs={viewedAs} position={position}>
                {isDeleted ?
                  <p className="text-grey-500 italic">message was recall</p>
                : <div>{text}</div>}
              </MessageBubble>
            </MessageBubbleWrapper>
            <MessageActions
              tryVisible={contextualMenuOpen}
              visible={!isDeleted}
              viewedAs={viewedAs}
            >
              <MessageReactionPicker
                setContextualMenuOpen={setContextualMenuOpen}
                messageId={_id}
                react={react}
              />
              <MessageActionsMenu
                msg={{ _id, ownerId }}
                content={text}
                allowDel={ownerId === userLoginId}
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
        status={status}
      />
      {/*Modal area*/}
      <>
        {reactionListVisible && (
          <MessageReactionModal
            reacts={react}
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
  <div className="relative msg-bubble-wrapper max-w-[calc(100%-5rem)]">
    {children}
  </div>
)

const MessageBubble = ({
  children,
  viewedAs,
  position,
  id,
}: {
  children: React.ReactNode
  viewedAs: string
  position: string | null
  id: string
}) => {
  const themeMessageBubble =
    viewedAs === 'sender' ?
      'bg-blue-600  dark:bg-blue-500 text-white'
    : 'bg-grey-300 dark:bg-grey-700'

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
      id={id}
      className={classNames(
        'p-2 px-4 break-words',
        themeMessageBubble,
        rounded,
      )}
    >
      {children}
    </div>
  )
}
const MessageReply = ({
  text,
  viewedAs,
  replyDirection,
  isRemoved,
  onClick,
}: {
  text?: string
  viewedAs: string
  isRemoved: boolean
  replyDirection: string
  onClick: () => void
}) => (
  <div className="flex justify-between translate-y-2">
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
          { 'pointer-events-none': isRemoved },
        )}
      >
        <div>
          {isRemoved ?
            <i className="text-grey-500">Message removed</i>
          : <p className="truncate text-sm">{text}</p>}
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
}) => (
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
          {groupReactionByEmoji(react).map(r => {
            return `${r.emoji} ${r.amount > 1 ? r.amount : ' '}`
          })}
        </span>
      )}
    </div>
  </div>
)

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
