<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AppButton } from '@/components/ui/app-button'
import { Textarea } from '@/components/ui/textarea'
import {
  ChevronsUp, Copy,Minus, Signature, X
} from 'lucide-vue-next'
import { AppComponentGap } from '@/components/ui/app-component-gap'
import { AppConfiguration } from '@/components/ui/app-configuration'
import { computed, ref } from 'vue'
import { useToast } from '@/components/ui/toast'
import { v1 as uuidv1, v4 as uuidv4 } from 'uuid'
import { nextTick } from 'vue'

const { toast } = useToast()

const uuidList = [
  { value: '1', key: '1' },
  { value: '4', key: '4 (GUID)' },
]
const uuidType = ref(uuidList[1].value)

const isIncludeHypen= ref ('1')
const hypenSwitchText = computed(() => (isIncludeHypen.value === '1' ? 'On' : 'Off'))
const isUpperCase= ref ('0')
const upperCaseSwitchText = computed(() => (isUpperCase.value === '1' ? 'On' : 'Off'))

const numberGeneratedUuid= ref ('5')
const uuidOutput= ref ('')

function showToaster(title: string, description: string) {
  toast({
    title: title,
    description: description
  })
}

async function copyFromUuidOutputToClipboard() {
  await navigator.clipboard.writeText(uuidOutput.value)
  showToaster('Copied', 'Copied output to clipboard')
}

function clearUuidOuput() {
  uuidOutput.value = ''
  showToaster('Cleared', 'Cleared output')
}

function generateUuid() {
  const uuids = uuidOutput.value.split('\n')
  for (let i = 0; i < parseInt(numberGeneratedUuid.value); i++) {
    let uuid = uuidType.value === '1' ? uuidv1() : uuidv4()
    if (isIncludeHypen.value === '0') {
      uuid = uuid.replace(/-/g, '')
    }
    if (isUpperCase.value === '1') {
      uuid = uuid.toUpperCase()
    }
    uuids.push(uuid)
  }
  uuidOutput.value = uuids.join('\n').trim()
  showToaster('Generated', 'UUID(s) generated successfully')

  nextTick(() => {
    const textarea = document.getElementById('uuidOutput') as HTMLTextAreaElement
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight
    }
  })
}

function checkMinValue() {
  if (parseInt(numberGeneratedUuid.value) < 1) {
    numberGeneratedUuid.value = '1'
  }
}

</script>


<template>
  <Label for="configuration">Configuration</Label>
  <AppComponentGap size="small" />
  <AppConfiguration
    title="Hypens"
    description="Hypens included in uuid ( - )"
    :icon="Minus"
    type="switch"
    v-model="isIncludeHypen"
    :switch-text="hypenSwitchText"
  />
  <AppComponentGap size="small" />
  <AppConfiguration
    title="Uppercase"
    description="Set uuid uppercase"
    :icon="ChevronsUp"
    type="switch"
    v-model="isUpperCase"
    :switch-text="upperCaseSwitchText"
  />
  <AppComponentGap size="small" />
  <AppConfiguration
    title="UUID Version"
    description="Select version"
    :listOptions="uuidList"
    :icon="Signature"
    type="dropdown"
    v-model="uuidType"
  />
  <AppComponentGap />

  <div class="input-header">
    <TooltipProvider >
      <Tooltip>
        <TooltipTrigger>
          <AppButton variant="outline" @click="generateUuid" class="p-5">
            <span>Generate UUID(s)</span>
          </AppButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Generate UUID(s)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <Label for="numberGeneratedUuid" class="justify-center p-5">x</Label><Input v-model="numberGeneratedUuid" type="number" id="numberGeneratedUuid"
                                                                                min="1" @blur="checkMinValue" />
    <Label for="numberGeneratedUuid" class="justify-center p-5">Time(s)</Label>
  </div>

  <div class="input-header">
    <Label for="uuidOutput" class="align-bottom">UUID(s)</Label>
    <div class="button-group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AppButton variant="outline" size="icon" @click="copyFromUuidOutputToClipboard">
              <Copy class="w-4 h-4" />
            </AppButton>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy to Clipboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AppButton variant="outline" size="icon" @click="clearUuidOuput">
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
  <Textarea v-model="uuidOutput" id="uuidOutput" class="w-full h-[30svh]" readonly />
</template>
