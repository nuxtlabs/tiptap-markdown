import { kebabCase } from 'scule'
const marks = {
  bold: node => ({
    type: 'strong',
    props: {},
    children: [node]
  }),
  link: (node, { attrs }) => {
    return {
      type: 'link',
      props: attrs || {},
      children: [node]
    }
  },
  code: (node, { attrs }) => {
    return {
      type: 'inlineCode',
      props: attrs || {},
      value: node.value
    }
  }
}
const handlers = {
  doc: node => ({
    type: 'root',
    children: node.content ? node.content.map(node => visit(node)) : [],
    props: {}
  }),
  horizontalRule: () => ({
    type: 'thematicBreak',
    props: {},
    children: []
  }),
  text: node => {
    let _node = {
      type: 'text',
      value: node.text
    }
    if (node.marks) {
      _node = node.marks.reduce((_node, { type, attrs }) => {
        return marks[type](_node, { attrs })
      }, _node)
    }
    return _node
  },
  paragraph: node => ({
    type: 'paragraph',
    children: node.content ? node.content.map(node => visit(node)) : [],
    props: {}
  }),
  orderedList: node => ({
    type: 'list',
    ordered: true,
    props: {},
    children: node.content.map(visit)
  }),
  bulletList: node => ({
    type: 'list',
    ordered: false,
    props: {},
    children: node.content.map(visit)
  }),
  listItem: node => ({
    type: 'listItem',
    props: {},
    children: node.content.map(visit)
  }),
  heading: node => {
    node.content = node.content || []
    const id = kebabCase(node.content.map(n => n.text))
    let children = node.content.map(visit)

    return {
      type: 'heading',
      depth: node.attrs.level,
      props: {
        id
      },
      children
    }
  }
}
function visit(node) {
  if (handlers[node.type]) {
    node = handlers[node.type](node)
  }
  return node
}

export function tiptapToAst(tree) {
  return visit(tree)
}