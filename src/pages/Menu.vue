<script setup>
import { ref, onMounted, watch } from 'vue'
import Card from '../components/MenuCard.vue'
import Formulaire from '../components/Formulaire.vue'
import Pdf from '../components/icon/Pdf.vue'
import { useRoute } from 'vue-router'
import { useApiData } from '../composables/useApiData.js'
import { useDocumentHead } from '../composables/useDocumentHead.js'

const { currentLang, fetchLangData } = useApiData()
const { setHeadFromPage } = useDocumentHead()

const showForm = ref(false)

const categories = ref([])
const contenus = ref([])

const route = useRoute()

const pages = ref([])
const contents = ref([])
const pageWithContent = ref([])

const forms = ref([]);


const categoriesAvecContenus = ref([])


function openForm() {
  showForm.value = true
}

function closeForm() {
  showForm.value = false
}

function chunkItems(items, size = 5) {
  const result = []
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size))
  }
  return result
}



async function fetchData() {
  const data = await fetchLangData([
    'categorie.json',
    'carte.json',
    'page.json',
    'pageContain.json',
    'formulaire.json',
  ])
  if (!data) return
  const [catData, contentData, pageData, contentPageData, formData] = data

  categories.value = catData
  // CARTE
  contenus.value = contentData.sort((a, b) => a.order - b.order)

  pages.value = pageData
  contents.value = contentPageData

  forms.value = formData

  // Fusionner les contenus dans les catégories
  categoriesAvecContenus.value = categories.value.map(cat => ({
    ...cat,
    items: contenus.value.filter(item => item.catId === cat.id)
  }));

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
watch(currentLang, fetchData)
// Bloque le scroll de fond pendant que la modale du formulaire est ouverte
watch(showForm, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})


</script>

<template>
  <section v-for="page in pageWithContent" :key="page.id">
    <h1 class=" px-10 text-3xl font-bold">{{ page.titre }}</h1>

    <!--INTRO-->

    <section class=" bg-crepe/20 flex px-10 2xl:px-80 my-8 py-8 gap-5 items-center"
      v-for="item in page.items.filter(i => i.type === 'intro-menu')" :key="item.id">

      <div class=" lg:basis-1/2">
        <h3 class=" text-3xl lg:text-4xl text-start mb-8">{{ item.titre }}</h3>

        <p class=" text-start" v-safe-html="item.texte"></p>

      </div>

      <div class="lg:grid hidden grid-cols-2 gap-3 ms-50">
        <div>
          <img class=" object-cover w-50" src="/images/crepes.webp" alt="crepes">
        </div>
        <div>
          <img class=" object-cover w-50" src="/images/galette.webp" alt="galette">
        </div>
        <div>
          <img class=" object-cover w-50" src="/images/quiche.webp" alt="quiche">
        </div>
        <div>
          <img class=" object-cover w-50" src="/images/boissons.webp" alt="boissons">
        </div>
      </div>

    </section>

    <!-- ACCES FORMULAIRE EVENEMENT-->

    <section>

      <div>
        <button v-for="item in page.items.filter(i => i.type === 'event-bouton')" :key="item.id" @click="openForm"
          class=" bg-rougeLPB text-orange-100 my-5">
          <h4 class=" text-3xl">{{ item.titre }}</h4>
        </button>

      </div>

      <!-- Détail plein écran -->
      <Teleport to="body">
        <section v-if="showForm" class="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-auto bg-ardoise/40"
          role="dialog" aria-modal="true">
          <button @click="closeForm" class=" relative top-17 text-rougeLPB z-15">
            ✕
          </button>
          <div class="max-w-3xl w-full relative">

            <Formulaire v-for="item in forms.filter(i => i.type === 'evenement')" :key="item.id" :form="item" />
          </div>
        </section>
      </Teleport>


    </section>

    <h3 id="menu" v-for="item in page.items.filter(i => i.type === 'menu-pres')" :key="item.id" class=" text-5xl my-10">
      {{ item.titre }}</h3>

    <div class="block lg:hidden px-10">
      <section>


        <div class=" grid grid-cols-2 gap-x-4 gap-y-4 ">

          <Card v-for="cat in categoriesAvecContenus" :key="cat.id" :cat="cat" />
        </div>

      </section>

    </div>

    <!-- TELECHARGEMENT -->

    <section v-for="item in page.items.filter(i => i.type === 'download')" :key="item.id" class="mx-10">

      <button class="flex items-center gap-2 bg-rougeLPB text-orange-100 py-2 px-4 rounded my-15  m-auto ">
        <a :href="`/menu/${currentLang}/Menu.pdf`" download target="_blank" rel="noopener noreferrer"
          class="flex items-center gap-2">
          {{ item.titre }}
          <span>
            <Pdf />
          </span>
        </a>
      </button>
    </section>


    <!-- ZONE DESKTOP MENU -->

    <div class=" hidden md:flex border-t-3 mx-auto border-rougeLPB">
    </div>

    <article class="bg-ardoise px-10 2xl:px-40 py-20 lg:block hidden">
      <section v-for="(cat, index) in categoriesAvecContenus" :key="cat.id">
        <!-- Bloc image -->
        <div :id="'menu' + index" :class="[
          'flex items-center justify-center gap-25 mb-12 min-h-100',
          index % 2 === 1 ? 'flex-row-reverse' : 'flex-row'
        ]">

          <div>
            <img class="md:w-75 2xl:w-100 object-cover shadow mb-4 rounded-2xl" v-if="cat.image" :src="cat.image"
              :alt="cat.titre" />

          </div>




          <div class=" flex flex-col w-200 pb-5">

            <h3 class="text-crepe text-3xl lg:text-6xl mb-5 font-semibold text-start ">
              {{ cat.titre }}
            </h3>

            <!-- Bloc contenu en colonnes -->

            <div class=" flex flex-row gap-10">
              <div v-for="(chunk, i) in chunkItems(cat.items, 5)" :key="i">
                <ul class="text-crepe text-start menu-font ">
                  <li v-for="item in chunk" :key="item.id" class="mb-3">
                    <span class=" text-2xl">{{ item.titre }} - <span style="white-space: nowrap;">{{ item.prix
                    }}</span></span><br />
                    <span class=" text-galette italic text-2xl">{{ item.ingredient }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div class=" hidden md:flex border-t-3 w-25  border-rougeLPB">

            </div>

          </div>

        </div>



      </section>
    </article>



    <!--INSTAGRAM-->

    <section v-for="item in page.items.filter(i => i.type === 'instagram')" :key="item.id"
      class="bg-crepe/20 flex flex-row p-10 2xl:px-80 gap-10 items-center justify-center">

      <div>
        <img class=" w-75" v-if="item.images" :src="item.images" alt="Food truck La Petite Bretagne">
      </div>
      <div>
        <h3 class=" text-3xl text-start">{{ item.texte }}</h3>
      </div>

    </section>
  </section>
</template>

<style scoped>
.test {
  background-color: rgba(250, 228, 206, 0.8);
  padding: 0;
  width: 80%;
  border-radius: 15% 15% 0 0;
}
</style>
