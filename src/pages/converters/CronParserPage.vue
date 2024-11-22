<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useToast } from '@/components/ui/toast'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { ArrowUp10, ClipboardPaste, Copy, LetterText, Tally2 } from 'lucide-vue-next'
import { AppConfiguration } from '@/components/ui/app-configuration'
import { AppComponentGap } from '@/components/ui/app-component-gap'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { parseExpression } from 'cron-parser'
import { format } from 'date-fns'
import cronstrue from 'cronstrue'

const { toast } = useToast()
const alertMessage = ref('')
const cron = ref('* * * * *') // Default to 5-segment cron expression
const description = ref('')
const schedule = ref('')
const selectedDate = ref('1') // Treat as string for v-model binding
const selectedFormat = ref('yyyy-MM-dd eee HH:mm:ss')

const CronTitle = 'Cron Mode'
const CronDescription = 'Choose whether to Cron expression should include seconds in its definition'
type CronOption = { key: string, value: string }
const CronDropdown: CronOption[] = [
  { key: 'Disable', value: '0' },
  { key: 'Enabled', value: '1' }
]
const selectedCron = ref(CronDropdown[0].value)
const CronSwitchText = ref('Seconds include (5 - segment Cron)')

// Function to show a toast notification
function showToast(message: string) {
  toast({
    title: 'Notification',
    description: message
  })
}

// Function to set an alert message
function showAlert(message: string) {
  alertMessage.value = message
}

function handleBlur() {
  try {
    const segments = cron.value.split(' ')
    if ((selectedCron.value === '1' && segments.length !== 6) || (selectedCron.value === '0' && segments.length !== 5)) {
      throw new Error('Invalid cron expression')
    }

    const interval = parseExpression(cron.value)
    const dates: string[] = []
    for (let i = 0; i < Number(selectedDate.value); i++) {
      // Convert selectedDate.value to a number if it's a string
      dates.push(format(interval.next().toDate(), selectedFormat.value))
    }
    schedule.value = dates.join('\n')

    // Generate human-readable description
    const cronDescription = cronstrue.toString(cron.value)

    description.value = cronDescription // Store description in your reactive state
    alertMessage.value = ''
  } catch (error) {
    console.error(error) // Log error for debugging
    showAlert('Invalid cron expression')
  }
}


// Function to copy cron expression to clipboard
function copyToClipboard() {
  navigator.clipboard.writeText(cron.value)
  showToast('Cron expression copied to clipboard')
}

// Function to paste cron expression from clipboard
async function pasteFromClipboard() {
  cron.value = await navigator.clipboard.readText()
  handleBlur()
  showToast('Cron expression pasted from clipboard')
}

// Watch for changes in selectedCron and update cron expression and switch text
watch(selectedCron, (newVal) => {
  if (newVal === '1') {
    cron.value = '* * * * * *' // 6-segment cron expression
    CronSwitchText.value = 'Seconds include (6 - segment Cron)'
  } else {
    cron.value = '* * * * *' // 5-segment cron expression
    CronSwitchText.value = 'Seconds include (5 - segment Cron)'
  }
})

// Watch for changes in selectedDate and selectedFormat and trigger handleBlur
watch(selectedFormat, handleBlur)

watch(cron, handleBlur)

const selectedDateString = computed({
  get: () => selectedDate.value,
  set: (value) => {
    selectedDate.value = String(value)
  }
})

// Initialize default values for description and schedule
handleBlur()
</script>

<template>
  <Alert v-if="alertMessage" variant="destructive">
    <AlertTitle>Warning</AlertTitle>
    <AlertDescription>{{ alertMessage }}</AlertDescription>
  </Alert>
  <AppComponentGap v-if="alertMessage" />

  <Label for="configuration">Configuration</Label>
  <AppComponentGap size="small" />
  <AppConfiguration
    :title="CronTitle"
    :description="CronDescription"
    :listOptions="CronDropdown"
    :icon="Tally2"
    type="switch"
    v-model="selectedCron"
    :switch-text="CronSwitchText"
    id="configuration"
  />
  <AppComponentGap size="small" />
  <AppConfiguration
    title="Next schedule date"
    description="Number date generate"
    :icon="ArrowUp10"
    type="inputNumber"
    :max-input-number="100"
    :min-input-number="1"
    v-model="selectedDateString"
    id="configuration"
    @blur="handleBlur"
  />
  <AppComponentGap size="small" />
  <AppConfiguration
    title="Output Format"
    description="Date time format"
    :icon="LetterText"
    type="inputText"
    v-model="selectedFormat"
    id="configuration"
  />
  <AppComponentGap />

  <div class="input-header">
    <Label for="cron" class="align-bottom">Cron Expression</Label>
    <div class="button-group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="icon" @click="pasteFromClipboard">
              <ClipboardPaste class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Paste from Clipboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="icon" @click="copyToClipboard">
              <Copy class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy to Clipboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
  <AppComponentGap size="small" />
  <Input v-model="cron" id="cron" type="text" class="w-full" @blur="handleBlur" />

  <AppComponentGap />

  <div class="input-header">
    <Label for="description" class="align-bottom">Description</Label>
  </div>
  <AppComponentGap size="small" />
  <Input v-model="description" id="description" type="text" class="w-full" readonly />
  <AppComponentGap />

  <div class="input-header">
    <Label for="schedule" class="align-bottom">Schedule Datetime</Label>
  </div>
  <AppComponentGap size="small" />
  <Textarea v-model="schedule" id="schedule" class="w-full h-[25svh]" readonly />
</template>
