import CodeMirror from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@uiw/react-codemirror'
import { keymap } from '@uiw/react-codemirror'

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

  return (
    <CodeMirror
      onChange={onChange}
      value={value}
      style={{
        flex: 1,
        textAlign: 'left',
        overflowY: 'auto',
      }}
      placeholder="Enter your message"
      theme={oneDark}
      extensions={[markdown({ base: markdownLanguage, codeLanguages: languages }), transparentTheme, keyBinding]}
      basicSetup={false}
    />
  )
}

export default MdxEditor
