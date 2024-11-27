<script setup lang="ts">
import { jwtDecode } from 'jwt-decode'
import { importJWK, importPKCS8, importSPKI, importX509, jwtVerify, SignJWT } from 'jose'
import { useToast } from '@/components/ui/toast/use-toast'
import { AppButton } from '@/components/ui/app-button'
import {
  ArrowLeftRight,
  CalendarCog,
  CheckCheck,
  CircleCheck,
  ClipboardPaste,
  Copy,
  File,
  Fingerprint,
  Maximize2,
  Minimize2,
  Parentheses,
  Settings,
  TriangleAlert,
  X
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const { toast } = useToast()

const isFullScreen = ref(false)
const isMobile = ref(window.innerWidth <= 768)

const encodeValue = ref('0')
const encodeText = ref(encodeValue.value === '0' ? 'Decode' : 'Encode')

const tokenHashingAlgorithmList = [
  { key: 'HS256', value: 'HS256' },
  { key: 'HS384', value: 'HS384' },
  { key: 'HS512', value: 'HS512' },
  { key: 'RS256', value: 'RS256' },
  { key: 'RS384', value: 'RS384' },
  { key: 'RS512', value: 'RS512' },
  { key: 'ES256', value: 'ES256' },
  { key: 'ES384', value: 'ES384' },
  { key: 'ES512', value: 'ES512' },
  { key: 'PS256', value: 'PS256' },
  { key: 'PS384', value: 'PS384' },
  { key: 'PS512', value: 'PS512' }
]
const tokenHashingAlgorithmValue = ref(ref(tokenHashingAlgorithmList[0].value))

const validateTokenTitle = ref('Validate Token')
const validateTokenDesc = ref('Select validate token parameter(s)')
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
const encodeSignature = ref('')
const header = ref(JSON.stringify({
  alg: 'HS256',
  typ: 'JWT'
}, null, 2))
const payload = ref('')

const tokenHasIssuerValue = ref('0')
const tokenHasIssuerText = ref(tokenHasIssuerValue.value === '0' ? 'No' : 'Yes')
const validEncodeIssuer = ref('')

const tokenHasAudienceValue = ref('0')
const tokenHasAudienceText = ref(tokenHasAudienceValue.value === '0' ? 'No' : 'Yes')
const validEncodeAudience = ref('')

const tokenHasExpirationsValue = ref('0')
const tokenHasExpirationsText = ref(tokenHasExpirationsValue.value === '0' ? 'No' : 'Yes')
const tokenHasExpirationsYear = ref('')
const tokenHasExpirationsMonth = ref('')
const tokenHasExpirationsDay = ref('')
const tokenHasExpirationsHour = ref('')
const tokenHasExpirationsMinute = ref('')

const tokenHasDefaultTimeValue = ref('0')
const tokenHasDefaultTimeText = ref(tokenHasAudienceValue.value === '0' ? 'No' : 'Yes')

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

    header.value = JSON.stringify({
      alg: 'HS256',
      typ: 'JWT'
    }, null, 2)

    validateTokenTitle.value = 'Validate Token'
    validateTokenDesc.value = 'Select validate token parameter(s)'
  } else {
    encodeText.value = 'Encode'

    header.value = JSON.stringify({
      alg: tokenHashingAlgorithmValue.value,
      typ: 'JWT'
    }, null, 2)

    validateTokenTitle.value = 'Setting'
    validateTokenDesc.value = 'Select token parameter(s)'
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
    if (encodeValue.value === '1') {
      return
    }
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

watch(
  [
    tokenHasIssuerValue,
    tokenHasAudienceValue,
    tokenHasExpirationsValue,
    tokenHasDefaultTimeValue,
    encodeSignature,
    tokenHashingAlgorithmValue,
    payload,
    encodeValue
  ],
  () => {
    if (encodeValue.value === '0') {
      return
    }
    if (tokenHasIssuerValue.value === '0') {
      tokenHasIssuerText.value = 'No'
    } else {
      tokenHasIssuerText.value = 'Yes'
    }
    if (tokenHasAudienceValue.value === '0') {
      tokenHasAudienceText.value = 'No'
    } else {
      tokenHasAudienceText.value = 'Yes'
    }
    if (tokenHasExpirationsValue.value === '0') {
      tokenHasExpirationsText.value = 'No'
    } else {
      tokenHasExpirationsText.value = 'Yes'
    }
    if (tokenHasDefaultTimeValue.value === '0') {
      tokenHasDefaultTimeText.value = 'No'
    } else {
      tokenHasDefaultTimeText.value = 'Yes'
    }
    encodeToken()
  }
)

watch(token, () => {
  if (encodeValue.value === '1') {
    return
  }
  decodeToken()
  if (validateTokenValue.value === '1') {
    validateToken()
  }
})

interface Payload {
  [key: string]: string | number | undefined;

  iss?: string;
  aud?: string;
  exp?: number;
  iat?: number;
}

async function encodeToken() {
  header.value = JSON.stringify({
    alg: tokenHashingAlgorithmValue.value,
    typ: 'JWT'
  }, null, 2)
  let message = ''
  if (payload.value === '') {
    message += 'Payload should be filled. '
  }
  if (encodeSignature.value === '') {
    message += 'Signature should be filled. '
  }
  if (message != '') {
    showAlertWarning('Missing parameter(s)', message)
    return
  }
  hideAlert()
  try {
    const payloadObj: Payload = JSON.parse(payload.value)
    if (tokenHasIssuerValue.value === '1') {
      payloadObj.iss = validEncodeIssuer.value
    }
    if (tokenHasAudienceValue.value === '1') {
      payloadObj.aud = validEncodeAudience.value
    }
    if (tokenHasExpirationsValue.value === '1') {
      const expirationDate = new Date()
      expirationDate.setFullYear(expirationDate.getFullYear() + parseInt(tokenHasExpirationsYear.value || '0'))
      expirationDate.setMonth(expirationDate.getMonth() + parseInt(tokenHasExpirationsMonth.value || '0'))
      expirationDate.setDate(expirationDate.getDate() + parseInt(tokenHasExpirationsDay.value || '0'))
      expirationDate.setHours(expirationDate.getHours() + parseInt(tokenHasExpirationsHour.value || '0'))
      expirationDate.setMinutes(expirationDate.getMinutes() + parseInt(tokenHasExpirationsMinute.value || '0'))
      payloadObj.exp = Math.floor(expirationDate.getTime() / 1000)
    }
    if (tokenHasDefaultTimeValue.value === '1') {
      payloadObj.iat = Math.floor(Date.now() / 1000)
    }

    const tokenHashingAlgorithm = tokenHashingAlgorithmValue.value.toUpperCase()
    const secretKey = await getSecret(encodeSignature.value, tokenHashingAlgorithm)
    const headerObj = JSON.parse(header.value)

    token.value = await new SignJWT(payloadObj)
      .setProtectedHeader(headerObj)
      .sign(secretKey)

    showToaster('Success', 'Token encoded successfully')
  } catch (error) {
    token.value = ''
    const err = error as Error
    showAlertWarning('Error', 'Failed to encode token :'+err.message, )
  }
}

async function getSecret(secret: string, alg: string) {
  try {
    // Check if input is a JWK
    const jwk = JSON.parse(secret)
    if (jwk && jwk.kty) {
      return await importJWK(jwk, alg)
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
  }

  try {
    // Try importing as SPKI (for public keys)
    return await importSPKI(secret, alg)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
  }

  try {
    // Try importing as PKCS8 (private key format)
    return await importPKCS8(secret, alg)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
  }

  try {
    // Try importing as X.509 (certificate format)
    return await importX509(secret, alg)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
  }

  return new TextEncoder().encode(secret)
}


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

async function pasteToEncodeValidIssuerFromClipboard() {
  try {
    validEncodeIssuer.value = await navigator.clipboard.readText()
    showToaster('Paste from clipboard', 'Pasted to Valid Issuer from Clipboard')
  } catch (error) {
    console.error('Failed to read clipboard contents: ', error)
  }
}

async function pasteToEncodeValidAudienceFromClipboard() {
  try {
    validEncodeAudience.value = await navigator.clipboard.readText()
    showToaster('Paste from clipboard', 'Pasted to Valid Audience from Clipboard')
  } catch (error) {
    console.error('Failed to read clipboard contents: ', error)
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

async function pasteToPayloadFromClipboard() {
  try {
    payload.value = await navigator.clipboard.readText()
    showToaster('Paste from clipboard', 'Pasted to Payload from Clipboard')
  } catch (error) {
    console.error('Failed to read clipboard contents: ', error)
  }
}

function loadFileToPayload() {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'text/*'
  fileInput.onchange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        payload.value = reader.result as string
        showToaster('File Loaded', 'Payload text has been updated from file contents.')
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

function clearSignatureInput() {
  signature.value = ''
  showToaster('Input Cleared', 'Signature text has been cleared.')
}

async function pasteToEncodeSignatureFromClipboard() {
  try {
    encodeSignature.value = await navigator.clipboard.readText()
    showToaster('Paste from clipboard', 'Pasted to Signature from Clipboard')
  } catch (error) {
    console.error('Failed to read clipboard contents: ', error)
  }
}

function loadFileToEncodeSignature() {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'text/*'
  fileInput.onchange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        encodeSignature.value = reader.result as string
        showToaster('File Loaded', 'Signature text has been updated from file contents.')
      }
      reader.readAsText(file)
    }
  }
  fileInput.click()
}

function copyFromEncodeSignatureToClipboard() {
  navigator.clipboard.writeText(encodeSignature.value).then(() => {
    showToaster('Copied to Clipboard', 'Signature text has been copied to clipboard.')
  })
}

function clearEncodeSignatureInput() {
  encodeSignature.value = ''
  showToaster('Input Cleared', 'Signature text has been cleared.')
}

function clearTokenInput() {
  token.value = ''
  showToaster('Input Cleared', 'Token text has been cleared.')
}

function clearValidEncodeIssuerInput() {
  validEncodeIssuer.value = ''
  showToaster('Input Cleared', 'Valid Issuer text has been cleared.')
}

function clearValidEncodeAudienceInput() {
  validEncodeAudience.value = ''
  showToaster('Input Cleared', 'Valid Audience text has been cleared.')
}

function clearPayloadInput() {
  payload.value = ''
  showToaster('Input Cleared', 'Payload text has been cleared.')
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

function copyPayloadToClipboard() {
  navigator.clipboard.writeText(payload.value).then(() => {
    showToaster('Copied to Clipboard', 'Payload text has been copied to clipboard.')
  })
}

const alertType = ref<'default' | 'destructive' | null>(null)
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
    const err = error as Error
    console.error(err.message)
    showAlertWarning('Invalid Payload', 'Failed to parse payload')
    return
  }

  const tokenIssuer = tokenPayload.iss
  const tokenAudience = tokenPayload.aud
  const tokenExpiration = tokenPayload.exp
  const tokenNotBefore = tokenPayload.nbf

  if (validateIssuerSigningKeyValue.value === '1') {
    const tokenSigningKey = signature.value

    if (!tokenSigningKey || !token.value) {
      isValid = false
      message += 'Missing token or signing key. '
    } else {
      try {
        const secret = await getSecret(tokenSigningKey, JSON.parse(header.value).alg)
        const jwt = token.value
        const { payload, protectedHeader } = await jwtVerify(jwt, secret, {
          clockTolerance: Number.MAX_SAFE_INTEGER
        })

        console.log(protectedHeader)
        console.log(payload)
      } catch (error) {
        console.log(error)
        isValid = false
        message += 'Issuer signing key validation failed. '
      }
    }
  }

  if (validateIssuerValue.value === '1') {
    const issuerKey = validIssuer.value

    if (!issuerKey || !token.value) {
      console.log('Missing token or issuer key')
      isValid = false
      message += 'Missing token or issuer key. '
    } else if (validIssuer.value !== tokenIssuer) {
      isValid = false
      message += 'Issuer validation failed. '
    }
  }

  if (validateAudienceValue.value === '1') {
    const validAudienceKey = validAudience.value

    if (!validAudienceKey || !token.value) {
      console.log('Missing token or audience key')
      isValid = false
      message += 'Missing token or audience key. '
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
  alertType.value = 'default'
  alertTitle.value = title
  alertMessage.value = message
}

function showAlertWarning(title: string, message: string) {
  alertType.value = 'destructive'
  alertTitle.value = title
  alertMessage.value = message
}

function hideAlert() {
  alertType.value = 'destructive'
  alertTitle.value = ''
  alertMessage.value = ''
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
      :title="validateTokenTitle"
      :description="validateTokenDesc"
      :icon="encodeValue ==='1' ? Settings : CheckCheck"
      :type=" encodeValue ==='1' ? 'none' : 'switch'"
      v-model="validateTokenValue"
      :switch-text="validateTokenText"
    >
      <div v-if="encodeValue ==='0'">
        <AppConfiguration
          title="Validate issuer signing key"
          :icon="CircleCheck"
          type="switch"
          v-model="validateIssuerSigningKeyValue"
          :switch-text="validateIssuerSigningKeyText"
          :disabled="validateTokenValue==='0'"
        >

          <div class="input-header">
            <Label for="signature" class="align-bottom">Signature or Public Key</Label>
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
                    :disabled="validateTokenValue==='0' || validateIssuerSigningKeyValue==='0'"
                    placeholder="Public Key in SPKI, PKCS #1, X.509 Certificate, or JWK string format." />

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
                    <AppButton variant="outline"
                               size="icon"
                               @click="pasteToValidIssuerFromClipboard"
                               :disabled="validateTokenValue==='0' || validateIssuerValue==='0'">
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
                    <AppButton variant="outline"
                               size="icon"
                               @click="pasteToValidAudienceFromClipboard"
                               :disabled="validateTokenValue==='0' || validateAudienceValue==='0'">
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
      </div>
      <div v-else>
        <AppConfiguration
          title="Token hashing algorithm"
          :icon="Fingerprint"
          :list-options="tokenHashingAlgorithmList"
          type="dropdown"
          v-model="tokenHashingAlgorithmValue"
        />
        <AppComponentGap size="small" />

        <AppConfiguration
          title="Token has issuer"
          :icon="Parentheses"
          type="switch"
          v-model="tokenHasIssuerValue"
          :switch-text="tokenHasIssuerText"
        >
          <div class="input-header">
            <Label for="validIssuer" class="align-bottom">Valid issuer</Label>
            <div class="button-group">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AppButton variant="outline"
                               size="icon"
                               @click="pasteToEncodeValidIssuerFromClipboard"
                               :disabled="tokenHasIssuerValue==='0'">
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
                    <AppButton variant="outline" size="icon" @click="clearValidEncodeIssuerInput"
                               :disabled="tokenHasIssuerValue==='0'">
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
          <Input v-model="validEncodeIssuer" id="validIssuer" type="text" class="w-full"
                 :disabled="tokenHasIssuerValue==='0'" />
        </AppConfiguration>
        <AppComponentGap size="small" />

        <AppConfiguration
          title="Token has audiences"
          :icon="Parentheses"
          type="switch"
          v-model="tokenHasAudienceValue"
          :switch-text="tokenHasAudienceText"
        >
          <div class="input-header">
            <Label for="validAudience" class="align-bottom">Valid audiences</Label>
            <div class="button-group">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AppButton variant="outline"
                               size="icon"
                               @click="pasteToEncodeValidAudienceFromClipboard"
                               :disabled="tokenHasAudienceValue==='0'">
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
                    <AppButton variant="outline" size="icon" @click="clearValidEncodeAudienceInput"
                               :disabled="tokenHasAudienceValue==='0'">
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
          <Input v-model="validEncodeAudience" id="validAudience" type="text" class="w-full"
                 :disabled="tokenHasAudienceValue==='0'" />
        </AppConfiguration>
        <AppComponentGap size="small" />

        <AppConfiguration
          title="Token has expirations"
          :icon="Parentheses"
          type="switch"
          v-model="tokenHasExpirationsValue"
          :switch-text="tokenHasExpirationsText"
        >
          <div class="grid grid-cols-5 gap-4">
            <div>
              <Label for="year">Expire in year(s)</Label>
              <Input v-model="tokenHasExpirationsYear" id="year" type="number" min="0" class="w-full"
                     :disabled="tokenHasExpirationsValue==='0'" />
            </div>

            <div>
              <Label for="month">Expire in month(s)</Label>
              <Input v-model="tokenHasExpirationsMonth" id="month" type="number" min="1" max="12" class="w-full"
                     :disabled="tokenHasExpirationsValue==='0'" />
            </div>

            <div>
              <Label for="day">Expire in day(s)</Label>
              <Input v-model="tokenHasExpirationsDay" id="day" type="number" min="1" max="31" class="w-full"
                     :disabled="tokenHasExpirationsValue==='0'" />
            </div>

            <div>
              <Label for="hours">Expire in hour(s)</Label>
              <Input v-model="tokenHasExpirationsHour" id="hours" type="number" min="0" max="23" class="w-full"
                     :disabled="tokenHasExpirationsValue==='0'" />
            </div>

            <div>
              <Label for="minutes">Expire in minute(s)</Label>
              <Input v-model="tokenHasExpirationsMinute" id="minutes" type="number" min="0" max="59" class="w-full"
                     :disabled="tokenHasExpirationsValue==='0'" />
            </div>
          </div>
        </AppConfiguration>
        <AppComponentGap size="small" />

        <AppConfiguration
          title="Token has default time"
          :icon="CalendarCog"
          type="switch"
          v-model="tokenHasDefaultTimeValue"
          :switch-text="tokenHasDefaultTimeText"
        />
      </div>
    </AppConfiguration>
    <AppComponentGap />


    <div v-if="validateTokenValue === '1' || (encodeValue === '1' && alertTitle!='')">
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
      <Label for="token" class="align-bottom">Token</Label>
      <div class="button-group">
        <TooltipProvider v-if="encodeValue === '0'">
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
        <TooltipProvider v-if="encodeValue === '0'">
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
        <TooltipProvider v-if="encodeValue === '0'">
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
    <Textarea v-model="token" id="token" class="w-full h-[10svh]" :readonly="encodeValue === '1'" />

    <AppComponentGap />
    <div v-if="encodeValue==='1'">
      <div class="input-header">
        <Label for="encodeSignature" class="align-bottom">Signature or Private Key</Label>
        <div class="button-group">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AppButton variant="outline" size="icon" @click="pasteToEncodeSignatureFromClipboard">
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
                <AppButton variant="outline" size="icon" @click="loadFileToEncodeSignature">
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
                <AppButton variant="outline" size="icon" @click="copyFromEncodeSignatureToClipboard">
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
                <AppButton variant="outline" size="icon" @click="clearEncodeSignatureInput">
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
      <Textarea v-model="encodeSignature" id="encodeSignature" class="w-full h-[10svh]"
                placeholder="Private Key in PKCS #8, PKCS #1, or JWK string format. The key never leaves your browser." />

      <AppComponentGap />
    </div>
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

          <TooltipProvider v-if="encodeValue === '1'">
            <Tooltip>
              <TooltipTrigger>
                <AppButton variant="outline" size="icon" @click="pasteToPayloadFromClipboard">
                  <ClipboardPaste class="w-4 h-4" />
                </AppButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Paste from Clipboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider v-if="encodeValue === '1'">
            <Tooltip>
              <TooltipTrigger>
                <AppButton variant="outline" size="icon" @click="loadFileToPayload">
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
                <AppButton variant="outline" size="icon" @click="copyPayloadToClipboard">
                  <Copy class="w-4 h-4" />
                </AppButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy to Clipboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider v-if="encodeValue === '1'">
            <Tooltip>
              <TooltipTrigger>
                <AppButton variant="outline" size="icon" @click="clearPayloadInput">
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
      <AppJsonEditor v-model="payload" :readonly="encodeValue === '0'" :class="{ '!h-full': isFullScreen }" />
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
