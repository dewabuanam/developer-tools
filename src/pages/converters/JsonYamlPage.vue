<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { AppConfiguration } from '@/components/ui/app-configuration'
import { Settings } from 'lucide-vue-next'
import { AppJsonEditor } from '@/components/ui/app-json-editor'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ref, watch } from 'vue'
import yaml from 'js-yaml'
import { Button } from '@/components/ui/button'
import { ClipboardPaste, X, FolderOpen, Copy } from 'lucide-vue-next'

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
    const text = await navigator.clipboard.readText()
    inputText.value = text
  } catch (error) {
    console.error('Failed to read clipboard contents: ', error)
  }
}

const openFile = async () => {
  if (window.showOpenFilePicker) {
    try {
      const [fileHandle] = await window.showOpenFilePicker()
      const file = await fileHandle.getFile()
      const text = await file.text()
      inputText.value = text
    } catch (error) {
      console.error('Failed to open file: ', error)
    }
  } else {
    console.error('showOpenFilePicker is not supported in this browser.')
  }
}

const clearInput = () => {
  inputText.value = ''
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(outputText.value)
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
</script>

<template>
  <Label for="email" class="component-gap">Configuration</Label>
  <AppConfiguration
    :title="ConversionTitle"
    :description="ConversionDesc"
    :dropdownOptions="ConversionDropdown"
    :icon="Settings"
    v-model="selectedConversion"
    class="component-gap-s"
  />
  <AppConfiguration
    :title="IndentationTitle"
    :dropdownOptions="IndentationDropdown"
    :icon="Settings"
    v-model="selectedIndentation"
    class="component-gap"
  />
  <ResizablePanelGroup
    direction="horizontal" class="component-gap max-h-[640px] ">
    <ResizablePanel>
      <div class="input-header component-gap-s">
        <Label for="input">Input</Label>
        <div class="button-group">
          <Button variant="outline" size="icon" @click="pasteFromClipboard">
            <ClipboardPaste class="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" @click="openFile">
            <FolderOpen class="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" @click="clearInput">
            <X class="w-4 h-4" />
          </Button>
        </div>
      </div>
      <AppJsonEditor v-model="inputText" />
    </ResizablePanel>
    <ResizableHandle with-handle class="resizeable-handle" />
    <ResizablePanel>
      <div class="input-header component-gap-s">
        <Label for="output">Output</Label>
        <div class="button-group">
          <Button variant="outline" size="icon" @click="copyToClipboard">
            <Copy class="w-4 h-4" />
          </Button>
        </div>
      </div>
      <AppJsonEditor v-model="outputText" readOnly dar />
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

<style scoped>
.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-group {
  display: flex;
  gap: 8px; /* Adjust the gap between buttons as needed */
}

.component-gap {
  margin-bottom: 16px; /* Adjust the gap between components as needed */
}

.component-gap-s {
  margin-bottom: 8px; /* Adjust the gap between components as needed */
}

.resizeable-handle {
  padding: 5px;
  background: transparent;
}
</style>
