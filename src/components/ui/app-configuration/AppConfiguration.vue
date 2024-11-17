<script setup lang="ts">
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ref, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  dropdownOptions: {
    type: Array as () => { key: string, value: string }[],
    required: true
  },
  icon: {
    type: [Object, Function],
    required: false
  },
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const selectedOption = ref(props.modelValue)

watch(selectedOption, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center space-x-2">
          <component :is="icon" class="icon" />
          <div>
            <CardTitle class="text-left">{{ title }}</CardTitle>
            <CardDescription v-if="description" class="text-left">
              {{ description }}
            </CardDescription>
          </div>
        </div>
        <select v-model="selectedOption" class="dropdown">
          <option v-for="option in dropdownOptions" :key="option.key" :value="option.value">
            {{ option.key }}
          </option>
        </select>
      </div>
    </CardHeader>
  </Card>
</template>

<style scoped>
.icon {
  width: 24px;
  height: 24px;
}
.dropdown {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 120px;
}
</style>
