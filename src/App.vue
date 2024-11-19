<script setup lang="ts">
import { ref, watch } from 'vue'
import Cookies from 'js-cookie'
import { useRoute } from 'vue-router'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/ui/app-sidebar'
import { menuItems } from '@/constants/MenuItems'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { AppComponentGap } from '@/components/ui/app-component-gap'
import { ChevronRight, Sun, Moon } from 'lucide-vue-next'
import { ScrollArea } from '@/components/ui/scroll-area'

const route = useRoute()

const isDark = ref(Cookies.get('isDark') === 'true')

const kebabToPascal = (str: string) => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-')
}

function toggleTheme() {
  isDark.value = !isDark.value
}

watch(isDark, (newVal) => {
  const themeColorMetaTag = document.querySelector('meta[name="theme-color"]');
  if (themeColorMetaTag) {
    if (newVal) {
      document.body.classList.add('dark');
      themeColorMetaTag.setAttribute('content', '#000000');
    } else {
      document.body.classList.remove('dark');
      themeColorMetaTag.setAttribute('content', '#8f3403');
    }
    Cookies.set('isDark', newVal.toString());
  }
}, { immediate: true });

</script>

<template>
  <SidebarProvider>
    <AppSidebar :menuItems="menuItems" />
    <main class="content">
      <div class="router-page">
        <div class="menu">
          <SidebarTrigger class="w-fit h-full" />
          <ChevronRight class="w-4" />
          <Label for="title" class="title-label">
            {{ typeof route.name === 'string' ? kebabToPascal(route.name) : '' }}
          </Label>
          <Switch :checked="isDark" @update:checked="toggleTheme" class="ml-auto h-full">
            <template #thumb>
              <Moon v-if="isDark" class="app-icon h-full w-full justify-center p-0.5" />
              <Sun v-else class="app-icon h-full w-full justify-center p-0.5" />
            </template>
          </Switch>
        </div>
        <AppComponentGap size="large" />
        <ScrollArea class="h-[88svh]">
          <router-view />
        </ScrollArea>
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
  font-size: 16px; /* Increase the label size */
}

.menu {
  display: flex;
  align-items: center;
}

.ml-auto {
  margin-left: auto;
}
</style>
