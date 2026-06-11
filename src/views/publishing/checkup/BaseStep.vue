<script setup>
const props = defineProps({
  step: String /*몇번째 단계인지*/
})
</script>

<template>
  <div class="BaseStep" :class="step">
    <div class="BaseStep--step"></div>
    <div class="BaseStep--step"></div>
    <div class="BaseStep--step"></div>
    <div class="BaseStep--step"></div>
    <div class="BaseStep--step"></div>
    <div class="BaseStep--step"></div>
  </div>
</template>

<style scoped>

</style>