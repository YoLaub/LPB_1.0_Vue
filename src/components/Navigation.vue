<script setup>
import { ref, reactive, onMounted, watchEffect, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApiData } from '../composables/useApiData.js'
import { useLocalizedPath } from '../composables/useLocalizedPath.js'

const route = useRoute()
const { currentLang, fetchLangData } = useApiData()
const { lp } = useLocalizedPath()
const nav = ref([])
const selectNav = ref([])

const navRefs = reactive({})


async function fetchData() {
  const data = await fetchLangData(['Navigation.json'])
  if (!data) return
  nav.value = data[0]

  // Filtrer la page correspondant à la route
  selectNav.value = nav.value.filter(p => p.Type === "principal")
}

const svgLeft = ref('0px')
const updateSvgPosition = () => {
  const currentRef = navRefs[route.name]

  if (currentRef) {
    const rect = currentRef.getBoundingClientRect()
    // On centre le SVG sous le lien
    const centerX = rect.right - rect.width / 2
    const svgWidth = 34 // largeur du SVG
    svgLeft.value = `${centerX - svgWidth}px`
  }
}

// Recalculer à chaque changement de route
watchEffect(() => {
  if (!route.name || !navRefs[route.name]) return

  nextTick(() => updateSvgPosition())
})



onMounted(async () => {
  await fetchData()
  await nextTick() // attend que le DOM avec v-for soit en place
  updateSvgPosition()

  window.addEventListener('resize', updateSvgPosition)
})


watch(currentLang, fetchData)
</script>

<template>
  <div>
    <nav class="bg-crepe/20 p-4 flex rounded-sm mx-6 text-center">
      <router-link v-for="item in selectNav" :key="item.id" :to="lp(item.lien)" class="basis-1/3 text-center p-1">
        <span class="inline-block w-full" :ref="el => {
          if (el && item.cible) {
            navRefs[item.cible] = el
          }
        }">
          {{ item.titre }}
        </span>
      </router-link>
    </nav>

    <div class="relative h-6 mx-6 p-3 border-b-4 border-red-600 overflow-hidden">
      <svg class="absolute bottom-0 fill-red-600 transition-all duration-300" width="24" height="24" viewBox="0 0 24 24"
        :style="{ left: svgLeft }">
        <path d="M1 21h22L12 2" />
      </svg>
    </div>
  </div>
</template>
