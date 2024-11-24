<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { timeZones } from '@/constants/TimeZones'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { AppComponentGap } from '@/components/ui/app-component-gap'
import { Input } from '@/components/ui/input'
import { ClipboardPaste, Copy, CalendarCheck } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/toast/use-toast'

// Get the machine's time zone, fallback to UTC if it fails
const machineTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

// Find the matching timezone value
const matchingTimeZone = timeZones.find(zone => zone.utc.includes(machineTimeZone))
const selectedTimeZone = ref(matchingTimeZone ? matchingTimeZone.value : 'utc')

// Set initial values for timestamp and datetime
const currentDateTime = new Date()
const timeInfo = ref({
  offset: currentDateTime.getTimezoneOffset() / -60,
  localDateTime: currentDateTime.toLocaleString(),
  utcTicks: currentDateTime.getTime(),
  utcDateTime: currentDateTime.toISOString()
})
const timestamp = ref(currentDateTime.getTime())
const year = ref(currentDateTime.getFullYear())
const month = ref(currentDateTime.getMonth() + 1)
const day = ref(currentDateTime.getDate())
const hours = ref(currentDateTime.getHours())
const minutes = ref(currentDateTime.getMinutes())
const seconds = ref(currentDateTime.getSeconds())
const ms = ref(currentDateTime.getSeconds())
const { toast } = useToast()

watch(selectedTimeZone, (newTimeZoneValue) => {
  const newMatchingTimeZone = timeZones.find(zone => zone.value === newTimeZoneValue)
  if (newMatchingTimeZone && timeInfo.value) {
    const oldOffset = timeInfo.value.offset
    const newOffset = newMatchingTimeZone.offset
    const offsetDifference = newOffset - oldOffset

// Parse the localDateTime from timeInfo
    const localDateTime = new Date(timeInfo.value.localDateTime)

// Adjust the date by the offset difference
    const adjustedDate = new Date(localDateTime.getTime() + offsetDifference * 60 * 60 * 1000)

    if (!isNaN(adjustedDate.getTime())) {
      year.value = adjustedDate.getFullYear()
      month.value = adjustedDate.getMonth() + 1
      day.value = adjustedDate.getDate()
      hours.value = adjustedDate.getHours()
      minutes.value = adjustedDate.getMinutes()
      seconds.value = adjustedDate.getSeconds()
      ms.value = adjustedDate.getMilliseconds()
      updateTimeInfo(adjustedDate)
    }
  }
})

watch(timestamp, (newTimestamp) => {
  while (newTimestamp.toString().length < 13) {
    newTimestamp = parseInt(newTimestamp.toString() + '0');
  }
  const newDate = new Date(newTimestamp)
  if (!isNaN(newDate.getTime())) {
    year.value = newDate.getFullYear()
    month.value = newDate.getMonth() + 1
    day.value = newDate.getDate()
    hours.value = newDate.getHours()
    minutes.value = newDate.getMinutes()
    seconds.value = newDate.getSeconds()
    ms.value = newDate.getMilliseconds()
    updateTimeInfo(newDate)
  }
})

function updateTimeInfo(date: Date) {
  const newMatchingTimeZone = timeZones.find(zone => zone.value === selectedTimeZone.value)
  if (newMatchingTimeZone) {
    timeInfo.value = {
      offset: newMatchingTimeZone.offset,
      localDateTime: date.toLocaleString(),
      utcTicks: date.getTime(),
      utcDateTime: date.toISOString()
    }
  }
}

function handleBlur() {
  const newDate = new Date(year.value, month.value - 1, day.value, hours.value, minutes.value, seconds.value, ms.value)
  if (!isNaN(newDate.getTime())) {
    timestamp.value = newDate.getTime()
    updateTimeInfo(newDate)
  }
}

async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText()
    timestamp.value = parseInt(text, 10)
    toast({
      title: 'Pasted from Clipboard',
      description: 'Timestamp has been updated from clipboard contents.'
    })
  } catch (error) {
    console.error('Failed to read clipboard contents: ', error)
  }
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(timestamp.value.toString())
    toast({
      title: 'Copied to Clipboard',
      description: 'Timestamp has been copied to clipboard.'
    })
  } catch (error) {
    console.error('Failed to copy to clipboard: ', error)
  }
}

