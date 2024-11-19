<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { ClipboardPaste, Copy, TriangleAlert } from 'lucide-vue-next'
import { AppComponentGap } from '@/components/ui/app-component-gap'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ref, watch, defineProps, defineEmits } from 'vue'
import { Toaster, useToast } from '@/components/ui/toast'
import {AppToaster} from "@/components/ui/app-toaster";
const { toast } = useToast()

const props = defineProps({
  formatNumber: Boolean,
  hexadecimal: {
    type: String,
    default: ''
  },
  decimal: {
    type: String,
    default: ''
  },
  octal: {
    type: String,
    default: ''
  },
  binary: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:hexadecimal', 'update:decimal', 'update:octal', 'update:binary'])

const hexadecimal = ref(props.hexadecimal as string)
const decimal = ref(props.decimal as string)
const octal = ref(props.octal as string)
const binary = ref(props.binary as string)

watch(hexadecimal, (newValue) => {
  emit('update:hexadecimal', newValue)
  validateAndSetAlert(newValue, 16)
})

watch(decimal, (newValue) => {
  emit('update:decimal', newValue)
  validateAndSetAlert(newValue, 10)
})

watch(octal, (newValue) => {
  emit('update:octal', newValue)
  validateAndSetAlert(newValue, 8)
})

watch(binary, (newValue) => {
  emit('update:binary', newValue)
  validateAndSetAlert(newValue, 2)
})

const alertMessage = ref('')

const MAX_INT_VALUE = Number.MAX_SAFE_INTEGER

function formatValue(value: string, base: number) {
  if (!props.formatNumber) return value
  switch (base) {
    case 16:return value.toUpperCase().split('').reverse().join('').replace(/(.{4})/g, '$1 ').trim().split('').reverse().join('')
    case 10:
      return Number(value).toLocaleString()
    case 8:
      return value.split('').reverse().join('').replace(/(.{4})/g, '$1 ').trim().split('').reverse().join('')
    case 2:
      value = value.padStart(Math.ceil(value.length / 4) * 4, '0')
      return value.replace(/(.{4})/g, '$1 ').trim()
    default:
      return value
  }
}

function convertValues(base: number, value: string) {
  if (value == '') {
    hexadecimal.value = ''
    decimal.value = ''
    octal.value = ''
    binary.value = ''
    return
  }
  const number = parseInt(value, base)
  if (isNaN(number) || number > MAX_INT_VALUE) {
    return
  }
  hexadecimal.value = formatValue(number.toString(16), 16)
  decimal.value = formatValue(number.toString(10), 10)
  octal.value = formatValue(number.toString(8), 8)
  binary.value = formatValue(number.toString(2), 2)
}
function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value ? target.value.replace(/\s+/g, '') : ''

  if (target.id === 'hexadecimal') {
    if (/^[0-9a-fA-F]*$/.test(value)) {
      convertValues(16, value)
    } else {
      target.value = hexadecimal.value
    }
  }

  if (target.id === 'decimal') {
    if (/^\d*$/.test(value)) {
      convertValues(10, value)
    } else {
      target.value = decimal.value
    }
  }

  if (target.id === 'octal') {
    if (/^[0-7]*$/.test(value)) {
      convertValues(8, value)
    } else {
      target.value = octal.value
    }
  }

  if (target.id === 'binary') {
    if (/^[01]*$/.test(value)) {
      convertValues(2, value)
    } else {
      target.value = binary.value
    }
  }
}

watch(() => props.formatNumber, () => {
  convertValues(16, hexadecimal.value.replace(/\s+/g, ''))
})

function pasteFromClipboard(refValue: { value: string }) {
  navigator.clipboard.readText().then(text => {
    refValue.value = text
    handleChange({ target: { id: refValue.value } } as unknown as Event)
    toast({
      title: 'Pasted from Clipboard',
      description: `Pasted value into ${refValue.value} input.`,
    })
  })
}

function copyToClipboard(value: string) {
  navigator.clipboard.writeText(value).then(() => {
    toast({
      title: 'Copied to Clipboard',
      description: `Copied value from ${value} input.`,
    })
  })
}

function hexadecimalPaste() {
  pasteFromClipboard(hexadecimal)
}

function decimalPaste() {
  pasteFromClipboard(decimal)
}

function octalPaste() {
  pasteFromClipboard(octal)
}

function binaryPaste() {
  pasteFromClipboard(binary)
}

function hexadecimalCopy() {
  copyToClipboard(hexadecimal.value)
}

function decimalCopy() {
  copyToClipboard(decimal.value)
}

function octalCopy() {
  copyToClipboard(octal.value)
}

function binaryCopy() {
  copyToClipboard(binary.value)
}

function validateAndSetAlert(newValue: string, base: number) {
  if (newValue == '') {
    alertMessage.value = ''
    return
  }
  const number = Number(parseInt(newValue, base))
  if (isNaN(number) || number > MAX_INT_VALUE) {
    alertMessage.value = `Input is not valid or exceeds the maximum value of ${MAX_INT_VALUE}`
  } else {
    alertMessage.value = ''
  }
}

</script>

<template>
  <AppToaster />
  <Alert v-if="alertMessage" variant="destructive">
    <TriangleAlert class="w-4 h-4" />
    <AlertTitle>Warning</AlertTitle>
    <AlertDescription>{{ alertMessage }}</AlertDescription>
  </Alert>
  <div class="input-header">
    <Label for="hexadecimal" class="align-bottom">Hexadecimal</Label>
    <div class="button-group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="icon" @click="hexadecimalPaste">
              <ClipboardPaste class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Paste to hexadecimal from clipboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="icon" @click="hexadecimalCopy">
              <Copy class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy hexadecimal to clipboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
  <AppComponentGap size="small" />
  <Input v-model="hexadecimal" id="hexadecimal" type="text" :default-value="hexadecimal" class="w-full"
         @blur="handleChange" @change="handleChange" />
  <AppComponentGap />

  <div class="input-header">
    <Label for="decimal" class="align-bottom">Decimal</Label>
    <div class="button-group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="icon" @click="decimalPaste">
              <ClipboardPaste class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Paste to decimal from clipboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="icon" @click="decimalCopy">
              <Copy class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy decimal to clipboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
  <AppComponentGap size="small" />
  <Input v-model="decimal" id="decimal" type="text" :default-value="decimal" class="w-full" @blur="handleChange"
         @change="handleChange" />

  <AppComponentGap />

  <div class="input-header">
    <Label for="octal" class="align-bottom">Octal</Label>
    <div class="button-group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="icon" @click="octalPaste">
              <ClipboardPaste class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Paste to octal from clipboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="icon" @click="octalCopy">
              <Copy class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy octal to clipboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
  <AppComponentGap size="small" />
  <Input v-model="octal" id="octal" type="text" :default-value="octal" class="w-full" @blur="handleChange"
         @change="handleChange" />

  <AppComponentGap />

  <div class="input-header">
    <Label for="binary" class="align-bottom">Binary</Label>
    <div class="button-group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="icon" @click="binaryPaste">
              <ClipboardPaste class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Paste to binary from clipboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="icon" @click="binaryCopy">
              <Copy class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy binary to clipboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
  <AppComponentGap size="small" />
  <Input v-model="binary" id="binary" type="text" :default-value="binary" class="w-full" @blur="handleChange"
         @change="handleChange" />

  <AppComponentGap />
</template>

<style scoped>
.input-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end; /* Align items at the bottom */
}

.button-group {
  display: flex;
  gap: 8px; /* Adjust the gap between buttons as needed */
}
</style>
