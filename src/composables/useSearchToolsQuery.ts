// src/composables/useSearchToolsQuery.ts
import { ref, computed } from 'vue'

const searchQuery = ref('')

export function useSearchToolsQuery() {
  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const getSearchQuery = computed(() => searchQuery.value)

  return {
    searchQuery: getSearchQuery,
    setSearchQuery,
  }
}
