<script setup lang="ts">
import { Label } from '@/components/ui/label'
import Configuration from '../../components/ui/configuration/Configuration.vue'
import { Settings } from 'lucide-vue-next'
import { LineNumberTextarea } from '@/components/ui/textarea'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ref, watch } from 'vue'
import yaml from 'js-yaml'

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

watch([selectedIndentation, inputText], convert)
watch(selectedConversion, () => {
  if (!outputText.value.startsWith('Error:')) {
    inputText.value = outputText.value
  }
  convert()
})
</script>

<template>
  <Label for="email">Configuration</Label>
  <Configuration
    :title="ConversionTitle"
    :description="ConversionDesc"
    :dropdownOptions="ConversionDropdown"
    :icon="Settings"
    v-model="selectedConversion"
  />
  <Configuration
    :title="IndentationTitle"
    :dropdownOptions="IndentationDropdown"
    :icon="Settings"
    v-model="selectedIndentation"
  />

  <ResizablePanelGroup direction="horizontal">
    <ResizablePanel>
      <Label for="input">Input</Label>
      <LineNumberTextarea v-model="inputText" height="600px"/>
    </ResizablePanel>
    <ResizableHandle with-handle />
    <ResizablePanel>
      <Label for="output">Output</Label>
      <LineNumberTextarea v-model="outputText" readonly height="600px"/>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
