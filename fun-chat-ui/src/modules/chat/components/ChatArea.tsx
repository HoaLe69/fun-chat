import { UserAvatar, EmptyState } from 'modules/core/components'
import ChatForm from './ChatForm'
import type { IMessage } from 'modules/chat/types'
import ReactLoading from 'react-loading'
import classNames from 'classnames'
import { useChatArea } from '../hooks'
import { useCallback } from 'react'
import Message from './Message'
import { isTimeDiffInMins } from '../utils/dateTimeFormat'
import Image from 'modules/core/components/Image'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full overflow-hidden text-gray-950 dark:text-gray-50 relative flex flex-col bg-zinc-50 dark:bg-zinc-800">
    {children}
  </div>
)

const ChatArea: React.FC = () => {
  const {
    partner,
    userLogin,
    historyMsgs,
    chatMembers,
    usersOnline,
    refContainer,
    typingIndicator,
    roomSelectedId,
    historyMsgsStatus,
    processMessageStatusAndTime,
  } = useChatArea()

  const renderHeaderChatArea = useCallback(
    () => (
      <div className="p-4 py-2 flex items-center bg-main-bg-light dark:bg-main-bg-dark border-b border-b-zinc-200 dark:border-zinc-700">
        <Image className="mr-4 w-8 h-8 rounded-full" alt={partner?.display_name || ''} src={partner?.picture || ''} />
        <div className="flex flex-col justify-start">
          <p className="font-bold leading-5">{partner?.display_name}</p>
          <span
            className={classNames(
              'text-sm ',
              usersOnline[partner?._id || '']?.status === 'online' ? 'text-green-500' : 'text-grey-500',
            )}
          >
            {usersOnline[partner?._id || '']?.status === 'online' ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    ),
    [partner, usersOnline],
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
      <div ref={refContainer} className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="min-h-full flex-1 flex flex-col justify-end">
          <div className="px-[23px] py-4">
            <Image src={partner?.picture || ''} alt={partner?.display_name || ''} className="w-20 h-20 rounded-full" />
            <h2 className="text-3xl font-bold my-4">{partner?.display_name}</h2>
            <p className="text-xl text-gray-500 dark:text-gray-200">{partner?.email}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This is beginning of your direct message history with <strong>{partner?.display_name}</strong>
            </p>
          </div>

          {historyMsgsStatus === 'loading' ? (
            <div className="flex items-center justify-center h-full text-grey-500 font-medium">Loading message...</div>
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
                    let position
                    const showStatusMsg =
                      processMessageStatusAndTime.status[
                        //@ts-ignore
                        current.status?.type
                      ] === current?._id

                    const showTimeDivider = processMessageStatusAndTime.divider[current._id]

                    if (current.ownerId !== previous?.ownerId && current.ownerId !== next?.ownerId) {
                      showAvatar = true
                      type = 'single'
                    } else {
                      // first msg in group
                      if (current.ownerId !== previous?.ownerId && current.ownerId === next?.ownerId) {
                        showAvatar = true
                        if (current.react?.length > 0) {
                          type = 'single'
                        } else {
                          type = 'group'
                          position = 'first'
                        }
                        // middle msg in group
                      } else if (current.ownerId === previous?.ownerId && current.ownerId === next?.ownerId) {
                        showAvatar = false
                        type = 'group'
                        position = 'middle'
                        if (previous.react.length > 0 && current.react.length === 0) {
                          position = 'first'
                        } else if (previous.react.length > 0 && current.react.length > 0) {
                          type = 'single'
                        } else if (previous.react.length === 0 && current.react.length > 0) {
                          position = 'last'
                        }
                        // last msg in group
                      } else if (current.ownerId === previous?.ownerId && current.ownerId !== next?.ownerId) {
                        showAvatar = false
                        if (previous.react.length > 0) {
                          type = 'single'
                        } else {
                          type = 'group'
                          position = 'last'
                        }
                      }
                    }
                    if (
                      showTimeDivider ||
                      current.replyTo ||
                      !isTimeDiffInMins(current?.createdAt, previous?.createdAt)
                    ) {
                      type = 'single'
                      showAvatar = true
                    }

                    return (
                      <Message
                        key={message._id}
                        message={message}
                        msgType={type}
                        showAvatar={showAvatar}
                        showTimeDivider={showTimeDivider}
                        position={position}
                        owner={chatMembers[current.ownerId]}
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
              {typingIndicator?.isTyping && typingIndicator?.userId !== userLogin?._id && (
                <div className="flex my-2">
                  <div className="pl-[6px] pr-4">
                    <UserAvatar src={partner?.picture || ''} alt={partner?.display_name || ''} />
                  </div>
                  <div className="max-w-max flex items-center justify-center bg-grey-200 dark:bg-grey-800 p-2 rounded-3xl">
                    <ReactLoading type="bubbles" width="25px" height="25px" />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ChatForm chatMembers={chatMembers} />
    </Wrapper>
  )
}

export default ChatArea
