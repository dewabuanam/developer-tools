<script setup lang='ts'>
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Home, Settings, ChevronDown } from 'lucide-vue-next'

const menuItems = [
  {
    title: 'Home',
    url: '/',
    icon: Home
  },
  {
    title: 'Converters',
    url: '/converters',
    icon: Settings,
    children: [
      { title: 'JSON ↔ YAML', url: '/converters/json-yaml', icon: Settings },
      { title: 'Timestamp Converter', url: '/converters/timestamp', icon: Settings },
      { title: 'Number Base Converter', url: '/converters/number-base', icon: Settings },
      { title: 'Cron Expression Parser', url: '/converters/cron-parser', icon: Settings }
    ]
  },
  {
    title: 'Encoders/Decoders',
    url: '/encoders-decoders',
    icon: Settings,
    children: [
      { title: 'Certificate Viewer', url: '/encoders-decoders/certificate-viewer', icon: Settings },
      { title: 'HTML Encoder / Decoder', url: '/encoders-decoders/html', icon: Settings },
      { title: 'URL Encoder / Decoder', url: '/encoders-decoders/url', icon: Settings },
      { title: 'Base64 Text & Image Encoder / Decoder', url: '/encoders-decoders/base64', icon: Settings },
      { title: 'GZip Compressor', url: '/encoders-decoders/gzip', icon: Settings },
      { title: 'JWT Decoder', url: '/encoders-decoders/jwt', icon: Settings }
    ]
  },
  {
    title: 'Formatters',
    url: '/formatters',
    icon: Settings,
    children: [
      { title: 'JSON Formatter', url: '/formatters/json', icon: Settings },
      { title: 'SQL Formatter', url: '/formatters/sql', icon: Settings },
      { title: 'XML Formatter', url: '/formatters/xml', icon: Settings }
    ]
  },
  {
    title: 'Generators',
    url: '/generators',
    icon: Settings,
    children: [
      { title: 'Hash Generator', url: '/generators/hash', icon: Settings },
      { title: 'Password Generator', url: '/generators/password', icon: Settings },
      { title: 'UUID Generator', url: '/generators/uuid', icon: Settings },
      { title: 'Lorem Ipsum Generator', url: '/generators/lorem-ipsum', icon: Settings },
      { title: 'Checksum Calculator', url: '/generators/checksum', icon: Settings }
    ]
  },
  {
    title: 'Text Tools',
    url: '/text-tools',
    icon: Settings,
    children: [
      { title: 'Escape / Unescape Text', url: '/text-tools/escape-unescape', icon: Settings },
      { title: 'Inspector & Case Converter', url: '/text-tools/inspector-case', icon: Settings },
      { title: 'Regex Tester', url: '/text-tools/regex-tester', icon: Settings },
      { title: 'Text Difference Finder', url: '/text-tools/text-difference', icon: Settings },
      { title: 'XML Validator', url: '/text-tools/xml-validator', icon: Settings },
      { title: 'Markdown Previewer', url: '/text-tools/markdown-previewer', icon: Settings }
    ]
  },
  {
    title: 'Graphic Tools',
    url: '/graphic-tools',
    icon: Settings,
    children: [
      { title: 'Color Blindness Simulator', url: '/graphic-tools/color-blindness', icon: Settings },
      { title: 'Color Picker & Contrast Checker', url: '/graphic-tools/color-picker', icon: Settings },
      { title: 'PNG / JPEG Compressor', url: '/graphic-tools/compressor', icon: Settings },
      { title: 'Image Converter', url: '/graphic-tools/image-converter', icon: Settings }
    ]
  }
]
</script>

<template>
  <Sidebar>
    <SidebarContent>
      <template v-for="item in menuItems" :key="item.title">
        <Collapsible className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <a :href="item.url" class="flex items-center space-x-2">
                <component :is="item.icon" />
                <span>{{ item.title }}</span>
              </a>
            </SidebarGroupLabel>
            <SidebarGroupAction title="Add Project">
              <template v-if="item.children && item.children.length">
                <CollapsibleTrigger>
                  <ChevronDown
                    className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </template>
            </SidebarGroupAction>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <template v-for="child in item.children">
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a :href="child.url">
                          <component :is="child.icon" />
                          <span>{{ child.title }}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </template>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </template>
    </SidebarContent>
  </Sidebar>
</template>
