<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { AppButton } from '@/components/ui/app-button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { AppJsonEditor } from '@/components/ui/app-json-editor'
import {
  ArrowDownAZ,
  ClipboardPaste,
  Copy,
  FolderOpen,
  Maximize2,
  Minimize2,
  TextQuote,
  X
} from 'lucide-vue-next'
import { AppConfiguration } from '@/components/ui/app-configuration'
import { AppComponentGap } from '@/components/ui/app-component-gap'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useToast } from '@/components/ui/toast'

const isMobile = ref(window.innerWidth <= 768)
const isFullScreen = ref(false)
const { toast } = useToast()
const indentationDictionary = [
  { key: '2 spaces', value: '2spaces' },
  { key: '4 spaces', value: '4spaces' },
  { key: '1 tab', value: '1tab' },
  { key: 'Minified', value: 'minified' }
]
const indentationType = ref(indentationDictionary[0].value)
const isSort = ref('0')
const sortText = computed(() => (isSort.value === '1' ? 'On' : 'Off'))
const inputText = ref('')
const outputText = ref('')

function setFullScreen() {
  isFullScreen.value = !isFullScreen.value
  showToaster(isFullScreen.value ? 'Entered Full Screen' : 'Exited Full Screen', isFullScreen.value ? 'You have entered full screen mode.' : 'You have exited full screen mode.')
}

function showToaster(title: string, description: string) {
  toast({
    title: title,
    description: description
  })
}

watch([isSort, indentationType, inputText], () => {
  formatJson()
})
function sortObjectKeys(obj: Record<string, never>): Record<string, never> {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).sort().reduce((result, key) => {
      result[key] = sortObjectKeys(obj[key]);
      return result;
    }, {} as Record<string, never>);
  }
  return obj;
}
function formatJson(){
  try {
    let jsonObject = JSON.parse(inputText.value);

    if (isSort.value === '1') {
      jsonObject = sortObjectKeys(jsonObject);
    }

    let spaces;
    switch (indentationType.value) {
      case '2spaces':
        spaces = 2;
        break;
      case '4spaces':
        spaces = 4;
        break;
      case '1tab':
        spaces = '\t';
        break;
      case 'minified':
        spaces = 0;
        break;
      default:
        spaces = 2;
    }

    outputText.value = JSON.stringify(jsonObject, null, spaces);
  } catch (error) {
    console.error('Invalid JSON input:', error);
  }
}

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
async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText()
    inputText.value = text
  } catch (err) {
    console.error('Failed to read clipboard contents: ', err)
  }
}

// Method to open a file and read its content into inputText
function openFile() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'

  input.onchange = async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        inputText.value = e.target?.result as string
      }
      reader.readAsText(file)
    }
  }

  input.click()
}

// Method to clear the inputText
function clearInput() {
  inputText.value = ''
}

// Method to copy outputText to clipboard
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(outputText.value)
  } catch (err) {
    console.error('Failed to write to clipboard: ', err)
  }
}
</script>


<template>
  <div v-if="!isFullScreen">
    <Label for="email">Configuration</Label>
    <AppComponentGap size="small" />
    <AppConfiguration
      title="Indentation"
      description="Select indentation type"
      :listOptions="indentationDictionary"
      :icon="TextQuote"
      type="dropdown"
      v-model="indentationType"
    />
    <AppComponentGap />
    <AppConfiguration
      title="Sort JSON properties alphabetically"
      :icon="ArrowDownAZ"
      type="switch"
      v-model="isSort"
      :switch-text="sortText"
    />
    <AppComponentGap size="large" />
  </div>
  <ResizablePanelGroup :direction="panelGroupDir" :class="panelGroupClass">
    <ResizablePanel v-if="!isFullScreen">
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
    <ResizableHandle v-if="!isMobile && !isFullScreen" with-handle class="p-2 bg-transparent" />
    <ResizablePanel>
      <div class="input-header">
        <Label for="output">Output</Label>
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
      <AppJsonEditor
        v-model="outputText"
        :class="isFullScreen ? 'h-[78svh]' : 'h-[25svh]'"
        :readonly="true"
        class="w-[50svh]"
        maxWidth="150svh"
      />
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
