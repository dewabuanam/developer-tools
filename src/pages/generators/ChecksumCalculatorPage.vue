<script setup lang="ts">
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip'
import {AppButton} from '@/components/ui/app-button'
import {
  CheckCheck,
  ChevronsUp,
  ClipboardPaste,
  Copy,
  File,
  FileKey2,
  Signature,
  TriangleAlert,
  X
} from 'lucide-vue-next'
import {AppComponentGap} from '@/components/ui/app-component-gap'
import {AppConfiguration} from '@/components/ui/app-configuration'
import {computed, ref, watch} from 'vue'
import {useToast} from '@/components/ui/toast'
import {Card, CardContent} from "@/components/ui/card";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {md5} from 'js-md5';
import {sha1} from 'js-sha1';
import {sha256} from 'js-sha256';
import {sha512} from 'js-sha512';
import {hash as sha384} from '@stablelib/sha384';

const { toast } = useToast()

const hashingAlgorithmList = [
  { value: 'md5', key: 'MD5' },
  { value: 'sha1', key: 'SHA1' },
  { value: 'sha256', key: 'SHA256' },
  { value: 'sha384', key: 'SHA384' },
  { value: 'sha512', key: 'SHA512' },
]
const hashingAlgorithmType = ref(hashingAlgorithmList[0].value)

const isUpperCase= ref ('1')
const upperCaseSwitchText = computed(() => (isUpperCase.value === '1' ? 'On' : 'Off'))

const checksumOutput= ref ('')
const checksumOutputComparer= ref ('')

const file = ref<File | null>(null)
const isDragging = ref(false)

const getExtensionFullName = (extension: string) => {
  const extensionMap: { [key: string]: string } = {
    'txt': 'Text File Document (TXT)',
  }
  return extensionMap[extension] || extension
}

const handleFileInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    file.value = target.files[0]
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
  }
}

const clearFile = () => {
  file.value = null
  checksumOutput.value = ''
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

function showToaster(title: string, description: string) {
  toast({
    title: title,
    description: description
  })
}
const pasteToChecksumOutputComparerFromClipboard = async () => {
  try {
    checksumOutputComparer.value = await navigator.clipboard.readText();
    showToaster('Success', 'Pasted from clipboard');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    showToaster('Error', 'Failed to paste from clipboard');
  }
};

const loadFileToChecksumOutputComparer = async () => {
  try {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '*/*';
    fileInput.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          checksumOutputComparer.value = reader.result as string;
          showToaster('Success', 'File loaded');
        };
        reader.readAsText(file);
      }
    };
    fileInput.click();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    showToaster('Error', 'Failed to load file');
  }
};

const copyFromChecksumOutputComparerToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(checksumOutputComparer.value);
    showToaster('Success', 'Copied to clipboard');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    showToaster('Error', 'Failed to copy to clipboard');
  }
};

const clearChecksumOuputComparer = () => {
  checksumOutputComparer.value = '';
  showToaster('Success', 'Cleared input');
};
const copyFromChecksumOutputToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(checksumOutput.value);
    showToaster('Success', 'Copied to clipboard');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    showToaster('Error', 'Failed to copy to clipboard');
  }
};

const alertType = ref<'default' | 'destructive' | null>(null)
const alertTitle = ref('')
const alertMessage = ref('')

watch([checksumOutputComparer, checksumOutput], () => {
  if(checksumOutputComparer.value === ''){
    showAlertValid('', '');
  }
  else if (checksumOutputComparer.value.toLowerCase() === checksumOutput.value.toLowerCase()) {
    showAlertValid('Valid', 'The checksums match.');
  } else {
    showAlertWarning('Warning', 'The checksums do not match.');
  }
});
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

watch(file, (newFile) => {
  if (newFile) {
    generateChecksum();
  }
});

watch(isUpperCase, () => {
  if (file.value) {
    generateChecksum();
  }
});

watch(hashingAlgorithmType, () => {
  if (file.value) {
    generateChecksum();
  }
});

function generateChecksum() {
  const reader = new FileReader();
  reader.onload = () => {
    const fileContent = reader.result as string;
    let checksum = '';

    switch (hashingAlgorithmType.value) {
      case 'md5':
        checksum = md5(fileContent);
        break;
      case 'sha1':
        checksum = sha1(fileContent);
        break;
      case 'sha256':
        checksum = sha256(fileContent);
        break;
      case 'sha384':
        checksum = uint8ArrayToHexString(sha384(new TextEncoder().encode(fileContent)));
        break;
      case 'sha512':
        checksum = sha512(fileContent);
        break;
    }

    if (isUpperCase.value === '1') {
      checksum = checksum.toUpperCase();
    }
    checksumOutput.value = checksum;
  };
  if (file.value) {
    reader.readAsText(file.value);
  }
}
function uint8ArrayToHexString(uint8Array: Uint8Array): string {
  return Array.from(uint8Array)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}
</script>


<template>
  <Label for="configuration">Configuration</Label>
  <AppComponentGap size="small" />
  <AppConfiguration
    title="Uppercase"
    description="Set checksum uppercase"
    :icon="ChevronsUp"
    type="switch"
    v-model="isUpperCase"
    :switch-text="upperCaseSwitchText"
  />
  <AppComponentGap size="small" />
  <AppConfiguration
    title="Hashing Algorithm"
    description="Select hash algorithm"
    :listOptions="hashingAlgorithmList"
    :icon="Signature"
    type="dropdown"
    v-model="hashingAlgorithmType"
  />
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
      <input type="file" ref="fileInput" class="hidden" @change="handleFileInput" accept="*/*" />
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
        <span class="text-xs text-gray-500">Any file here</span>
        <span class="text-xs text-gray-500">or</span>
        <span class="text-sm font-medium text-blue-500">Click here</span>
      </div>
    </CardContent>
  </Card>

  <AppComponentGap />

  <div class="input-header">
    <Label for="checksumOutput" class="align-bottom">Output</Label>
    <div class="button-group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AppButton variant="outline" size="icon" @click="copyFromChecksumOutputToClipboard">
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
  <Input v-model="checksumOutput" id="checksumOutput" readonly />

  <AppComponentGap />

  <div class="input-header">
    <Label for="checksumOutputComparer" class="align-bottom">Output Comparer</Label>
    <div class="button-group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AppButton variant="outline" size="icon" @click="pasteToChecksumOutputComparerFromClipboard">
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
            <AppButton variant="outline" size="icon" @click="loadFileToChecksumOutputComparer">
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
            <AppButton variant="outline" size="icon" @click="copyFromChecksumOutputComparerToClipboard">
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
            <AppButton variant="outline" size="icon" @click="clearChecksumOuputComparer">
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
  <Input v-model="checksumOutputComparer" id="checksumOutputComparer" />

  <AppComponentGap/>

  <div v-if="alertTitle!=''">
  <Alert :variant="alertType"
         :class="{ 'border-green-600': alertType === 'default' }">
    <CheckCheck v-if="alertType === 'default'" class="w-4 h-4 !text-green-600" />
    <TriangleAlert v-if="alertType === 'destructive'" class="w-4 h-4" />
    <AlertTitle :class="{ 'text-green-600': alertType === 'default' }">{{ alertTitle }}</AlertTitle>
    <AlertDescription :class="{ 'text-green-600': alertType === 'default' }">{{ alertMessage }}</AlertDescription>
  </Alert>
  </div>
</template>
