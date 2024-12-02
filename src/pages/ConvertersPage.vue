<script setup lang="ts">
import { ref, watch } from 'vue'
import AppTool from '@/components/ui/app-tool/AppTool.vue'
import { useFilteredMenuItems } from '@/composables/useFilteredMenuItems'
import type { MenuItem } from '@/router/index'

const { filteredMenuItems } = useFilteredMenuItems()
const childItems = ref<MenuItem[]>([])

watch(filteredMenuItems, (newValue) => {
  const convertersMenu = newValue.find(item => item.url === '/converters')
  childItems.value = convertersMenu ? convertersMenu.children : []
}, { immediate: true })

const updateGridColumns = () => {
  const svh = window.innerWidth / 200
  const columns = Math.min(Math.floor(svh), 5)
  document.documentElement.style.setProperty('--columns', columns.toString())
}

window.addEventListener('resize', updateGridColumns)
updateGridColumns()
</script>

<template>
  <main>
    <div class="tool-list">
      <AppTool
        v-for="child in childItems"
        :key="child.title"
        :title="child.title"
        :description="child.description"
        :icon="child.icon"
        :url="child.url"
      />
    </div>
  </main>
</template>

<style scoped>
:root {
  --columns: 4; /* Default value */
}

.tool-list {
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  gap: 16px;
}
</style>
