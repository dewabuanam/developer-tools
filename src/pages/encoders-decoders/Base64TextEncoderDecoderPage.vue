<script setup lang="ts">
import { useToast } from '@/components/ui/toast/use-toast'
import { AppButton } from '@/components/ui/app-button'
import { ArrowLeftRight, ClipboardPaste, Copy, X, Maximize2, Minimize2, File, LockKeyholeOpen } from 'lucide-vue-next'
import { Label } from '@/components/ui/label'
import { AppConfiguration } from '@/components/ui/app-configuration'
import { ref, watch } from 'vue'
import { AppComponentGap } from '@/components/ui/app-component-gap'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Textarea } from '@/components/ui/textarea'

const { toast } = useToast()

const switchValue = ref('0')
const isFullScreen = ref(false)
const switchText = ref(switchValue.value === '0' ? 'Decode' : 'Encode')
const input = ref('')
const output = ref('')
const encodingList = [
  { key: 'UTF-8', value: 'utf-8' },
  { key: 'ASCII', value: 'ascii' },
]
const encoding = ref(encodingList[0].value)

function updateOutput() {
  if (switchValue.value === '0') {
    switchText.value = 'Decode'
    output.value = decodeBase64(input.value, encoding.value)
  } else {
    switchText.value = 'Encode'
    output.value = encodeBase64(input.value, encoding.value)
  }
}

watch(switchValue, () => {
  input.value = output.value
  updateOutput()
})

watch(encoding, updateOutput)

watch(input, () => {
  updateOutput()
})

function encodeBase64(str: string, encoding: string = 'utf-8'): string {
  if (encoding === 'ascii') {
    return btoa(str)
  } else {
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    return btoa(String.fromCharCode(...new Uint8Array(data.buffer)))
  }
}

function decodeBase64(str: string, encoding: string = 'utf-8'): string {
  const binaryString = atob(str)
  if (encoding === 'ascii') {
    return binaryString
  } else {
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const decoder = new TextDecoder(encoding)
    return decoder.decode(bytes)
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
  <div v-if="!isFullScreen">
    <Label for="email">Configuration</Label>
    <AppComponentGap size="small" />
    <AppConfiguration
      title="Conversion"
      description="Select which conversion mode you want to use"
      :icon="ArrowLeftRight"
      type="switch"
      v-model="switchValue"
      :switch-text="switchText"
    />
    <AppComponentGap size="small" />
    <AppConfiguration
      title="Encoding"
      description="Select which encoding you want to use"
      :list-options="encodingList"
      :icon="LockKeyholeOpen"
      type="dropdown"
      v-model="encoding"
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
    <Textarea v-model="input" id="input" class="w-full h-[20svh]" />

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
  <Textarea v-model="output" id="output" :class="isFullScreen ? 'h-[78svh]' : 'h-[20svh]'" readonly/>
</template>
