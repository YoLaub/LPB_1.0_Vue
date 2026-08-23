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
    class="max-w-3xl mx-auto p-6 md:p-10 rounded-2xl shadow-xl border border-crepe/30 space-y-7 form">

    <h3 class="text-3xl text-ardoise pe-8">{{ form?.titre }}</h3>

    <!-- Email -->
    <div>
      <input type="email" name="email" v-if="form.champ_1" :placeholder="form.champ_1"
        class="input-lpb" required />
    </div>

    <input type="text" name="_honey" style="display:none">

    <!-- Adultes -->
    <fieldset class="border-t border-ardoise/10 pt-6">
      <legend class="text-sm text-start font-semibold text-ardoise/80 uppercase tracking-wide mb-3 px-0">{{ form.label_1 }}</legend>
      <div class="flex flex-col gap-3 items-start">
        <label class="checkbox-lpb">
          <input type="checkbox" name="adulte_50" value="+50" class="accent-rougeLPB w-5 h-5" />
          <span>{{ form?.champ_2 }}</span>
        </label>
        <label class="checkbox-lpb">
          <input type="checkbox" name="adulte_100" value="+100" class="accent-rougeLPB w-5 h-5" />
          <span>{{ form?.champ_3 }}</span>
        </label>
        <label class="checkbox-lpb">
          <input type="checkbox" name="adulte_150" value="+150" class="accent-rougeLPB w-5 h-5" />
          <span>{{ form?.champ_4 }}</span>
        </label>
        <input type="text" name="adulte_autre" v-if="form.champ_5" :placeholder="form.champ_5"
          class="input-lpb w-40 py-2" />
      </div>
    </fieldset>

    <!-- Lieu -->
    <div class="border-t border-ardoise/10 pt-6">
      <input type="text" name="lieu" v-if="form.champ_6" :placeholder="form.champ_6"
        class="input-lpb" required />
    </div>

    <!-- Dates -->
    <div class="border-t border-ardoise/10 pt-6">
      <label for="date_debut" class="block text-sm font-semibold text-ardoise/80 uppercase tracking-wide mb-2 text-start">{{ form.label_2 }}</label>
      <input type="date" name="date_debut" class="input-lpb" required />
    </div>

    <div class="border-t border-ardoise/10 pt-6">
      <label class="checkbox-lpb" for="consent">
        <input type="checkbox" id="consent" v-model="consent" class="accent-rougeLPB w-5 h-5" required />
        <span class="text-sm">{{ form?.champ_7 }}</span>
      </label>
    </div>

    <div class="text-right pt-2">
      <button type="submit" :disabled="loading || !consent"
        class="bg-rougeLPB text-orange-100 rounded-lg px-8 py-3 shadow-md hover:bg-ardoise transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-rougeLPB">
        {{ loading ? form.etat_1 : form.etat_2 }}
      </button>
    </div>

    <!-- Message de confirmation -->
    <p v-if="success" class="text-start bg-green-600/10 text-green-700 border border-green-600/30 rounded-lg px-4 py-3 font-medium">
      {{ form.success }}
    </p>

    <!-- Message d'erreur -->
    <p v-if="error" class="text-start bg-rougeLPB/10 text-rougeLPB border border-rougeLPB/30 rounded-lg px-4 py-3 font-medium">
      {{ form.erreur }}
    </p>
  </form>

</template>

<style scoped>
.form {
  background-color: #FAE4CE;
}

.input-lpb {
  width: 100%;
  background-color: white;
  border: 1px solid rgba(10, 41, 56, 0.15);
  border-radius: 0.5rem;
  padding: 0.65rem 1rem;
  font-family: 'Lato';
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-lpb:focus {
  outline: none;
  border-color: #D93927;
  box-shadow: 0 0 0 3px rgba(217, 57, 39, 0.15);
}

.input-lpb::placeholder {
  color: rgba(10, 41, 56, 0.45);
}

.checkbox-lpb {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  color: #0A2938;
}
</style>