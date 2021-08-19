import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-2'
import ContainerComponent from './components/ContainerComponent.vue'

export default Node.create({
  name: 'containerComponent',

  group: 'block',
  content: 'block*',
  addAttributes() {
    /**
     * list of all props that will be available inside our custom Vue component
     * This is important: props are not available in the Vue component if they are not defined in the object
     **/
    return {
      _tag: {
        rendered: false
      },
      props: {
        rendered: false
      }
    }
  },
  parseHTML() {
    return [
      {
        tag: `div[data-type="${this.name}"]`
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': this.name })]
  },

  addNodeView() {
    // define vue component to render
    return VueNodeViewRenderer(ContainerComponent)
  }
})
