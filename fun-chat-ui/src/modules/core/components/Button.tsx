import classNames from 'classnames'

type Props = {
  title: string
  type?: string
  className?: string
  textBold?: boolean
  onClick?: () => void
}
const Button: React.FC<Props> = ({ type, title, onClick, className, textBold }) => {
  return (
    <button
      onClick={onClick}
      className={classNames(
        ' py-2 px-4 text-blue-500 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-md',
        className,
        { 'font-bold': textBold },
      )}
    >
      {title}
    </button>
  )
}

export default Button
