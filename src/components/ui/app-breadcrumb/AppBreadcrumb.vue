<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Slash } from 'lucide-vue-next'
import { defineProps } from 'vue'

const props = defineProps<{
  links: { key: string; value: string; display: string }[]
}>()
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem v-for="(link, index) in links" :key="link.key">
        <BreadcrumbLink :href="link.value">
          {{ link.display }}
        </BreadcrumbLink>
        <BreadcrumbSeparator v-if="index < links.length - 1">
          <Slash />
        </BreadcrumbSeparator>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</template>
