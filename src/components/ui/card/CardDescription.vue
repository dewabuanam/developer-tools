<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <p :class="cn('text-sm text-muted-foreground card-description', props.class)">
    <slot />
  </p>
</template>

<style scoped>
.card-description {
  color: hsl(var(--card-foreground));
}
</style>
