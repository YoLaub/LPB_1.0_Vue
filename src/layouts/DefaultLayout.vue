<template>
    <div>
        <img src="/images/fond2.webp" alt="" class="object-cover w-[1000px] -z-10 fixed right-auto left-1/12 lg:left-2/6" :style="{
        transform: `translate3d(0, ${scrollY * 0.15}px, 0) scale(${phareScale})`,
        opacity: phareOpacity,
        transformOrigin: 'center top',
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

import { ref, computed, onMounted, onUnmounted } from 'vue'

const scrollY = ref(0)
let ticking = false

// Le phare s'éloigne au fil du scroll : il rétrécit et s'estompe,
// comme si on le laissait derrière soi, en plus du décalage vertical (parallax).
const phareScale = computed(() => Math.max(1 - scrollY.value * 0.00035, 0.55))
const phareOpacity = computed(() => Math.max(0.2 - scrollY.value * 0.00025, 0.04))

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