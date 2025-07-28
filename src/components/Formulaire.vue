<script setup>
import { ref } from 'vue'
import axios from 'axios'

defineProps({
  form: Object
})


// État d'envoi
const success = ref(false)
const error = ref(false)
const loading = ref(false)

const consent = ref(false);

// Référence au formulaire
const formRef = ref(null)

const envoyerFormulaire = async () => {
  loading.value = true
  success.value = false
  error.value = false

  try {
    const formData = new FormData(formRef.value)

    await axios.post('https://formsubmit.co/ajax/88684e3280c614c43f5fc6b0b01e67e1', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    success.value = true
    formRef.value.reset()
  } catch (err) {
    error.value = true
    console.error(err)
  } finally {
    loading.value = false
  }
}


</script>

<template>
  <form @submit.prevent="envoyerFormulaire" ref="formRef"
    class="max-w-3xl mx-auto p-10 rounded-lg shadow space-y-6 form">

    <h3 class=" text-3xl">{{ form?.titre }}</h3>
    <!-- Email -->
    <div>
      <input type="email" name="email" v-if="form.champ_1" :placeholder="form.champ_1"
        class="w-full bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" required/>
    </div>

    <input type="text" name="_honey" style="display:none">

    <!-- Adultes -->
    <fieldset>
      <legend class="text-sm text-start font-medium text-gray-700 mb-2">{{ form.label_1 }}</legend>
      <div class="flex flex-col gap-4 items-start">
        <label class="inline-flex items-center space-x-2">
          <input type="checkbox" name="adulte_50" value="+50" class="form-checkbox" />
          <span>{{ form?.champ_2 }}</span>
        </label>
        <label class="inline-flex items-center space-x-2">
          <input type="checkbox" name="adulte_100" value="+100" class="form-checkbox" />
          <span>{{ form?.champ_3 }}</span>
        </label>
        <label class="inline-flex items-center space-x-2">
          <input type="checkbox" name="adulte_150" value="+150" class="form-checkbox" />
          <span>{{ form?.champ_4 }}</span>
        </label>
        <input type="text" name="adulte_autre" v-if="form.champ_5" :placeholder="form.champ_5"
          class=" bg-white  border border-gray-300 rounded-md px-2 py-1 w-32" />
      </div>
    </fieldset>


    <!-- Lieu -->
    <div>
      <input type="text" name="lieu" v-if="form.champ_6" :placeholder="form.champ_6"
        class="w-full bg-white  border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" required />
    </div>

    <!-- Dates -->
    <div>
      <div>
        <label for="date_debut" class="block text-sm text-gray-700 mb-1">{{ form.label_2 }}</label>
        <input type="date" name="date_debut" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2" required />
      </div>
    </div>

    <div>
      <label class="inline-flex items-center space-x-2" for="consent">
        <input type="checkbox" id="consent" v-model="consent" class="form-checkbox" required/>
        <span>{{ form?.champ_7 }}</span>
      </label>

    </div>


    <div class="text-right">
      <button type="submit" :disabled="loading || !consent"
        class=" bg-rougeLPB text-white rounded hover:bg-red-700 transition disabled:opacity-50">
        {{ loading ? form.etat_1 : form.etat_2 }}
      </button>
    </div>

    <!-- Message de confirmation -->
    <p v-if="success" class="text-green-600 font-medium mt-2">
      {{ form.success }}
    </p>

    <!-- Message d'erreur -->
    <p v-if="error" class="text-red-600 font-medium mt-2">
      {{ form.erreur }}
    </p>
  </form>

</template>

<style scoped>
.form {
  background-color: rgba(250, 228, 206);
  border-radius: 5px;
  margin-bottom: 2em;
  width: 80%;
}


</style>