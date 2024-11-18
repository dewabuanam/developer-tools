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

// Get the machine's time zone, fallback to UTC if it fails
let machineTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

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

// Watch for changes in timestamp and update datetime
watch(timestamp, (newTimestamp) => {
  const newDate = new Date(newTimestamp)
  year.value = newDate.getFullYear()
  month.value = newDate.getMonth() + 1
  day.value = newDate.getDate()
  hours.value = newDate.getHours()
  minutes.value = newDate.getMinutes()
  seconds.value = newDate.getSeconds()
  updateTimeInfo(newDate)
})

// Watch for changes in datetime or timezone and update timestamp
watch([selectedTimeZone, year, month, day, hours, minutes, seconds], () => {
  const newDate = new Date(year.value, month.value - 1, day.value, hours.value, minutes.value, seconds.value)
  timestamp.value = newDate.getTime()
  updateTimeInfo(newDate)
})

function updateTimeInfo(date: Date) {
  timeInfo.value = {
    offset: date.getTimezoneOffset() / -60,
    localDateTime: date.toLocaleString(),
    utcTicks: date.getTime(),
    utcDateTime: date.toISOString()
  }
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
          <p class="text-sm font-medium">Utc Ticks</p>
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

  <Label for="timestamp">Timestamp</Label>
  <Input v-model="timestamp" id="timestamp" type="number" :default-value="timestamp" min="0" class="w-full" />

  <AppComponentGap />

  <div class="grid grid-cols-6 gap-4">
    <div>
      <Label for="year">Year</Label>
      <Input v-model="year" id="year" type="number" :default-value="year" min="0" class="w-full" />
    </div>

    <div>
      <Label for="month">Month</Label>
      <Input v-model="month" id="month" type="number" :default-value="month" min="1" max="12" class="w-full" />
    </div>

    <div>
      <Label for="day">Day</Label>
      <Input v-model="day" id="day" type="number" :default-value="day" min="1" max="31" class="w-full" />
    </div>

    <div>
      <Label for="hours">Hours(24 Hour)</Label>
      <Input v-model="hours" id="hours" type="number" :default-value="hours" min="0" max="23" class="w-full" />
    </div>

    <div>
      <Label for="minutes">Minutes</Label>
      <Input v-model="minutes" id="minutes" type="number" :default-value="minutes" min="0" max="59" class="w-full" />
    </div>

    <div>
      <Label for="seconds">Seconds</Label>
      <Input v-model="seconds" id="seconds" type="number" :default-value="seconds" min="0" max="59" class="w-full" />
    </div>
  </div>
</template>

<style scoped>
.text-muted-foreground {
  color: #6b7280; /* Tailwind gray-500 equivalent */
}
</style>
