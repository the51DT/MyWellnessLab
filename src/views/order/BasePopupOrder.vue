<script setup>

</script>

<template>
  <div class="popup order"> <!--풀팝업-->
    <div class="popup--wrap">
      <h2 class="popup--header">
        <span style="flex: none;">
          <slot name="title"></slot>
        </span>
      </h2>
      <div class="popup--space">
        <slot name="contents"></slot>
      </div>
      <footer>
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/css/ordernpay";
</style>