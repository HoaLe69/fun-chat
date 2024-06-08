import classNames from 'classnames'

type Props = {
  size?: string
  src: string
  alt: string
}
const UserAvatar: React.FC<Props> = ({ size = 'sm', src, alt }) => {
  return (
    <div className={classNames('w-9 h-9 ', { 'w-12 h-12': size == 'lg' })}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full rounded-full object-cover"
      />
    </div>
  )
}

export default UserAvatar
