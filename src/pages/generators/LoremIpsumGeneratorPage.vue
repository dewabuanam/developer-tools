<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AppButton } from '@/components/ui/app-button'
import { Textarea } from '@/components/ui/textarea'
import {
  Copy, LetterText, ListOrdered, Ruler, X, RefreshCw
} from 'lucide-vue-next'
import { AppComponentGap } from '@/components/ui/app-component-gap'
import { AppConfiguration } from '@/components/ui/app-configuration'
import { computed, ref } from 'vue'
import { useToast } from '@/components/ui/toast'
import { nextTick } from 'vue'

import { LoremIpsum } from 'lorem-ipsum'

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
})

const { toast } = useToast()

const loremIpsumList = [
  { value: 'words', key: 'Words' },
  { value: 'sentences', key: 'Sentences' },
  { value: 'paragraphs', key: 'Paragraphs' },
]
const loremIpsumType = ref(loremIpsumList[0].value)
const typeLength = ref('1')
const isStartWithLoremIpsum= ref ('0')
const loremIpsumSwitchText = computed(() => (isStartWithLoremIpsum.value === '1' ? 'On' : 'Off'))

const loremIpsumOutput= ref ('')

function showToaster(title: string, description: string) {
  toast({
    title: title,
    description: description
  })
}

async function copyFromLoremIpsumOutputToClipboard() {
  await navigator.clipboard.writeText(loremIpsumOutput.value)
  showToaster('Copied', 'Copied lorem ipsum output to clipboard')
}

function clearLoremIpsumOuput() {
  loremIpsumOutput.value = ''
  showToaster('Cleared', 'Cleared lorem ipsum output')
}

function generateLoremIpsum() {
  let output = ''
  const length = parseInt(typeLength.value)

  if (isStartWithLoremIpsum.value === '1') {
    if (loremIpsumType.value === 'words') {
      output = lorem.generateWords(length)
    } else if (loremIpsumType.value === 'sentences') {
      output = lorem.generateSentences(length)
    } else if (loremIpsumType.value === 'paragraphs') {
      output = lorem.generateParagraphs(length)
    }
    output = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + output

    if (loremIpsumType.value === 'words') {
      const words = output.split(' ')
      output = words.slice(0, length).join(' ')
    } else if (loremIpsumType.value === 'sentences') {
      const sentences = output.split('. ')
      output = sentences.slice(0, length).join('. ')
    }
  }
  else{
    if (loremIpsumType.value === 'words') {
      output = lorem.generateWords(length)
    } else if (loremIpsumType.value === 'sentences') {
      output = lorem.generateSentences(length)
    } else if (loremIpsumType.value === 'paragraphs') {
      output = lorem.generateParagraphs(length)
    }
  }

  loremIpsumOutput.value = output
  showToaster('Generated', 'Lorem Ipsum generated successfully')

  nextTick(() => {
    const textarea = document.getElementById('loremIpsumOutput') as HTMLTextAreaElement
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight
    }
  })
}

</script>


<template>
  <Label for="configuration">Configuration</Label>
  <AppComponentGap size="small" />
  <AppConfiguration
    title="Type"
    description="Generate words, sentences, or paragraphs of Lorem Ipsum"
    :listOptions="loremIpsumList"
    :icon="ListOrdered"
    type="dropdown"
    v-model="loremIpsumType"
  />
  <AppComponentGap size="small" />
  <AppConfiguration
    title="Length"
    description="Number of characters in each word, sentence, or paragraph"
    :icon="Ruler"
    type="inputNumber"
    v-model="typeLength"
    :min-input-number='1'
  />
  <AppComponentGap size="small" />
  <AppConfiguration
    title="Use Lorem Ipsum"
    description="Start with 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'"
    :icon="LetterText"
    type="switch"
    v-model="isStartWithLoremIpsum"
    :switch-text="loremIpsumSwitchText"
  />
  <AppComponentGap />

  <div class="input-header">
    <Label for="loremIpsumOutput" class="align-bottom">Output</Label>
    <div class="button-group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AppButton variant="outline" size="icon" @click="generateLoremIpsum">
              <RefreshCw class="w-4 h-4" />
            </AppButton>
          </TooltipTrigger>
          <TooltipContent>
            <p>Refresh Lorem Ipsum</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AppButton variant="outline" size="icon" @click="copyFromLoremIpsumOutputToClipboard">
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
            <AppButton variant="outline" size="icon" @click="clearLoremIpsumOuput">
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
  <Textarea v-model="loremIpsumOutput" id="loremIpsumOutput" class="w-full h-[40svh]" readonly />
</template>
