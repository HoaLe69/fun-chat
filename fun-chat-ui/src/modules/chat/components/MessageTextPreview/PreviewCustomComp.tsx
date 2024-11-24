import { useEffect, useState } from 'react'
import highlightCode from 'modules/chat/utils/highlightCode'

interface Props {
  className?: string
  children: string
}
// Custom code component to wrap highlighted code
export const CodeBlock: React.FC<Props> = (props) => {
  const [spans, setSpans] = useState(null)

  const lang = (props.className || ' ').substr(9)

  useEffect(() => {
    highlightCode(lang, props.children, (text: string, style: string | null, from) => {
      return (
        <span key={from} className={style || ''}>
          {text}
        </span>
      )
      //@ts-ignore
    }).then(setSpans)
  }, [props.children])

  return <code>{spans || props.children}</code>
}

//INFO: Heading

export const H1: React.FC<Props> = (props) => {
  return <h1 className="text-2xl font-bold my-2">{props.children}</h1>
}
export const H2: React.FC<Props> = (props) => {
  return <h2 className="text-xl font-bold my-2">{props.children}</h2>
}
export const H3: React.FC<Props> = (props) => {
  return <h3 className="text-base font-bold my-2">{props.children}</h3>
}
export const Link: React.FC<Props> = (props) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValidEmail = emailRegex.test(props.children)

  if (isValidEmail) return <a href={`mailto:${props.children}`}>{props.children}</a>

  return (
    <a target="_blank" href={props.children} className={`devchatter-msg-link hover:underline cursor-pointer`}>
      {props.children}
    </a>
  )
}
