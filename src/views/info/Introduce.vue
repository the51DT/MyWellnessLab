<script setup>
const prefix = "Introduce"; /*231222 클래스 접두어*/
</script>

<template>
  <div :class="prefix">
    <div :class="prefix + '--con-t'">
      <p :class="prefix + '--tit'">{{ $t('Introduce.text1') }}<br>{{ $t('Introduce.text2') }}</p>
      <div :class="prefix + '--desc0'">
        <p>{{ $t('Introduce.text3') }}</p>
        <p :class="prefix + '--desc-b'" v-html="$t('Introduce.text4')"></p>
      </div>
      <hr class="dot">
    </div>
    <div :class="prefix + '--visual'">

      <div :class="prefix + '--group'">
        <div :class="prefix + '--txt'">
          <p :class="prefix + '--copy'">{{ $t('Introduce.text5') }}</p>
          <p :class="prefix + '--desc'" v-html="$t('Introduce.text6')"></p>
        </div>
        <div :class="prefix + '--bg-wrap'"></div>
      </div>

      <div :class="prefix + '--group v2'">
        <div :class="prefix + '--txt v2'">
          <p :class="prefix + '--desc'">{{ $t('Introduce.text7') }}</p>
        </div>
        <div :class="prefix + '--bg-wrap v2'"></div>
        <div :class="prefix + '--bg-wrap v3'"></div>
      </div>

      <div :class="prefix + '--group v3'">
        <div :class="prefix + '--txt v3'">
          <p :class="prefix + '--copy'">{{ $t('Introduce.text8') }}</p>
          <p :class="prefix + '--desc'">{{ $t('Introduce.text9') }}</p>
        </div>
        <div :class="prefix + '--bg-wrap v4'"></div>
      </div>

      <!-- <div :class="prefix + '--group v4'">
        <img src="/img/logo.svg" alt="myWellnessLAB Logo">
      </div> -->

    </div>
  </div>
</template>

<style scoped>

</style>