// src/composables/useFilteredMenuItems.ts
import { computed } from 'vue'
import { useSearchToolsQuery } from '@/composables/useSearchToolsQuery'
import { routeItems } from '@/constants/RouteItems'

export function useFilteredMenuItems() {
  const { searchQuery } = useSearchToolsQuery()

  const filteredMenuItems = computed(() => {
    return routeItems.map(item => {
      const matchesItem = item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          item.url === '/';
      const filteredChildren = item.children ? item.children.filter(child =>
        child.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        child.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        child.url === '/'
      ) : [];
      if (matchesItem || filteredChildren.length > 0) {
        return {
          ...item,
          children: filteredChildren
        };
      }
      return null;
    }).filter(item => item !== null);
  })

  return {
    filteredMenuItems
  }
}
