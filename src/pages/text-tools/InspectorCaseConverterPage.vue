<script setup lang="ts">
import {ref, watch} from 'vue';
import {AppButton} from "@/components/ui/app-button";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Label} from "@/components/ui/label";
import {AppComponentGap} from "@/components/ui/app-component-gap";
import {ClipboardPaste, Copy, File, X} from "lucide-vue-next";
import {Textarea} from "@/components/ui/textarea";
import {Card, CardContent} from "@/components/ui/card";
import {useToast} from '@/components/ui/toast';

const { toast } = useToast();

const inputString = ref('');
const wordDistributionOutput = ref('');
const characterDistributionOutput = ref('');
const lineValue = ref(0);
const columnValue = ref(0);
const positionValue = ref(0);
const charactersValue = ref(0);
const wordsValue = ref(0);
const linesValue = ref(0);
const sentencesValue = ref(0);
const paragraphsValue = ref(0);
const bytesValue = ref(0);

const currentCaseType = ref('originalText');

const originalText = ref('')

function updateDistributions() {
  const text = inputString.value;

  // Update word distribution
  const words = text.split(/\s+/).filter(Boolean);
  const wordMap: Record<string, number> = {};
  for (const word of words) {
    wordMap[word] = (wordMap[word] || 0) + 1;
  }
  wordDistributionOutput.value = Object.entries(wordMap)
    .map(([word, count]) => `${word}: ${count}`)
    .join('\n');

  // Update character distribution
  const charMap: Record<string, number> = {};
  for (const char of text.replace(/\s+/g, '')) {
    charMap[char] = (charMap[char] || 0) + 1;
  }
  const sortedChars = Object.keys(charMap).sort();
  characterDistributionOutput.value = sortedChars.map(char => `${char}: ${charMap[char]}`).join('\n');

  // Update other values
  charactersValue.value = text.length;
  wordsValue.value = words.length; // Add this line to update wordsValue
  linesValue.value = text.split('\n').length;
  sentencesValue.value = text.split(/[.!?]/).filter(Boolean).length;
  paragraphsValue.value = text.split(/\n\s*\n/).filter(Boolean).length;
  bytesValue.value = new TextEncoder().encode(text).length;
}

function updateCursorPosition(event: Event) {
  const target = event.target as HTMLTextAreaElement;
  const position = target.selectionStart;
  const textUpToCursor = inputString.value.slice(0, position);

  positionValue.value = position;
  lineValue.value = (textUpToCursor.match(/\n/g) || []).length + 1;
  columnValue.value = position - textUpToCursor.lastIndexOf('\n') - 1;
}

watch(inputString, (newValue) => {
  updateDistributions();
  updateCursorPosition({ target: { selectionStart: newValue.length } } as unknown as Event);
});

async function pasteToInputStringComparerFromClipboard() {
  try {
    inputString.value = await navigator.clipboard.readText();
    toast({
      title: 'Paste Complete',
      description: 'Text pasted from clipboard.'
    });
  } catch (error) {
    console.error('Failed to read clipboard contents: ', error);
  }
}

const loadFileToChecksumInputString = async () => {
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
          inputString.value = reader.result as string;
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
}

async function copyFromInputStringComparerToClipboard() {
  try {
    await navigator.clipboard.writeText(inputString.value);
    toast({
      title: 'Copy Complete',
      description: 'Text copied to clipboard.'
    });
  } catch (error) {
    console.error('Failed to write to clipboard: ', error);
  }
}

function clearInputStringComparer() {
  inputString.value = '';
  toast({
    title: 'Clear Complete',
    description: 'Input string cleared.'
  });
}
function showToaster(title: string, description: string) {
  toast({
    title: title,
    description: description
  });
}

function onInputStringChange(){
  currentCaseType.value = 'originalText';
  originalText.value = inputString.value;
}

function convertOriginalText() {
  currentCaseType.value = 'originalText';
  inputString.value = originalText.value
  showToaster('Conversion Complete', 'Original text conversion finished.');
}

function convertSentenceCase() {
  currentCaseType.value = 'sentenceCase';
  inputString.value = originalText.value
    .toLowerCase()
    .replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
  showToaster('Conversion Complete', 'Sentence case conversion finished.');
}

function convertLowerCase() {
  currentCaseType.value = 'lowerCase';
  inputString.value = originalText.value.toLowerCase();
  showToaster('Conversion Complete', 'Lower case conversion finished.');
}

