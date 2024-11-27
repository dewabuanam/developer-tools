<template>
  <Codemirror
    v-model="code"
    placeholder=""
    :style="computedStyle"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="computedExtensions"
    @ready="handleReady"
    @change="log('change', $event)"
    @focus="log('focus', $event)"
    @blur="log('blur', $event)"
  />
</template>

<script>
import { defineComponent, computed, ref, shallowRef } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { xml } from '@codemirror/lang-xml'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorState } from '@codemirror/state'

export default defineComponent({
  components: {
    Codemirror
  },
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    darkmode: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const code = ref(``)
    const extensions = [xml()]

    // Create computed extensions to include readonly state and dark mode
    const computedExtensions = computed(() => [
      ...extensions,
      props.readonly ? EditorState.readOnly.of(true) : [],
      props.darkmode ? oneDark : []
    ])

    // Computed style object
    const computedStyle = computed(() => {
      const style = {
        border: '1px solid #ccc',
        borderRadius: '2px'
      }
      if (props.maxWidth && props.maxWidth !== '') {
        console.log(props.maxWidth)
        style.maxWidth = props.maxWidth
      }
      if (props.height) {
        style.height = props.height
      } else{
        style.height = '480px'
      }
      return style
    })

    // Codemirror EditorView instance ref
    const view = shallowRef()
    const handleReady = (payload) => {
      view.value = payload.view
    }

    return {
      code,
      computedExtensions,
      computedStyle,
      handleReady,
      log: console.log
    }
  }
})
</script>