function setCurrentDateTime() {
  const currentDateTime = new Date()
  timestamp.value = currentDateTime.getTime()
  year.value = currentDateTime.getFullYear()
  month.value = currentDateTime.getMonth() + 1
  day.value = currentDateTime.getDate()
  hours.value = currentDateTime.getHours()
  minutes.value = currentDateTime.getMinutes()
  seconds.value = currentDateTime.getSeconds()
  ms.value = currentDateTime.getMilliseconds()
  updateTimeInfo(currentDateTime)
  toast({
    title: 'Set Current Date and Time',
    description: `Current date and time set to ${currentDateTime.toLocaleString()}`
  })
}

// Computed property to format the offset
const formattedTimeZones = computed(() => {
  return timeZones.map(zone => {
    const sign = zone.offset >= 0 ? '+' : '-'
    const hours = Math.floor(Math.abs(zone.offset)).toString().padStart(2, '0')
    const minutes = ((Math.abs(zone.offset) % 1) * 60).toString().padStart(2, '0')
    return {
      ...zone,
      formattedOffset: `${sign}${hours}:${minutes}`
    }
  })
})

</script>

<template>
  <Label for="time-zone" class="component-gap">Time Zone</Label>

  <AppComponentGap size="small" />

  <Select v-model="selectedTimeZone" class="w-full">
    <SelectTrigger class="w-full">
      <SelectValue placeholder="Select a timezone" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="zone in formattedTimeZones" :key="zone.value" :value="zone.value">
        {{ zone.text }}
      </SelectItem>
    </SelectContent>
  </Select>

  <AppComponentGap />

  <Card :class="cn('w-full', $attrs.class ?? '')">
    <CardHeader>
      <CardTitle>There is daylight saving time.</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid gap-2">
        <div class="flex justify-between">
          <p class="text-sm font-medium">Offset</p>
          <p class="text-sm text-muted-foreground">{{ timeInfo.offset }}</p>
        </div>
        <div class="flex justify-between">
          <p class="text-sm font-medium">Local Date and Time</p>
          <p class="text-sm text-muted-foreground">{{ timeInfo.localDateTime }}</p>
        </div>
        <div class="flex justify-between">
          <p class="text-sm font-medium">UTC Ticks</p>
          <p class="text-sm text-muted-foreground">{{ timeInfo.utcTicks }}</p>
        </div>
        <div class="flex justify-between">
          <p class="text-sm font-medium">UTC Date and Time</p>
          <p class="text-sm text-muted-foreground">{{ timeInfo.utcDateTime }}</p>
        </div>
      </div>
    </CardContent>
  </Card>

  <AppComponentGap />

  <div class="input-header">
    <Label for="timestamp" class="align-bottom">Timestamp</Label>
    <div class="button-group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="icon" @click="setCurrentDateTime">
              <CalendarCheck class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Set Current Date and Time</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
  <Input v-model="timestamp" id="timestamp" type="number" :default-value="timestamp" class="w-full" />

  <AppComponentGap />

  <div class="grid grid-cols-6 gap-4">
    <div>
      <Label for="year">Year</Label>
      <Input v-model="year" id="year" type="number" :default-value="year" min="0" class="w-full" @blur="handleBlur"
             @change="handleBlur" />
    </div>

    <div>
      <Label for="month">Month</Label>
      <Input v-model="month" id="month" type="number" :default-value="month" min="1" max="12" class="w-full"
             @blur="handleBlur" @change="handleBlur" />
    </div>

    <div>
      <Label for="day">Day</Label>
      <Input v-model="day" id="day" type="number" :default-value="day" min="1" max="31" class="w-full"
             @blur="handleBlur" @change="handleBlur" />
    </div>

    <div>
      <Label for="hours">Hours</Label>
      <Input v-model="hours" id="hours" type="number" :default-value="hours" min="0" max="23" class="w-full"
             @blur="handleBlur" @change="handleBlur" />
    </div>

    <div>
      <Label for="minutes">Minutes</Label>
      <Input v-model="minutes" id="minutes" type="number" :default-value="minutes" min="0" max="59" class="w-full"
             @blur="handleBlur" @change="handleBlur" />
    </div>

    <div>
      <Label for="seconds">Seconds</Label>
      <Input v-model="seconds" id="seconds" type="number" :default-value="seconds" min="0" max="59" class="w-full"
             @blur="handleBlur" @change="handleBlur" />
    </div>
  </div>
</template>

<style scoped>
.text-muted-foreground {
  color: #6b7280; /* Tailwind gray-500 equivalent */
}
</style>
