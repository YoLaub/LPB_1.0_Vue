<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation'
import 'swiper/css/pagination'; // 👈 essentiel pour les points

import { Navigation, Pagination } from 'swiper/modules';

const images = [
  { src: '/images/cote_bretonne.webp', alt: 'Côte bretonne' },
  { src: '/images/cote_bretonne_2.webp', alt: 'Côte bretonne' },
  { src: '/images/saint-goustan.webp', alt: 'Port de Saint-Goustan, Bretagne' },
  { src: '/images/bigoudenes.webp', alt: 'Coiffe bigoudène traditionnelle' },
  { src: '/images/sosneado.webp', alt: 'Volcán El Sosneado, Mendoza' },
  { src: '/images/vignes.webp', alt: 'Vignobles de Mendoza' },
  { src: '/images/mountain.webp', alt: 'Cordillère des Andes' },
  { src: '/images/tango1.webp', alt: 'Tango argentin' },
];


</script>

<template>
  <Swiper :modules="[Navigation, Pagination]" :pagination="{ clickable: true }" navigation loop
    class=" w-75 lg:w-120 max-w-xl mx-auto rounded-xl  overflow-hidden">
    <SwiperSlide v-for="(image, index) in images" :key="index">
      <img :src="image.src" :alt="image.alt" class="w-80 mx-auto shadow-lg object-cover rounded-xl" />
    </SwiperSlide>
  </Swiper>
</template>

<style>
.swiper-pagination-bullet {
  background: #0A2938;
  opacity: 0.7;
}

.swiper-pagination-bullet-active {
  background: #D93927;
  opacity: 1;
}

.swiper-button-next::after,
.swiper-button-prev::after {
  color: #D93927;
  font-size: 42px;
}


@media (max-width: 768px) {
  .swiper-button-next,
  .swiper-button-prev {
    display: none !important;
  }
}

</style>