function convertUpperCase() {
  currentCaseType.value = 'upperCase';
  inputString.value = originalText.value.toUpperCase();
  showToaster('Conversion Complete', 'Upper case conversion finished.');
}

function convertTitleCase() {
  currentCaseType.value = 'titleCase';
  inputString.value = originalText.value
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
  showToaster('Conversion Complete', 'Title case conversion finished.');
}

function convertCamelCase() {
  currentCaseType.value = 'camelCase';
  inputString.value = originalText.value
    .toLowerCase()
    .split('\n')
    .map(line =>
      line.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
        index === 0 ? match.toLowerCase() : match.toUpperCase()
      ).replace(/\s+/g, '')
    )
    .join('\n');
  showToaster('Conversion Complete', 'Camel case conversion finished.');
}

function convertPascalCase() {
  currentCaseType.value = 'pascalCase';
  inputString.value = originalText.value
    .toLowerCase()
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match) => match.toUpperCase())
    .replace(/(?!\n)\s+/g, ''); // Remove spaces except new lines
  showToaster('Conversion Complete', 'Pascal case conversion finished.');
}

function convertSnakeCase() {
  currentCaseType.value = 'snakeCase';
  inputString.value = originalText.value
    .toLowerCase()
    .replace(/\s+/g, '_');
  showToaster('Conversion Complete', 'Snake case conversion finished.');
}

function convertConstantCase() {
  currentCaseType.value = 'constantCase';
  inputString.value = originalText.value
    .toUpperCase()
    .replace(/\s+/g, '_');
  showToaster('Conversion Complete', 'Constant case conversion finished.');
}

function convertKebabCase() {
  currentCaseType.value = 'kebabCase';
  inputString.value = originalText.value
    .toLowerCase()
    .replace(/\s+/g, '-');
  showToaster('Conversion Complete', 'Kebab case conversion finished.');
}

function convertCobolCase() {
  currentCaseType.value = 'cobolCase';
  inputString.value = originalText.value
    .toUpperCase()
    .replace(/\s+/g, '-');
  showToaster('Conversion Complete', 'Cobol case conversion finished.');
}

function convertTrainCase() {
  currentCaseType.value = 'trainCase';
  inputString.value = originalText.value
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\s+/g, '-');
  showToaster('Conversion Complete', 'Train case conversion finished.');
}

function convertAlternatingCase() {
  currentCaseType.value = 'alternatingCase';
  inputString.value = originalText.value
    .split('')
    .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
    .join('');
  showToaster('Conversion Complete', 'Alternating case conversion finished.');
}

function convertInverseCase() {
  currentCaseType.value = 'inverseCase';
  inputString.value = originalText.value
    .split('')
    .map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()))
    .join('');
  showToaster('Conversion Complete', 'Inverse case conversion finished.');
}

function sortAlphabetize() {
  inputString.value = originalText.value
    .split('\n')
    .sort()
    .join('\n');
  showToaster('Sort Complete', 'Alphabetize sorting finished.');
}

function sortReverseAlphabetize() {
  inputString.value = originalText.value
    .split('\n')
    .sort()
    .reverse()
    .join('\n');
  showToaster('Sort Complete', 'Reverse alphabetize sorting finished.');
}

function sortAlphabetizeByLastWord() {
  inputString.value = originalText.value
    .split('\n')
    .sort((a, b) => {
      const lastWordA = a.split(' ').pop() || '';
      const lastWordB = b.split(' ').pop() || '';
      return lastWordA.localeCompare(lastWordB);
    })
    .join('\n');
  showToaster('Sort Complete', 'Alphabetize by last word sorting finished.');
}

function sortReverseAlphabetizeByLastWord() {
  inputString.value = originalText.value
    .split('\n')
    .sort((a, b) => {
      const lastWordA = a.split(' ').pop() || '';
      const lastWordB = b.split(' ').pop() || '';
      return lastWordB.localeCompare(lastWordA);
    })
    .join('\n');
  showToaster('Sort Complete', 'Reverse alphabetize by last word sorting finished.');
}

function sortReverse() {
  inputString.value = originalText.value
    .split('\n')
    .reverse()
    .join('\n');
  showToaster('Sort Complete', 'Reverse sorting finished.');
}

function sortRandomize() {
  inputString.value = originalText.value
    .split('\n')
    .sort(() => Math.random() - 0.5)
    .join('\n');
  showToaster('Sort Complete', 'Randomize sorting finished.');
}
function clearSort() {
  inputString.value = originalText.value;
  showToaster('Sort Complete', 'Randomize sorting finished.');
}
</script>

