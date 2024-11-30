<script setup lang="ts">
import { ALargeSmall, Cable, ClipboardPaste, Copy, File, KeyRound, X } from 'lucide-vue-next'
import { Label } from '@/components/ui/label'
import { AppConfiguration } from '@/components/ui/app-configuration'
import { AppComponentGap } from '@/components/ui/app-component-gap'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Textarea } from '@/components/ui/textarea'
import { AppButton } from '@/components/ui/app-button'
import { Input } from '@/components/ui/input'
import { computed, ref, watch } from 'vue'
import { useToast } from '@/components/ui/toast'
import { md5 } from 'js-md5'
import { sha1 } from 'js-sha1'
import { sha256 } from 'js-sha256'
import { sha512 } from 'js-sha512'

const { toast } = useToast()

const outputList = [
  { value: 'hex', key: 'Hex' },
  { value: 'base64', key: 'Base64' },
]
const outputType = ref(outputList[0].value)
const isUpperCase = ref('0')
const uppercaseSwitchText = computed(() => (isUpperCase.value === '1' ? 'On' : 'Off'))
const isHmacMode = ref('0')
const hmacModeSwitchText = computed(() => (isHmacMode.value === '1' ? 'On' : 'Off'))
const input = ref('')
const secretKeyInput = ref('')
const md5Output = ref('')
const sha1Output = ref('')
const sha256Output = ref('')
const sha512Output = ref('')

function showToaster(title: string, description: string) {
  toast({
    title: title,
    description: description
  })
}

function pasteToInputFromClipboard() {
  showToaster('Paste from Clipboard', 'Pasting content from clipboard to input.');
  navigator.clipboard.readText().then(text => {
    input.value = text;
  }).catch(err => {
    console.error('Failed to read clipboard contents: ', err);
  });
}

function loadFileToInput() {
  showToaster('Load File', 'Loading file content to input.');
  const inputElement = document.createElement('input');
  inputElement.type = 'file';
  inputElement.accept = '*/*';
  inputElement.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        input.value = e.target?.result as string;
      };
      reader.readAsText(file);
    }
  };
  inputElement.click();
}

function copyFromInputToClipboard() {
  showToaster('Copy to Clipboard', 'Copying input content to clipboard.');
  navigator.clipboard.writeText(input.value).catch(err => {
    console.error('Failed to write to clipboard: ', err);
  });
}

function clearInput() {
  showToaster('Clear Input', 'Clearing input content.');
  input.value = '';
}

function pasteToSecretKeyInputFromClipboard() {
  showToaster('Paste from Clipboard', 'Pasting content from clipboard to secret key input.');
  navigator.clipboard.readText().then(text => {
    secretKeyInput.value = text;
  }).catch(err => {
    console.error('Failed to read clipboard contents: ', err);
  });
}

function loadFileToSecretKeyInput() {
  showToaster('Load File', 'Loading file content to secret key input.');
  const inputElement = document.createElement('input');
  inputElement.type = 'file';
  inputElement.accept = '*/*';
  inputElement.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        secretKeyInput.value = e.target?.result as string;
      };
      reader.readAsText(file);
    }
  };
  inputElement.click();
}

function copyFromSecretKeyInputToClipboard() {
  showToaster('Copy to Clipboard', 'Copying secret key input content to clipboard.');
  navigator.clipboard.writeText(secretKeyInput.value).catch(err => {
    console.error('Failed to write to clipboard: ', err);
  });
}

function clearSecretKeyInput() {
  showToaster('Clear Input', 'Clearing secret key input content.');
  secretKeyInput.value = '';
}

function copyFromMd5ToClipboard() {
  showToaster('Copy to Clipboard', 'Copying MD5 output to clipboard.');
  navigator.clipboard.writeText(md5Output.value).catch(err => {
    console.error('Failed to write to clipboard: ', err);
  });
}

function copyFromsha1ToClipboard() {
  showToaster('Copy to Clipboard', 'Copying SHA1 output to clipboard.');
  navigator.clipboard.writeText(sha1Output.value).catch(err => {
    console.error('Failed to write to clipboard: ', err);
  });
}

function copyFromsha256ToClipboard() {
  showToaster('Copy to Clipboard', 'Copying SHA256 output to clipboard.');
  navigator.clipboard.writeText(sha256Output.value).catch(err => {
    console.error('Failed to write to clipboard: ', err);
  });
}

function copyFromsha512ToClipboard() {
  showToaster('Copy to Clipboard', 'Copying SHA512 output to clipboard.');
  navigator.clipboard.writeText(sha512Output.value).catch(err => {
    console.error('Failed to write to clipboard: ', err);
  });
}

