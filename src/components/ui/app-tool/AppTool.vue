<script setup lang="ts">
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { defineProps } from 'vue';
import { AppComponentGap } from '@/components/ui/app-component-gap'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  icon: {
    type: [Object, Function],
    required: true
  },
  url: {
    type: String,
    required: true
  }
});
</script>

<template>
  <Card @click="$router.push(props.url)" class="app-card cursor-pointer">
    <CardHeader>
      <component :is="props.icon" class="tool-icon" />
      <div>
        <CardTitle class="font-medium">{{ props.title }}</CardTitle>
        <AppComponentGap size="small"/>
        <CardDescription v-if="props.description" class="app-card-description">{{ props.description }}</CardDescription>
      </div>
    </CardHeader>
  </Card>
</template>

<style scoped>
.tool-icon {
  width: 50px;
  height: 50px;
  margin-bottom: 8px;
}
</style>
