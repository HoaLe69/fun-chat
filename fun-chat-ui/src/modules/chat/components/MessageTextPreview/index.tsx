import { unified } from 'unified'
import remarkParse from 'remark-parse'
import rehypeReact, { Options } from 'rehype-react'
import remarkRehype from 'remark-rehype'
import remarkGfm from 'remark-gfm'
import * as prod from 'react/jsx-runtime'
//import 'github-markdown-css/github-markdown.css'
//import 'github-markdown-css/github-markdown-dark.css'
//import 'github-markdown-css/github-markdown-light.css'
//import './Preview.css'
import React from 'react'
import { CodeBlock, Link, H1, H2, H3 } from './PreviewCustomComp'
import MarkdownPreview from '@uiw/react-markdown-preview'

//import { visit } from 'unist-util-visit'

/*
 * unified let you transform content with plugins
 * remarkParse it support for parsing from markdown
 * remarkGfm added more github flavour
 *
 * */

interface Props {
  doc: string
}

const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs }

const options: Options = {
  ...production,
  createElement: React.createElement,
  components: {
    code: CodeBlock,
    h1: H1,
    h2: H2,
    h3: H3,
    a: Link,
  },
}

// const remarkNewLineToBreak = () => {
//   return (tree) => {
//     console.log(tree)
//     visit(tree, 'text', (node) => {
//       if (typeof node.value === 'string') {
//         // Replace newlines with `<br />`
//         node.value = node.value.replace(/\n/g, ' \n ')
//       }
//     })
//   }
// }
const Preview: React.FC<Props> = ({ doc }) => {
  // const md = unified() // initiate the pipeline
  //   .use(remarkRehype, { allowDangerousHtml: true })
  //   .use(remarkParse)
  //   .use(remarkGfm)
  //   //    .use(remarkNewLineToBreak)
  //   .use(rehypeReact, options)
  //
  //   .processSync(doc).result
  return <MarkdownPreview className="post-preview-content" source={doc}></MarkdownPreview>
}

export default Preview
