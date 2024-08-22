import s from './Typing.module.css'

const TypingIndicator = () => {
  return (
    <div className={s.typing}>
      <div className={s.typing_dot} />
      <div className={s.typing_dot} />
      <div className={s.typing_dot} />
    </div>
  )
}

export default TypingIndicator
