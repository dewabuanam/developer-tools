<script setup lang="ts">
import { menuItems } from '@/constants/MenuItems';
import AppTool from '@/components/ui/app-tool/AppTool.vue';

const formattersMenu = menuItems.find(item => item.url === '/formatters');
const formattersChildren = formattersMenu ? formattersMenu.children : [];
</script>

<template>
  <main>
    <div class="tool-list">
      <AppTool
        v-for="child in formattersChildren"
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
.tool-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  overflow-y: auto;
  max-height: 80vh;
  padding: 16px;
}
</style>
