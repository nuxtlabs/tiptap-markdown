import toMarkdown from 'mdast-util-to-markdown'
import unified from 'unified';
import parse from 'remark-parse'

function compiler() {
  this.Compiler = function(root) {
    return root
  }
}
export function markdownToAst(markdown) {
  let stream = unified().use(parse)

    const file = stream.use(compiler).processSync({ contents: markdown })
  return file.result
}

export function astToMarkdown(ast) {
  return toMarkdown(ast, {
    bullet: '-'
  })
}