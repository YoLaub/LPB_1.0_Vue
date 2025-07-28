<template>
    <div class=" flex flex-col my-5">
        <router-link to="/"><img class="logo w-60 m-auto" src="/images/LogoSite.png" alt="Le Logo"></router-link>
    </div>
    <div>
        <Navigation />
    </div>
</template>

<script setup>
import Navigation from '../components/Navigation.vue';
import ReverseIcon from '../components/icon/reverse.vue';
</script>

<style scoped>

a:hover {
  scale: 1;
}
</style>