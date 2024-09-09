import classNames from 'classnames'
import moment from 'moment'

import type { MessageType } from 'lib/app.type'
import UserAvatar from 'components/user-avatar'

import ReactionPicker from 'components/reaction-picker'
import ContextualMenu from 'components/contextual-menu'
import { groupReactMessageByEmoji } from 'utils/message'
import { useState } from 'react'
import useSocket from 'hooks/useSocket'
import MessageReactionsModal from 'components/modal-message-reactions'
import { updateMessageAsync } from 'api/message.api'
import { timeToSeconds } from 'utils/time'
import { useAppDispatch, useAppSelector } from 'hooks'
import { roomSelector, updateLatestMessage } from 'redux/room.store'
import { apiClient } from 'api/apiClient'

type MessageProps = MessageType & {
  recipient: {
    _id: string | null
    picture: string | null
    displayName: string | null
  }
  userLoginId: string | null
}

const Message: React.FC<MessageProps> = ({
  _id,
  text,
  react,
  roomId,
  ownerId,
  isDeleted,
  recipient,
  createdAt,
  userLoginId,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const { sendMessage } = useSocket()
  const latestMessage = useAppSelector(
    roomSelector.selectLatestMessageOfSelectdRoom,
  )
  const dispatch = useAppDispatch()

  const isCurrentUser = userLoginId === ownerId
  const fallbackImg = 'https://placehold.co/600x400.png'

  const onClose = () => {
    setShowModal(false)
  }

  const handleReactMessage = async (emoji: string) => {
    if (!emoji) return

    if (!userLoginId) return

    await updateMessageAsync({
      type: 'react',
      data: {
        messageId: _id,
        ownerId: userLoginId,
        emoji,
      },
    })

    sendMessage({
      destination: 'chat:sendReactIcon',
      data: {
        icon: emoji,
        roomId,
        messageId: _id,
        ownerId: userLoginId,
      },
    })
  }

  const handleRecallMessage = async (cb: () => void) => {
    if (!_id) return

    // message identify is the latest or not
    const isLatestMessage =
      timeToSeconds(createdAt) === timeToSeconds(latestMessage.createdAt)

    const msg = await updateMessageAsync({
      type: 'recall',
      data: {
        messageId: _id,
      },
    })

    if (isLatestMessage && msg) {
      const latestMessage = {
        text: 'Message was recall',
        createdAt: msg.data.updatedAt,
        ownerId: msg.data.ownerId,
      }

      await apiClient.patch(`/room/update/latestMessage/${roomId}`, {
        latestMessage,
      })

      dispatch(updateLatestMessage({ roomId, latestMessage }))
    }

    // send to socket server
    sendMessage({
      destination: 'chat:recallMessage',
      data: {
        roomId,
        messageId: _id,
        recipientId: recipient?._id,
        isNotifyRecipient: isLatestMessage,
        modifyTime: msg?.data.updatedAt,
      },
    })
    cb()
  }

  const renderTextMessage = () => (
    <div
      className={classNames(
        'px-4 py-2 rounded-t-[18px]',
        isCurrentUser
          ? 'bg-blue-100 dark:bg-blue-900 rounded-bl-[18px] rounded-br-sm'
          : 'bg-grey-200 dark:bg-grey-800 rounded-br-[18px] rounded-bl-sm',
      )}
    >
      <p className="text-sm">
        {isDeleted ? (
          <i className="text-grey-600">Message wall recall</i>
        ) : (
          text
        )}
      </p>
    </div>
  )

  const renderReactInMessage = () => {
    const handleShowListReactInfo = () => {
      setShowModal(true)
    }
    return (
      <div className="flex items-center mb-1 gap-1">
        {!isDeleted &&
          groupReactMessageByEmoji(react).map((item, index) => (
            <span
              onClick={handleShowListReactInfo}
              key={index}
              className="px-2 py-1 text-[12px] rounded-md bg-grey-100 dark:bg-grey-900 cursor-pointer"
            >
              {item.emoji} {item.amount}
            </span>
          ))}
      </div>
    )
  }

  return (
    <div
      className={classNames('flex py-2 flex-col pl-10 items-start group', {
        'items-end': isCurrentUser,
      })}
    >
      {renderReactInMessage()}
      <div
        className={classNames('relative flex-1 flex items-center gap-2', {
          'flex-row-reverse': isCurrentUser,
        })}
      >
        {renderTextMessage()}
        {!isCurrentUser && (
          <div className="mr-2 absolute top-full -translate-y-full right-full">
            <UserAvatar
              src={recipient.picture ?? fallbackImg}
              alt={recipient.displayName ?? ''}
            />
          </div>
        )}
        {!isDeleted && (
          <>
            <ReactionPicker onReact={handleReactMessage} />
            <ContextualMenu
              onRecall={handleRecallMessage}
              isCurrentUser={isCurrentUser}
            />
          </>
        )}
        <div className="flex-[1]" />
      </div>
      <div>
        <span className="text-[12px] text-grey-500">
          {moment(createdAt).format('LT')}
        </span>
      </div>
      {showModal && (
        <MessageReactionsModal
          reacts={react}
          isOpen={showModal}
          onClose={onClose}
          recipient={recipient}
        />
      )}
    </div>
  )
}

export default Message
