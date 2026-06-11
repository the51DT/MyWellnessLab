<script>
export default {
  name: "BasePopupFull",
  methods: {
    close(){
      this.$emit("popupClose")
    }
  }
}
</script>

<template>
  <div class="popup full">
    <div class="popup--wrap tit">
      <div class="popup--space">
        <slot name="contents"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

</style>
