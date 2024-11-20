<script setup lang="ts">
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ref, watch } from 'vue'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { AppDropdown } from '@/components/ui/app-dropdown'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  listOptions: {
    type: Array as () => { key: string, value: string }[],
    required: false
  },
  icon: {
    type: [Object, Function],
    required: false
  },
  modelValue: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: (value: string) => ['dropdown', 'switch', 'inputNumber', 'inputText'].includes(value)
  },
  switchText: {
    type: String,
    required: false,
    default: ''
  },
  maxInputNumber: {
    type: Number,
    required: false
  },
  minInputNumber: {
    type: Number,
    required: false
  }
})

const emit = defineEmits(['update:modelValue', 'blur'])

const selectedOption = ref(props.modelValue)
const open = ref(false)

watch(selectedOption, (newValue: string) => {
  emit('update:modelValue', newValue)
})

function handleChange(newValue: boolean) {
  selectedOption.value = newValue ? '1' : '0'
}

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  selectedOption.value = target.value
}

function validateInput(event: Event) {
  const target = event.target as HTMLInputElement
  let value = parseFloat(target.value)
  if (props.maxInputNumber !== undefined && value > props.maxInputNumber) {
    target.value = props.maxInputNumber.toString()
  }
  if (props.minInputNumber !== undefined && value < props.minInputNumber) {
    target.value = props.minInputNumber.toString()
  }
  selectedOption.value = target.value
}

function handleBlur() {
  emit('blur')
}
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center space-x-2">
          <component :is="icon" class="h-4 w-4" />
          <div>
            <CardTitle class="text-left items-center text-[1.2rem]">{{ title }}</CardTitle>
            <CardDescription v-if="description" class="text-left">
              {{ description }}
            </CardDescription>
          </div>
        </div>
        <div v-if="type === 'switch'" class="flex items-center space-x-2">
          <span>{{ switchText }}</span>
          <Switch
            class="data-[state=checked]:bg-[hsl(var(--button-component-primary))]"
            :checked="selectedOption === '1'"
            @update:checked="handleChange"
          />
        </div>
        <AppDropdown
          v-else-if="type === 'dropdown'"
          :selectedOption="selectedOption"
          :listOptions="props.listOptions"
          popover-content-class="w-[200px] p-0"
          button-class="w-[22svh] justify-between"
          @update:selectedOption="(value: string) => selectedOption = value"
        />
        <Input v-else-if="type === 'inputText'" class="w-[22svh]" v-model="selectedOption" @input="handleInputChange" @blur="handleBlur" />
        <Input
          v-else-if="type === 'inputNumber'"
          class="w-[22svh]"
          v-model="selectedOption"
          type="number"
          :max="props.maxInputNumber"
          :min="props.minInputNumber"
          @input="validateInput"
          @blur="handleBlur"
        />
      </div>
    </CardHeader>
  </Card>
</template>
