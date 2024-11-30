<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AppButton } from '@/components/ui/app-button'
import { Textarea } from '@/components/ui/textarea'
import {
  CheckCheck,
  ChevronsDown,
  ChevronsUp,
  ClipboardPaste,
  Copy,
  FileDigit,
  Hash,
  Ruler,
  TriangleAlert,
  X
} from 'lucide-vue-next'
import { AppComponentGap } from '@/components/ui/app-component-gap'
import { AppConfiguration } from '@/components/ui/app-configuration'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { computed, ref, watch } from 'vue'
import { useToast } from '@/components/ui/toast'

const { toast } = useToast()

const alertType = ref<'default' | 'destructive' | null>(null)
const alertTitle = ref('')
const alertMessage = ref('')

const passwordLength = ref('32')
const isIncludeLowerCase= ref ('0')
const lowerCaseSwitchText = computed(() => (isIncludeLowerCase.value === '1' ? 'On' : 'Off'))
const isIncludeUpperCase= ref ('1')
const upperCaseSwitchText = computed(() => (isIncludeUpperCase.value === '1' ? 'On' : 'Off'))
const isIncludeNumberCase= ref ('1')
const numberCaseSwitchText = computed(() => (isIncludeNumberCase.value === '1' ? 'On' : 'Off'))
const isIncludeSpecialCase= ref ('1')
const specialCaseSwitchText = computed(() => (isIncludeSpecialCase.value === '1' ? 'On' : 'Off'))

const excludeCharacterInput= ref ('')
const numberGeneratedPassword= ref ('5')
const passwordOutput= ref ('')

function showAlertWarning(title: string, message: string) {
  alertType.value = 'destructive'
  alertTitle.value = title
  alertMessage.value = message
}

function showToaster(title: string, description: string) {
  toast({
    title: title,
    description: description
  })
}

async function pasteToExcludeCharacterInputFromClipboard() {
  try {
    excludeCharacterInput.value = await navigator.clipboard.readText()
    showToaster('Pasted', 'Pasted from clipboard to exclude character input')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    showAlertWarning('Error', 'Failed to paste from clipboard')
  }
}

async function copyFromPasswordOutputToClipboard() {
  try {
    await navigator.clipboard.writeText(passwordOutput.value)
    showToaster('Copied', 'Copied password output to clipboard')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    showAlertWarning('Error', 'Failed to copy to clipboard')
  }
}

function clearPasswordOuput() {
  passwordOutput.value = ''
  showToaster('Cleared', 'Cleared password output')
}

function generatePassword() {
  if (preventGeneration.value) {
    return
  }
  const length = parseInt(passwordLength.value)
  const includeLowerCase = isIncludeLowerCase.value === '1'
  const includeUpperCase = isIncludeUpperCase.value === '1'
  const includeNumber = isIncludeNumberCase.value === '1'
  const includeSpecial = isIncludeSpecialCase.value === '1'
  const excludeChars = excludeCharacterInput.value.split(',')

  const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numberChars = '0123456789'
  const specialChars = '!@#$%^&*()_+'

  let charSet = ''
  if (includeLowerCase) charSet += lowerCaseChars
  if (includeUpperCase) charSet += upperCaseChars
  if (includeNumber) charSet += numberChars
  if (includeSpecial) charSet += specialChars

  // Remove excluded characters from charSet
  excludeChars.forEach(char => {
    charSet = charSet.replace(new RegExp(`[${char}]`, 'g'), '')
  })

  let generatedPasswords = ''
  for (let i = 0; i < parseInt(numberGeneratedPassword.value); i++) {
    let password = ''
    for (let j = 0; j < length; j++) {
      const randomIndex = Math.floor(Math.random() * charSet.length)
      password += charSet[randomIndex]
    }
    generatedPasswords += password + '\n'
  }

  passwordOutput.value = generatedPasswords.trim()
  showToaster('Generated', 'Password(s) generated successfully')
}

function checkMinValue() {
  if (parseInt(numberGeneratedPassword.value) < 1) {
    numberGeneratedPassword.value = '1'
  }
}
const preventGeneration = ref(false)

