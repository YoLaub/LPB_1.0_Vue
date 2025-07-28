<template>
  <div>
    <!-- Carte visible dans la liste -->
    <div
      class="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
      @click="openDetail">
      <img :src="cat.image" alt="" class="w-full h-48 object-cover" />
      <div class="p-4">
        <h3 class=" text-3xl font-semibold">{{ cat.titre }}</h3>
      </div>
    </div>

    <!-- Détail plein écran -->
    <Teleport to="body">
      <transition name="zoom">
        <div v-if="showDetail"
          class="fixed inset-0 bg-ardoise  z-50 flex items-center justify-center p-10 overflow-auto">
          <div class="max-w-3xl w-full relative flex flex-col">

            <div class="relative">
              <img class=" object-cover aspect-video my-4 " v-if="cat.image" :src="cat.image" :alt="cat.titre">
              <div class=" absolute top-1/2 bg-ardoise/80 w-full py-4">
                <h3 class=" text-3xl text-crepe text-center">{{ cat.titre }}</h3>
              </div>
            </div>


            <ul class="mt-4 space-y-2 menu-font">
              <li v-for="item in cat.items" :key="item.id" class=" md:text-lg ">
                <strong class=" text-crepe ">{{ item.titre }} – {{ item.prix }}</strong> <br><span
                  class=" text-galette "> {{ item.ingredient || "" }}</span>
              </li>
            </ul>

            <button @click="closeDetail" class=" text-rougeLPB mx-30 px-2 py-1 rounded">
              {{ cat.autre_1 }}
            </button>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  cat: Object
})

const showDetail = ref(false)

function openDetail() {
  showDetail.value = true
}

function closeDetail() {
  showDetail.value = false
}

</script>

<style scoped>
.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.3s ease;
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
