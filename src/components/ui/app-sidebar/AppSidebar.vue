<script setup lang='ts'>
import { useRouter } from 'vue-router'
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

const router = useRouter()

const navigateTo = (url: string) => {
  router.push(url)
}
</script>

<template>
  <Sidebar>
    <SidebarContent>
      <template v-for="item in menuItems" :key="item.title">
        <Collapsible className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <div @click="navigateTo(item.url)" class="flex items-center space-x-2 cursor-pointer">
                <component :is="item.icon" />
                <span>{{ item.title }}</span>
              </div>
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
                        <div @click="navigateTo(child.url)" class="cursor-pointer">
                          <component :is="child.icon" />
                          <span>{{ child.title }}</span>
                        </div>
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
