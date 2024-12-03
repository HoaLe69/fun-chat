import CodeMirror, { useCodeMirror } from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@uiw/react-codemirror'
import { keymap } from '@uiw/react-codemirror'
import { useEffect, useRef } from 'react'

interface Props {
  className?: string
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

const transparentTheme = EditorView.theme({
  '&': {
    backgroundColor: 'transparent !important',
    height: '100%',
  },
  '&.cm-editor': {
    border: 'none',
    borderRadius: '10px',
    padding: '5px',
  },
  '&.cm-focused': {
    outline: 'none',
  },
})
const MdxEditor: React.FC<Props> = (props) => {
  const { value, onChange, onSubmit } = props
  const keyBinding = keymap.of([
    {
      key: 'Enter',
      run: () => {
        onSubmit()
        return true
      },
    },
  ])

  const editor = useRef<HTMLDivElement>(null)
  const { setContainer, view } = useCodeMirror({
    container: editor.current,
    autoFocus: true,
    basicSetup: false,
    placeholder: 'Enter your message',
    extensions: [markdown({ base: markdownLanguage, codeLanguages: languages }), transparentTheme, keyBinding],
    value: value,
    onChange,
  })

  useEffect(() => {
    if (editor.current) setContainer(editor.current)
  }, [editor])

  return (
    <div className="flex-1 whitespace-pre-wrap" ref={editor}></div>
    // <CodeMirror
    //   onChange={onChange}
    //   value={value}
    //   style={{
    //     flex: 1,
    //     textAlign: 'left',
    //     overflowY: 'auto',
    //   }}
    //   placeholder="Enter your message"
    //   extensions={[markdown({ base: markdownLanguage, codeLanguages: languages }), transparentTheme, keyBinding]}
    //   basicSetup={false}
    // />
  )
}

export default MdxEditor
