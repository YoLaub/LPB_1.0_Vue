<script setup>
import ImageCarousel from '../components/ImageCarousel.vue';

import axios from 'axios'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLang } from '../composables/useLang.js'

const route = useRoute()

const { currentLang  } = useLang()

const pages = ref([])
const contents = ref([])
const pageWithContent = ref([])

async function fetchData() {
  try {
    const base = `/data/${currentLang .value}`
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
watch(currentLang , fetchData)


</script>

<template>

  <div v-for="page in pageWithContent" :key="page.id">

    <section class=" flex justify-center items-center gap-6
  my-10 xs:px-10">
      <img class=" object-cover w-25 lg:w-50" src="/images/breton.png" alt="drapeau breton">
      <h1 class=" text-3xl lg:text-6xl font-bold">{{ page.navigation }}</h1>
      <img class=" object-cover w-25 lg:w-50" src="/images/mendoza.jpg" alt="drapeau mendoza">
    </section>

    <section v-for="item in page.items.filter(i => i.type === 'nostra-concept')" :key="item.id"
      class="lg:h-100 bg-ardoise concept mt-10 px-10 2xl:px-50 flex flex-wrap items-center">
      <div class=" flex-auto lg:flex-2/4 lg:py-10 2xl:ps-60">
        <h2 class="py-4 text-start ">{{ item.titre }}</h2>
        <p class="text-start" v-safe-html="item.texte"></p>
      </div>

      <div class=" py-10 flex-auto lg:flex-2/4">
        <ImageCarousel />
      </div>

    </section>

    <section v-for="item in page.items.filter(i => i.type === 'mission')" :key="item.id"
      class="lg:h-100 bg-crepe/20 px-10 2xl:px-50 flex flex-wrap lg:flex-row-reverse items-center">
      <div class=" flex-auto lg:flex-2/4 lg:py-10 2xl:pe-60">
        <h2 class=" py-4 text-start">{{ item.titre }}</h2>
        <p class=" text-start" v-safe-html="item.texte"></p>
      </div>

      <div class="  py-10 flex-auto lg:flex-2/4">
        <img class=" object-cover w-75 m-auto" v-if="item.images" :src="item.images" alt="Foodtruck">

      </div>


    </section>

    <section v-for="item in page.items.filter(i => i.type === 'valeur')" :key="item.id" class=" my-10 px-10 2xl:px-50 flex flex-wrap items-center">
      <div class="  flex-auto lg:flex-2/4 lg:py-10 2xl:ps-60">
        <h2>{{ item.titre }}</h2>
        <p class=" text-start pb-10" v-safe-html="item.texte"></p>
      </div>


      <div class="  py-10 flex-auto lg:flex-2/4">
        <img v-if="item.images" class="m-auto w-75 object-cover " :src="item.images" alt="Décor breton">
      </div>
    </section>

  </div>


</template>

<style scoped>

.concept p,
.concept h2 {
  color: #FAE4CE;
}

</style>
