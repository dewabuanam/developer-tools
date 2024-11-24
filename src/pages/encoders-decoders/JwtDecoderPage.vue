<script setup lang="ts">
import { jwtDecode } from 'jwt-decode'
import { jwtVerify, base64url, jwtDecrypt } from 'jose'
import { useToast } from '@/components/ui/toast/use-toast'
import { AppButton } from '@/components/ui/app-button'
import {
  ArrowLeftRight,
  ClipboardPaste,
  Copy,
  X,
  Maximize2,
  Minimize2,
  File,
  CheckCheck,
  Info,
  CircleCheck, TriangleAlert
} from 'lucide-vue-next'
import { Label } from '@/components/ui/label'
import { AppConfiguration } from '@/components/ui/app-configuration'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { AppComponentGap } from '@/components/ui/app-component-gap'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Textarea } from '@/components/ui/textarea'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { AppJsonEditor } from '@/components/ui/app-json-editor'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const { toast } = useToast()

const isFullScreen = ref(false)
const isMobile = ref(window.innerWidth <= 768)

const encodeValue = ref('0')
const encodeText = ref(encodeValue.value === '0' ? 'Decode' : 'Encode')

const validateTokenValue = ref('0')
const validateTokenText = ref(validateTokenValue.value === '0' ? 'No' : 'Yes')

const validateIssuerSigningKeyValue = ref('0')
const validateIssuerSigningKeyText = ref(validateTokenValue.value === '0' ? 'No' : 'Yes')

const validateIssuerValue = ref('0')
const validateIssuerText = ref(validateTokenValue.value === '0' ? 'No' : 'Yes')

const validateAudienceValue = ref('0')
const validateAudienceText = ref(validateTokenValue.value === '0' ? 'No' : 'Yes')

const validateLifetimeValue = ref('0')
const validateLifetimeText = ref(validateTokenValue.value === '0' ? 'No' : 'Yes')

const validateActorValue = ref('0')
const validateActorText = ref(validateTokenValue.value === '0' ? 'No' : 'Yes')

const validIssuer = ref('')
const validAudience = ref('')
const token = ref('')
const signature = ref('')
const header = ref('')
const payload = ref('')

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

watch(encodeValue, () => {
  if (encodeValue.value === '0') {
    encodeText.value = 'Decode'
  } else {
    encodeText.value = 'Encode'
  }
})

watch(
  [
    validateTokenValue,
    validateIssuerSigningKeyValue,
    validateIssuerValue,
    validateAudienceValue,
    validateLifetimeValue,
    validateActorValue,
    validIssuer,
    validAudience,
    signature
  ],
  () => {
    if (validateIssuerSigningKeyValue.value === '0') {
      validateIssuerSigningKeyText.value = 'No'
    } else {
      validateIssuerSigningKeyText.value = 'Yes'
    }

    if (validateIssuerValue.value === '0') {
      validateIssuerText.value = 'No'
    } else {
      validateIssuerText.value = 'Yes'
    }

    if (validateAudienceValue.value === '0') {
      validateAudienceText.value = 'No'
    } else {
      validateAudienceText.value = 'Yes'
    }

    if (validateLifetimeValue.value === '0') {
      validateLifetimeText.value = 'No'
    } else {
      validateLifetimeText.value = 'Yes'
    }

    if (validateActorValue.value === '0') {
      validateActorText.value = 'No'
    } else {
      validateActorText.value = 'Yes'
    }
    if (validateTokenValue.value === '0') {
      validateTokenText.value = 'No'
    } else {
      validateTokenText.value = 'Yes'
      validateToken()
    }
  }
)

watch(token, () => {
  decodeToken()
  if (validateTokenValue.value === '1') {
    validateToken()
  }
})

function decodeToken() {
  try {
    const decodedHeader = jwtDecode(token.value, { header: true })
    const decodedPayload = jwtDecode(token.value)
    header.value = JSON.stringify(decodedHeader, null, 2)
    payload.value = JSON.stringify(decodedPayload, null, 2)
  } catch (error) {
    console.error('Failed to decode token: ', error)
    showToaster('Error', 'Failed to decode token')
  }
}

function showToaster(title: string, description: string) {
  toast({
    title: title,
    description: description
  })
}

