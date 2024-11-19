<script setup lang='ts'>
import { useRouter } from 'vue-router'
import {
  Sidebar,
  SidebarContent,
  SidebarMenuSub,
  SidebarMenuButton,
  SidebarMenuSubItem, SidebarMenu, SidebarMenuItem, SidebarHeader
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-vue-next'
import type { PropType } from 'vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import logo from '@/assets/logo.png'
import { Label } from 'radix-vue'
import { version } from '@/../package.json'
import { cn } from '@/lib/utils'

const props = defineProps({
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
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 logo-text ">
          Developer Tools</Label>

        <Label
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 description-text ">
          v{{ version }}</Label>
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
                    <SidebarMenuButton>
                      <div class="flex items-center space-x-2 cursor-pointer">
                        <component :is="item.icon" class="w-5 h-5" />
                        <span class="title-text font-medium">{{ item.title }}</span>
                      </div>
                      <ChevronDown
                        class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </template>
                <template v-else>
                  <SidebarMenuButton @click="navigateTo(item.url)">
                    <div class="flex items-center space-x-2 cursor-pointer">
                      <component :is="item.icon" class="w-5 h-5" />
                      <span class="title-text font-medium">{{ item.title }}</span>
                    </div>
                  </SidebarMenuButton>
                </template>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <template v-for="child in item.children">
                      <SidebarMenuSubItem>
                        <SidebarMenuButton asChild>
                          <div @click="navigateTo(child.url)" class="cursor-pointer">
                            <component :is="child.icon" />
                            <span class="font-medium">{{ child.title }}</span>
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
  margin-top: -30px; /* Adjust the margin as needed */
}
</style>
