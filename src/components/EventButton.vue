<template>
    <button class=" bg-crepe/20 rounded-sm buttonMenu">
        <h4 class=" text-3xl lg:text-2xl"> <router-link to="/menu_et_prestation">{{ cat.titre }}</router-link></h4>
    </button>
</template> 

<script setup>

defineProps({
  cat: Object
})

</script> 

