<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/ui/appsidebar'
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarTrigger />
    <main class="content">
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
