import toMarkdown from 'mdast-util-to-markdown'
import unified from 'unified';
import parse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import strigify from 'remark-stringify'
import components from './components'

function compiler() {
  this.Compiler = function(root) {
    return root
  }
}

export function markdownToAst(markdown) {
  let stream = unified()
  .use(parse)
  .use(components)
  .use(remarkGfm)

  const file = stream.use(compiler).processSync({ contents: markdown })
  return file.result
}


function jsonParser() {
  this.Parser = function(root) {
    return JSON.parse(root)
  }
}
export function astToMarkdown(ast) {
  let stream = unified()
    .use(jsonParser)
    .use(remarkGfm)
    .use(components)
    .use(strigify, {
      bullet: '-'
    })
    .processSync({ contents: JSON.stringify(ast) })
  return stream.contents
}