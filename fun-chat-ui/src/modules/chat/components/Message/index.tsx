import { useAppSelector } from 'modules/core/hooks'
import type { IMessage } from 'modules/chat/types'
import { authSelector } from 'modules/auth/states/authSlice'
import { memo, useCallback, useState } from 'react'
import { selectCurrentRoomInfo } from 'modules/chat/states/roomSlice'
import MessageActions from './MessageActions'
import MessageReply from './MessageReply'
import { MessageInner, MessageContainer, MessageLeft, MessageRight, MessageRightHeader } from './MessageLayout'
import { UserAvatar } from 'modules/core/components'
import moment from 'moment'
import classNames from 'classnames'
import MessageDivider from './MessageDivider'
import MessageContent from './MessageContent'
import MessageReaction from './MessageReaction'

interface Props {
  message: IMessage
  msgType?: string
  position?: string
  showAvatar?: boolean
  showTimeDivider?: string
}

const Message: React.FC<Props> = ({ message, ...extra }) => {
  const [contextualMenuOpen, setContextualMenuOpen] = useState<boolean>(false)
  const { showAvatar, showTimeDivider, msgType } = extra

  const userLogin = useAppSelector(authSelector.selectUser)
  const roomSelectedInfo = useAppSelector(selectCurrentRoomInfo)

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
  }, [])

  return (
    <>
      {showTimeDivider && <MessageDivider divider={showTimeDivider} />}
      <MessageContainer className={classNames({ 'mt-4': msgType === 'single' })} messageId={message._id}>
        {message.replyTo && (
          <MessageReply
            handleMoveToReplyMessage={handleMoveToReplyMessage}
            replyMessage={message.replyTo}
            userLogin={userLogin}
          />
        )}
        <MessageInner>
          <MessageLeft>
            {showAvatar ? (
              <UserAvatar
                src={message?.ownerId === userLogin?._id ? userLogin?.picture : roomSelectedInfo?.picture || ''}
                alt={message?.ownerId === userLogin?._id ? userLogin?.display_name : roomSelectedInfo?.name || ''}
              />
            ) : (
              <span className="text-xs pt-2 hidden group-hover:inline-block text-grey-500/90 dark:text-grey-400/90">
                {moment(message.createdAt).format('h:mm A')}
              </span>
            )}
          </MessageLeft>

          <MessageRight>
            <MessageRightHeader
              showAvatar={showAvatar}
              createdAt={message.createdAt}
              display_name={
                message?.ownerId === userLogin?._id ? userLogin?.display_name : roomSelectedInfo?.name || ''
              }
            />
            <MessageContent content={message.content} isDeleted={message.isDeleted} msgId={message?._id} />
            <MessageReaction react={message?.react} />
          </MessageRight>
        </MessageInner>
        {!message.isDeleted && (
          <MessageActions
            userLoginId={userLogin?._id}
            react={message.react}
            messageId={message._id}
            setContextualMenuOpen={setContextualMenuOpen}
            contextualMenuOpen={contextualMenuOpen}
            originalMessage={message}
          />
        )}
      </MessageContainer>
    </>
  )
}

export default memo(Message)