function generateHashes() {
  const inputText = input.value
  const secretKey = secretKeyInput.value
  const isUpper = isUpperCase.value === '1'
  const outputFormat = outputType.value
  const useHmac = isHmacMode.value === '1'

  if (inputText === '' || (useHmac && secretKey === '')) {
    md5Output.value = ''
    sha1Output.value = ''
    sha256Output.value = ''
    sha512Output.value = ''
    return
  }

  let md5Value = useHmac ? md5.hmac(inputText, secretKey) : md5(inputText);
  let sha1Value = useHmac ? sha1.hmac(inputText, secretKey) : sha1(inputText)
  let sha256Value = useHmac ? sha256.hmac(inputText, secretKey) : sha256(inputText)
  let sha512Value = useHmac ? sha512.hmac(inputText, secretKey) : sha512(inputText)

  if (outputFormat === 'base64') {
    md5Value = arrayBufferToBase64(hexByteStringToByteArray(md5Value))
    sha1Value = arrayBufferToBase64(hexByteStringToByteArray(sha1Value))
    sha256Value = arrayBufferToBase64(hexByteStringToByteArray(sha256Value))
    sha512Value = arrayBufferToBase64(hexByteStringToByteArray(sha512Value))
  }
  if (isUpper) {
    md5Value = md5Value.toUpperCase()
    sha1Value = sha1Value.toUpperCase()
    sha256Value = sha256Value.toUpperCase()
    sha512Value = sha512Value.toUpperCase()
  }
  md5Output.value = md5Value
  sha1Output.value = sha1Value
  sha256Output.value = sha256Value
  sha512Output.value = sha512Value
}
function hexByteStringToByteArray(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error('Hex string must have an even number of characters');
  }
  const byteArray = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    byteArray[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return byteArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < byteArray.byteLength; i++) {
    binary += String.fromCharCode(byteArray[i]);
  }
  return btoa(binary);
}
watch([input, secretKeyInput, isUpperCase, outputType, isHmacMode], generateHashes)
</script>

<template>
  <Label for="email">Configuration</Label>
  <AppComponentGap size="small" />
  <AppConfiguration
    title="Uppercase"
    description="Set case to uppercase"
    :icon="ALargeSmall"
    type="switch"
    v-model="isUpperCase"
    :switch-text="uppercaseSwitchText"
  />
  <AppComponentGap size="small" />
  <AppConfiguration
    title="Output Type"
    description="Select output type"
    :listOptions="outputList"
    :icon="Cable"
    type="dropdown"
    v-model="outputType"
  />
  <AppComponentGap size="small" />
  <AppConfiguration
    title="HMAC Mode"
    description="Set mode to HMAC"
    :icon="KeyRound"
    type="switch"
    v-model="isHmacMode"
    :switch-text="hmacModeSwitchText"
  />
  <AppComponentGap />

  <div class="input-header">
    <Label for="input" class="align-bottom">Input</Label>
    <div class="button-group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AppButton variant="outline" size="icon" @click="pasteToInputFromClipboard">
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
            <AppButton variant="outline" size="icon" @click="loadFileToInput">
              <File class="w-4 h-4" />
            </AppButton>
          </TooltipTrigger>
          <TooltipContent>
            <p>Load file</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AppButton variant="outline" size="icon" @click="copyFromInputToClipboard">
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
  <Textarea v-model="input" id="input" class="w-full h-[10svh]" />
  <AppComponentGap />

  <div v-if="isHmacMode === '1'">
    <div class="input-header">
      <Label for="input" class="align-bottom">Input</Label>
      <div class="button-group">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AppButton variant="outline" size="icon" @click="pasteToSecretKeyInputFromClipboard">
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
              <AppButton variant="outline" size="icon" @click="loadFileToSecretKeyInput">
                <File class="w-4 h-4" />
              </AppButton>
            </TooltipTrigger>
            <TooltipContent>
              <p>Load file</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AppButton variant="outline" size="icon" @click="copyFromSecretKeyInputToClipboard">
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
              <AppButton variant="outline" size="icon" @click="clearSecretKeyInput">
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
    <Textarea v-model="secretKeyInput" id="input" class="w-full h-[10svh]" />
    <AppComponentGap />
  </div>

  <div class="input-header">
    <Label for="md5" class="align-bottom">MD5</Label>
    <div class="button-group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AppButton variant="outline" size="icon" @click="copyFromMd5ToClipboard">
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
  <Input v-model="md5Output" id="md5" class="w-ful" readonly />
  <AppComponentGap />

  <div class="input-header">
    <Label for="sha1" class="align-bottom">SHA1</Label>
    <div class="button-group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AppButton variant="outline" size="icon" @click="copyFromsha1ToClipboard">
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
  <Input v-model="sha1Output" id="sha1" class="w-full" readonly />
  <AppComponentGap />

  <div class="input-header">
    <Label for="sha256" class="align-bottom">SHA256</Label>
    <div class="button-group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AppButton variant="outline" size="icon" @click="copyFromsha256ToClipboard">
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
  <Input v-model="sha256Output" id="sha256" class="w-full" readonly />
  <AppComponentGap />

  <div class="input-header">
    <Label for="sha512" class="align-bottom">SHA512</Label>
    <div class="button-group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AppButton variant="outline" size="icon" @click="copyFromsha512ToClipboard">
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
  <Input v-model="sha512Output" id="sha512" class="w-full" readonly />
  <AppComponentGap />
</template>
