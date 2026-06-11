<script setup>

</script>

<template>
  <div class="popup order"> <!--풀팝업-->
    <div class="popup--wrap">
      <h2 class="popup--header">
        <span style="flex: none;">
          <slot name="title" />
        </span>
      </h2>
      <div class="popup--space">
        <slot name="contents" />
      </div>
      <footer>
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/css/ordernpay";
</style>
