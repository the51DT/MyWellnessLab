<script setup>
import { computed, onMounted } from "vue";

const emit = defineEmits(['mounted'])

const props = defineProps({
  save: Boolean,
  userInfo: Object,
  check_date: String,
  report_no: Number,
  page: Number,
  imgSrc: String,
});

onMounted(() => {
  emit('mounted')
  // console.log(JSON.stringify(props.userInfo));
})
// const getAnalysisNumber = computed(() => {
//   if (!props.report_no) return "";
//   let zeroCount = 10 - props.report_no.toString().length;
//   let number = "MWL-";
//   for (let i = 0; i < zeroCount; i++) {
//     number += "0";
//   }
//   number += props.report_no;
//   return number;
// });

</script>
<template>
  <div id="Page1" class="custom-page page a4">
    <div class="page-inside">
      <div class="info-box">
        <div class="item-box">
          <div class="item">{{ props.report_no.toString() }}</div>
          <div class="item">{{ props.check_date }}</div>
        </div>
        <div class="item-box">
          <!-- <div class="item">{{ props.userInfo.user_name }}</div> -->
           <div class="item">{{ props.userInfo.name }}</div>
          <div class="item">로그미</div>
        </div>
      </div>
      <img :src="props.imgSrc"/>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";


.page-inside {
  position: relative;
  text-align: left;
  letter-spacing: 1px;
  padding: 0;
}

.info-box {
  position: absolute;
  right: calc(35px * $pdf-scale);
  bottom: calc(80px * $pdf-scale);
  height: calc(73px * $pdf-scale);
  width: calc(280px * $pdf-scale);
  
  flex-direction: row;
  flex-wrap: wrap;

  .item-box {
    @include flex(center, center);
  }

  .item {
    padding-top: calc(19px * $pdf-scale);

    width: 50%;
    height: calc(38px * $pdf-scale);

    font-size: calc(10px * $pdf-scale);
  }
}
  
  // .stretch-page2 {
  //   .info {
  //     position: absolute;
  //     font-family: "Pretendard";
  //     font-variant: normal;
  //     right: calc(31px * $pdf-scale);
  //     /* top: calc($pdf-text-ratio * $pdf-scale); */
  //     height: calc(73px * $pdf-scale);
  //     width: calc(280px * $pdf-scale);
  //     @include flex(center, center);
  //     flex-direction: row;
  //     flex-wrap: wrap;
  //     /* background-color: red; */
  
  //     .item {
  //       transform: translateY($pdf-text-ratio);
  //       padding-top: calc(19px * $pdf-scale);
  
  //       width: 50%;
  //       height: calc(38px * $pdf-scale);
  
  //       font-size: calc(10px * $pdf-scale);
  //     }
  //   }
  // }

</style>
