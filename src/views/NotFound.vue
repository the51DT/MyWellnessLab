<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const moveHome = () => {
  router.replace({ name: 'Home' })
}
</script>

<template>
  <div class="error">
    <div>
      <img src="/img/img_error.png" class="error--img" alt="" />
    </div>
    <h2 class="error--tit">
      404 Not Found
    </h2>
    <p class="error--txt">
      {{ $t('NotFound.text1') }}
    </p>
    <div class="error--btn">
      <button @click="moveHome" class="btn-pop--gray" type="button">{{ $t('Common.home') }}</button>
    </div>
  </div>
</template>
