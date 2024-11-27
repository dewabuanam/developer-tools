<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { AppButton } from '@/components/ui/app-button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { AppJsonEditor } from '@/components/ui/app-json-editor'
import {
  ClipboardPaste,
  Copy,
  FolderOpen, Languages,
  Maximize2,
  Minimize2,
  TextQuote,
  X
} from 'lucide-vue-next'
import { AppConfiguration } from '@/components/ui/app-configuration'
import { AppComponentGap } from '@/components/ui/app-component-gap'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useToast } from '@/components/ui/toast'

import { format } from 'sql-formatter';

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
const languageDictionary = [
  { key: "Db2", value: "db2" },
  { key: "MariaDB", value: "mariadb" },
  { key: "MySQL", value: "mysql" },
  { key: "N1QL", value: "n1ql" },
  { key: "PL/SQL", value: "plsql" },
  { key: "PostgreSQL", value: "postgresql" },
  { key: "Amazon Redshift", value: "redshift" },
  { key: "Spark SQL", value: "spark" },
  { key: "Standard SQL", value: "sql" },
  { key: "Transact-SQL", value: "transactsql" },
  { key: "BigQuery", value: "bigquery" },
  { key: "Db2i", value: "db2i" },
  { key: "Hive", value: "hive" },
  { key: "SingleStoreDB", value: "singlestoredb" },
  { key: "Snowflake", value: "snowflake" },
  { key: "SQLite", value: "sqlite" },
  { key: "TiDB", value: "tidb" },
  { key: "Trino", value: "trino" },
  { key: "T-SQL", value: "tsql" }
];

const languageType = ref(languageDictionary[8].value)
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

watch([indentationType,languageType, inputText], () => {
  formatSql()
})

function formatSql() {
  try {
    const sql = inputText.value;
    const language = languageType.value;
    let indent;

    switch (indentationType.value) {
      case '2spaces':
        indent = '  ';
        break;
      case '4spaces':
        indent = '    ';
        break;
      case '1tab':
        indent = '\t';
        break;
      case 'minified':
        indent = '';
        break;
      default:
        indent = '  ';
    }

    const formattedSql = format(sql, {
      language: language,
      indent: indent,
    });

    outputText.value = formattedSql;
  } catch (error) {
    console.error('Error formatting SQL:', error);
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
      title="SQL Language"
      description="Select sql language"
      :listOptions="languageDictionary"
      :icon="Languages"
      type="dropdown"
      v-model="languageType"
    />
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
