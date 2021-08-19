<template>
  <div>
    <div class="editor">
      <Editor v-model="json"/>
    </div>
    <div class="preview">
      <pre>{{ markdown }}</pre>
    </div>
  </div>
</template>

<script>
import { tiptapToAst } from '~/utils/tiptap-to-ast'
import { astToMarkdown, markdownToAst} from '~/utils/markdown'
import { astToTiptap } from '~/utils/ast-to-tiptap'
export default {
  data () {
    const markdown = `# Hello
Edit ~~me~~ _me_

::test{a="d"}
# This is test components
::

- I'm a list
- With two **items**
`
    const ast = markdownToAst(markdown)
    const json = astToTiptap(ast)

    return {
      json,
      markdown,
    }
  },

  watch: {
    json(nValue) {
      const ast = tiptapToAst(nValue)
      const markdown = astToMarkdown(ast)

      this.markdown = markdown
    }
  },
}
</script>

<style>
.editor {
  background: #f8f8f8;
  padding: 10px;
}
</style>