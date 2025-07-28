<script setup>
import Instagram from '../components/icon/Instagram.vue';
import WhatApp from '../components/icon/WhatApp.vue';
import Download from '../components/icon/Download.vue';
import { useLang } from '../composables/useLang.js'

const { currentLang } = useLang()
</script>

<template>
    <aside  class="fixed top-10 right-0 z-50 bg-galette p-2 rounded-s-sm flex flex-col gap-2">
        <a href="#"><Instagram/></a>
        <a href="https://wa.me/33749410994" target="_blank"><WhatApp/></a>
        <router-link :to="{ path: '/menu_et_prestation', hash: '#menu' }"><span class="[writing-mode:vertical-rl]" style="color: #FAE4CE;" >Menu</span></router-link>
    </aside>
</template>