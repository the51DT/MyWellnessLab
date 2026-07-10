<script>
import { bodyScroll } from '@/assets/js/common'

export default {
  name: "BasePopupClose",
  methods: {
    close(){
      this.$emit("popupClose")
    }
  },
  props: {
    closeBtn: {
      type: Boolean,
      default: true
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
    <div class="popup--wrap close">
      <div class="align--between popup--header">
        <div class="popup--tit-wrap">
          <span class="popup--tit"><slot name="title"></slot></span>
        </div>
        <div v-if="closeBtn">
          <button @click="close" type="button" class="popup--close" aria-label="닫기"></button>
        </div>
      </div>
      <div class="popup--space">
        <slot name="contents"></slot>
      </div>
      <div v-if="$slots.button" class="pop-btn-wrap">
        <slot name="button"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

</style>
