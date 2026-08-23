<template>
  <div class=" flex-auto lg:flex-2/4 lg:p-20">
    <h2>{{ cat.titre }}</h2>
    <p class=" text-start" v-safe-html="cat.texte"></p>
  </div>

  <div class=" flex-auto lg:flex-2/4 mt-8 lg:p-20">
    <img v-if="cat.images" class="aspect-video object-cover" :src="cat.images" alt="Décor breton">
  </div>
</template>

<script setup>

defineProps({
  cat: Object
})

</script>