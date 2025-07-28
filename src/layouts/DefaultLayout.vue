<template>
    <div>
        <img src="/images/fond2.webp" alt="fond" class=" object-cover -z-10 fixed right-auto left-1/12 lg:left-2/6 opacity-20"  :style="{
        width: `${1000 - scrollY /8}px`,
        transition: 'width 0.2s ease',
      }">
        <Header />
        <main class="min-h-screen pt-8 ">
            <Reseau/>
            <Language />
            <router-view />
            <div>
                <Up />
            </div>
        </main>

        <Footer/>
    </div>
</template>

<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import Up from '../components/icon/Up.vue';
import Reseau from '../components/ReseauComponent.vue';
import Language from '../components/Language.vue';

import { ref, onMounted, onUnmounted } from 'vue'

const scrollY = ref(0)

const handleScroll = () => {
  scrollY.value = window.scrollY
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>