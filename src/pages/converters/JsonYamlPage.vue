<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { AppConfiguration } from '@/components/ui/app-configuration'
import { AppJsonEditor } from '@/components/ui/app-json-editor'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import yaml from 'js-yaml'
import { ClipboardPaste, X, FolderOpen, Copy, FileJson2, TextQuote } from 'lucide-vue-next'
import { AppComponentGap } from '@/components/ui/app-component-gap'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/toast/use-toast'
import { AppButton } from '@/components/ui/app-button'
import {AppToaster} from "@/components/ui/app-toaster";

const { toast } = useToast()

const ConversionTitle = 'Conversion'
const ConversionDesc = 'Select which conversion mode you want to use'
const ConversionDropdown = [
  { key: 'JSON to YAML', value: 'jsonToYaml' },
  { key: 'YAML to JSON', value: 'yamlToJson' }
]

const IndentationTitle = 'Indentation'
const IndentationDropdown = [
  { key: '2 spaces', value: '2' },
  { key: '4 spaces', value: '4' }
]

const selectedConversion = ref(ConversionDropdown[0].value)
const selectedIndentation = ref(IndentationDropdown[0].value)
const inputText = ref('')
const outputText = ref('')

const convert = () => {
  try {
    if (selectedConversion.value === 'jsonToYaml') {
      const jsonObject = JSON.parse(inputText.value)
      outputText.value = yaml.dump(jsonObject, { indent: parseInt(selectedIndentation.value) })
    } else {
      const yamlObject = yaml.load(inputText.value)
      outputText.value = JSON.stringify(yamlObject, null, parseInt(selectedIndentation.value))
    }
  } catch (error: any) {
    outputText.value = `Error: ${error.message}`
  }
}

const pasteFromClipboard = async () => {
  try {
    inputText.value = await navigator.clipboard.readText()
    toast({
      title: 'Pasted from Clipboard',
      description: 'Input text has been updated from clipboard contents.',
    })
  } catch (error) {
    console.error('Failed to read clipboard contents: ', error)
  }
}

const openFile = async () => {
  if (window.showOpenFilePicker) {
    try {
      const [fileHandle] = await window.showOpenFilePicker()
      const file = await fileHandle.getFile()
      inputText.value = await file.text()
      toast({
        title: 'File Opened',
        description: 'Input text has been updated from the selected file.',
      })
    } catch (error) {
      console.error('Failed to open file: ', error)
    }
  } else {
    console.error('showOpenFilePicker is not supported in this browser.')
  }
}

const clearInput = () => {
  inputText.value = ''
  toast({
    title: 'Input Cleared',
    description: 'Input text has been cleared.',
  })
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(outputText.value)
    toast({
      title: 'Copied to Clipboard',
      description: 'Output text has been copied to clipboard.',
    })
  } catch (error) {
    console.error('Failed to copy to clipboard: ', error)
  }
}

watch([selectedIndentation, inputText], convert)
watch(selectedConversion, () => {
  if (!outputText.value.startsWith('Error:')) {
    inputText.value = outputText.value
  }
  convert()
})

const isMobile = ref(window.innerWidth <= 768)

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}
onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})
const panelGroupDir = computed(() => (isMobile.value ? 'vertical' : 'horizontal'))

const panelGroupClass = computed(() => (isMobile.value ? '!h-[125svh]' : '!h-[60svh]'))
</script>

<template>
  <AppToaster />
  <Label for="email">Configuration</Label>
  <AppComponentGap size="small" />
  <AppConfiguration
    :title="ConversionTitle"
    :description="ConversionDesc"
    :listOptions="ConversionDropdown"
    :icon="FileJson2"
    type="dropdown"
    v-model="selectedConversion"
  />
  <AppComponentGap />
  <AppConfiguration
    :title="IndentationTitle"
    :listOptions="IndentationDropdown"
    :icon="TextQuote"
    type="dropdown"
    v-model="selectedIndentation"
  />
  <AppComponentGap size="large" />
  <ResizablePanelGroup :direction="panelGroupDir" :class="panelGroupClass">
    <ResizablePanel>
      <div class="input-header">
        <Label for="input">Input</Label>
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
                <AppButton variant="outline" size="icon" @click="openFile">
                  <FolderOpen class="w-4 h-4" />
                </AppButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open File</p>
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
      <AppJsonEditor v-model="inputText" />
    </ResizablePanel>
    <ResizableHandle v-if="!isMobile" with-handle class="resizeable-handle" />
    <ResizablePanel>
      <div class="input-header">
        <Label for="output">Output</Label>
        <div class="button-group">
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
      <AppJsonEditor v-model="outputText" :readonly="true" />
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

<style scoped>
.resizeable-handle {
  padding: 5px;
  background: transparent;
}
</style>
