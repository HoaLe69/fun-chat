import classNames from 'classnames'
import moment from 'moment'

import type { MessageType } from 'lib/app.type'
import UserAvatar from 'components/user-avatar'

import ReactionPicker from 'components/reaction-picker'
import ContextualMenu from 'components/contextual-menu'

type MessageProps = MessageType & {
  picture: string | null
  ownerName: string | null
  userLoginId: string | null
}

const Message: React.FC<MessageProps> = ({
  ownerId,
  text,
  ownerName,
  picture,
  createdAt,
  userLoginId,
}) => {
  const isCurrentUser = userLoginId === ownerId
  const fallbackImg = 'https://placehold.co/600x400.png'

  const renderTextMessage = () => (
    <div
      className={classNames(
        'px-4 py-2 rounded-t-[18px] max-w-[60%]',
        isCurrentUser
          ? 'bg-blue-100 dark:bg-blue-900 rounded-bl-[18px] rounded-br-sm'
          : 'bg-grey-200 dark:bg-grey-800 rounded-br-[18px] rounded-bl-sm',
      )}
    >
      <p className="text-sm">{text}</p>
    </div>
  )

  return (
    <div
      className={classNames(
        'w-full flex items-center px-2 py-1 group',
        isCurrentUser ? 'justify-end' : 'justify-start',
      )}
    >
      <div
        className={classNames('flex flex-col flex-1', {
          'items-end': isCurrentUser,
        })}
      >
        <div className={classNames('flex items-end')}>
          {!isCurrentUser && (
            <div className="mr-2">
              <UserAvatar
                alt={ownerName ?? 'invidual image'}
                src={picture ?? fallbackImg}
              />
            </div>
          )}
          <div
            className={classNames('flex items-center gap-4', {
              'flex-row-reverse': isCurrentUser,
            })}
          >
            {renderTextMessage()}
            <div className="flex items-center">
              <ReactionPicker />
              <ContextualMenu />
            </div>
          </div>
        </div>
        <span
          className={classNames('text-[12px] leading-6 text-grey-500', {
            'ml-10': !isCurrentUser,
          })}
        >
          {moment(createdAt).format('LT')}
        </span>
      </div>
    </div>
  )
}

export default Message
