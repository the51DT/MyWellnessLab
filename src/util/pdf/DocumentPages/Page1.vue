<template>
  <div id="page" class="custom-page a4" :class="props.save ? 'stretch-page' : ''">
    <div class="page-inside">
      <div class="info">
        <div class="item">{{ reportNo }}</div>
        <div class="item">{{ date }}</div>
        <div class="item">{{ userInfo.name }}</div>
        <div class="item">로그미</div>
      </div>
      <img src="/img/pdf/res/page1.png" />
    </div>
  </div>
</template>

<script setup>
// import { convertDateToYYYYMMDD } from "@/utl/util";
const props = defineProps({
  save: Boolean,
  userInfo: null,
  date: null,
  reportNo: null,
});
</script>

<style lang="scss" scoped>
@import "@/assets/css/pdf/_variables.scss";
@import "@/assets/css/pdf/document.scss";
.page-inside {
  position: relative;
  text-align: left;
  letter-spacing: 1px;
  padding: 0;
}

.info {
  position: absolute;
  font-family: "Pretendard";
  font-variant: normal;
  right: calc(31px * $pdf-scale);
  bottom: calc(80px * $pdf-scale);
  height: calc(73px * $pdf-scale);
  width: calc(280px * $pdf-scale);
  //@include flex(center, center);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;

  .item {
    padding-top: calc(19px * $pdf-scale);

    width: 50%;
    height: calc(38px * $pdf-scale);

    font-size: calc(10px * $pdf-scale);
  }
}

.stretch-page2 {
  .info {
    position: absolute;
    font-family: "Pretendard";
    font-variant: normal;
    right: calc(31px * $pdf-scale);
    /* top: calc($pdf-text-ratio * $pdf-scale); */
    height: calc(73px * $pdf-scale);
    width: calc(280px * $pdf-scale);
    //@include flex(center, center);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
    /* background-color: red; */

    .item {
      /* transform: translateY($pdf-text-ratio); *//* 24.01.03 텍스트 틀어짐이 발생해서 제거 */
      padding-top: calc(19px * $pdf-scale);

      width: 50%;
      height: calc(38px * $pdf-scale);

      font-size: calc(10px * $pdf-scale);
    }
  }
}
</style>
