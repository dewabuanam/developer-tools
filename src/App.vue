// src/App.vue
<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/ui/app-sidebar'
import { useRoute } from 'vue-router'
import { menuItems } from '@/constants/MenuItems'

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
</style>
