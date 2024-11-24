<script setup lang="ts">
import { useToast } from '@/components/ui/toast/use-toast'
import { AppButton } from '@/components/ui/app-button'
import { ArrowLeftRight, ClipboardPaste, Copy, X, Maximize2, Minimize2, File, TriangleAlert } from 'lucide-vue-next'
import { Label } from '@/components/ui/label'
import { AppConfiguration } from '@/components/ui/app-configuration'
import { computed, onMounted, ref, watch } from 'vue'
import { AppComponentGap } from '@/components/ui/app-component-gap'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Textarea } from '@/components/ui/textarea'
import { useRoute } from 'vue-router'
import pako from 'pako';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const { toast } = useToast()
const route = useRoute()

const switchValue = ref('0')
const isFullScreen = ref(false)
const switchText = ref(switchValue.value === '0' ? 'Decompress' : 'Compress')
const input = ref('')
const output = ref('')
const localStorageKey = computed(() => `${String(route.name)}-input`)

// Set default input value from localStorage
onMounted(() => {
  const savedInput = localStorage.getItem(localStorageKey.value)
  if (savedInput) {
    input.value = savedInput
  }
})

watch(switchValue, () => {
  input.value = output.value
  if(input.value === ''){
    alertMessage.value = ''; // Clear the alert message on success
    output.value = ''
  }
  else if (switchValue.value === '0'){
    switchText.value = 'Decompress'
    output.value = deCompress(input.value)
  }
  else{
    switchText.value = 'Compress'
    output.value = compress(input.value)
  }
})

watch(input, (newValue) => {
  if(newValue === ''){
    alertMessage.value = ''; // Clear the alert message on success
    output.value = ''
    return
  }
  else if (switchValue.value === '0') {
    output.value = deCompress(newValue)
  }
  else{
    output.value = compress(newValue)
  }
  localStorage.setItem(localStorageKey.value, newValue)
})

const alertMessage = ref('');

function compress(str: string): string {
  try {
    const binaryData = new TextEncoder().encode(str);
    const compressedData = pako.gzip(binaryData);
    alertMessage.value = ''; // Clear the alert message on success
    return btoa(String.fromCharCode(...compressedData));
  } catch (error) {
    const err = error as Error
    alertMessage.value = `Compression error: ${err.message}`;
    return '';
  }
}

function deCompress(str: string): string {
  try {
    const binaryString = atob(str);
    const binaryData = new Uint8Array(binaryString.split('').map(char => char.charCodeAt(0)));
    const decompressedData = pako.ungzip(binaryData);
    alertMessage.value = ''; // Clear the alert message on success
    return new TextDecoder().decode(decompressedData);
  } catch (error) {
    const err = error as Error
    alertMessage.value = `Decompression error: ${err.message}`;
    return '';
  }
}

function showToaster(title: string, description: string) {
  toast({
    title: title,
    description: description,
  })
}

function pasteFromClipboard() {
  navigator.clipboard.readText().then(text => {
    input.value = text
    showToaster('Pasted from Clipboard', 'Input text has been updated from clipboard contents.')
  })
}


function copyToClipboard() {
  navigator.clipboard.writeText(input.value).then(() => {
    showToaster('Copied to Clipboard', 'Input text has been copied to clipboard.')
  })
}

function copyOutputToClipboard() {
  navigator.clipboard.writeText(output.value).then(() => {
    showToaster('Copied to Clipboard', 'Output text has been copied to clipboard.')
  })
}

function clearInput() {
  input.value = ''
  showToaster('Input Cleared', 'Input text has been cleared.')
}

function setFullScreen() {
  isFullScreen.value = !isFullScreen.value
  showToaster(isFullScreen.value ? 'Entered Full Screen' : 'Exited Full Screen', isFullScreen.value ? 'You have entered full screen mode.' : 'You have exited full screen mode.')
}

function loadFile() {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'text/*'
  fileInput.onchange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        input.value = reader.result as string
        showToaster('File Loaded', 'Input text has been updated from file contents.')
      }
      reader.readAsText(file)
    }
  }
  fileInput.click()
}
</script>

<template>
  <Alert v-if="alertMessage" variant="destructive">
    <TriangleAlert class="w-4 h-4" />
    <AlertTitle>Warning</AlertTitle>
    <AlertDescription>{{ alertMessage }}</AlertDescription>
  </Alert>
  <div v-if="!isFullScreen">
    <Label for="email">Configuration</Label>
    <AppComponentGap size="small" />
    <AppConfiguration
      title="GZip Compress/Decompress"
      description="Select which input you want to perform the operation on."
      :icon="ArrowLeftRight"
      type="switch"
      v-model="switchValue"
      :switch-text="switchText"
    />
    <AppComponentGap />

    <div class="input-header">
      <Label for="input" class="align-bottom">Input</Label>
      <div class="button-group">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AppButton variant="outline" size="icon" @click="pasteFromClipboard">
                <ClipboardPaste class="w-4 h-4" />
              </AppButton>
            </TooltipTrigger>
            <TooltipContent>
              <p>Paste from Clipboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AppButton variant="outline" size="icon" @click="loadFile">
                <File class="w-4 h-4" />
              </AppButton>
            </TooltipTrigger>
            <TooltipContent>
              <p>Load file</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AppButton variant="outline" size="icon" @click="copyToClipboard">
                <Copy class="w-4 h-4" />
              </AppButton>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy to Clipboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AppButton variant="outline" size="icon" @click="clearInput">
                <X class="w-4 h-4" />
              </AppButton>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear Input</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
    <AppComponentGap size="small" />
    <Textarea v-model="input" id="input" class="w-full h-[25svh]" />

    <AppComponentGap />
  </div>

  <div class="input-header">
    <Label for="output" class="align-bottom">Output</Label>
    <div class="button-group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AppButton variant="outline" size="icon" @click="setFullScreen">
              <Maximize2 v-if="!isFullScreen" class="w-4 h-4" />
              <Minimize2 v-else class="w-4 h-4" />
            </AppButton>
          </TooltipTrigger>
          <TooltipContent>
            <p>Full Screen</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AppButton variant="outline" size="icon" @click="copyOutputToClipboard">
              <Copy class="w-4 h-4" />
            </AppButton>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy to Clipboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
  <AppComponentGap size="small" />
  <Textarea v-model="output" id="output" :class="isFullScreen ? 'h-[78svh]' : 'h-[25svh]'" readonly/>
</template>
