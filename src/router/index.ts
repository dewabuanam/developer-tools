import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { routeItems } from '@/constants/RouteItems'

const routes: RouteRecordRaw[] = []

export interface MenuItem {
  title: string
  url: string
  icon: any
  description: string
  component: any
  children?: MenuItem[]
}

const addRoutes = (items: MenuItem[]) => {
  items.forEach((item: MenuItem) => {
    routes.push({
      path: item.url,
      name: item.title,
      component: item.component,
      meta: { description: item.description },
    })
    if (item.children) {
      addRoutes(item.children)
    }
  })
}

addRoutes(routeItems)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
