<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/ui/app-sidebar'
import { useRoute } from 'vue-router'
import { menuItems } from '@/constants/MenuItems'
import { Label } from '@/components/ui/label'
import { AppComponentGap } from '@/components/ui/app-component-gap'

const route = useRoute()

const kebabToPascal = (str: string) => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-')
}
</script>

<template>
  <SidebarProvider>
    <AppSidebar :menuItems="menuItems" />
    <SidebarTrigger />
    <main class="content">
      <div class="router-page">
        <Label for="title" class="title-label">{{ kebabToPascal(route.name) }}</Label>
        <AppComponentGap size="large"/>
        <router-view />
      </div>
    </main>
  </SidebarProvider>
</template>

<style scoped>
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.router-page {
  gap: 16px;
  padding: 16px;
}

.title-label {
  font-size: 24px; /* Increase the label size */
  font-weight: bold; /* Make the label bold */
}
</style>
