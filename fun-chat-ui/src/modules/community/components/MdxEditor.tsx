import { useCodeMirror, EditorView } from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { useCallback, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import ToolbarEditor from './ToolbarEditor'
import { postServices } from '../services'

const editorCustomTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: 'transparent !important',
      height: '100%',
    },
    '&.cm-editor': {
      borderRadius: '10px',
      padding: '5px',
    },
    '.cm-content': {
      caretColor: '#0e9',
    },
    '&.cm-focused': {
      outline: 'none',
    },
  },
  { dark: false },
)

interface Props {
  onChange: (value: string) => void
  doc: string
  autoFocus?: boolean
}

const MdxEditor: React.FC<Props> = (props) => {
  const { onChange, doc, autoFocus } = props

  const editor = useRef<HTMLDivElement>(null)
  const [tab, setTab] = useState<string>('write')

  const fileUploadHandler = (view: EditorView, file?: File) => {
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png']
    if (file && !validImageTypes.includes(file.type)) return
    const state = view.state
    const dispatch = view.dispatch
    if (file) {
      postServices
        .uploadFile(file)
        .then((res) => {
          const makrdownLinkImage = `![${res.fileName}](${res.path})`
          const transaction = view.state.update({
            changes: { from: state.selection.main.from, to: state.selection.main.to, insert: makrdownLinkImage },
          })
          dispatch(transaction)
        })
        .catch((error) => console.log(error))
    }
  }

  const { setContainer, view } = useCodeMirror({
    container: editor.current,
    autoFocus: autoFocus || false,
    basicSetup: false,
    placeholder: 'Body',
    minHeight: '120px',
    value: doc,
    extensions: [
      markdown({ base: markdownLanguage, codeLanguages: languages }),
      editorCustomTheme,
      EditorView.lineWrapping,
      EditorView.domEventHandlers({
        paste: (event, view) => {
          const file = event.clipboardData?.files[0]
          fileUploadHandler(view, file)
        },
        drop: (event, view) => {
          const file = event.dataTransfer?.files[0]
          fileUploadHandler(view, file)
        },
      }),
    ],
    onChange: (val, viewUpdate) => {
      onChange(val)
    },
  })

  const handleTabChange = useCallback(
    (tabChange: string) => {
      if (tab === tabChange) return
      setTab(tabChange)
    },
    [tab],
  )

  useEffect(() => {
    if (editor.current) setContainer(editor.current)
  }, [editor, tab])

  return (
    <div className="border border-zinc-300 dark:border-zinc-500 rounded-xl">
      <div className="flex h-[41px] items-center border-b border-zinc-300  dark:border-zinc-500  bg-slate-100 dark:bg-zinc-900 rounded-t-xl">
        <div className="flex">
          <button
            className={classNames('text-sm py-2 px-4', {
              'bg-slate-300 dark:bg-zinc-700  my-[-3px] border-r border-t border-l rounded-t-xl border-zinc-300  dark:border-zinc-500':
                tab === 'write',
            })}
            onClick={() => handleTabChange('write')}
          >
            Write
          </button>
          <button
            onClick={() => handleTabChange('preview')}
            className={classNames('text-sm py-2 px-4 ', {
              'bg-slate-300 dark:bg-zinc-700  my-[-3px] border-r border-t border-l rounded-t-xl border-zinc-300  dark:border-zinc-500':
                tab === 'preview',
            })}
          >
            Preview
          </button>
        </div>
        {tab === 'write' && <ToolbarEditor view={view} />}
      </div>
      <div className="p-1 dark:bg-zinc-900 rounded-b-xl">
        {tab === 'write' && <div className="max-h-96 overflow-auto text-zinc-950 dark:text-zinc-50" ref={editor} />}
        {tab === 'preview' && (
          <div className="min-h-[120px] max-h-96 overflow-auto">
            {doc ? (
              <MarkdownPreview
                style={{ background: 'transparent', fontSize: '0.875em', padding: '9px' }}
                source={doc}
              />
            ) : (
              <span className="p-2">Nothing to preview</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MdxEditor