async function pasteToValidIssuerFromClipboard() {
  try {
    validIssuer.value = await navigator.clipboard.readText()
    showToaster('Paste from clipboard', 'Pasted to Valid Issuer from Clipboard')
  } catch (error) {
    console.error('Failed to read clipboard contents: ', error)
  }
}

async function pasteToValidAudienceFromClipboard() {
  try {
    validAudience.value = await navigator.clipboard.readText()
    showToaster('Paste from clipboard', 'Pasted to Valid Audience from Clipboard')
  } catch (error) {
    console.error('Failed to read clipboard contents: ', error)
  }
}

async function pasteToTokenFromClipboard() {
  try {
    token.value = await navigator.clipboard.readText()
    showToaster('Paste from clipboard', 'Pasted to Token from Clipboard')
  } catch (error) {
    console.error('Failed to read clipboard contents: ', error)
  }
}

function loadFileToToken() {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'text/*'
  fileInput.onchange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        token.value = reader.result as string
        showToaster('File Loaded', 'Token text has been updated from file contents.')
      }
      reader.readAsText(file)
    }
  }
  fileInput.click()
}

function copyFromTokenToClipboard() {
  navigator.clipboard.writeText(token.value).then(() => {
    showToaster('Copied to Clipboard', 'Token text has been copied to clipboard.')
  })
}

async function pasteToSignatureFromClipboard() {
  try {
    signature.value = await navigator.clipboard.readText()
    showToaster('Paste from clipboard', 'Pasted to Signature from Clipboard')
  } catch (error) {
    console.error('Failed to read clipboard contents: ', error)
  }
}

function loadFileToSignature() {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'text/*'
  fileInput.onchange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        signature.value = reader.result as string
        showToaster('File Loaded', 'Signature text has been updated from file contents.')
      }
      reader.readAsText(file)
    }
  }
  fileInput.click()
}

function copyFromSignatureToClipboard() {
  navigator.clipboard.writeText(signature.value).then(() => {
    showToaster('Copied to Clipboard', 'Signature text has been copied to clipboard.')
  })
}

function clearTokenInput() {
  token.value = ''
  showToaster('Input Cleared', 'Token text has been cleared.')
}

function clearSignatureInput() {
  signature.value = ''
  showToaster('Input Cleared', 'Signature text has been cleared.')
}

function copyFromHeaderToClipboard() {
  navigator.clipboard.writeText(header.value).then(() => {
    showToaster('Copied to Clipboard', 'Header text has been copied to clipboard.')
  })
}

function setFullScreen() {
  isFullScreen.value = !isFullScreen.value
  showToaster(isFullScreen.value ? 'Entered Full Screen' : 'Exited Full Screen', isFullScreen.value ? 'You have entered full screen mode.' : 'You have exited full screen mode.')
}

function infoHandle() {
  showToaster('Action', 'Showed Additional Info')
  // Implement the actual logic here
}

function copyPayloadToClipboard() {
  navigator.clipboard.writeText(payload.value).then(() => {
    showToaster('Copied to Clipboard', 'Payload text has been copied to clipboard.')
  })
}

const alertType = ref('default')
const alertTitle = ref('')
const alertMessage = ref('')

