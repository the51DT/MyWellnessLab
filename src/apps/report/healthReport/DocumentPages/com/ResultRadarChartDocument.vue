
<script setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import { createRadarChart } from "@/utils/chartConfig";

// Props 정의
const props = defineProps({
  data: Object,
  pdfScale: Number,
  right: Boolean,
  hideScore: Boolean,
  loadingFinished: Function,
});

// Reactive 상태 정의
const echart = ref(null);

onMounted(() => {
  makeChart();
});
const makeChart = async () => {
  var max_values = [
    { name: '몸통', max: 100 },
    { name: '왼팔', max: 100 },
    { name: '왼다리', max: 100 },
    { name: '오른다리', max: 100 },
    { name: '오른팔', max: 100 }
  ]
  var mean_values = [
    90, 80, 90, 90, 80
  ]
  var values = [
    props.data.hq_musMass.bodypartData.trk_percent, 
    props.data.hq_musMass.bodypartData.lrm_percent,
    props.data.hq_musMass.bodypartData.llg_percent,
    props.data.hq_musMass.bodypartData.rlg_percent,
    props.data.hq_musMass.bodypartData.rrm_percent,
  ]
  const chart = echarts.init(echart.value)
  var option = await createRadarChart(max_values, mean_values, values, '#E95371', 5)
  chart.setOption(option)
}
</script>
<template>
  <div class="container">
    <!-- <img src="@/assets/images/pdf/res/img-muscle-shape.png"> -->
    <div class="echart" ref="echart"></div>
    <div class="info">
      <div class="info-list">
        <div class="info-item top">
          <p>몸통</p>
          <p :class="props.data.hq_musMass.bodypartData.trk_status === 3 ? 'danger' : 'normal'">
            {{ props.data.hq_musMass.bodypartData.trk_status === 3 ? '부족' : '표준' }}
          </p>
        </div>
        <div class="info-item left-top">
          <p>왼팔</p>
          <p :class="props.data.hq_musMass.bodypartData.lrm_status === 3 ? 'danger' : 'normal'">
            {{ props.data.hq_musMass.bodypartData.lrm_status === 3 ? '부족' : '표준' }}
          </p>
        </div>
        <div class="info-item left-bottom">
          <p>왼다리</p>
          <p :class="props.data.hq_musMass.bodypartData.llg_status === 3 ? 'danger' : 'normal'">
            {{ props.data.hq_musMass.bodypartData.llg_status === 3 ? '부족' : '표준' }}
          </p>
        </div>
        <div class="info-item right-bottom">
          <p>오른다리</p>
          <p :class="props.data.hq_musMass.bodypartData.rlg_status === 3 ? 'danger' : 'normal'">
            {{ props.data.hq_musMass.bodypartData.rlg_status === 3 ? '부족' : '표준' }}
          </p>
        </div>
        <div class="info-item right-top">
          <p>오른팔</p>
          <p :class="props.data.hq_musMass.bodypartData.rrm_status === 3 ? 'danger' : 'normal'">
            {{ props.data.hq_musMass.bodypartData.rrm_status === 3 ? '부족' : '표준' }}
          </p>
        </div> 
      </div> 
    </div>
  </div>
</template>


<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";
@import "@/assets/scss/_document.scss";

.container {
  position: relative;
  left: 0;
  right: 0;
  // margin-left: -32px; // 임의로 수정
  width: calc((173px) * $pdf-scale);
  height: calc(164.5px * $pdf-scale);

  & .info {
  width:100%;
  height: 100%;
  position: absolute;
  top: 0;
  

  & .info-list{
    width:100%;
    height: 100%;
    position: relative;
  }
  & .info-item {
    font-weight: 400;
    
    color: #000000;
    position: absolute;
    transform: translate(-50%, -50%);

    & p {
      font-size: calc(10px * $pdf-scale);
      font-weight: $medium;;
      color: #000000;
      text-align: center;

      &.normal {
        color: #5AB651;
      }

      &.danger {
        color: #E95371;
      }

    }

    &.top {
      left: 50%;
      top: calc(0px * $pdf-scale);
    }
    &.left-top {
      left: -5%;
      top: calc(60px * $pdf-scale);
    }
    &.left-bottom {
      left: 20%;
      bottom: calc(-35px * $pdf-scale);
    } 
    &.right-top {
      right: -20%;
      top: calc(60px * $pdf-scale);
    }
    &.right-bottom {
      right: 0%;
      bottom: calc(-35px * $pdf-scale);
    }
  }
}

}
.right {
  right: calc(7px * $pdf-scale);
}
.chart {
  width: 100%;
  
  height: 100%;
  position: absolute;
}

.title {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  @include flex(center, center);
  h5 {
    /* @include flex(center, flex-end); */
    /* position: absolute; */

    /* top: 50%; */
    /* margin-top: 20px; */
    width: 100%;
    /* height: 100%; */
    /* transform: translateY(50%); */
    font-weight: 500;
    font-size: calc(23px * $pdf-scale);
    line-height: normal;

    /* identical to box height */
    display: flex;
    /* height: 100%; */
    align-items: flex-end;
    justify-content: center;

    text-align: left;

    color: #008352;
    span {
      left: calc(55px * $pdf-scale);
      font-weight: 500;
      font-size: calc(10px * $pdf-scale);
      line-height: normal;
      padding-bottom: calc(4px * $pdf-scale);
    }
  }
}
.echart {
  position: absolute;
  /* height: 100%; */
  top: 60px;
  bottom: 0;
  left: calc(0px * $pdf-scale);
  right: 0;
}

// .stretch-page2 {
//   .title {
//     position: absolute;
//     width: 100%;
//     height: 100%;
//     top: 0;
//     left: 0;
//     @include flex(center, center);
//     h5 {
//       /* @include flex(center, flex-end); */
//       /* position: absolute; */

//       /* top: 50%; */
//       /* margin-top: 20px; */
//       width: 100%;
//       /* height: 100%; */
//       /* transform: translateY(50%); */
//       font-weight: 500;
//       font-family: "Pretendard";
//       transform: translateY(calc($pdf-text-ratio));
//       font-size: calc(23px * $pdf-scale);
//       line-height: normal;

//       /* identical to box height */
//       display: flex;
//       /* height: 100%; */
//       align-items: flex-end;
//       justify-content: center;

//       text-align: left;

//       color: #008352;
//       span {
//         left: calc(55px * $pdf-scale);
//         font-weight: 500;
//         font-size: calc(10px * $pdf-scale);
//         line-height: normal;
//         padding-bottom: calc(4px * $pdf-scale);
//       }
//     }
//   }
// }
</style>
