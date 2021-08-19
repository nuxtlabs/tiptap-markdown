<template>
  <EditorContent :editor="editor" />
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2'
import { defaultExtensions } from '@tiptap/starter-kit'
import ContainerComponent from '~/utils/tiptap/containerComponent'

export default {
  components: {
    EditorContent
  },

  props: {
    value: {
      type: [String, Object],
      default: ''
    }
  },

  data() {
    return {
      editor: null
    }
  },

  watch: {
    value(val) {
      // JSON
      const isSame = this.editor.getJSON().toString() === val.toString()

      if (isSame) {
        return
      }

      this.editor.commands.setContent(this.value, false)
    }
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        ...defaultExtensions(),
        ...ContainerComponent
      ],
      content: this.value
    })
    this.editor.on('update', () => {
      this.$emit('input', this.editor.getJSON())
    })
  },

  beforeDestroy() {
    this.editor.destroy()
  }
}
</script>