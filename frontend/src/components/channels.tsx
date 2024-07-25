import { channels } from '../api/mock'
import { ChannelType } from '../lib/app.type'
import UserAvatar from './user-avatar'
import Empty from './common/empty-sate'

const Channels: React.FC = () => {
  const isEmpty = true
  return (
    <div className="h-full">
      {isEmpty ? (
        <div className="flex items-center justify-center h-full">
          <Empty content="You currently have no channels" />
        </div>
      ) : (
        <ul className="overflow-x-hidden w-full">
          {channels.map((channel: ChannelType) => {
            return <Channel key={channel.name} {...channel} />
          })}
        </ul>
      )}
    </div>
  )
}

export default Channels

const Channel = ({ name, time, avatar_path, latest_message }: ChannelType) => {
  return (
    <li className="hover:bg-grey-200 dark:hover:bg-grey-800 cursor-pointer">
      <div className="flex items-center px-2 py-3">
        <div>
          <UserAvatar alt={name} src={avatar_path} size="lg" />
        </div>
        <div className="pl-2 flex-1 pr-2 flex flex-col">
          <span className="font-bold">{name}</span>
          <div className="flex items-center text-grey-500">
            <p className="text-sm  max-w-44 truncate ">{latest_message}</p>
            <span className="ml-auto">{time}</span>
          </div>
        </div>
      </div>
    </li>
  )
}
