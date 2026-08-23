<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLang } from '../composables/useLang.js'

const showLanguages = ref(false)
const { currentLang } = useLang()
const route = useRoute()
const router = useRouter()

function toggleLangMenu() {
  showLanguages.value = !showLanguages.value
}

function setLang(code) {
  // ES = langue par défaut, non préfixée (voir lib/i18n.js) : pas de
  // paramètre lang dans l'URL cible. La navigation déclenche
  // router.beforeEach -> setLangFromRoute, qui met à jour currentLang.
  const params = code === 'ES' ? {} : { lang: code.toLowerCase() }
  router.push({ name: route.name, params })
  showLanguages.value = false
}
</script>

<template>
  <aside
    class="fixed top-55 right-0 z-50 bg-galette p-2 rounded-s-sm flex flex-col gap-1.5 font-bold"
  >
    <!-- Bouton principal -->
    <p @click="toggleLangMenu" class="text-start cursor-pointer text-1xl" style="color: #FAE4CE">
      {{ currentLang }}
    </p>

    <!-- Transition des langues -->
    <Transition name="fade">
      <div v-if="showLanguages" class="flex flex-col gap-1">
        <a v-show="currentLang != 'ES'" @click.prevent="setLang('ES')" style="color: #FAE4CE">ES</a>
        <a v-show="currentLang != 'EN'" @click.prevent="setLang('EN')" style="color: #FAE4CE">EN</a>
        <a v-show="currentLang != 'FR'" @click.prevent="setLang('FR')" style="color: #FAE4CE">FR</a>
        <a v-show="currentLang != 'PG'" @click.prevent="setLang('PG')" style="color: #FAE4CE">PG</a>
      </div>
    </Transition>
  </aside>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
