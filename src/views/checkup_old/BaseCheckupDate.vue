<script setup>

import {ref, computed, } from "vue";

 const props = defineProps({
  checkDate : String
 });
 
 //let date = (props.checkDate.substring(0, 4).concat('. '))+(props.checkDate.substring(4, 6).concat('. '))+props.checkDate.substring(6);

const date = computed(() => {
  let date = '';
  if(props.checkDate) {
    date = props.checkDate.replace(/\-/gi, '. ');
  }
  return date;
});

</script>

<template>
  <div class="BaseCheckupDate">
    건강 검진일 : {{ date }}
  </div>
</template>

<style scoped>
@use "@/assets/css/default.scss";
</style>