import Message from './Message'
import { UserAvatar, EmptyState } from 'modules/core/components'
import ChatForm from './ChatForm'
import type { IMessage } from 'modules/chat/types'
import ReactLoading from 'react-loading'
import { ArrowDownIcon } from 'modules/core/components/icons'
import classNames from 'classnames'
import { useChatArea } from '../hooks'
import { useCallback } from 'react'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="relative w-3/4 flex flex-col bg-grey-50 dark:bg-grey-950">
    {children}
  </div>
)

const ChatArea: React.FC = () => {
  const {
    userLogin,
    typingIndicator,
    roomSelectedId,
    roomSelectedInfo,
    usersOnline,
    refContainer,
    refJumpToButton,
    historyMsgs,
    processMessageStatusAndTime,
    historyMsgsStatus,
    handleJumpToBottom,
  } = useChatArea()

  const renderHeaderChatArea = useCallback(
    () => (
      <div className="p-4 flex items-center bg-grey-50 dark:bg-grey-900 border-b-2 border-grey-300 dark:border-grey-700">
        <UserAvatar
          className="mr-4"
          alt={roomSelectedInfo?.name || ''}
          src={roomSelectedInfo?.picture || ''}
          size="md"
        />
        <div className="flex flex-col justify-start">
          <p className="font-bold leading-5">{roomSelectedInfo?.name}</p>
          <span
            className={classNames(
              'text-sm ',
              usersOnline[roomSelectedInfo?._id || '']?.status === 'online'
                ? 'text-green-500'
                : 'text-grey-500',
            )}
          >
            {usersOnline[roomSelectedInfo?._id || '']?.status === 'online'
              ? 'Online'
              : 'Offline'}
          </span>
        </div>
      </div>
    ),
    [roomSelectedInfo, usersOnline],
  )

  if (!roomSelectedId)
    return (
      <Wrapper>
        <div>No Room Selected</div>
      </Wrapper>
    )

  return (
    <Wrapper>
      {/*Header*/}
      {renderHeaderChatArea()}
      {/*Messages*/}
      <div
        ref={refContainer}
        className="flex-1 overflow-y-auto overflow-x-hidden px-2 flex flex-col justify-start"
      >
        {historyMsgsStatus === 'loading' ? (
          <div className="flex items-center justify-center h-full text-grey-500 font-medium">
            Loading message...
          </div>
        ) : (
          <>
            {historyMsgs?.length > 0 ? (
              <>
                {historyMsgs.map((message: IMessage, index: number) => {
                  const previous = historyMsgs[index - 1]
                  const next = historyMsgs[index + 1]
                  const current = message
                  let showAvatar = false
                  let type = 'single'
                  let position = null
                  const showStatusMsg =
                    processMessageStatusAndTime.status[
                      //@ts-ignore
                      current.status?.type
                    ] === current?._id

                  const showTimeDivider =
                    processMessageStatusAndTime.divider[current._id]

                  if (
                    current.ownerId !== previous?.ownerId &&
                    current.ownerId !== next?.ownerId
                  ) {
                    showAvatar = true
                    type = 'single'
                  } else {
                    // first msg in group
                    if (
                      current.ownerId !== previous?.ownerId &&
                      current.ownerId === next?.ownerId
                    ) {
                      showAvatar = false
                      if (current.react.length > 0) {
                        type = 'single'
                      } else {
                        type = 'group'
                        position = 'first'
                      }
                      // middle msg in group
                    } else if (
                      current.ownerId === previous?.ownerId &&
                      current.ownerId === next?.ownerId
                    ) {
                      showAvatar = false
                      type = 'group'
                      position = 'middle'
                      if (
                        previous.react.length > 0 &&
                        current.react.length === 0
                      ) {
                        position = 'first'
                      } else if (
                        previous.react.length > 0 &&
                        current.react.length > 0
                      ) {
                        type = 'single'
                      } else if (
                        previous.react.length === 0 &&
                        current.react.length > 0
                      ) {
                        position = 'last'
                      }
                      // last msg in group
                    } else if (
                      current.ownerId === previous?.ownerId &&
                      current.ownerId !== next?.ownerId
                    ) {
                      showAvatar = true
                      if (previous.react.length > 0) {
                        type = 'single'
                      } else {
                        type = 'group'
                        position = 'last'
                      }
                    }
                  }
                  if (index === historyMsgs.length - 1) console.log({ message })
                  return (
                    <Message
                      type={type}
                      key={message._id}
                      showAvatar={showAvatar}
                      showTimeDivider={showTimeDivider}
                      showStatusMsg={showStatusMsg}
                      position={position}
                      userLoginId={userLogin?._id}
                      isLast={index === historyMsgs.length - 1}
                      {...message}
                    />
                  )
                })}
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <EmptyState content="No chats here yet" />
              </div>
            )}
            {typingIndicator?.isTyping &&
              typingIndicator?.userId !== userLogin?._id && (
                <div className="flex my-2">
                  <div className="pl-[6px] pr-4">
                    <UserAvatar
                      src={roomSelectedInfo?.picture || ''}
                      alt={roomSelectedInfo?.name || ''}
                    />
                  </div>
                  <div className="max-w-max flex items-center justify-center bg-grey-200 dark:bg-grey-800 p-2 rounded-3xl">
                    <ReactLoading type="bubbles" width="25px" height="25px" />
                  </div>
                </div>
              )}
          </>
        )}
      </div>
      <button
        ref={refJumpToButton}
        onClick={handleJumpToBottom}
        className={classNames(
          'flex animate-bounce absolute dark:bg-grey-900 bg-grey-50 bottom-20 left-1/2 -translate-x-1/2 w-10 h-10 items-center justify-center rounded-full shadow-[0px_2px_4px_rgba(0,0,0,0.25)] dark:shadow-[0px_2px_4px_rgba(0,0,0,0.5)] hover:brightness-75',
        )}
      >
        <span className="text-blue-500 dark:text-blue-400">
          <ArrowDownIcon />
        </span>
      </button>
      {/*Input Area */}
      <ChatForm />
    </Wrapper>
  )
}

export default ChatArea
