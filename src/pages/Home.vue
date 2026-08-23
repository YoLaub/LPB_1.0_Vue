<script setup>
import Concept from '../components/Concept.vue'
import MenuButton from '../components/MenuButton.vue'
import Geoloc from '../components/Geolocalisation.vue'

import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApiData } from '../composables/useApiData.js'
import { useDocumentHead } from '../composables/useDocumentHead.js'

const route = useRoute()

const showInfo = ref(false)

const { currentLang, error: fetchError, fetchLangData } = useApiData()
const { setHeadFromPage } = useDocumentHead()
const pages = ref([])
const contents = ref([])
const pageWithContent = ref([])

const selectedCategory = ref(null)

const categories = ref([])

async function fetchData() {
  const data = await fetchLangData(['page.json', 'pageContain.json', 'categorie.json'])
  if (!data) return
  const [pageData, contentData, catData] = data

  pages.value = pageData
  contents.value = contentData
  categories.value = catData

  // Filtrer la page correspondant à la route
  const currentPages = pages.value.filter(p => p.nom === route.name)

  // Fusionner contenu avec les items associés
  pageWithContent.value = currentPages.map(page => ({
    ...page,
    items: contents.value.filter(c => c.pageId === page.id)
  }))

  setHeadFromPage(pageWithContent.value[0])
}

onMounted(fetchData)
watch(currentLang, fetchData,)


</script>

<template>
  <section v-for="page in pageWithContent" :key="page.id">
    <h1 class=" text-2xl lg:text-3xl font-bold px-10">{{ page.titre }}</h1>

    <!--INTRO-->
    <section class=" bg-crepe/20 my-8  py-8 lg:py-0 px-10 xl:px-50 flex flex-wrap items-center">
      <Concept v-for="item in page.items.filter(i => i.type === 'concept')" :key="item.id" :cat="item" />
    </section>

    <!--ACCES MENU-->
    <div class="md:hidden lg:mt-24 px-10 lg:px-150">
      <MenuButton v-for="item in page.items.filter(i => i.type === 'menu')" :key="item.id" :cat="item" />
    </div>

    <div>
      <h2 v-for="item in page.items.filter(i => i.type === 'acces-menu')" :key="item.id"
        class="hidden md:block text-center">{{ item.titre }}</h2>

    </div>


  <!--MENU-->
    <section class="hidden md:flex my-25 mx-auto px-10 xl:px-50 flex-wrap items-center gap-4 max-w-fit">

      <article @click="showInfo = false" @mouseleave="showInfo = false" id="infoDetail" :class="[
        'absolute transition-transform duration-500 ease-in-out z-150',
        showInfo ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 '
      ]">

        <img v-if="selectedCategory?.image" class="image-menu object-cover " :src="selectedCategory.image"
          :alt="selectedCategory.titre">


        <div class=" absolute">
          <div v-for="item in page.items.filter(i => i.type === 'menu')" :key="item.id"
            class=" relative z-150 left-65 bottom-70">
            <button class=" bg-rougeLPB rounded-sm buttonMenu">
              <h3 v-if="selectedCategory?.hash" class=" text-3xl text-orange-100"> <router-link
                  :to="{ path: '/menu_et_prestation', hash: selectedCategory.hash }">{{
                    item.titre }}</router-link></h3>
            </button>
          </div>
        </div>
      </article>

      <section v-for="cat in categories" :key="cat.id">

        <div class="relative cursor-pointer w-40 lg:w-50"
          @click="() => { selectedCategory = cat; showInfo = true}">
          <img class="  w-50 aspect-portrait object-cover" v-if="cat.image" :src="cat.image" :alt="cat.titre">
          <div class=" absolute top-1/2 bg-stone-900/35 w-full py-4">
            <h3 class=" text-2xl text-white">{{ cat.titre }}</h3>
          </div>
        </div> 

      </section>

    </section>

    <div class=" hidden md:flex border-t-3 w-40 mx-auto mb-25 border-rougeLPB">

    </div>

     <!--GEOLOCALISTAION-->

    <section class="lg:h-100 bg-ardoise concept mt-10 px-10 2xl:px-50 flex flex-wrap items-center">
      <Geoloc v-for="item in page.items.filter(i => i.type === 'geoloc')" :key="item.id" :item="item"/>

    </section>

      <!--ACCES EVENEMENT-->

    <section v-for="item in page.items.filter(i => i.type === 'event')" :key="item.id"
      class=" flex md:flex-row flex-warp px-10 2xl:px-80 gap-20 items-center my-20">

      <img class="hidden lg:flex w-80 rounded-2xl object-cover " v-if="item.images" :src="item.images" alt="Notre voyage">
      <div class=" flex flex-col gap-15">
        <div>
          <h3 class=" text-3xl text-start mb-4">{{ item.titre }}</h3>
          <p class=" text-start" v-safe-html="item.texte"></p>

        </div>

        <div class="2xl:ms-110" v-for="item in page.items.filter(i => i.type === 'event-bouton')" :key="item.id">

          <button class=" bg-crepe/20 rounded-sm buttonMenu">
            <h4 class=" text-3xl lg:text-2xl"> <router-link to="/menu_et_prestation">{{ item.titre }}</router-link></h4>
          </button>

        </div>
      </div>
    </section>

    <!--INSTAGRAM-->
    <section v-for="item in page.items.filter(i => i.type === 'instagram')" :key="item.id" class=" bg-crepe/20 flex flex-row p-10 2xl:px-80 gap-10 items-center justify-center">

      <div>
        <img class=" w-120 lg:w-75" v-if="item.images" :src="item.images" alt="Food truck La Petite Bretagne">
      </div>
      <div >
        <h3 class=" text-3xl text-start">{{ item.texte }}</h3>
      </div>

    </section>
  </section>
</template>

<style scoped>
.menu {
  margin-top: 100px;
  margin-bottom: 100px;
}

.image-menu {
  position: relative;
  width: 848px;
  height: 536px;
}
</style>
