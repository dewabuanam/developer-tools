<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ClipboardPaste, Copy, X, FileKey2, Eye, EyeOff } from 'lucide-vue-next'
import { AppComponentGap } from '@/components/ui/app-component-gap'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AppButton } from '@/components/ui/app-button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast/use-toast'
import forge from 'node-forge'

const { toast } = useToast()

const route = useRoute()

const getExtensionFullName = (extension: string) => {
  const extensionMap: { [key: string]: string } = {
    'pem': 'Privacy Enhanced Mail (PEM)',
    'crt': 'Certificate (CRT)',
    'cer': 'Certificate (CER)',
    'pfx': 'Personal Information Exchange (PFX)'
  }
  return extensionMap[extension] || extension
}

const file = ref<File | null>(null)
const isDragging = ref(false)
const showPassword = ref(false)
const password = ref('')
const input = ref('')
const output = ref('')

const localStorageKey = computed(() => `${String(route.name)}-input`)

const isMobile = ref(window.innerWidth <= 768)

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}
onMounted(() => {
  updateIsMobile();
  window.addEventListener('resize', updateIsMobile);
  const savedInput = localStorage.getItem(localStorageKey.value);
  if (savedInput) {
    input.value = savedInput;
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})

const handleFileInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    file.value = target.files[0]
    readFile(file.value)
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  if (event.dataTransfer && event.dataTransfer.files.length > 0) {
    file.value = event.dataTransfer.files[0]
    readFile(file.value)
  }
}

const clearFile = () => {
  file.value = null
  input.value = ''
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const trimmedFileName = computed(() => {
  if (!file.value) return ''
  const name = file.value.name
  const maxLength = 20
  if (name.length <= maxLength) return name
  const extension = name.split('.').pop()
  const baseName = name.substring(0, name.lastIndexOf('.'))
  return `${baseName.substring(0, 20)}...${extension}`
})

const getFileExtension = (fileName: string): string => {
  const extension = fileName.split('.').pop()
  return extension ? extension : ''
}

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    input.value = text
    showToaster('Pasted from Clipboard', 'Input text has been updated from clipboard contents.')
  } catch (err) {
    console.error('Failed to read clipboard contents: ', err)
  }
}
const pasteToPasswordFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    password.value = text
    showToaster('Pasted from Clipboard', 'Input text has been updated from clipboard contents.')
  } catch (err) {
    console.error('Failed to read clipboard contents: ', err)
  }
}

const copyFromOutputToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(output.value)
    showToaster('Copied to Clipboard', 'Output text has been copied to clipboard.')
  } catch (err) {
    console.error('Failed to write to clipboard: ', err)
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(input.value)
    showToaster('Copied to Clipboard', 'Output text has been copied to clipboard.')
  } catch (err) {
    console.error('Failed to write to clipboard: ', err)
  }
}

const clearInput = () => {
  input.value = ''
  showToaster('Input Cleared', 'Input text has been cleared.')
}

watch(password, () => {
  const fileType = file.value ? getFileExtension(file.value.name) : ''

  output.value = decodeContent(input.value, password.value, fileType)
})

watch(input, (value) => {
  localStorage.setItem(localStorageKey.value, value)

  const fileType = file.value ? getFileExtension(file.value.name) : ''

  output.value = decodeContent(input.value, password.value, fileType)

  if (file.value){
    if (currentFileText !== input.value) {
      file.value = null
    }
  }
})

let currentFileText = ''

const readFile = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const fileType = getFileExtension(file.name)
    if (fileType === 'pfx' || fileType === 'cer') {
      const binaryString = forge.util.binary.raw.encode(new Uint8Array(e.target?.result as ArrayBuffer))
      input.value = forge.util.encode64(binaryString)
    } else {
      input.value = e.target?.result as string
    }
    currentFileText = input.value
    showToaster('File Loaded', 'File content has been loaded.')
  }
  if (file.name.endsWith('.pfx') || file.name.endsWith('.cer')) {
    reader.readAsArrayBuffer(file)
  } else {
    reader.readAsText(file)
  }
}

const panelGroupDir = computed(() => (isMobile.value ? 'vertical' : 'horizontal'))

const panelGroupClass = computed(() => (isMobile.value ? '!h-[175svh]' : '!h-[84svh]'))

