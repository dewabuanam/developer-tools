<template>
  <Codemirror
    v-model="code"
    placeholder=""
    :style="{ height: '600px' }"
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
import { javascript } from '@codemirror/lang-javascript'
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
    }
  },
  setup(props) {
    const code = ref(`console.log('Hello, world!')`)
    const extensions = [javascript()]

    // Create computed extensions to include readonly state and dark mode
    const computedExtensions = computed(() => [
      ...extensions,
      props.readonly ? EditorState.readOnly.of(true) : [],
      props.darkmode ? oneDark : []
    ])

    // Codemirror EditorView instance ref
    const view = shallowRef()
    const handleReady = (payload) => {
      view.value = payload.view
    }

    return {
      code,
      computedExtensions,
      handleReady,
      log: console.log
    }
  }
})
</script>
