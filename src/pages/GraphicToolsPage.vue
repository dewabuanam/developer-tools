<script setup lang="ts">
import { menuItems } from '@/constants/MenuItems';
import AppTool from '@/components/ui/app-tool/AppTool.vue';
import { ScrollArea } from '@/components/ui/scroll-area'

const graphicToolsMenu = menuItems.find(item => item.url === '/graphic-tools');
const childItems = graphicToolsMenu ? graphicToolsMenu.children : [];

const updateGridColumns = () => {
  const svh = window.innerWidth / 200;
  const columns = Math.min(Math.floor(svh), 5);
  document.documentElement.style.setProperty('--columns', columns.toString());
}

window.addEventListener('resize', updateGridColumns);
updateGridColumns();
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
