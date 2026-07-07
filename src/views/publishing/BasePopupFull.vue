<script>
import { bodyScroll } from '@/assets/js/common'

export default {
  name: "BasePopupFull",
  methods: {
    close(){
      this.$emit("popupClose")
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
  <div class="popup full">
    <div class="popup--wrap tit">
      <div class="align--between popup--header">
        <div></div>
        <div class="popup--tit-wrap">
          <span class="popup--tit"><slot name="title"></slot></span>
        </div>
        <div>
          <button @click="close" type="button" class="popup--close"></button>
        </div>
      </div>
      <div class="popup--space">
        <slot name="contents"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

</style>
