<script>
export default {
  name: "BasePopupTit",
  methods: {
    close(){
      this.$emit("popupClose")
    }
  }
}
</script>

<template>
  <div class="popup">
    <div class="popup--wrap tit">
      <div class="align--between popup--header">
        <div></div>
        <div class="popup--tit-wrap">
          <span class="popup--tit"><slot name="title"></slot></span>
        </div>
        <div>
          <button @click="close" type="button" class="popup--close" aria-label="닫기"></button>
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
