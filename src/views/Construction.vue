<script setup>
const prefix = "Construction";
</script>

<template>
  <div :class="prefix">
    <div>
      <img src="/img/img_construction.png" alt="">
    </div>
    <h2 :class="prefix + '--tit'">{{ $t('Construction.text1') }}</h2>
    <p :class="prefix + '--txt'">{{ $t('Construction.text2') }}<br>{{ $t('Construction.text3') }}</p>
  </div>
</template>

<style scoped>

</style>