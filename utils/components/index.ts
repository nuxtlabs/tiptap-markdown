import { camelCase, kebabCase } from 'scule'
import visit from 'unist-util-visit'
import { parseFrontMatter } from '../fontmatter'
import toMarkdown from './to-markdown'
import fromMarkdown from './from-markdown'
import syntax from './micromark-extension'

const toFrontMatter = (yamlString: string) => `---\n${yamlString}\n---`


export default function remarkComponentsPlugin(components: any = {}) {
  // @ts-ignore
  const data = this.data()

  add('micromarkExtensions', syntax())
  add('fromMarkdownExtensions', fromMarkdown)
  add('toMarkdownExtensions', toMarkdown)

  function add(field: string, value: any) {
    /* istanbul ignore if - other extensions. */
    if (!data[field]) {
      data[field] = []
    }

    data[field].push(value)
  }
  
  return (tree: any, { data }: { data: any }) => {
    visit(tree, ['textComponent', 'leafComponent', 'containerComponent'], visitor)

    function visitor(node: any) {      
      const nodeData = node.data || (node.data = {})

      // parse data slots and retrive data
      const yamlAttributes = getNodeData(node)

      nodeData.hName = kebabCase(camelCase(node.name))
      nodeData.hProperties = bindData(
        {
          ...node.attributes,
          ...yamlAttributes
        },
        data
      )
    }
    
    return tree
  }
}

function getNodeData(node: any) {
  if (!node.rawData) {
    return {}
  }

  const yaml = node.rawData
  const { data } = parseFrontMatter(toFrontMatter(yaml))

  return data
}

function bindData(data: any, pageData: any) {
  const enteries = Object.entries(data).map(([key, value]) => {
    if (key.startsWith(':')) {
      return [key, value]
    }
    if (typeof value === 'string') {
      return [pageData[value] ? `:${key}` : key, value]
    }
    return [`:${key}`, JSON.stringify(value)]
  })
  return Object.fromEntries(enteries)
}