<template>
  <Label for="email">Convert</Label>
  <AppComponentGap size="small"/>
  <div class="flex flex-wrap gap-1">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AppButton :variant="currentCaseType === 'originalText' ? 'default' : 'outline'" @click="convertOriginalText" :disabled="currentCaseType === 'originalText'" class="p-5">
            <span>Original Text</span>
          </AppButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Convert Original text</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AppButton :variant="currentCaseType === 'sentenceCase' ? 'default' : 'outline'" @click="convertSentenceCase" :disabled="currentCaseType === 'sentenceCase'" class="p-5">
            <span>Sentence case</span>
          </AppButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Convert Sentence Case</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AppButton :variant="currentCaseType === 'lowerCase' ? 'default' : 'outline'" @click="convertLowerCase" :disabled="currentCaseType === 'lowerCase'" class="p-5">
            <span>lower case</span>
          </AppButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Convert Lower Case</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AppButton :variant="currentCaseType === 'upperCase' ? 'default' : 'outline'" @click="convertUpperCase" :disabled="currentCaseType === 'upperCase'" class="p-5">
            <span>UPPER CASE</span>
          </AppButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Convert Upper Case</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AppButton :variant="currentCaseType === 'titleCase' ? 'default' : 'outline'" @click="convertTitleCase" :disabled="currentCaseType === 'titleCase'" class="p-5">
            <span>Title Case</span>
          </AppButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Convert Title Case</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AppButton :variant="currentCaseType === 'camelCase' ? 'default' : 'outline'" @click="convertCamelCase" :disabled="currentCaseType === 'camelCase'" class="p-5">
            <span>camelCase</span>
          </AppButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Convert Camel Case</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AppButton :variant="currentCaseType === 'pascalCase' ? 'default' : 'outline'" @click="convertPascalCase" :disabled="currentCaseType === 'pascalCase'" class="p-5">
            <span>PascalCase</span>
          </AppButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Convert Pascal Case</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AppButton :variant="currentCaseType === 'snakeCase' ? 'default' : 'outline'" @click="convertSnakeCase" :disabled="currentCaseType === 'snakeCase'" class="p-5">
            <span>snake_case</span>
          </AppButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Convert Snake Case</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AppButton :variant="currentCaseType === 'constantCase' ? 'default' : 'outline'" @click="convertConstantCase" :disabled="currentCaseType === 'constantCase'" class="p-5">
            <span>CONSTANT_CASE</span>
          </AppButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Convert Constant Case</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AppButton :variant="currentCaseType === 'kebabCase' ? 'default' : 'outline'" @click="convertKebabCase" :disabled="currentCaseType === 'kebabCase'" class="p-5">
            <span>kebab-case</span>
          </AppButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Convert Kebab Case</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AppButton :variant="currentCaseType === 'cobolCase' ? 'default' : 'outline'" @click="convertCobolCase" :disabled="currentCaseType === 'cobolCase'" class="p-5">
            <span>COBOL-CASE</span>
          </AppButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Convert Cobol Case</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AppButton :variant="currentCaseType === 'trainCase' ? 'default' : 'outline'" @click="convertTrainCase" :disabled="currentCaseType === 'trainCase'" class="p-5">
            <span>Train-Case</span>
          </AppButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Convert Train Case</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AppButton :variant="currentCaseType === 'alternatingCase' ? 'default' : 'outline'" @click="convertAlternatingCase" :disabled="currentCaseType === 'alternatingCase'" class="p-5">
            <span>aLtErNaTiNg cAsE</span>
          </AppButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Convert Alternating Case</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AppButton :variant="currentCaseType === 'inverseCase' ? 'default' : 'outline'" @click="convertInverseCase" :disabled="currentCaseType === 'inverseCase'" class="p-5">
            <span>InVeRsE CaSe</span>
          </AppButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Convert Inverse Case</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
  <AppComponentGap/>
  <Label for="email">Sort Lines</Label>
  <AppComponentGap size="small"/>
  <div class="flex flex-wrap gap-1">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AppButton variant="outline" @click="sortAlphabetize" class="p-5">
            <span>Alphabetize</span>
          </AppButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sort Alphabetize</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AppButton variant="outline" @click="sortReverseAlphabetize" class="p-5">
            <span>Reverse Alphabetize</span>
          </AppButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sort Reverse Alphabetize</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AppButton variant="outline" @click="sortAlphabetizeByLastWord" class="p-5">
            <span>Alphabetize By Last Word</span>
          </AppButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sort Alphabetize By Last Word</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AppButton variant="outline" @click="sortReverseAlphabetizeByLastWord" class="p-5">
            <span>Reverse Alphabetize By Last Word</span>
          </AppButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sort Reverse Alphabetize By Last Word</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AppButton variant="outline" @click="sortReverse" class="p-5">
            <span>Reverse</span>
          </AppButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sort Reverse</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AppButton variant="outline" @click="sortRandomize" class="p-5">
            <span>Randomize</span>
          </AppButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sort Randomize</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AppButton variant="outline" @click="clearSort" class="p-5">
            <X class="w-4 h-4"/>
          </AppButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Clear Sort</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

  </div>
  <AppComponentGap/>
  <div class="flex gap-2">
    <div class="w-2/3">
      <div class="input-header">
        <Label for="inputString" class="align-bottom">Input String</Label>
        <div class="button-group">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <AppButton variant="outline" size="icon" @click="pasteToInputStringComparerFromClipboard">
                  <ClipboardPaste class="w-4 h-4"/>
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
                <AppButton variant="outline" size="icon" @click="loadFileToChecksumInputString">
                  <File class="w-4 h-4"/>
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
                <AppButton variant="outline" size="icon" @click="copyFromInputStringComparerToClipboard">
                  <Copy class="w-4 h-4"/>
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
                <AppButton variant="outline" size="icon" @click="clearInputStringComparer">
                  <X class="w-4 h-4"/>
                </AppButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear Input</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <AppComponentGap size="small"/>
      <Textarea v-model="inputString" id="inputString" class="h-[55.8svh]" @input="onInputStringChange" @click="updateCursorPosition"/>
    </div>
    <div class="w-1/3">
      <Card>
        <CardContent class="p-6">
          <Label for="input" class="align-bottom">Selection</Label>
          <AppComponentGap size="small"/>
          <div class="flex justify-between">
            <Label for="input" class="align-bottom">Line:</Label>
            <Label for="input" class="align-bottom">{{lineValue}}</Label>
          </div>
          <AppComponentGap size="small"/>
          <div class="flex justify-between">
            <Label for="input" class="align-bottom">Column:</Label>
            <Label for="input" class="align-bottom">{{columnValue}}</Label>
          </div>
          <AppComponentGap size="small"/>
          <div class="flex justify-between">
            <Label for="input" class="align-bottom">Position:</Label>
            <Label for="input" class="align-bottom">{{positionValue}}</Label>
          </div>
          <AppComponentGap/>
          <Label for="input" class="align-bottom">Statistic</Label>
          <AppComponentGap size="small"/>
          <div class="flex justify-between">
            <Label for="input" class="align-bottom">Characters:</Label>
            <Label for="input" class="align-bottom">{{charactersValue}}</Label>
          </div>
          <AppComponentGap size="small"/>
          <div class="flex justify-between">
            <Label for="input" class="align-bottom">Words:</Label>
            <Label for="input" class="align-bottom">{{wordsValue}}</Label>
          </div>
          <AppComponentGap size="small"/>
          <div class="flex justify-between">
            <Label for="input" class="align-bottom">Lines:</Label>
            <Label for="input" class="align-bottom">{{linesValue}}</Label>
          </div>
          <AppComponentGap size="small"/>
          <div class="flex justify-between">
            <Label for="input" class="align-bottom">Sentences:</Label>
            <Label for="input" class="align-bottom">{{sentencesValue}}</Label>
          </div>
          <AppComponentGap size="small"/>
          <div class="flex justify-between">
            <Label for="input" class="align-bottom">Paragraphs:</Label>
            <Label for="input" class="align-bottom">{{paragraphsValue}}</Label>
          </div>
          <AppComponentGap size="small"/>
          <div class="flex justify-between">
            <Label for="input" class="align-bottom">Bytes:</Label>
            <Label for="input" class="align-bottom">{{bytesValue}}</Label>
          </div>
          <AppComponentGap/>

          <div class="input-header">
            <Label for="wordDistributionOutput" class="align-bottom">Word Distribution</Label>
          </div>
          <AppComponentGap size="small" />
          <Textarea v-model="wordDistributionOutput" id="wordDistributionOutput" readonly />
          <AppComponentGap/>

          <div class="input-header">
            <Label for="characterDistributionOutput" class="align-bottom">Character Distribution</Label>
          </div>
          <AppComponentGap size="small" />
          <Textarea v-model="characterDistributionOutput" id="characterDistributionOutput" readonly/>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
