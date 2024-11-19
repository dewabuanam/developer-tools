<script setup lang="ts">
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ref, watch } from 'vue'
import { Switch } from '@/components/ui/switch'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { ChevronsUpDown, Check } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

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
    required: true
  },
  icon: {
    type: [Object, Function],
    required: false
  },
  modelValue: {
    type: String,
    required: true
  },
  useSwitch: {
    type: Boolean,
    required: false,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const selectedOption = ref(props.modelValue)
const open = ref(false)
const value = ref(props.modelValue)

watch(selectedOption, (newValue) => {
  emit('update:modelValue', newValue)
})

function handleChange(newValue: boolean) {
  selectedOption.value = newValue ? '1' : '0'
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
        <div v-if="useSwitch">
          <Switch
            :checked="selectedOption === '1'"
            @update:checked="handleChange"
          />
        </div>
        <Popover v-else v-model:open="open">
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              role="combobox"
              :aria-expanded="open"
              class="app-button w-[22svh] justify-between"
            >
              {{ value
              ? props.listOptions.find((option) => option.value === value)?.key
              : "Select option..." }}
              <ChevronsUpDown class="app-icon h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[200px] p-0">
            <Command>
              <CommandInput class="h-9" placeholder="Search option..." />
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  <CommandItem
                    v-for="option in props.listOptions"
                    :key="option.value"
                    :value="option.value"
                    @select="(ev) => {
                      if (typeof ev.detail.value === 'string') {
                        value = ev.detail.value
                      }
                      open = false
                    }"
                  >
                    {{ option.key }}
                    <Check
                      :class="['ml-auto h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0']"
                    />
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </CardHeader>
  </Card>
</template>
