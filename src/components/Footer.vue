<script setup>
import ReverseIcon from '../components/icon/reverse.vue';
import Instagram from '../components/icon/Instagram.vue';
import WhatApp from '../components/icon/WhatApp.vue';

import { ref, onMounted, watch } from 'vue'
import { useApiData } from '../composables/useApiData.js'

const { currentLang, fetchLangData } = useApiData()
const nav = ref([])

async function fetchData() {
  const data = await fetchLangData(['Navigation.json'])
  if (!data) return
  nav.value = data[0]
}


// Recalcul aussi au mount
onMounted(() => {
  fetchData()
})

watch(currentLang, fetchData)

</script>


<template>
    <footer>
        <section class="flex md:flex-row xs:flex-col py-8 px-10 2xl:px-80 ">
            <div class=" text-md xs:text-center  md:text-left basis-5/12 items-center">
                <ul  v-for="item in nav" :key="item.id" :to="item.lien">
                    <li> <router-link :to="item.lien">{{ item.titre }}</router-link></li>
                </ul>
            </div>
            <div class="md:py-3 flex flex-row basis-2/12 justify-center gap-2 xs:mt-5 md:mt-0">
                <a href="#"><Instagram/></a>
                <a href="https://wa.me/33749410994" target="_blank"><WhatApp/></a>
            </div>
            <div class="basis-5/12 flex flex-row items-center xs:justify-center md:justify-end xs:mt-5  md:mt-0">
              <div class=" flex flex-col">
                <a class="titre xs:text-2xl md:text-4xl text-white" href="/">La petite Bretagne</a>
                 <ul class="text-white mt-2">
                    <li>Tel : + 33 7 49 41 09 94 </li>
                    <li>Email : bzh.mdz@gmail.com</li>
                </ul>
                

              </div>
                
            </div>
        </section>
        <p class="mt-2 text-xs text-center" style="color: #FAE4CE;">YlGraphiste3D - Developpement Web - Copyright 2025</p>
    </footer>
</template>

