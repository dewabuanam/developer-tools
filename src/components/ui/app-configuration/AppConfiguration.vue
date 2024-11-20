<script setup lang="ts">
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ref, watch } from 'vue'
import { Switch } from '@/components/ui/switch'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { ChevronsUpDown, Check } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

watch(selectedOption, (newValue) => {
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
        <Popover v-else-if="type === 'dropdown'" v-model:open="open">
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              role="combobox"
              :aria-expanded="open"
              class="w-[22svh] justify-between"
            >
              {{ selectedOption
              ? (props.listOptions ?? []).find((option) => option.value === selectedOption)?.key
              : 'Select option...' }}
              <ChevronsUpDown class="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[200px] p-0">
            <Command>
              <CommandInput class="h-9" placeholder="Search option..." />
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  <CommandItem
                    v-for="option in (props.listOptions ?? [])"
                    :key="option.value"
                    :value="option.value"
                    @select="(ev) => {
                      if (typeof ev.detail.value === 'string') {
                        selectedOption = ev.detail.value
                      }
                      open = false
                    }"
                  >
                    {{ option.key }}
                    <Check
                      :class="['ml-auto h-4 w-4', selectedOption === option.value ? 'opacity-100' : 'opacity-0']"
                    />
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
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