async function validateToken() {
  if (
    validateIssuerSigningKeyValue.value === '0' &&
    validateIssuerValue.value === '0' &&
    validateAudienceValue.value === '0' &&
    validateLifetimeValue.value === '0' &&
    validateActorValue.value === '0'
  ) {
    showAlertWarning('Token not validated', 'no parameters selected')
    return
  }

  let isValid = true
  let message = ''

  let tokenPayload
  try {
    tokenPayload = JSON.parse(payload.value)
  } catch (error) {
    showAlertWarning('Invalid Payload', 'Failed to parse payload')
    return
  }

  const tokenIssuer = tokenPayload.iss
  const tokenAudience = tokenPayload.aud
  const tokenExpiration = tokenPayload.exp
  const tokenNotBefore = tokenPayload.nbf

  if (validateIssuerSigningKeyValue.value === '1') {
    const tokenSigningKey = signature.value;

    if (!tokenSigningKey || !token.value) {
      console.log("Missing token or signing key");
      isValid = false;
      message += 'Missing token or signing key. ';
    } else {
      try {
        const secret = new TextEncoder().encode(tokenSigningKey)
        const jwt = token.value
        const { payload, protectedHeader } = await jwtVerify(jwt, secret, {
          clockTolerance: Number.MAX_SAFE_INTEGER,
        })

        console.log(protectedHeader)
        console.log(payload)
      } catch (error) {
        console.log(error);
        isValid = false;
        message += 'Issuer signing key validation failed. ';
      }
    }
  }

  if (validateIssuerValue.value === '1') {
    const issuerKey = validIssuer.value;

    if (!issuerKey || !token.value) {
      console.log("Missing token or issuer key");
      isValid = false;
      message += 'Missing token or issuer key. ';
    } else if (validIssuer.value !== tokenIssuer) {
      isValid = false
      message += 'Issuer validation failed. '
    }
  }

  if (validateAudienceValue.value === '1') {
    const validAudienceKey = validAudience.value;

    if (!validAudienceKey || !token.value) {
      console.log("Missing token or audience key");
      isValid = false;
      message += 'Missing token or audience key. ';
    } else if (validAudience.value !== tokenAudience) {
      isValid = false
      message += 'Audience validation failed. '
    }
  }

  if (validateLifetimeValue.value === '1') {
    const currentTime = Math.floor(Date.now() / 1000)
    if (tokenExpiration && tokenExpiration < currentTime) {
      isValid = false
      message += 'Token has expired. '
    }
    if (tokenNotBefore && tokenNotBefore > currentTime) {
      isValid = false
      message += 'Token not active yet. '
    }
  }

  if (isValid) {
    showAlertValid('Token validated', 'All selected parameters are valid')
  } else {
    showAlertWarning('Token validation failed', message.trim())
  }
}

function showAlertValid(title: string, message: string) {
  alertType.value = 'valid'
  alertTitle.value = title
  alertMessage.value = message
}

function showAlertWarning(title: string, message: string) {
  alertType.value = 'destructive'
  alertTitle.value = title
  alertMessage.value = message
}
</script>

