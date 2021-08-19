<template>
  <NodeViewWrapper class="component">
    <details class="flex">
      <summary>{{ type }}</summary>
      <textarea v-model="raw" class="block w-full flex-1 h-24 rounded-md my-2"></textarea>
    </details>
    <!-- <Component :is="name" v-bind="props" /> -->
    <NodeViewContent /><!-- this will render children aka content -->
  </NodeViewWrapper>
</template>

<script>
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-2'

export default {
  components: { NodeViewWrapper, NodeViewContent },
  props: {
    node: {
      type: Object,
      default: () => ({})
    },
    updateAttributes: {
      type: Function,
      required: true
    }
  },
  computed: {
    type() {
      return this.node.attrs._tag
    },
    raw () {
      return JSON.stringify(this.node.attrs.props)
    },
    props: function () {
      return this.node.attrs.props
    }
  },
  watch: {
    raw() {
      this.updateAttributes({
        props: JSON.parse(this.raw), // modified props in UI
        _tag: this.type,
      })
    },
    type() {
      this.updateAttributes({
        props: JSON.parse(this.raw), // modified props in UI
        _tag: this.type,
      })
    }
  }
}
</script>

<style >
.component {
  background: #aaa;
  padding: 1em;
}
</style>
