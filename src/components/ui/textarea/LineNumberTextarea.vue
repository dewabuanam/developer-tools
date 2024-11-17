<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
  defaultValue?: string | number
  modelValue?: string | number
  readonly?: boolean
  autosize?: boolean // Add autosize prop
  height?: string | number // Accept height as prop
  width?: string | number // Accept width as prop
}>()

const emits = defineEmits<(e: 'update:modelValue', payload: string | number) => void>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue
})

const lineNumbers = ref<string[]>([])
const activeLine = ref<number>(1)

// Update line numbers based on textarea value
watch(() => modelValue.value, (newValue) => {
  lineNumbers.value = (newValue?.toString() || '').split('\n').map((_, i) => (i + 1).toString())
})

// Handle caret position to find the active line
const handleCaretPosition = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  const caretPos = textarea.selectionStart
  const lines = textarea.value.substring(0, caretPos).split('\n')
  activeLine.value = lines.length
}

// Initialize line numbers for default content
lineNumbers.value = (modelValue?.toString() || '').split('\n').map((_, i) => (i + 1).toString())

// Autosize helper function
const autosize = (textarea: HTMLTextAreaElement) => {
  if (props.autosize) {
    textarea.style.height = 'auto' // Reset the height to auto
    textarea.style.height = `${textarea.scrollHeight}px` // Set the height to scrollHeight to match content
  } else if (props.height) {
    textarea.style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
}

// Watch for model value changes and resize textarea
watch(() => modelValue.value, () => {
  nextTick(() => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (textarea) autosize(textarea)
  })
})
</script>

<template>
  <div
    class="relative flex rounded-md border border-input bg-background shadow-sm overflow-hidden"
  >
    <!-- Line numbers as a textarea -->
    <textarea
      :value="lineNumbers.join('\n')"
      readonly
      class="relative z-10 flex-none bg-gray-100 text-gray-500 text-sm text-right px-2 py-2 leading-5 overflow-hidden resize-none"
      :style="{ width: '3rem', overflow: 'hidden' }"
    >
    </textarea>

    <!-- Main Textarea -->
    <textarea
      ref="mainTextarea"
      v-model="modelValue"
      @input="handleCaretPosition"
      @click="handleCaretPosition"
      @keyup="handleCaretPosition"
      @scroll="(event) => {
        const target = event.target as HTMLTextAreaElement
        const lineNumberTextarea = target.previousElementSibling as HTMLTextAreaElement
        lineNumberTextarea.scrollTop = target.scrollTop
      }"
      :readonly="props.readonly"
      :style="{
        overflowY: 'auto', /* Changed to auto to enable scrolling when necessary */
        height: props.height ? (typeof props.height === 'number' ? `${props.height}px` : props.height) : 'auto',
        width: props.width || '100%'
      }"
      class="relative z-10 flex-grow min-h-20 w-full border-0 bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
    />
  </div>
</template>

<style scoped>
/* Optional: Add custom styles for better alignment */
textarea {
  line-height: 1.25rem; /* Match the line height of the text */
}

textarea:focus {
  outline: none;
}
</style>