<template>
  <div v-if="!isFullScreen">
    <Label for="email">Configuration</Label>
    <AppComponentGap size="small" />
    <AppConfiguration
      title="Conversion"
      description="Select which conversion mode you want to use"
      :icon="ArrowLeftRight"
      type="switch"
      v-model="encodeValue"
      :switch-text="encodeText"
    />
    <AppComponentGap size="small" />
    <AppConfiguration
      title="Validate Token"
      description="Select if you want to turn on validate token"
      :icon="CheckCheck"
      type="switch"
      v-model="validateTokenValue"
      :switch-text="validateTokenText"
    >
      <AppConfiguration
        title="Validate issuer signing key"
        :icon="CircleCheck"
        type="switch"
        v-model="validateIssuerSigningKeyValue"
        :switch-text="validateIssuerSigningKeyText"
        :disabled="validateTokenValue==='0'"
      >

        <div class="input-header">
          <Label for="signature" class="align-bottom">Signature</Label>
          <div class="button-group">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AppButton variant="outline" size="icon" @click="pasteToSignatureFromClipboard"
                             :disabled="validateTokenValue==='0' || validateIssuerSigningKeyValue==='0'">
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
                  <AppButton variant="outline" size="icon" @click="loadFileToSignature"
                             :disabled="validateTokenValue==='0' || validateIssuerSigningKeyValue==='0'">
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
                  <AppButton variant="outline" size="icon" @click="copyFromSignatureToClipboard"
                             :disabled="validateTokenValue==='0' || validateIssuerSigningKeyValue==='0'">
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
                  <AppButton variant="outline" size="icon" @click="clearSignatureInput"
                             :disabled="validateTokenValue==='0' || validateIssuerSigningKeyValue==='0'">
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
        <Textarea v-model="signature" id="token" class="w-full h-[10svh]"
                  :disabled="validateTokenValue==='0' || validateIssuerSigningKeyValue==='0'" />

        <AppComponentGap />
      </AppConfiguration>
      <AppComponentGap size="small" />
      <AppConfiguration
        title="Validate issuer"
        :icon="CircleCheck"
        type="switch"
        v-model="validateIssuerValue"
        :switch-text="validateIssuerText"
        :disabled="validateTokenValue==='0'"
      >
        <div class="input-header">
          <Label for="validIssuer" class="align-bottom">Valid issuer</Label>
          <div class="button-group">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="outline"
                          size="icon"
                          @click="pasteToValidIssuerFromClipboard"
                          :disabled="validateTokenValue==='0' || validateIssuerValue==='0'">
                    <ClipboardPaste class="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Paste from Clipboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <AppComponentGap size="small" />
        <Input v-model="validIssuer" id="validIssuer" type="text" class="w-full"
               :disabled="validateTokenValue==='0' || validateIssuerValue==='0'" />
      </AppConfiguration>
      <AppComponentGap size="small" />
      <AppConfiguration
        title="Validate audience"
        :icon="CircleCheck"
        type="switch"
        v-model="validateAudienceValue"
        :switch-text="validateAudienceText"
        :disabled="validateTokenValue==='0'"
      >
        <div class="input-header">
          <Label for="validAudience" class="align-bottom">Valid audience</Label>
          <div class="button-group">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="outline"
                          size="icon"
                          @click="pasteToValidAudienceFromClipboard"
                          :disabled="validateTokenValue==='0' || validateAudienceValue==='0'">
                    <ClipboardPaste class="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Paste from Clipboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <AppComponentGap size="small" />
        <Input v-model="validAudience" id="validAudience" type="text" class="w-full"
               :disabled="validateTokenValue==='0' || validateAudienceValue==='0'" />
      </AppConfiguration>
      <AppComponentGap size="small" />
      <AppConfiguration
        title="Validate lifetime"
        :icon="CircleCheck"
        type="switch"
        v-model="validateLifetimeValue"
        :switch-text="validateLifetimeText"
        :disabled="validateTokenValue==='0'"
      />
      <AppComponentGap size="small" />
      <AppConfiguration
        title="Validate actor"
        :icon="CircleCheck"
        type="switch"
        v-model="validateActorValue"
        :switch-text="validateActorText"
        :disabled="validateTokenValue==='0'"
      />
    </AppConfiguration>
    <AppComponentGap />


    <div v-if="validateTokenValue === '1'">
      <Alert :variant="alertType"
             :class="{ 'border-green-600': alertType === 'valid' }">
        <CheckCheck v-if="alertType === 'valid'" class="w-4 h-4 !text-green-600" />
        <TriangleAlert v-if="alertType === 'destructive'" class="w-4 h-4" />
        <AlertTitle :class="{ 'text-green-600': alertType === 'valid' }">{{ alertTitle }}</AlertTitle>
        <AlertDescription :class="{ 'text-green-600': alertType === 'valid' }">{{ alertMessage }}</AlertDescription>
      </Alert>

      <AppComponentGap />
    </div>
    <div class="input-header">
      <Label for="token" class="align-bottom">Token</Label>
      <div class="button-group">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AppButton variant="outline" size="icon" @click="pasteToTokenFromClipboard">
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
              <AppButton variant="outline" size="icon" @click="loadFileToToken">
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
              <AppButton variant="outline" size="icon" @click="copyFromTokenToClipboard">
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
              <AppButton variant="outline" size="icon" @click="clearTokenInput">
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
    <Textarea v-model="token" id="token" class="w-full h-[10svh]" />

    <AppComponentGap />
  </div>

  <ResizablePanelGroup :direction="panelGroupDir" :class="panelGroupClass">
    <ResizablePanel v-if="!isFullScreen">
      <div class="input-header">
        <Label for="header">Header</Label>
        <div class="button-group">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AppButton variant="outline" size="icon" @click="copyFromHeaderToClipboard">
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
      <AppJsonEditor v-model="header" id="header" readonly />
    </ResizablePanel>
    <ResizableHandle v-if="!isMobile && !isFullScreen" with-handle class="p-2 bg-transparent" />
    <ResizablePanel>
      <div class="input-header">
        <Label for="output">Payload</Label>
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
                <AppButton variant="outline" size="icon" @click="infoHandle">
                  <Info class="w-4 h-4" />
                </AppButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show Additional Info</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AppButton variant="outline" size="icon" @click="copyPayloadToClipboard">
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
      <AppJsonEditor v-model="payload" :readonly="true" :class="{ '!h-full': isFullScreen }" />
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
