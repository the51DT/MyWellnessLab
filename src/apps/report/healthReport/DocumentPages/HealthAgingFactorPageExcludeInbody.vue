<script setup>
import { computed, onMounted, ref } from "vue";
import PageHeader from "./PageHeader.vue";
import TrackingChartDocument from "./com/TrackingChartDocument.vue";
import DimComponent from "@/components/dim/DimComponent.vue";

const emit = defineEmits(['mounted'])

// Props 정의
const props = defineProps({
  healthArindicatorData: null,
  save: Boolean,
  userInfo: null,
  pdfScale: null,
  page: Number,
});

const dataList = { ...props.healthArindicatorData }

onMounted(() => {
  emit('mounted')
})
// 데이터를 2개씩 묶어서 반환하는 computed
const groupedDataList = computed(() => {
  delete dataList["WWI"];
  delete dataList["RFS"];
  delete dataList["FMR"];

  // 25.09.03 --> 총콜레스테롤, 저밀도콜레스테롤, 고밀도 콜레스테롤, 중성지방이 0 인경우는 화면에서 제외
  if (dataList["TC"].data == 0) {
    delete dataList["TC"];
  }
  if (dataList["LDL"].data == 0) {
    delete dataList["LDL"];
  }
  if (dataList["HDL"].data == 0) {
    delete dataList["HDL"];
  }
  if (dataList["TG"].data == 0) {
    delete dataList["TG"];
  }
  const sortedDataList = Object.entries(dataList)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([key, value]) => {
      // 화면에 표시되는 이름 변경 (영문명 추가) -> 25.07.23
      const { name, unit, en_name } = dataList[key];
      let displayName = name;
      if (en_name != '') {
        displayName += ` (${en_name})`;
      }
      return {
        key,
        displayName: displayName,
        ...value, // 기존의 다른 필드가 필요하다면 여기에 spread
      };
    });

  const entries = Object.entries(sortedDataList);
  const grouped = [];
  for (let i = 0; i < entries.length; i += 2) {
    grouped.push(entries.slice(i, i + 2)); // 2개씩 잘라서 배열에 추가
  }
  return grouped;
});
// Methods 정의
const getWorstList = () => {
  const worst = []
  for (var item in props.healthArindicatorData) {
    if (props.healthArindicatorData[item].risk > 0) {
      worst.push({
        name: props.healthArindicatorData[item].keyword,
        risk: props.healthArindicatorData[item].risk,
      })
    }
  }

  let text = ""
  for (let i = 0; i < sort_with_key(worst, 'risk', true).length; i++) {
    if (i !== 0) {
      text += ", "
    }
    text += worst[i].name
  }

  return text
};
/** sort with key */
const sort_with_key = (object, key, reverse = false) => {

  object = object.sort((a, b) => {
    if (reverse) {
      if (a[key] > b[key]) {
        return -1
      }
    } else {
      if (a[key] < b[key]) {
        return -1
      }
    }

  })

  return object
}
</script>
<template>
  <div id="Page17" class="custom-page page a4">
    <div class="page-inside">
      <PageHeader :page="props.page"></PageHeader>
      <div class="title-container">
        <img src="@/assets/images/pdf/res/img-aging-rate.png" />
        <div>
          <h3 class="stretch-text">나의 노화 속도에 영향을 준 요인</h3>
          <span class="stretch-text">노화속도에 영향을 준 요인은 빅데이터 기반 한국 성인 평균값과 분포를 기준으로 혈액 지표 및 생활 습관을 판정하므로 건강검진 기준과 상이할 수
            있습니다. 나의 노화 속도에 영향을 준 건강 요인을 확인해 보세요.</span>
        </div>
      </div>

      <div class="subject">
        <h3 class="stretch-text">
          [한국 성인 표본집단의 건강 요인별 분포와 나의 건강 요인]
        </h3>
      </div>
      <div class="data-container">
        <div class="legend">
          <div class="legend-icon">
            <img src="@/assets/images/pdf/res/icon-check.png" />
          </div>
          <div class="stretch-text">건강 위험 요인</div>
          <div class="avg"></div>
          <div class="stretch-text">한국인 평균</div>
          <div class="my"></div>
          <div class="stretch-text">{{ props.userInfo.user_name }}님</div>


        </div>

        <!-- 건강지표 그래프 -->
        <!-- 2개씩 묶인 데이터를 렌더링 -->
        <!-- 체성분 데이터가 없는 사용자의 경우 체지방률, 체중대비 팔다리 근육률일때 잠금표시 필요-->
        <div v-for="(group, groupIndex) in groupedDataList" :key="groupIndex">

          <div class="name-group">
            <div v-for="(item, i) in group" :key="i" class="top">
              <div class="check-box">
                <img v-if="item[1].check == 1" class="check" src="@/assets/images/pdf/res/tracking-check.png" />
              </div>
              <div class="name stretch-text">{{ item[1].displayName }}</div>
            </div>
          </div>
          <div class="data-group">
            <DimComponent :style-type="2" :html-text="'체성분 데이터 입력 시 ‘체지방률’, ‘체중 대비 팔다리 근육률’ 분석 결과를 확인할 수 있습니다.'"
              :icon-size="'small'" :padding-flag="false" v-if="groupIndex == 1" />
            <div v-for="(item, i) in group" :key="i" class="data-chart">
              <TrackingChartDocument :data="item[1]" :pdf-scale="pdfScale" />
            </div>
          </div>
        </div>
        <!-- </template> -->
      </div>
      <div class="desc">
        <span class="stretch-text">
          <!-- 체크항목들 모두 써주는 방법으로 -->
          <b>노화 속도에 영향을 준 요인들</b><br />
          {{ getWorstList() }}
        </span>
      </div>
      <hr />
      <div class="bottom-info">
        *본 서비스는 질병의 예방 또는 진단을 목적으로 제공되는
        서비스가 아닙니다. 본인의 건강 상태에 대한 정확한 진단이
        필요하신 경우 전문의와 상의하시기 바랍니다. 수분 섭취량,
        스트레스, 식사의 질 건강 지표의 건강 판정은 건강 위험
        요인과 건강 신호등에서 확인 할 수 있습니다.
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";
// @import "@/assets/scss/_document.scss";

