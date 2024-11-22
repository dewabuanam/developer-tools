<script setup lang="ts">
import { useToast } from '@/components/ui/toast/use-toast'
import { AppButton } from '@/components/ui/app-button'
import { ArrowLeftRight, ClipboardPaste, Copy, X, Maximize2, Minimize2 } from 'lucide-vue-next'
import { Label } from '@/components/ui/label'
import { AppConfiguration } from '@/components/ui/app-configuration'
import { ref, watch } from 'vue'
import { AppComponentGap } from '@/components/ui/app-component-gap'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Textarea } from '@/components/ui/textarea'

const { toast } = useToast()

const switchValue = ref('')
const isFullScreen = ref(false)
const switchText = ref('Decode')
const input = ref('')
const output = ref('')

watch(switchValue, () => {
  input.value = output.value
  if (switchValue.value === '0') {
    output.value = decodeUrl(input.value)
  }
  else{
    output.value = encodeUrl(input.value)
  }
})

watch(input, (newValue) => {
  if (switchValue.value === '0') {
    output.value = decodeUrl(newValue)
  }
  else{
    output.value = encodeUrl(newValue)
  }
})

function encodeUrl(str: string): string {
  return encodeURIComponent(str);
}

function decodeUrl(str: string): string {
  return decodeURIComponent(str);
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
            <AppButton variant="outline" size="icon" @click="copyToClipboard">
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
