<script setup lang='ts'>
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
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
</script>

<template>
  <Sidebar>
    <SidebarContent>
      <template v-for="item in menuItems" :key="item.title">
        <Collapsible className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <a :href="item.url" class="flex items-center space-x-2">
                <component :is="item.icon" />
                <span>{{ item.title }}</span>
              </a>
            </SidebarGroupLabel>
            <SidebarGroupAction title="Add Project">
              <template v-if="item.children && item.children.length">
                <CollapsibleTrigger>
                  <ChevronDown
                    className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </template>
            </SidebarGroupAction>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <template v-for="child in item.children">
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <a :href="child.url">
                          <component :is="child.icon" />
                          <span>{{ child.title }}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </template>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </template>
    </SidebarContent>
  </Sidebar>
</template>
