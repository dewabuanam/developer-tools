<script setup lang="ts">
import {CircleCheck, ClipboardPaste, Copy, File, Settings, X} from "lucide-vue-next";
import {AppConfiguration} from "@/components/ui/app-configuration";
import {AppComponentGap} from '@/components/ui/app-component-gap'
import {Label} from "@/components/ui/label";
import {AppButton} from "@/components/ui/app-button";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import {Card, CardContent} from "@/components/ui/card";
import {useToast} from '@/components/ui/toast';

const {toast} = useToast();

function showToaster(title: string, description: string) {
  toast({
    title: title,
    description: description
  });
}

import {computed, ref, watch} from 'vue';

const optionsSetValue = computed(() => {
  const options = [];
  if (isEcmaScript.value === '1') options.push('Ecma Script');
  if (isCultureInvariant.value === '1') options.push('Culture Invariant');
  if (isIgnoreCase.value === '1') options.push('Ignore Case');
  if (isIgnoreWhitespace.value === '1') options.push('Ignore Whitespace');
  if (isSingleLine.value === '1') options.push('Single Line');
  if (isMultiLine.value === '1') options.push('Multi Line');
  if (isRightToLeft.value === '1') options.push('Right To Left');
  return options.join(', ');
});
const isEcmaScript = ref('');
const ecmaScriptSwitchText = computed(() => (isEcmaScript.value === '1' ? 'On' : 'Off'))
const isCultureInvariant = ref('');
const cultureInvariantText = computed(() => (isCultureInvariant.value === '1' ? 'On' : 'Off'))
const isIgnoreCase = ref('');
const ignoreCaseSwitchText = computed(() => (isIgnoreCase.value === '1' ? 'On' : 'Off'))
const isIgnoreWhitespace = ref('');
const ignoreWhitespaceSwitchText = computed(() => (isIgnoreWhitespace.value === '1' ? 'On' : 'Off'))
const isSingleLine = ref('');
const singleLineSwitchText = computed(() => (isSingleLine.value === '1' ? 'On' : 'Off'));
const isMultiLine = ref('');
const multiLineSwitchText = computed(() => (isMultiLine.value === '1' ? 'On' : 'Off'))
const isRightToLeft = ref('');
const rightToLeftSwitchText = computed(() => (isRightToLeft.value === '1' ? 'On' : 'Off'))
const regularExpression = ref('');
const text = ref('');
const matches = ref<{ colFirst: number; colLast:number; value: string }[]>([]);

watch([regularExpression, text], () => {
  updateMatches();
});

function updateMatches() {
  try {
    if (regularExpression.value === '' || text.value === '') {
      return;
    }
    const regex = new RegExp(regularExpression.value, 'g');
    const matchArray = [];
    let match;
    while ((match = regex.exec(text.value)) !== null) {
      matchArray.push({
        colFirst: match.index,
        colLast: match.index + match[0].length - 1,
        value: match[0]
      });
    }
    matches.value = matchArray;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    matches.value = [];
  }
}
function pasteToRegularExpressionFromClipboard() {
  navigator.clipboard.readText().then((clipText) => {
    regularExpression.value = clipText;
    showToaster('Success', 'Pasted regular expression from clipboard');
  });
}

