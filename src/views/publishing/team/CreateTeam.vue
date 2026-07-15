<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

 /* 퍼블 확인용 챌린지/상시 구분 받을 값 challenge/regular */
const route = useRoute()
const teamClassification = route.meta.teamClassification
console.log(teamClassification);
</script>

<template>
  <section class="team">
    111
  </section>
</template>

<style lang="scss" scoped>
</style>
