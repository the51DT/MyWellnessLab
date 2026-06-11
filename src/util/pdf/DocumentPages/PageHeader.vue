<template>
  <div class="page-header">
    <span class="stretch-text">myWellness LAB Report</span>
    <div class="right">
      <div class="vertical" />
      <b class="stretch-text">{{ page < 10 ? "0" + page : page }}</b>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  page: Number
})
</script>

<style lang="scss" scoped>
@import "@/assets/css/pdf/_variables.scss";
@import "@/assets/css/pdf/document.scss";

.page-header {
  height: calc(20px * $pdf-scale);
  border-top: calc(0.3px * $pdf-scale) solid #000000;
  border-bottom: calc(0.3px * $pdf-scale) solid #000000;

  font-size: calc(7px * $pdf-scale);
  //@include flex(space-between, center);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .right {
    //@include flex(center, center);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    flex-direction: row;
  }
  .vertical {
    height: calc(13.5px * $pdf-scale);
    //border-right: calc(0.3px * $pdf-scale) solid #000000;
    margin-right: calc(15px * $pdf-scale);
    margin-bottom: calc(6.5px * $pdf-scale);
  }

  b {
    font-size: calc(8px * $pdf-scale);
    font-weight: 800;
    color: #000;
  }
}

.stretch-page2 {
  .page-header {
    height: calc(20px * $pdf-scale);
    border-top: calc(0.3px * $pdf-scale) solid #000000;
    border-bottom: calc(0.3px * $pdf-scale) solid #000000;
    font-family: "Pretendard";

    font-size: calc(7px * $pdf-scale);
    //@include flex(space-between, center);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .right {
      //@include flex(center, center);
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      flex-direction: row;
    }
    .vertical {
      height: calc(13.5px * $pdf-scale);
      border-right: calc(0.3px * $pdf-scale) solid #000000;
      margin-right: calc(15px * $pdf-scale);
      margin-bottom: calc(6.5px * $pdf-scale);
    }

    span {
    }
    b {
      font-family: "Pretendard";

      font-size: calc(8px * $pdf-scale);
      font-weight: 800;
      color: #000;
    }
  }
}
</style>
