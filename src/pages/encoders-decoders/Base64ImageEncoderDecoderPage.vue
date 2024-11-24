<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { ClipboardPaste, Copy, X, FileKey2, SquareArrowOutUpRight, Save, File } from 'lucide-vue-next'
import { AppComponentGap } from '@/components/ui/app-component-gap'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AppButton } from '@/components/ui/app-button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast/use-toast'
import placeholder from '@/assets/placeholder.svg'

const { toast } = useToast()

const getExtensionFullName = (extension: string) => {
  const extensionMap: { [key: string]: string } = {
    'png': 'PNG Image',
    'jpg': 'JPEG Image',
    'jpeg': 'JPEG Image',
    'bmp': 'Bitmap Image',
    'gif': 'GIF Image',
    'ico': 'Icon Image',
    'webp': 'WEBP Image',
    'svg': 'SVG Image'
  }
  return extensionMap[extension] || extension
}

const file = ref<File | null>(null)
const isDragging = ref(false)
const input = ref('')
const output = ref('')

const isMobile = ref(window.innerWidth <= 768)

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
watch(input, () => {
  output.value = decodeContent(input.value)

  if (file.value) {
    if (currentFileText !== input.value) {
      file.value = null
    }
  }
})

let currentFileText = ''

const readFile = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    input.value = result
    currentFileText = result
    showToaster('File Loaded', 'File content has been loaded.')
  }
  reader.readAsDataURL(file)
}

const panelGroupDir = computed(() => (isMobile.value ? 'vertical' : 'horizontal'))

const panelGroupClass = computed(() => (isMobile.value ? '!h-[175svh]' : '!h-[84svh]'))

function showToaster(title: string, description: string) {
  toast({
    title: title,
    description: description
  })
}

const decodeContent = (content: string): string => {
  return `${content}`
}

const handlePasteImage = async () => {
  try {
    const clipboardItems = await navigator.clipboard.read()
    for (const item of clipboardItems) {const supportedImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/bmp', 'image/gif', 'image/ico', 'image/webp', 'image/svg+xml']
      if (supportedImageTypes.some(type => item.types.includes(type))) {
        const blob = await item.getType(item.types.find(type => type.startsWith('image/'))!)
        const dataFile = new window.File([blob], 'pasted-image.png', { type: blob.type })
        file.value = dataFile
        readFile(dataFile)
        showToaster('Image Pasted', 'Image has been pasted from clipboard.')
        break
      }
    }
  } catch (err) {
    console.error('Failed to read clipboard contents: ', err)
  }
}
const copyImage = async () => {
  try {
    if (!output.value) return
    const blob = await (await fetch(output.value)).blob()
    const item = new ClipboardItem({ [blob.type]: blob })
    await navigator.clipboard.write([item])
    showToaster('Copied to Clipboard', 'Image has been copied to clipboard.')
  } catch (err) {
    console.error('Failed to copy image to clipboard: ', err)
  }
}

const saveImage = () => {
  if (!output.value) return
  const link = document.createElement('a')
  link.href = output.value
  link.download = 'image.png'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToaster('Image Saved', 'Image has been saved.')
}

const openImage = () => {
  if (!input.value) return
  const newWindow = window.open()
  if (newWindow) {
    newWindow.document.write(`<img src="${input.value}" alt="Base64 Image" />`)
  }
}
</script>

<template>
  <ResizablePanelGroup :direction="panelGroupDir" :class="panelGroupClass">
    <ResizablePanel class="h-[100svh] w-full">

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
                <AppButton variant="outline" size="icon" @click="($refs.fileInput as any).click()">
                  <File class="w-4 h-4" />
                </AppButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Load File</p>
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
      <Textarea v-model="input" id="input" class="w-full h-[78svh]" />
    </ResizablePanel>
    <ResizableHandle v-if="!isMobile" with-handle class="resizeable-handle p-2 bg-transparent" />
    <ResizablePanel>

      <Card>
        <CardContent
          class="p-6 cursor-pointer"
          :class="{ 'ring-1 ring-blue-500 rounded-md': isDragging }"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop"
        >
          <input type="file" ref="fileInput" class="hidden" @change="handleFileInput"
                 accept=".png,.jpg,.jpeg,.bmp, .gif, .ico, .webp, .svg" />
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
            <span class="text-xs text-gray-500">PNG, JPG, JPEG, BMP, GIF, ICO, WEBP, SVG file here</span>
            <span class="text-xs text-gray-500">or</span>
            <div class="flex">
              <span class="text-sm font-medium text-blue-500" @click="($refs.fileInput as any).click()">Open</span>
              <span class="text-sm font-medium ml-2 mr-2"> or </span>
              <span class="text-sm font-medium text-blue-500" @click="handlePasteImage">Paste</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <AppComponentGap />
      <Card>
        <CardContent>
          <AppComponentGap size="small" />
          <div class="input-header justify-end">
            <div class="button-group">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AppButton variant="outline" size="icon" @click="openImage">
                      <SquareArrowOutUpRight class="w-4 h-4" />
                    </AppButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Open</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AppButton variant="outline" size="icon" @click="copyImage">
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
                    <AppButton variant="outline" size="icon" @click="saveImage">
                      <Save class="w-4 h-4" />
                    </AppButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <AppComponentGap size="small" />
          <div class="flex justify-center">
            <img
              alt="decoded image"
              class="object-cover border border-gray-200 w-auto rounded-lg overflow-hidden dark:border-gray-800 h-[51.7svh] mx-auto"
              :src="output || placeholder" />
          </div>
        </CardContent>
      </Card>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
