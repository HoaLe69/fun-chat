import classNames from 'classnames'

type Props = {
  size?: 'sm' | 'lg' | 'md'
  src: string
  alt: string
  className?: string
}
const UserAvatar: React.FC<Props> = ({ size = 'sm', src, alt, className }) => {
  return (
    <div
      className={classNames(
        { 'w-9 h-9': size == 'sm' },
        { 'w-12 h-12': size == 'lg' },
        { 'w-10 h-10': size == 'md' },
        className,
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
