// src/App.vue
<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/ui/appsidebar'
import AppBreadcrumb from '@/components/ui/app-breadcrumb/AppBreadcrumb.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { menuItems } from '@/constants/MenuItems'

const route = useRoute()

const kebabToPascal = (str: string) => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-')
}

const breadcrumbLinks = computed(() => {
  const links: Array<{ key: string; value: string; display: string }> = []
  let currentPath = ''
  route.path.split('/').filter(Boolean).forEach(segment => {
    currentPath += `/${segment}`
    links.push({
      key: segment,
      value: currentPath,
      display: kebabToPascal(segment)
    })
  })
  return links
})
</script>

<template>
  <SidebarProvider>
    <AppSidebar :menuItems="menuItems" />
    <SidebarTrigger />
    <main class="content">
      <AppBreadcrumb :links="breadcrumbLinks" />
      <h1>{{route.name}}</h1>
      <router-view />
    </main>
  </SidebarProvider>
</template>

<style scoped>
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