.title-container {
  @include flex(flex-start, flex-start);

  padding-top: calc(8.7px * $pdf-scale);
  height: calc(105px * $pdf-scale);
  width: 100%;

  ul {
    font-size: calc(12px * $pdf-scale);
    padding-left: calc((16.51px + 89.9px) * $pdf-scale);

    li {
      list-style-type: disc;
      word-break: break-all;
      word-wrap: break-word;
      white-space: normal;
    }
  }

  img {
    width: calc(42.08px * $pdf-scale);
    height: calc(42.08px * $pdf-scale);
    object-fit: contain;
  }

  h3 {
    // margin-top: calc(10.68px * $pdf-scale);
    margin-left: calc(12.69px * $pdf-scale);
    font-size: calc(28px * $pdf-scale);
    font-weight: $medium;
    color: #008452;
    height: calc(23px * $pdf-scale);
    text-align: left;
  }

  span {
    display: inline-block;
    margin-left: calc(12.69px * $pdf-scale);
    margin-top: calc(15.82px * $pdf-scale);
    font-size: calc(12px * $pdf-scale);
    /* padding-right: calc(25.97px * $pdf-scale); */
    line-height: calc(17.5px * $pdf-scale);
    letter-spacing: calc(-0.01em * $pdf-scale);
    font-weight: 300;
  }

  .score-container {
    width: 100%;
    height: 100%;
    flex: 1;
  }
}

.desc {
  margin-top: calc(7.46px * $pdf-scale);
  height: calc(66px * $pdf-scale);
  font-size: calc(11px * $pdf-scale);
  font-weight: 400;
  color: #585859;

  b {
    color: #000000;
    font-size: calc(12px * $pdf-scale);
    font-weight: 400;
  }
}

.bottom-info {
  bottom: calc(10px * $pdf-scale);
}

.data-container {
  position: relative;
  width: 100%;
  height: calc(540px * $pdf-scale);
  background-color: white;
  border: calc(0.5px * $pdf-scale) solid #000000;
  padding-left: calc(21.7px * $pdf-scale);
  padding-right: calc(21.7px * $pdf-scale);
  padding-top: calc(30.08px * $pdf-scale);
}

.subject {
  display: flex;
  justify-content: space-between;
  padding-right: calc(10.35px * $pdf-scale);
  padding-bottom: calc(6.2px * $pdf-scale);

  h3 {
    font-size: calc(10px * $pdf-scale);
    font-weight: 400;
  }

  span {
    display: inline-block;
    font-size: calc(6.5px * $pdf-scale);
  }
}

.name-group {
  @include flex(flex-start, flex-start);
  gap: calc(41px * $pdf-scale);

  .top {
    width: calc(243px * $pdf-scale);
    @include flex(flex-start, center);
    font-size: calc(8px * $pdf-scale);
    font-weight: 400;
  }

  .check-box {
    position: relative;
    width: calc(7px * $pdf-scale);
    height: calc(7px * $pdf-scale);
    border: calc(0.5px * $pdf-scale) solid #000;
    margin-right: calc(6px * $pdf-scale);

    .check {
      position: absolute;
      top: calc(-2px * $pdf-scale);
      left: calc(0px * $pdf-scale);
      width: calc(8px * $pdf-scale);
      height: calc(7px * $pdf-scale);
    }
  }
}

.data-group {
  position: relative;
  @include flex(space-between, flex-start);
  gap: calc(41px * $pdf-scale);

}

.data-chart {

  height: calc(32px * $pdf-scale);
  width: calc(243px * $pdf-scale);
}

.legend {
  position: absolute;
  top: calc(9.76px * $pdf-scale);
  right: calc(12.21px * $pdf-scale);
  color: #727171;
  @include flex(flex-end, center);
  font-size: calc(6.5px * $pdf-scale);

  .avg {
    margin-left: calc(7px * $pdf-scale);
    width: calc(7px * $pdf-scale);
    height: calc(7px * $pdf-scale);
    background-color: #92539d;
    margin-right: calc(2.83px * $pdf-scale);
  }

  .my {
    margin-left: calc(7px * $pdf-scale);
    width: calc(7px * $pdf-scale);
    height: calc(7px * $pdf-scale);
    background-color: #00b4de;
    margin-right: calc(2.83px * $pdf-scale);
  }

  .legend-icon {
    margin-left: calc(17px * $pdf-scale);
    width: calc(7px * $pdf-scale);
    height: auto;
    /* background-color: #00b4de; */
    margin-right: calc(2.83px * $pdf-scale);
  }
}
</style>
