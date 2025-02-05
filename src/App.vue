<script setup lang="ts">
import { useFilteredMenuItems } from '@/composables/useFilteredMenuItems'
import { ref, watch } from 'vue'
import Cookies from 'js-cookie'
import { useRoute } from 'vue-router'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/ui/app-sidebar'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { AppComponentGap } from '@/components/ui/app-component-gap'
import { ChevronRight, Sun, Moon } from 'lucide-vue-next'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import logo from '@/assets/logo.png'
import { Card } from '@/components/ui/card'
import { Toaster } from '@/components/ui/toast'
import { useSearchToolsQuery } from '@/composables/useSearchToolsQuery'

const route = useRoute()
const { searchQuery, setSearchQuery } = useSearchToolsQuery()
const { filteredMenuItems } = useFilteredMenuItems()

const isDark = ref(Cookies.get('theme_isDark') === 'true')

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
  const themeColorMetaTag = document.querySelector('meta[name="theme-color"]')
  if (themeColorMetaTag) {
    if (newVal) {
      document.body.classList.add('dark')
      themeColorMetaTag.setAttribute('content', '#000000')
    } else {
      document.body.classList.remove('dark')
      themeColorMetaTag.setAttribute('content', '#8f3403')
    }
    Cookies.set('theme_isDark', newVal.toString())
  }
}, { immediate: true })

const localSearchQuery = ref(searchQuery.value)

watch(localSearchQuery, (newQuery) => {
  setSearchQuery(newQuery)
})
</script>

<template>
  <SidebarProvider>
    <AppSidebar :menuItems="filteredMenuItems" v-model:searchQuery="localSearchQuery" />
    <main class="content">
      <Toaster/>
      <div class="router-page">
        <Card :class="['cursor-pointer shadow-lg backdrop-blur ring-0.5 ring-black', { 'app-menu': !isDark }]">
          <div class="menu p-2 rounded-md">
            <SidebarTrigger class="w-fit h-full" />
            <ChevronRight class="w-4" />
            <Avatar @click="$router.push('/')"  size="base" class="avatar-margin-top justify-center bg-transparent" shape="square">
              <AvatarImage :src="logo" alt="@radix-vue" class="object-center" />
            </Avatar>
            <div class="flex-col">
              <Label for="title" class="title-label">
                {{ typeof route.name === 'string' ? kebabToPascal(route.name) : '' }}
              </Label>
              <p v-if="route.meta.description">
                {{ route.meta.description }}
              </p>
            </div>
            <Switch :checked="isDark" @update:checked="toggleTheme"
                    class="ml-auto h-full ">
              <template #thumb>
                <Moon v-if="isDark" class="accent-white h-full w-full justify-center p-0.5" />
                <Sun v-else class="app-icon h-full w-full justify-center p-0.5" />
              </template>
            </Switch>
          </div>
        </Card>
        <ScrollArea class="h-[87.3svh]">
          <AppComponentGap size="large" />
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
  font-size: 20px; /* Increase the label size */
}

.menu {
  display: flex;
  align-items: center;
}

.ml-auto {
  margin-left: auto;
}
.description-text {
  font-size: 14px;
  color: #ddd;
}
.avatar-cut {
  clip-path: inset(0 0 25% 0);
  align-self: flex-end;
}
</style>
