<script>
/**
 * 토스트 메시지 콤포넌트
 */
export default {
  name: 'BaseToast',
  props: {
    msg: String
  },
  data () {
    return {
      toastMsg: ''
    }
  },
  watch: {
    msg () {
      if (this.msg) {
        this.toastMsg = this.msg
      } else {
        this.toastMsg = ''
      }
    }
  }
}
</script>

<template>
  <transition name="toastFade">
    <div v-if="toastMsg" class="toast">
      {{toastMsg}}
    </div>
  </transition>
</template>

<style scoped>
.toast {
  position: fixed !important;
  bottom: 20px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  z-index: 9999 !important;
  max-width: 90%;
  display: inline-block;
  top: auto !important;
}
</style>
