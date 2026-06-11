<script>
export default {
  name: "BseTooltipOrderNpay",
}
</script>

<template>
  <div class="tooltip--wrap"> <!--툴팁-->
    <slot name="contents"></slot>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/css/ordernpay";
</style>