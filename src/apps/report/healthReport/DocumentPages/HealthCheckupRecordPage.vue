<script setup>
import { computed, onMounted } from "vue";
import PageHeader from "./PageHeader.vue";
// import { tracking_hcr } from "@/js/rstText";
import HistoryGraphDocument from "./com/HistoryGraphDocument.vue";

const emit = defineEmits(['mounted'])

onMounted(() => {
  emit('mounted')
})

// Props 정의
const props = defineProps({
  save: Boolean,
  userInfo: null,
  healthCheckupRecordData: null,
  report_no: null,
  pdfScale: Number,
  page: Number,
});

const getElementList = computed(() => {
  // check_date 항목 제외
  const datas = { ...props.healthCheckupRecordData[0] };
  const filteredData = Object.keys(datas)
    .filter((key) => key !== "check_date")
    .sort(([, a], [, b]) => a.order - b.order)
    .map((key) => {
      // 화면에 표시되는 이름 변경 (영문명 추가) -> 25.07.23
      const { name, unit, en_name } = datas[key];
      let displayName = name;
      if (en_name != '') {
        displayName += ` (${en_name})`;
      }
      return {
        key: key,
        name: displayName,
        unit: unit,
      };
    });


  return filteredData;
});
const getDataList = computed(() => {
  // 뒤에서 부터 5개 데이터 가져오기
  let dataList = props.healthCheckupRecordData;
  return dataList;
});
</script>
<template>
  <div class="custom-page page a4">
    <div class="page-inside">
      <PageHeader :page="props.page"></PageHeader>
      <div class="title-container">
        <div class="title">
          <img src="@/assets/images/pdf/res/img-history.png" />
          <h3 class="stretch-text">{{ props.userInfo.user_name }}님의 건강검진 이력</h3>
        </div>
        <span class="stretch-text">
          최근 {{ getDataList.length }}회의 건강검진 결과의 수치 변화를 한눈에 확인하여 건강 상태 변화를 쉽게 비교해볼 수 있습니다.
          각 지표의 막대가 초록색 영역 안에 위치한다면 해당 지표는 정상 범위에 있는 것이며,
          초록색 영역 바깥에 위치한다면, 주의 또는 위험 수치이니 개선하기 위한 노력이 필요합니다.
        </span>
      </div>

      <div class="data-container">
        <div class="legend-container">
          <div class="legend1"></div>
          <span class="stretch-text">주의</span>
          <div class="legend2"></div>
          <span class="stretch-text">관리</span>
          <div class="legend3"></div>
          <span class="stretch-text">정상</span>
        </div>
        <template v-for="(list, i) in getElementList" :key="i">
          <div class="graph-wrap" v-if="props.healthCheckupRecordData.length > 0">
            <h3 :class="i >= 8 && i <= 11 ? 'double-line' : ''" class="stretch-text">
              {{
                list.name
              }}
            </h3>
            <!-- <div class="gap"></div> -->
            <div class="graph">
              <HistoryGraphDocument :data="getDataList" :data-ref="list.key" :pdfScale="props.pdfScale" />
            </div>
          </div>
        </template>
      </div>
      <div class="desc">
        <span class="stretch-text">
          각 지표의 주의/관리/정상 범위는 사용된 가장 최신 연도의 국민건강보험공단의 참고치를 따릅니다.
        </span>
      </div>
      <hr />
      <div class="bottom-info">
        *본 서비스는 질병의 예방 또는 진단을 목적으로 제공되는 서비스가 아닙니다.
        본인의 건강 상태에 대한 정확한 진단이 필요하신 경우 전문의와 상의하시기 바랍니다.
        체질량지수에는 체성분 정보가 반영될 수 있어, 건강검진 정보와 상이할 수 있습니다.
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixin.scss";
// @import "@/assets/scss/_document.scss";

.title-container {
  padding-top: calc(15px * $pdf-scale);
  height: calc(115px * $pdf-scale);

  .title {
    display: flex;
    gap: calc(12.57px * $pdf-scale);
    align-items: center;
  }

  span {
    display: inline-block;
    font-size: calc(11px * $pdf-scale);
    padding-left: calc(57.35px * $pdf-scale);
    line-height: calc(17px * $pdf-scale);
  }

  img {
    width: calc(42.9px * $pdf-scale) !important;
    height: calc(42.9px * $pdf-scale) !important;
    object-fit: contain;
  }

  h3 {
    font-size: calc(28px * $pdf-scale);
    color: #64A531;
    font-weight: $medium;

  }
}

.data-container {
  position: relative;
  @include flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  margin: 0 auto;
  width: 100%;
  height: calc(584px * $pdf-scale);
  margin-top: calc(10px * $pdf-scale);
  margin-bottom: calc(8px * $pdf-scale);
  border: calc(0.5px * $pdf-scale) solid #000000;

  padding: calc(23px * $pdf-scale) calc(8.6px * $pdf-scale);
  /* padding: calc(23px * $pdf-scale) calc(0px * $pdf-scale); */
  padding-bottom: 0;
}

.desc {
  @include flex(flex-start, flex-start);
  width: 100%;
  height: calc(28px * $pdf-scale);
  background-color: #F1F1F1;
  font-size: calc(10px * $pdf-scale);
  padding: calc(6px * $pdf-scale) calc(12px * $pdf-scale);
  color: #585859;
}

.graph-wrap {
  width: calc(115px * $pdf-scale);
  height: auto;
  position: unset;

  /* flex: 1; */
  h3 {
    /* @include flex(center, flex-end); */
    font-size: calc(8.5px * $pdf-scale);
    /* height: calc(11px * $pdf-scale); */
    font-weight: 500;
  }

  .double-line {
    height: calc(22px * $pdf-scale);
  }

  .graph {
    width: calc(115px * $pdf-scale);
    height: calc(116px * $pdf-scale);
    // padding-top: calc(5px * $pdf-scale);
  }
}

.legend-container {
  @include flex(center, center);
  position: absolute;
  top: calc(9px * $pdf-scale);
  right: calc(19.3px * $pdf-scale);

  .legend1 {
    display: inline-block;
    margin-right: calc(2.75px * $pdf-scale);

    width: calc(6px * $pdf-scale);
    height: calc(6px * $pdf-scale);
    background-color: #e29bb6;
  }

  .legend2 {
    margin-left: calc(8.62px * $pdf-scale);

    display: inline-block;
    margin-right: calc(2.75px * $pdf-scale);

    width: calc(6px * $pdf-scale);
    height: calc(6px * $pdf-scale);
    background-color: #f6ccaa;
  }

  .legend3 {
    margin-left: calc(8.62px * $pdf-scale);

    display: inline-block;
    margin-right: calc(2.75px * $pdf-scale);

    width: calc(6px * $pdf-scale);
    height: calc(6px * $pdf-scale);
    background-color: #c0dcad;
  }

  h3 {
    font-size: calc(12px * $pdf-scale);
  }

  span {
    display: inline-block;
    font-size: calc(6.5px * $pdf-scale);
  }
}

.bottom-info {
  bottom: calc(5px * $pdf-scale);
}

</style>