function loadFileToRegularExpression() {
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
          regularExpression.value = reader.result as string;
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

function copyFromRegularExpressionToClipboard() {
  navigator.clipboard.writeText(regularExpression.value).then(() => {
    showToaster('Success', 'Copied regular expression to clipboard');
  });
}

function clearRegularExpressionInput() {
  regularExpression.value = '';
  showToaster('Success', 'Cleared regular expression input');
}

function pasteToTextFromClipboard() {
  navigator.clipboard.readText().then((clipText) => {
    text.value = clipText;
    showToaster('Success', 'Pasted text from clipboard');
  });
}

function loadFileToText() {
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
          text.value = reader.result as string;
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

function copyFromTextToClipboard() {
  navigator.clipboard.writeText(text.value).then(() => {
    showToaster('Success', 'Copied text to clipboard');
  });
}

function clearTextInput() {
  text.value = '';
  showToaster('Success', 'Cleared text input');
}
</script>

<template>
  <Label for="email">Configuration</Label>
  <AppComponentGap size="small"/>
  <AppConfiguration
    title="Options"
    :description="optionsSetValue"
    :icon=Settings
    type='none'
    :model-value="optionsSetValue"
    :v-model='optionsSetValue'
  >
    <AppConfiguration
      title="ECMA Script"
      description="Enable ECMAScript-compliant behavior for the expression. This value can be used only in conjunction with the Culture Invariant, Ignore Case and Multiline options."
      :icon="CircleCheck"
      type="switch"
      v-model="isEcmaScript"
      :switch-text="ecmaScriptSwitchText"
    />
    <AppComponentGap size="small"/>
    <AppConfiguration
      title="Culture Invariant"
      description="Specifies that cultural differences in language are ignored."
      :icon="CircleCheck"
      type="switch"
      v-model="isCultureInvariant"
      :switch-text="cultureInvariantText"
    />
    <AppComponentGap size="small"/>
    <AppConfiguration
      title="Ignore Case"
      description="Specifies case-insensitive matching."
      :icon="CircleCheck"
      type="switch"
      v-model="isIgnoreCase"
      :switch-text="ignoreCaseSwitchText"
    />
    <AppComponentGap size="small"/>
    <AppConfiguration
      title="Ignore Whitespace"
      description="Eliminates unescaped white space from the pattern and enables comments marked with #. However, this value does not affect or eliminate white space in character classes, numeric quantifiers, or tokens marked the beginning of individual regular expression language elements."
      :icon="CircleCheck"
      type="switch"
      v-model="isIgnoreWhitespace"
      :switch-text="ignoreWhitespaceSwitchText"
    />
    <AppComponentGap size="small"/>
    <AppConfiguration
      title="Single Line"
      description="Change the meaning of the dot (.) so it matches every character (instead of every character except \n)."
      :icon="CircleCheck"
      type="switch"
      v-model="isSingleLine"
      :switch-text="singleLineSwitchText"
    />
    <AppComponentGap size="small"/>
    <AppConfiguration
      title="Multi Line"
      description="Change the meaning of the caret (^) and dollar sign ($) so they match the start and end of every line (instead of the start and end of the entire string)."
      :icon="CircleCheck"
      type="switch"
      v-model="isMultiLine"
      :switch-text="multiLineSwitchText"
    />
    <AppComponentGap size="small"/>
    <AppConfiguration
      title="Right To Left"
      description="Specifies that the search will be from right to left instead of the default left to right."
      :icon="CircleCheck"
      type="switch"
      v-model="isRightToLeft"
      :switch-text="rightToLeftSwitchText"
    />
    <AppComponentGap size="small"/>


  </AppConfiguration>
  <AppComponentGap/>

  <div class="input-header">
    <Label for="regularExpression" class="align-bottom">RegularExpression</Label>
    <div class="button-group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AppButton variant="outline" size="icon" @click="pasteToRegularExpressionFromClipboard">
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
            <AppButton variant="outline" size="icon" @click="loadFileToRegularExpression">
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
            <AppButton variant="outline" size="icon" @click="copyFromRegularExpressionToClipboard">
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
            <AppButton variant="outline" size="icon" @click="clearRegularExpressionInput">
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
  <Input v-model="regularExpression" id="regularExpression" class="w-full"/>
  <AppComponentGap/>
  <div class="input-header">
    <Label for="text" class="align-bottom">Text</Label>
    <div class="button-group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <AppButton variant="outline" size="icon" @click="pasteToTextFromClipboard">
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
            <AppButton variant="outline" size="icon" @click="loadFileToText">
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
            <AppButton variant="outline" size="icon" @click="copyFromTextToClipboard">
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
            <AppButton variant="outline" size="icon" @click="clearTextInput">
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
  <Textarea v-model="text" id="text" class="w-full h-[30svh]"/>
  <AppComponentGap/>
  <Label for="email">Matches</Label>
  <AppComponentGap size="small"/>

  <Card>
    <CardContent class="p-6">
      <div v-for="(match, index) in matches" :key="index" class="flex justify-between p-2">
        <Label for="input" class="align-bottom">Match {{ index + 1 }}:</Label>
        <Label for="input" class="align-bottom">{{ match.colFirst }}-{{ match.colLast }}</Label>
        <Label for="input" class="align-bottom">{{ match.value }}</Label>
      </div>
    </CardContent>
  </Card>
</template>