function showToaster(title: string, description: string) {
  toast({
    title: title,
    description: description
  })
}
const decodeContent = (content: string, password: string, fileType: string): string => {
  try {
    let cert
    if (fileType === 'pfx') {
      const p12Asn1 = forge.asn1.fromDer(forge.util.decode64(content))
      const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password)
      const bags = p12.getBags({ bagType: forge.pki.oids.certBag });
      const certBag = bags[forge.pki.oids.certBag];
      if (certBag && certBag[0] && certBag[0].cert) {
        cert = certBag[0].cert;
      } else {
        throw new Error('Certificate bag is undefined or empty');
      }
    } else if (fileType === 'cer') {
      cert = forge.pki.certificateFromAsn1(forge.asn1.fromDer(forge.util.decode64(content)))
    } else {
      cert = forge.pki.certificateFromPem(content)
    }

    if (!cert) {
      throw new Error('Certificate is undefined')
    }

    const subject = cert.subject.attributes.map(attr => `${attr.shortName}=${attr.value}`).join(', ')
    const issuer = cert.issuer.attributes.map(attr => `${attr.shortName}=${attr.value}`).join(', ')
    const serialNumber = cert.serialNumber.toUpperCase()
    const notBefore = cert.validity.notBefore.toLocaleString()
    const notAfter = cert.validity.notAfter.toLocaleString()
    const thumbprint = forge.md.sha1.create().update(forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes()).digest().toHex().toUpperCase()
    const subjectKeyIdentifier = cert.extensions.find(ext => ext.name === 'subjectKeyIdentifier')?.subjectKeyIdentifier || ''

    return `[Subject]\n  ${subject}\n\n[Issuer]\n  ${issuer}\n\n[Serial Number]\n  ${serialNumber}\n\n[Not Before]\n  ${notBefore}\n\n[Not After]\n  ${notAfter}\n\n[Thumbprint]\n  ${thumbprint}\n\n[Subject Key Identifier]\n  ${subjectKeyIdentifier}`
  } catch (e) {
    console.error(e)
    return 'Failed to decode certificate'
  }
}
</script>

<template>
  <ResizablePanelGroup :direction="panelGroupDir" :class="panelGroupClass">
    <ResizablePanel class="h-[100svh] w-full">
      <div class="input-header">
        <Label for="password" class="align-bottom">Password</Label>
        <div class="button-group">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AppButton variant="outline" size="icon" @click="pasteToPasswordFromClipboard">
                  <ClipboardPaste class="w-4 h-4" />
                </AppButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Paste from Clipboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <AppButton variant="outline" size="icon" @click="togglePasswordVisibility">
            <component :is="showPassword ? EyeOff : Eye" class="w-4 h-4" />
          </AppButton>
        </div>
      </div>
      <AppComponentGap size="small" />
      <Input v-model="password" id="password" :type="showPassword ? 'text' : 'password'" class="w-full" />

      <AppComponentGap />

      <Card>
        <CardContent
          class="p-6 cursor-pointer"
          :class="{ 'ring-1 ring-blue-500 rounded-md': isDragging }"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop"
          @click="($refs.fileInput as any).click()"
        >
          <input type="file" ref="fileInput" class="hidden" @change="handleFileInput" accept=".crt,.pem,.cer,.pfx" />
          <div v-if="file" class="flex items-center gap-2 justify-between">
            <div class="flex items-center gap-2">
              <FileKey2 class="w-10 h-10" stroke-width="1" />
              <div class="flex flex-col items-start">
                <span>{{ trimmedFileName }}</span>
                <span class="text-xs text-gray-500">{{ getExtensionFullName(getFileExtension(file.name)) }}</span>
              </div>
            </div>
            <AppButton variant="outline" size="icon" @click="clearFile" class="ml-auto">
              <X class="w-4 h-4" />
            </AppButton>
          </div>
          <div v-else class="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center">
            <span class="text-sm font-medium text-gray-500">Drag and drop a file</span>
            <span class="text-xs text-gray-500">CRT, PEM, CER, PFX file here</span>
            <span class="text-xs text-gray-500">or</span>
            <span class="text-sm font-medium text-blue-500">Click here</span>
          </div>
        </CardContent>
      </Card>

      <AppComponentGap />

      <div class="input-header">
        <Label for="input" class="align-bottom">Input</Label>
        <div class="button-group">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AppButton variant="outline" size="icon" @click="pasteFromClipboard">
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
                <AppButton variant="outline" size="icon" @click="copyToClipboard">
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
      <Textarea v-model="input" id="input" class="w-full h-[45.3svh]" />
    </ResizablePanel>
    <ResizableHandle v-if="!isMobile" with-handle class="resizeable-handle p-2 bg-transparent" />
    <ResizablePanel>
      <div class="input-header">
        <Label for="output" class="align-bottom">Output</Label>
        <div class="button-group">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AppButton variant="outline" size="icon" @click="copyFromOutputToClipboard">
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
      <Textarea v-model="output" id="output" class="w-full h-[78.7svh]" readonly />
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
