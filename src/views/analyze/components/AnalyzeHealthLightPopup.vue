<script setup>
import BasePopupTit from '@/views/publishing/BasePopupTit.vue'
import { getCurrentInstance, onMounted, onUnmounted } from 'vue'
import { bodyScroll } from '@/assets/js/common'

const instance = getCurrentInstance()

/**
 * 팝업 종료
 */
function close () {
  instance.emit('popupClose')
}

onMounted(() => {
  bodyScroll(false)
})

onUnmounted(() => {
  bodyScroll(true)
})
</script>

<template>
  <base-popup-tit @click="close" class="AnalyzeHealthLight--popup">
    <template v-slot:title>
      {{ $t('AnalyzeHealthLightPopup.text1')}}
    </template>
    <template v-slot:contents>
      <ul class="AnalyzeHealthLight--net-txt">
        <li>{{ $t('AnalyzeHealthLightPopup.text2')}}</li>
        <li>{{ $t('AnalyzeHealthLightPopup.text3')}}</li>
        <li>{{ $t('AnalyzeHealthLightPopup.text4')}}</li>
      </ul>
      <div class="AnalyzeHealthLight--net-img-wrap">
        <img src="/img/human.png" alt="인체 생리 네트워크" class="AnalyzeHealthLight--net-img" />
      </div>
    </template>
  </base-popup-tit>
</template>

<style scoped></style>
