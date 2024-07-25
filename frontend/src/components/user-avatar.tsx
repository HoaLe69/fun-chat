import classNames from 'classnames'

type Props = {
  size?: string
  src: string
  alt: string
}
const UserAvatar: React.FC<Props> = ({ size = 'sm', src, alt }) => {
  return (
    <div
      className={classNames(
        { 'w-9 h-9': size == 'sm' },
        { 'w-12 h-12': size == 'lg' },
        { 'w-10 h-10': size == 'md' },
      )}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full rounded-full object-cover"
      />
    </div>
  )
}

export default UserAvatar
