<script setup lang="ts">
import { ref, computed } from 'vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { ChevronsUpDown, Check } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const props = defineProps({
  selectedOption: {
    type: String,
    required: true
  },
  listOptions: {
    type: Array as () => { key: string, value: string }[],
    required: false
  },
  buttonClass: {
    type: String,
    required: false,
    default: ''
  },
  popoverContentClass: {
    type: String,
    required: false,
    default: ''
  }
})

const emit = defineEmits(['update:selectedOption'])

const open = ref(false)
const searchQuery = ref('')
let buttonSelected = ref((props.listOptions ?? []).find((option) => option.value === props.selectedOption)?.key)

const filteredOptions = computed(() => {
  if (!searchQuery.value) {
    return props.listOptions ?? []
  }
  return (props.listOptions ?? []).filter(option =>
    option.key.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    option.value.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function handleSelect(ev: CustomEvent) {
  buttonSelected = ev.detail.value
  if (typeof ev.detail.value === 'string') {
    let value = (props.listOptions ?? []).find((option) => option.key === ev.detail.value)?.value
    emit('update:selectedOption', value)
  }
  open.value = false
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        :class="buttonClass"
      >
        {{ buttonSelected ? buttonSelected
        : 'Select option...' }}
        <ChevronsUpDown class="h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent :class="popoverContentClass">
      <Command :class="popoverContentClass">
        <CommandInput class="h-9" placeholder="Search option..." v-model="searchQuery" />
        <CommandEmpty>No option found.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="option in filteredOptions"
              :key="option.key"
              :value="option.key"
              @select="handleSelect"
            >
              {{ option.key }}
              <Check
                :class="['ml-auto h-4 w-4', buttonSelected === option.key ? 'opacity-100' : 'opacity-0']"
              />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
