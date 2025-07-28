<script setup>
import axios from 'axios'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLang } from '../composables/useLang.js'

const route = useRoute()

const { currentLang } = useLang()

const pages = ref([])
const contents = ref([])
const pageWithContent = ref([])

async function fetchData() {
  try {
    const base = `/data/${currentLang.value}`
    const [pageRes, contentRes] = await Promise.all([
      axios.get(`${base}/page.json`),
      axios.get(`${base}/pageContain.json`)
    ])

    pages.value = pageRes.data
    contents.value = contentRes.data

    // Filtrer la page correspondant à la route
    const currentPages = pages.value.filter(p => p.nom === route.name)

    // Fusionner contenu avec les items associés
    pageWithContent.value = currentPages.map(page => ({
      ...page,
      items: contents.value.filter(c => c.pageId === page.id)
    }))
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error)
  }
}

onMounted(fetchData)
watch(currentLang, fetchData)


</script>

<template>
  <section v-for="page in pageWithContent" :key="page.id">
    <h1 class="text-5xl">{{ page.titre }}</h1>
    <article v-for="item in page.items.filter(i => i.type === 'mention')" :key="item.id">
      <section v-html="item.texte" class="test text-start px-4 lg:px-80 text-2xl my-20">

      </section>

    </article>
  </section>
</template>