watch([isIncludeLowerCase, isIncludeUpperCase, isIncludeNumberCase, isIncludeSpecialCase, excludeCharacterInput], ([newLower, newUpper, newNumber, newSpecial, newExclude]) => {
  const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numberChars = '0123456789'
  const specialChars = '!@#$%^&*()_+'

  let charSet = ''
  if (newLower === '1') charSet += lowerCaseChars
  if (newUpper === '1') charSet += upperCaseChars
  if (newNumber === '1') charSet += numberChars
  if (newSpecial === '1') charSet += specialChars

  const excludeChars = newExclude.split(',')
  excludeChars.forEach(char => {
    charSet = charSet.replace(new RegExp(`[${char}]`, 'g'), '')
  })

  if (newLower === '0' && newUpper === '0' && newNumber === '0' && newSpecial === '0') {
    showAlertWarning('Warning', 'All character types are excluded. Please include at least one character type.')
    preventGeneration.value = true
  } else if (charSet.length === 0) {
    showAlertWarning('Warning', 'Excluded characters cancel out all available characters. Please adjust your exclusions.')
    preventGeneration.value = true
  } else {
    showAlertWarning('', '')
    preventGeneration.value = false
  }
})
</script>


<template>
  <Label for="configuration">Configuration</Label>
  <AppComponentGap size="small" />
  <AppConfiguration
    title="Length of the Password"
    description="Set password length"
    :icon="Ruler"
    type="inputNumber"
    v-model="passwordLength"
    :min-input-number='1'
  />
  <AppComponentGap size="small" />
  <AppConfiguration
    title="Add Lowercase Character"
    description="Lowercase character included in password (abcdefghijklmnopqrstuvwxyz)"
    :icon="ChevronsDown"
    type="switch"
    v-model="isIncludeLowerCase"
    :switch-text="lowerCaseSwitchText"
  />
  <AppComponentGap size="small" />
  <AppConfiguration
    title="Add Uppercase Character"
    description="Uppercase character included in password (ABCDEFGHIJKLMNOPQRSTUVWXYZ)"
    :icon="ChevronsUp"
    type="switch"
    v-model="isIncludeUpperCase"
    :switch-text="upperCaseSwitchText"
  />
  <AppComponentGap size="small" />
  <AppConfiguration
    title="Add Number Character"
    description="Number character included in password (0123456789)"
    :icon="FileDigit"
    type="switch"
    v-model="isIncludeNumberCase"
    :switch-text="numberCaseSwitchText"
  />
  <AppComponentGap size="small" />
  <AppConfiguration
    title="Add Special Character"
    description="Special character included in password (!@#$%^&*()_+)"
    :icon="Hash"
    type="switch"
    v-model="isIncludeSpecialCase"
    :switch-text="specialCaseSwitchText"
  />
  <AppComponentGap />

  <div class="input-header">
    <Label for="excludeCharacterInput" class="align-bottom">Exclude Character (separate with comma)</Label>
    <div class="button-group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AppButton variant="outline" size="icon" @click="pasteToExcludeCharacterInputFromClipboard">
              <ClipboardPaste class="w-4 h-4" />
            </AppButton>
          </TooltipTrigger>
          <TooltipContent>
            <p>Paste from Clipboard</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
  <AppComponentGap size="small" />
  <Input v-model="excludeCharacterInput" id="excludeCharacterInput" class="w-full" />
  <AppComponentGap />

  <div class="input-header">
    <TooltipProvider >
      <Tooltip>
        <TooltipTrigger>
          <AppButton variant="outline" @click="generatePassword" class="p-5">
            <span>Generate Password</span>
          </AppButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Generate Password</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <Label for="numberGeneratedPassword" class="justify-center p-5">x</Label><Input v-model="numberGeneratedPassword" type="number" id="numberGeneratedPassword" min="1" @blur="checkMinValue" />
    <Label for="numberGeneratedPassword" class="justify-center p-5">Time(s)</Label>
  </div>

  <div v-if="alertTitle!=''">

    <AppComponentGap />

    <Alert :variant="alertType"
           :class="{ 'border-green-600': alertType === 'default' }">
      <CheckCheck v-if="alertType === 'default'" class="w-4 h-4 !text-green-600" />
      <TriangleAlert v-if="alertType === 'destructive'" class="w-4 h-4" />
      <AlertTitle :class="{ 'text-green-600': alertType === 'default' }">{{ alertTitle }}</AlertTitle>
      <AlertDescription :class="{ 'text-green-600': alertType === 'default' }">{{ alertMessage }}</AlertDescription>
    </Alert>

    <AppComponentGap />
  </div>

  <div class="input-header">
    <Label for="passwordOutput" class="align-bottom">Passwords</Label>
    <div class="button-group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AppButton variant="outline" size="icon" @click="copyFromPasswordOutputToClipboard">
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
            <AppButton variant="outline" size="icon" @click="clearPasswordOuput">
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
  <Textarea v-model="passwordOutput" id="passwordOutput" class="w-full h-[20svh]" readonly />
</template>
