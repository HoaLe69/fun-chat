import classNames from 'classnames'
import moment from 'moment'

import type { MessageType } from '../lib/app.type'
import UserAvatar from './user-avatar'
import { LaughSmallIcon, ThreeDotVerticalIcon } from './icons'

const Message: React.FC<MessageType> = ({
  userId,
  avatar_path,
  name,
  message,
  timestamp,
}) => {
  const isCurrentUser = 'u123' === userId
  return (
    <div
      className={classNames(
        'w-full flex items-center px-2 py-1 group',
        { 'justify-end': isCurrentUser },
        { 'justify-start': !isCurrentUser },
      )}
    >
      <div
        className={classNames('flex flex-col flex-1', {
          'items-end': isCurrentUser,
        })}
      >
        <div className={classNames('max-w-[50%] w-max flex items-end')}>
          {!isCurrentUser && (
            <div className="mr-2">
              <UserAvatar alt={name} src={avatar_path} />
            </div>
          )}
          {/*CONTENT MESSAGE*/}
          <div
            className={classNames('flex items-center gap-4', {
              'flex-row-reverse': isCurrentUser,
            })}
          >
            <div
              className={classNames(
                'px-4 py-2 rounded-t-[18px] flex-1',
                {
                  'bg-grey-200 dark:bg-grey-800 rounded-br-[18px] rounded-bl-sm':
                    !isCurrentUser,
                },
                {
                  'bg-blue-100 dark:bg-blue-900 rounded-bl-[18px] rounded-br-sm':
                    isCurrentUser,
                },
              )}
            >
              <p className="text-sm">{message}</p>
            </div>
            {/*ICON*/}
            <div className="flex items-center opacity-0 group-hover:opacity-100">
              <span className="btn_icon">
                <LaughSmallIcon />
              </span>
              <span className="btn_icon ">
                <ThreeDotVerticalIcon />
              </span>
            </div>
          </div>
        </div>
        <span
          className={classNames('text-[12px] leading-6 text-grey-500', {
            'ml-10': !isCurrentUser,
          })}
        >
          {moment(timestamp).format('LT')}
        </span>
      </div>
    </div>
  )
}

export default Message
