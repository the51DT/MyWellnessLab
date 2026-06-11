<script>
/**
 * 상단에 타이틀이 있는 큰 레이어팝업 콤포넌트
 */
import { bodyScroll } from '@/assets/js/common'

export default {
  name: 'BasePopupTit',
  methods: {
    close () {
      this.$emit('popupClose')
    }
  },
  mounted () {
    bodyScroll(false) /* 240110 팝업 노출 시 body 스크롤 정지 */
  },
  unmounted () {
    bodyScroll(true) /* 240110 팝업 삭제 시 body 스크롤 원복 */
  }
}
</script>

<template>
  <div class="popup">
    <div class="popup--wrap tit">
      <div class="align--between popup--header">
        <div />
        <div class="popup--tit-wrap">
          <span class="popup--tit"><slot name="title" /></span>
        </div>
        <div>
          <button @click="close" type="button" class="popup--close" />
        </div>
      </div>
      <div class="popup--space">
        <slot name="contents" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">

</style>
