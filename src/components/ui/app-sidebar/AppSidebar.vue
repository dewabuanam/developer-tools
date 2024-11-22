<script setup lang='ts'>
import { useRouter } from 'vue-router'
import {
  Sidebar,
  SidebarContent,
  SidebarMenuSub,
  SidebarMenuButton,
  SidebarMenuSubItem, SidebarMenu, SidebarMenuItem, SidebarHeader, SidebarFooter
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-vue-next'
import type { PropType } from 'vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import logo from '@/assets/logo.png'
import { Label } from 'radix-vue'
import { version } from '@/../package.json'

defineProps({
  menuItems: {
    type: Array as PropType<Array<any>>,
    required: true
  }
})

const router = useRouter()

const navigateTo = (url: string) => {
  router.push(url)
}
</script>

<template>
  <Sidebar>
    <ScrollArea class="h-[100svh] rounded-md">
      <SidebarHeader class="flex flex-col ">
        <Label
          class="app-sidebar-text text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 logo-text ">
          Developer Tools</Label>

        <Label
          class="app-sidebar-text text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 description-text ">
          by FoxSensei</Label>
        <Avatar size="xxl" class="avatar-margin-top justify-center bg-transparent" shape="square">
          <AvatarImage :src="logo" alt="@radix-vue" class="object-center" />
        </Avatar>
      </SidebarHeader>
      <SidebarContent class="p-3">
        <template v-for="item in menuItems" :key="item.title">
          <SidebarMenu>
            <Collapsible className="group/collapsible">
              <SidebarMenuItem>
                <template v-if="item.children && item.children.length > 0">
                  <CollapsibleTrigger asChild @click="navigateTo(item.url)">
                    <SidebarMenuButton class="app-sidebar-button">
                      <div class="flex items-center space-x-2 cursor-pointer">
                        <component :is="item.icon" class="w-5 h-5 app-sidebar-icon" />
                        <span class="title-text font-medium app-sidebar-label">{{ item.title }}</span>
                      </div>
                      <ChevronDown
                        class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 app-sidebar-icon" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </template>
                <template v-else>
                  <SidebarMenuButton @click="navigateTo(item.url)" class="app-sidebar-button">
                    <div class="flex items-center space-x-2 cursor-pointer">
                      <component :is="item.icon" class="w-5 h-5 app-sidebar-icon" />
                      <span class="title-text font-medium app-sidebar-label">{{ item.title }}</span>
                    </div>
                  </SidebarMenuButton>
                </template>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <template v-for="child in item.children">
                      <SidebarMenuSubItem>
                        <SidebarMenuButton class="app-sidebar-button" asChild>
                          <div @click="navigateTo(child.url)" class="cursor-pointer">
                            <component :is="child.icon" class="app-sidebar-icon" />
                            <span class="font-medium app-sidebar-label">{{ child.title }}</span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    </template>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </template>
      </SidebarContent>
    </ScrollArea>
    <SidebarFooter>
      <Label
        class="app-sidebar-text justify-end text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 description-text text-right">
        v{{ version }}
      </Label>
    </SidebarFooter>
  </Sidebar>
</template>

<style scoped>
.title-text {
  font-size: 0.9rem; /* Adjust the size as needed */
}

.logo-text {
  font-size: 1.1rem; /* Adjust the size as needed */
}

.description-text {
  font-size: 0.9rem; /* Adjust the size as needed */
}

.avatar-margin-top {
  margin-top: -20px; /* Adjust the margin as needed */
}
</style>
