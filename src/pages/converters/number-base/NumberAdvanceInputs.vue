<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { AppConfiguration } from '@/components/ui/app-configuration'
import { AppComponentGap } from '@/components/ui/app-component-gap'
import { ArrowLeft, ArrowRight, ClipboardPaste, Copy, TriangleAlert } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import base32Encode from 'base32-encode'
import base32Decode from 'base32-decode'
import { defineProps } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast'

const props = defineProps<{
  formatNumber: boolean
}>()

const { toast } = useToast()
const InputDictTitle = 'Input dictionary'
const InputDictDropdown = [
  { key: 'RFC-4648 Base16', value: 'Base16' },
  { key: 'RFC-4648 Base32', value: 'Base32' },
  { key: 'RFC-4648 Base32 Extended Hex', value: 'Base32Hex' },
  { key: 'RFC-4648 Base64', value: 'Base64' },
  { key: 'RFC-4648 Base64 Url Encode', value: 'Base64Url' }
]

const OutputDictTitle = 'Output dictionary'
const OutputDictDropdown = [...InputDictDropdown]

const selectedInputDict = ref(InputDictDropdown[0].value)
const selectedOutputDict = ref(OutputDictDropdown[0].value)

const input = ref('')
const output = ref('')
const alertMessage = ref('')

function pasteFromClipboard(refValue: { value: string }) {
  navigator.clipboard.readText().then(text => {
    refValue.value = text
    toast({
      title: 'Pasted from Clipboard',
      description: `Pasted value into ${refValue.value} input.`
    })
  })
}

function copyToClipboard(value: string) {
  navigator.clipboard.writeText(value).then(() => {
    toast({
      title: 'Copied to Clipboard',
      description: `Value copied`
    })
  })
}

function inputPaste() {
  pasteFromClipboard(input)
}

function inputCopy() {
  copyToClipboard(input.value)
}

function outputCopy() {
  copyToClipboard(output.value)
}

function validateInput(value: string, format: string): boolean {
  // Add validation logic for specific formats if needed
  if (!value) {
    alertMessage.value = 'Input is empty'
    return false
  }
  alertMessage.value = ''
  return true
}

function convert(value: string, inputFormat: string, outputFormat: string): string {
  if (!validateInput(value, inputFormat)) {
    alertMessage.value = ''
    return ''
  }

  let buffer: ArrayBuffer;

  // Decode based on input format
  switch (inputFormat) {
    case 'Base16': // Hexadecimal
      buffer = hexToArrayBuffer(value);
      break;
    case 'Base32':
      buffer = base32DecodeToArrayBuffer(value, 'RFC4648');
      break;
    case 'Base32Hex':
      buffer = base32DecodeToArrayBuffer(value, 'Crockford');
      break;
    case 'Base64':
      buffer = base64ToArrayBuffer(value);
      break;
    case 'Base64Url':
      buffer = base64UrlToArrayBuffer(value);
      break;
    default:
      throw new Error(`Unsupported input format: ${inputFormat}`);
  }
  // Encode based on output format
  let result: string;
  switch (outputFormat) {
    case 'Base16': // Convert to hexadecimal
      result = arrayBufferToHex(buffer);
      break;
    case 'Base32':
      result = base32Encode(new Uint8Array(buffer), 'RFC4648');
      break;
    case 'Base32Hex':
      result = base32Encode(new Uint8Array(buffer), 'Crockford');
      break;
    case 'Base64': // Convert to Base64
      result = arrayBufferToBase64(buffer);
      break;
    case 'Base64Url': // Convert to Base64 URL safe
      result = arrayBufferToBase64Url(buffer);
      break;
    default:
      throw new Error(`Unsupported output format: ${outputFormat}`);
  }

  return result;
}
function hexToArrayBuffer(hex: string): ArrayBuffer {
  if (hex.length % 2 !== 0) {
    hex = '0' + hex;
  }

  const length = hex.length / 2;
  const buffer = new ArrayBuffer(length);
  const view = new Uint8Array(buffer);

  for (let i = 0; i < length; i++) {
    view[i] = parseInt(hex.substr(i * 2, 2), 16);
  }

  return buffer;
}

function arrayBufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hexString = Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
    .replace(/^0+/, '');

  if (props.formatNumber) {
    hexString = hexString.toUpperCase();
    const regex = /.{1,4}(?=(.{4})*$)/g;
    hexString = hexString.match(regex)?.join(' ') ?? hexString;
  }

  return hexString;
}
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array( buffer );
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode( bytes[ i ] );
  }
  return btoa(binary);
}

function base64UrlToArrayBuffer(base64Url: string): ArrayBuffer {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return base64ToArrayBuffer(base64);
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const base64 = arrayBufferToBase64(buffer);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
type Variant = 'RFC4648' | 'Crockford';

function base32DecodeToArrayBuffer(value: string, variant: Variant): ArrayBuffer {
  return base32Decode(value, variant);
}

function convertValues() {
  try {
    output.value = convert(input.value, selectedInputDict.value, selectedOutputDict.value)
  } catch (error: any) {
    alertMessage.value = error.message
    output.value = ''
  }
}

watch(selectedInputDict, convertValues)
watch(selectedOutputDict, convertValues)
watch(() => props.formatNumber, () => {
  convertValues()
})
</script>

<template>
  <Alert v-if="alertMessage" variant="destructive">
    <TriangleAlert class="w-4 h-4" />
    <AlertTitle>Warning</AlertTitle>
    <AlertDescription>{{ alertMessage }}</AlertDescription>
  </Alert>
  <AppComponentGap size="small" />
  <AppConfiguration
    :title="InputDictTitle"
    :listOptions="InputDictDropdown"
    :icon="ArrowRight"
    type="dropdown"
    v-model="selectedInputDict"
  />
  <AppComponentGap size="small" />

  <div class="input-header">
    <Label for="input" class="align-bottom">Input</Label>
    <div class="button-group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="icon" @click="inputPaste">
              <ClipboardPaste class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Paste to input from clipboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="icon" @click="inputCopy">
              <Copy class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy input to clipboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
  <AppComponentGap size="small" />
  <Input v-model="input" type="text" :default-value="input" class="w-full" @blur="convertValues"
         @change="convertValues" />
  <AppComponentGap size="small" />
  <AppConfiguration
    :title="OutputDictTitle"
    :listOptions="OutputDictDropdown"
    :icon="ArrowLeft"
    type="dropdown"
    v-model="selectedOutputDict"
  />
  <AppComponentGap size="small" />
  <div class="input-header">
    <Label for="binary" class="align-bottom">Output</Label>
    <div class="button-group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="icon" @click="outputCopy">
              <Copy class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy output to clipboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
  <AppComponentGap size="small" />
  <Input v-model="output" type="text" :default-value="output" class="w-full" readonly />
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
