<template>
    <button class=" bg-rougeLPB rounded-sm buttonMenu">
        <h3 class=" text-3xl text-orange-100"> <router-link :to="{path: '/menu_et_prestation', hash: '#menu'}">{{ cat.titre }}</router-link></h3>
    </button>
</template>

<script setup>

defineProps({
  cat: Object
})

</script> 