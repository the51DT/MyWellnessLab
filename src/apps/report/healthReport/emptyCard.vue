<script setup>
import cardComponent from '@/components/card/CardComponent.vue'
import { onMounted } from 'vue';
const props = defineProps({
  title:{
    type: String,
    required: true
  },
  isInbodyData:{
    type: Boolean,
    required: true
  },
  activeCardNumber: {
    type: Number,
    required: true
  
  }
})

onMounted(async () => {
})

</script>
<template>
<cardComponent :title=title :description-title="''" :activeCard="props.isInbodyData== true ? props.activeCardNumber==6 : props.activeCardNumber == 5">
  <template v-slot:content>

  </template>
</cardComponent>

</template>
  