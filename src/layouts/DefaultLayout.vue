<template>
    <div>
        <img src="/images/fond2.webp" alt="" class="object-cover w-[1000px] -z-10 fixed right-auto left-1/12 lg:left-2/6 opacity-20" :style="{
        transform: `translate3d(0, ${scrollY * 0.15}px, 0)`,
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
let ticking = false

const handleScroll = () => {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    scrollY.value = window.scrollY
    ticking = false
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>