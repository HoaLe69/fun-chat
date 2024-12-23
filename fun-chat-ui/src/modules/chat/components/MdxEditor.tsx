import CodeMirror, { useCodeMirror } from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { EditorView } from '@uiw/react-codemirror'
import { keymap } from '@uiw/react-codemirror'
import { useEffect, useRef } from 'react'
import { IFileUpload } from '../types'

interface Props {
  className?: string
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  setFiles: React.Dispatch<React.SetStateAction<IFileUpload[]>>
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

  '.cm-content': {
    caretColor: '#0e9',
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

  const fileUploadHandler = (file?: File) => {
    if (file) {
      const preview = {
        name: file?.name,
        path: file.type.includes('image')
          ? URL.createObjectURL(file)
          : //@ts-ignore
            file?.name,
        size: file?.size,
        type: file?.type,
      }
      props?.setFiles((pre) => {
        return [...pre, { preview, original: file }]
      })
    }
  }

  const editor = useRef<HTMLDivElement>(null)
  const { setContainer, view } = useCodeMirror({
    container: editor.current,
    autoFocus: true,
    basicSetup: false,
    placeholder: 'Enter your message',
    maxHeight: '400px',
    extensions: [
      markdown({ base: markdownLanguage, codeLanguages: languages }),
      transparentTheme,
      keyBinding,
      EditorView.lineWrapping,
      EditorView.domEventHandlers({
        paste: (event) => {
          const file = event.clipboardData?.files[0]
          fileUploadHandler(file)
        },
        drop: (event) => {
          const file = event.dataTransfer?.files[0]
          fileUploadHandler(file)
        },
      }),
    ],
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
