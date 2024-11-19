<template>
  <img :src="src" :alt="alt" class="object-center w-full h-full" />
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  src: string
  alt: string
}>()
</script>
