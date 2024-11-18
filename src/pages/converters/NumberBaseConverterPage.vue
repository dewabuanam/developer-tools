<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@/components/ui/label'
import { AppConfiguration } from '@/components/ui/app-configuration'
import { AppComponentGap } from '@/components/ui/app-component-gap'
import { Settings } from 'lucide-vue-next'
import NumberBaseInputs from './number-base/NumberBaseInputs.vue'
import NumberAdvanceInputs from './number-base/NumberAdvanceInputs.vue'

const FormatNumberTitle = 'Format Number'
const FormatNumberDropdown = [
  { key: 'Disable', value: '0' },
  { key: 'Enabled', value: '1' }
]
const selectedFormatNumber = ref(FormatNumberDropdown[0].value)

const AdvanceModeTitle = 'AdvanceMode'
const AdvanceModeDropdown = [
  { key: 'Disable', value: '0' },
  { key: 'Enabled', value: '1' }
]
const selectedAdvanceMode = ref(AdvanceModeDropdown[0].value)

// State to store input values
const hexadecimal = ref('')
const decimal = ref('')
const octal = ref('')
const binary = ref('')

</script>

<template>
  <Label for="configuration">Configuration</Label>
  <AppComponentGap size="small" />
  <AppConfiguration
    :title="FormatNumberTitle"
    :listOptions="FormatNumberDropdown"
    :icon="Settings"
    v-model="selectedFormatNumber"
    use-switch
    id="configuration"
  />
  <AppComponentGap size="small" />
  <AppConfiguration
    :title="AdvanceModeTitle"
    :listOptions="AdvanceModeDropdown"
    :icon="Settings"
    v-model="selectedAdvanceMode"
    use-switch
  />
  <AppComponentGap />

  <NumberBaseInputs
    v-if="selectedAdvanceMode === '0'"
    :formatNumber="selectedFormatNumber==='1'"
    :hexadecimal="hexadecimal"
    :decimal="decimal"
    :octal="octal"
    :binary="binary"
    @update:hexadecimal="hexadecimal = $event"
    @update:decimal="decimal = $event"
    @update:octal="octal = $event"
    @update:binary="binary = $event"
  />
  <NumberAdvanceInputs v-else :formatNumber="selectedFormatNumber==='1'"/>
</template>
