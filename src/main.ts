import './styles/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

router.beforeEach((to, from, next) => {
  document.title = `${String(to.name)} - Developer Tools by FoxSensei`;
  next();
});

app.use(router)

app.mount('#app')
