<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { AppButton } from '@/components/ui/app-button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { AppJsonEditor } from '@/components/ui/app-json-editor'
import {
  ChartNoAxesGantt,
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
const isAttributeOnNewLine = ref('0')
const newLineText = computed(() => (isAttributeOnNewLine.value === '1' ? 'On' : 'Off'))
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

watch([isAttributeOnNewLine, indentationType, inputText], () => {
  outputText.value = formatXml(inputText.value, indentationType.value, isAttributeOnNewLine)
})

function formatXml(inputText: string, indentationType: string, isAttributeOnNewLine: boolean): string {
  const indentMapping: Record<string, string> = {
    '2spaces': '  ',
    '4spaces': '    ',
    '1tab': '\t',
    'minified': ''
  };

  const indent = indentMapping[indentationType] || '  '; // Default to 2 spaces if type is unknown
  const parser = new DOMParser();

  // Extract the XML declaration if it exists
  const xmlDeclarationMatch = inputText.match(/^<\?xml [^>]+?>/);
  const xmlDeclaration = xmlDeclarationMatch ? xmlDeclarationMatch[0] : null;

  // Parse the input XML string
  const xmlContent = xmlDeclaration ? inputText.replace(xmlDeclaration, '').trim() : inputText;
  const xmlDocument = parser.parseFromString(xmlContent, 'application/xml');
  const parseError = xmlDocument.querySelector('parsererror');
  if (parseError) {
    throw new Error('Invalid XML: ' + parseError.textContent);
  }

  function formatNode(node: Node, level: number): string {
    let formatted = '';
    const indentString = indentationType === 'minified' ? '' : indent.repeat(level);

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const attributes = Array.from(element.attributes);
      const tagName = element.tagName;

      formatted += `${indentString}<${tagName}`;

      if (isAttributeOnNewLine && attributes.length > 0 && indentationType !== 'minified') {
        formatted += '\n';
        attributes.forEach(attr => {
          formatted += `${indentString}${indent}${attr.name}="${attr.value}"\n`;
        });
        formatted += `${indentString}>`;
      } else {
        attributes.forEach(attr => {
          formatted += ` ${attr.name}="${attr.value}"`;
        });
        formatted += '>';
      }

      const childNodes = Array.from(element.childNodes);
      if (childNodes.length > 0) {
        formatted += indentationType === 'minified' ? '' : '\n';
        childNodes.forEach(child => {
          formatted += formatNode(child, level + 1);
        });
        formatted += `${indentString}</${tagName}>${indentationType === 'minified' ? '' : '\n'}`;
      } else {
        formatted += `</${tagName}>${indentationType === 'minified' ? '' : '\n'}`;
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue?.trim();
      if (text) {
        formatted += `${indentString}${text}${indentationType === 'minified' ? '' : '\n'}`;
      }
    }

    return formatted;
  }

  let result = '';
  const rootNodes = Array.from(xmlDocument.childNodes);
  rootNodes.forEach(node => {
    result += formatNode(node, 0);
  });

  // Prepend the XML declaration if it was present
  return xmlDeclaration ? `${xmlDeclaration}${result.trim()}` : result.trim();
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
      title="Put attributes on new line"
      :icon="ChartNoAxesGantt"
      type="switch"
      v-model="isAttributeOnNewLine"
      :switch-text="newLineText"
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
