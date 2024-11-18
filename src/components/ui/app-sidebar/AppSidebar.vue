<script setup lang='ts'>
import { useRouter } from 'vue-router'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarMenuSub,
  SidebarMenuButton,
  SidebarMenuSubItem, SidebarMenu, SidebarMenuItem
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-vue-next'
import type { PropType } from 'vue'

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
    <SidebarContent class="gap-0">
      <template v-for="item in menuItems" :key="item.title">
        <SidebarMenu>
          <Collapsible className="group/collapsible">
            <SidebarMenuItem>
              <template v-if="item.children && item.children.length > 0">
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <div @click="navigateTo(item.url)" class="flex items-center space-x-2 cursor-pointer">
                      <component :is="item.icon" />
                      <span class="title-text">{{ item.title }}</span>
                    </div>
                    <ChevronDown class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </template>
              <template v-else>
                <SidebarMenuButton>
                  <div @click="navigateTo(item.url)" class="flex items-center space-x-2 cursor-pointer">
                    <component :is="item.icon" />
                    <span class="title-text">{{ item.title }}</span>
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
                            <span>{{ child.title }}</span>
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
  </Sidebar>
</template>

<style scoped>
.title-text {
  font-size: 1rem; /* Adjust the size as needed */
}
</style>
