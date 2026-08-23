<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApiData } from '../composables/useApiData.js'
import { useDocumentHead } from '../composables/useDocumentHead.js'

const route = useRoute()

const { currentLang, fetchLangData } = useApiData()
const { setHeadFromPage } = useDocumentHead()

const pages = ref([])
const contents = ref([])
const pageWithContent = ref([])

async function fetchData() {
  const data = await fetchLangData(['page.json', 'pageContain.json'])
  if (!data) return
  const [pageData, contentData] = data

  pages.value = pageData
  contents.value = contentData

  // Filtrer la page correspondant à la route
  const currentPages = pages.value.filter(p => p.nom === route.name)

  // Fusionner contenu avec les items associés
  pageWithContent.value = currentPages.map(page => ({
    ...page,
    items: contents.value.filter(c => c.pageId === page.id)
  }))

  setHeadFromPage(pageWithContent.value[0], route.name)
}

onMounted(fetchData)
watch(currentLang, fetchData)


</script>

<template>
  <section v-for="page in pageWithContent" :key="page.id">
    <h1 class="text-5xl">{{ page.titre }}</h1>
    <article v-for="item in page.items.filter(i => i.type === 'mention')" :key="item.id">
      <section v-safe-html="item.texte" class="test text-start px-4 lg:px-80 text-2xl my-20">

      </section>

    </article>
  </section>
</template>
