import { createApp } from 'vue'
import './style.css'
import './tailwing.css'
import router from './router'
import App from './App.vue'
import safeHtml from './directives/safeHtml'

createApp(App).use(router).directive('safe-html', safeHtml).mount('#app')
