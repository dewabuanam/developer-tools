<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import Button from '../button/Button.vue'
import type { ButtonVariants } from '../button'
import type { PrimitiveProps } from 'radix-vue'

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button'
})
</script>

<template>
  <Button v-bind="props" :class="props.class" class="app-button">
    <slot />
  </Button>
</template>
