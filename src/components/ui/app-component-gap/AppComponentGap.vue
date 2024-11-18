<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value: string) => ['small', 'medium', 'large', 'x-large'].includes(value)
  }
})

const gapClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'component-gap-s'
    case 'large':
      return 'component-gap-l'
    case 'x-large':
      return 'component-gap-xl'
    default:
      return 'component-gap'
  }
})
</script>

<template>
  <div :class="gapClass">
    <slot></slot>
  </div>
</template>

<style scoped>
.component-gap {
  margin-bottom: 16px; /* Adjust the gap between components as needed */
}

.component-gap-s {
  margin-bottom: 8px; /* Adjust the gap between components as needed */
}

.component-gap-l {
  margin-bottom: 24px; /* Adjust the gap between components as needed */
}

.component-gap-xl {
  margin-bottom: 32px; /* Adjust the gap between components as needed */
}
</style>
