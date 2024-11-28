import { useCodeMirror, EditorView } from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { useCallback, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import ToolbarEditor from './ToolbarEditor'

const editorCustomTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: ' !important',
      height: '100%',
    },
    '&.cm-editor': {
      border: '1px solid #cbd5e1',
      borderRadius: '10px',
      padding: '5px',
    },
    '&.cm-focused': {
      outline: 'none',
    },
  },
  { dark: false },
)

const MdxEditor = () => {
  const editor = useRef<HTMLDivElement>(null)
  const [tab, setTab] = useState<string>('write')
  const [markdownContent, setMarkdownContent] = useState<string>('')

  const { setContainer, view } = useCodeMirror({
    container: editor.current,
    autoFocus: true,
    basicSetup: false,
    placeholder: 'Body',
    value: markdownContent,
    minHeight: '120px',
    extensions: [markdown({ base: markdownLanguage, codeLanguages: languages }), editorCustomTheme],
    onChange: (val, viewUpdate) => {
      setMarkdownContent(val)
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
  }, [editor])

  return (
    <div className="border rounded-xl">
      <div className="flex items-center border-b bg-slate-100 rounded-md">
        <div className="ml-[-1px] mt-[-1px] mb-[-1px] flex-shrink-0 flex">
          <button
            className={classNames('text-sm py-2 px-4', { 'bg-slate-300': tab === 'write' })}
            onClick={() => handleTabChange('write')}
          >
            Write
          </button>
          <button
            onClick={() => handleTabChange('preview')}
            className={classNames('text-sm py-2 px-4', { 'bg-slate-300': tab === 'preview' })}
          >
            Preview
          </button>
        </div>
        {tab === 'write' && <ToolbarEditor view={view} />}
      </div>
      <div className="p-1">
        {tab === 'write' && <div className="max-h-96 overflow-auto" ref={editor} />}
        {tab === 'preview' && (
          <div className="min-h-[120px] max-h-96 overflow-auto">
            {markdownContent ? (
              <MarkdownPreview source={markdownContent} wrapperElement={{ 'data-color-mode': 'light' }} />
            ) : (
              <span>Nothing to preview</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MdxEditor
