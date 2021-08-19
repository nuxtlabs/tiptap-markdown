const handlers = {
  root: node => ({
    type: 'doc',
    content: node.children ? node.children.map(node => visit(node)) : []
  }),
  'heading': (node) => ({
    type: 'heading',
    attrs: {
      level: node. depth
    },
    content: node.children.map(visit)
  }),
  'paragraph': node => ({
    type: 'paragraph',
    content: node.children.map(visit)
  }),
  'hr': () => ({
    type: 'horizontalRule'
  }),
  text: node => ({
    type: 'text',
    text: node.value
  }),
  'list': node => ({
    type: node.ordered ? 'orderedList' : 'bulletList',
    content: node.children.map(visit)
  }),
  'listItem': node => ({
    type: 'listItem',
    content: node.children.map(visit)
  }),
  markNode: (node, type) => {
    const _node = node.children ? visit(node.children[0]) : node
    _node.marks = _node.marks || []
    _node.marks.push({ type, attrs: node.props })
    return _node
  },
  emphasis: node => handlers.markNode(node, 'italic'),
  strong: node => handlers.markNode(node, 'bold'),
  link: node => handlers.markNode(node, 'link'),
  inlineBode: node => handlers.markNode(node, 'code'),
  delete: node => handlers.markNode(node, 'strike'),
  em: node => handlers.markNode(node, 'italic')
}
function visit(node) {
  const type = node.type
  if (handlers[type]) {
    node = handlers[type](node)
  } else {
    node.attrs = {
      props: node.attributes,
      _tag: node.name
    }
    node.content = (node.children || []).map(visit)
  }
  return node
}

export function astToTiptap(tree) {
  return visit(tree)
}
