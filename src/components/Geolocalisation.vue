<script setup>
import { ref } from 'vue'

defineProps({
  item: Object
})

const geolocDef = ref(null);

// geolocDef.value = "mendoza";

</script> 


<template>
    <div  v-if="geolocDef" class=" flex xs:flex-col md:flex-row md:gap-20 py-10 mx-auto items-center">
        <h3  class=" text-white text-4xl mb-5">{{ item.texte }}</h3>
        <iframe class=" xs:w-85 md:w-150 md:h-80 rounded-lg" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26804.498681273777!2d-68.87911865189228!3d-32.88329747191978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e093ec45179bf%3A0x205a78f6d20efa3a!2sMendoza%2C%20D%C3%A9partement%20Capital%2C%20Province%20de%20Mendoza%2C%20Argentine!5e0!3m2!1sfr!2sfr!4v1753305328059!5m2!1sfr!2sfr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>

    <div v-if="!geolocDef" class=" flex flex-col py-10 mx-auto">
        <h3 class=" text-white text-3xl">{{ item.texte2 }}
        </h3>
    </div>
</template>