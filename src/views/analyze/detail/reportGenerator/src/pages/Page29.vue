<script setup>
import { computed } from 'vue'
import PageHeader from '../PageHeader.vue'
import { useCommonForm } from '@/utils/commonForm'

const { ABC_FORM } = useCommonForm()
const props = defineProps({
  save: Boolean,
  userInfo: null,
  regDate: null,
  analyzeDetail: {
    type: Object,
    default: null
  },
  prevABCDetail: {
    type: Object,
    default: null
  }
})

const prevScore = computed(() => {
  if (!props.prevABCDetail) {
    return {
      oxi: '',
      met: ''
    }
  }

  const { OXI, MET } = props.prevABCDetail.hqData

  return {
    oxi: String(OXI.toFixed(0)),
    met: String(MET.toFixed(0))
  }
})

const currentScore = computed(() => {
  const { OXI, MET } = props.analyzeDetail.hqData

  return {
    oxi: String(OXI.toFixed(0)),
    met: String(MET.toFixed(0))
  }
})

const list = computed(() => {
  const result = []
  const currentHriStatus = props.analyzeDetail.hriStatus
  const prevHriStatus = props.prevABCDetail?.hriStatus

  for (const key in ABC_FORM) {
    const currentStatus = currentHriStatus[key]
    const prevStatus = prevHriStatus ? prevHriStatus[key] : ''

    result.push({
      key,
      label: ABC_FORM[key].labelUnit,
      current: getClass(currentStatus),
      prev: getClass(prevStatus)
    })
  }

  return result
})

/**
 * 상태값에 따른 클래스 반환
 * @param {*} status
 * @returns {string}
 */
const getClass = (status) => {
  switch (status) {
    case 1:
      return 'safe'
    case 2:
      return 'warning'
    case 3:
      return 'danger'
    default:
      return ''
  }
}
</script>

<template>
  <div id="page" class="custom-page a4" :class="save ? 'stretch-page' : ''">
    <div class="page-inside">
      <PageHeader page="25" />
      <div class="title-container">
        <div class="title">
          <img src="/img/pdf/res/img-type.png" alt="" />
          <h3 class="stretch-text">{{ $t('Page29.text1') }}</h3>
        </div>
        <span class="stretch-text">
          {{ userInfo.name }}{{ $t('Page29.text2') }} {{ props.analyzeDetail.hqData.Health_Type }} {{ $t('Page29.text3') }}<br />
          {{ $t('Page29.text4') }}
        </span>
      </div>
      <div class="subject">
        <h3 class="stretch-text">{{ $t('Page29.text5') }}</h3>
        <div class="legend-container">
          <div class="legend1" />
          <span class="stretch-text">{{ $t('Common.warning') }}</span>
          <div class="legend2" />
          <span class="stretch-text">{{ $t('Common.manage') }}</span>
          <div class="legend3" />
          <span class="stretch-text">{{ $t('Common.good') }}</span>
        </div>
      </div>
      <div class="data-container">
        <div class="top stretch-text">{{ $t('Page29.text9') }}</div>
        <div class="top stretch-text" />
        <div class="top bold-light stretch-text">
          <template v-if="props.prevABCDetail">
            {{ props.prevABCDetail.regDate }}
          </template>
        </div>
        <div class="top bold-light stretch-text">{{ props.regDate }}</div>

        <div class="content cell bt bb">
          <span class="stretch-text">{{ $t('Page29.text10') }}</span>
        </div>
        <div class="content row">
          <span class="stretch-text">{{ $t('Page29.text11') }}</span>
        </div>
        <div class="content row2">
          <span class="stretch-text">{{ $t('Page29.text12') }}</span>
        </div>

        <div class="content-title bg black bt">
          <span class="stretch-text"> {{ $t('Page29.text13') }} </span>
        </div>
        <div class="content bg black bt">
          <span v-if="prevABCDetail" class="stretch-text">{{ prevScore.oxi }}{{ $t('Common.score') }}</span>
        </div>
        <div class="content bg black bt">
          <span class="stretch-text">{{ currentScore.oxi }}{{ $t('Common.score') }}</span>
        </div>

        <div class="content-title bg black bb">
          <span class="stretch-text">{{ $t('Page29.text15') }}</span>
        </div>
        <div class="content bg black bb">
          <span v-if="prevABCDetail" class="stretch-text">{{ prevScore.met }}{{ $t('Common.score') }}</span>
        </div>
        <div class="content bg black bb">
          <span class="stretch-text">{{ currentScore.met }}{{ $t('Common.score') }}</span>
        </div>

        <template v-for="(item) in list" :key="item.key">
          <div class="content-title">
            <span class="stretch-text">
              {{ item.label }}
            </span>
          </div>
          <div class="content">
            <span :class="item.prev" />
          </div>
          <div class="content">
            <span :class="item.current" />
          </div>
        </template>

        <div class="content-title bg last cell2 bt bb">
          <span class="stretch-text">{{ $t('Page29.text16') }}</span>
        </div>
        <div class="content-type bg bold bt bb">
          <span v-if="props.prevABCDetail" class="stretch-text">{{ props.prevABCDetail.hqData.Health_Type }}</span>
        </div>
        <div class="content-type bg bold bt bb">
          <span class="stretch-text">{{ props.analyzeDetail.hqData.Health_Type }}</span>
        </div>
      </div>

      <hr />
      <div class="bottom-info">
        {{ $t('Page29.text17') }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/css/pdf/_variables.scss";
@import "@/assets/css/pdf/document.scss";

.title-container {
  @include flex(flex-start, flex-start);
  flex-direction: column;
  height: calc(145.69px * $pdf-scale);
  padding-top: calc(22px * $pdf-scale);

  border-bottom: calc(0.3px * $pdf-scale) solid #000000;

  .title {
    display: flex;
    gap: calc(12.57px * $pdf-scale);
    align-items: center;
  }

  span {
    display: inline-block;
    font-size: calc(10px * $pdf-scale);
    padding-left: calc(53.35px * $pdf-scale);
    line-height: 150%;
  }

  img {
    width: calc(42.9px * $pdf-scale);
    height: calc(42.9px * $pdf-scale);
    object-fit: contain;
  }

  h3 {
    font-size: calc(28px * $pdf-scale);
    color: $tit-color;
  }
}

.data-container {
  @include flex;
  flex-direction: column;
  /* gap: calc(22.2px * $pdf-scale); */

  position: relative;
  width: 100%;

  margin-top: calc(19px * $pdf-scale);
  margin-bottom: calc(36.24px * $pdf-scale);
  /* border: calc(0.3px * $pdf-scale) solid #000000; */

  border-bottom: calc(0.3px * $pdf-scale) solid #000000;
  border-left: none;
  border-right: none;
  /* border-bottom: calc(0.3px * $pdf-scale) solid #000000; */
  display: grid;
  grid-template-columns:
    calc(56.69px * $pdf-scale) 1fr calc(89.66px * $pdf-scale)
    calc(89.66px * $pdf-scale);
  /* calc(112.58px * $pdf-scale) */
  grid-template-rows: repeat(22, calc(22.545px * $pdf-scale)) calc(
      35.38px * $pdf-scale
    );

  align-items: center;
  justify-items: center;
  color: #000000;

  .top {
    font-size: calc(10px * $pdf-scale);
    color: #727171;
  }

  .content-title {
    font-size: calc(12px * $pdf-scale);
    @include flex(flex-start, center);
    padding-left: calc(6.6px * $pdf-scale);
    width: 100%;
    height: 100%;
    /* border-right: calc(0.5px * $pdf-scale) solid #000000; */
    border-top: calc(0.3px * $pdf-scale) solid #000000;
    font-weight: 300;
  }

  .last {
    font-weight: 600;
  }

  .content {
    font-size: calc(12px * $pdf-scale);
    @include flex(center, center);
    width: 100%;
    height: 100%;
    border-left: calc(0.5px * $pdf-scale) solid #000000;
    border-top: calc(0.3px * $pdf-scale) solid #000000;
  }

  .content-type {
    font-size: calc(18px * $pdf-scale);
    @include flex(center, center);
    width: 100%;
    height: 100%;
    border-left: calc(0.5px * $pdf-scale) solid #000000;
    border-top: calc(0.3px * $pdf-scale) solid #000000;
  }

  .bold {
    font-weight: 700;
  }

  .bg {
    background-color: #eff7ef;
    color: #00a856;
  }

  .cell {
    grid-row: 2/4;
    background-color: #eff7ef;
    border-left: none;
    border-right: calc(0.5px * $pdf-scale) solid #000000;
    border-width: 0 calc(0.5px * $pdf-scale) 0 0;
  }
  .row {
    border-left: none;
    grid-row: 4/17;
    @include flex(center, center);
    width: 100%;
    height: 100%;
    border-right: calc(0.5px * $pdf-scale) solid #000000;
    border-top: calc(0.3px * $pdf-scale) solid #000000;
    font-weight: 500;
  }
  .row2 {
    border-left: none;
    grid-row: 17/23;
    @include flex(center, center);
    width: 100%;
    height: 100%;
    border-right: calc(0.5px * $pdf-scale) solid #000000;
    border-top: calc(0.3px * $pdf-scale) solid #000000;
    font-weight: 500;
  }

  .cell2 {
    grid-column: 1/3;
  }

  .black {
    color: #000000;
  }

  .bt {
    border-top: calc(1px * $pdf-scale) solid #000000;
  }
  .bb {
    border-bottom: calc(1px * $pdf-scale) solid #000000;
  }

  .danger {
    border-radius: 50%;
    width: calc(12.76px * $pdf-scale);
    height: calc(12.76px * $pdf-scale);

    background-color: #e95371;
  }

  .warning {
    border-radius: 50%;
    width: calc(12.76px * $pdf-scale);
    height: calc(12.76px * $pdf-scale);

    background-color: #f8b500;
  }

  .safe {
    border-radius: 50%;
    width: calc(12.76px * $pdf-scale);
    height: calc(12.76px * $pdf-scale);

    background-color: #5ab651;
  }
}

.desc-title {
  font-size: calc(10px * $pdf-scale);
  margin-bottom: calc(7.76px * $pdf-scale);
  font-weight: bold;
}

.desc {
  width: 100%;
  height: calc(66px * $pdf-scale);
  background-color: #e9f4f0;
  font-size: calc(13px * $pdf-scale);
  padding: calc(12.88px * $pdf-scale) calc(17.07px * $pdf-scale);
}
.subject {
  display: flex;
  justify-content: space-between;
  padding-top: calc(10.18px * $pdf-scale);
  padding-right: calc(10.35px * $pdf-scale);
  /* margin-bottom: calc(6.81px * $pdf-scale); */

  .legend-container {
    @include flex(center, center);
  }
  .legend1 {
    display: inline-block;
    margin-right: calc(2.75px * $pdf-scale);

    width: calc(5.35px * $pdf-scale);
    height: calc(5.35px * $pdf-scale);
    background-color: #e95371;
  }
  .legend2 {
    margin-left: calc(12.24px * $pdf-scale);

    display: inline-block;
    margin-right: calc(2.75px * $pdf-scale);

    width: calc(5.35px * $pdf-scale);
    height: calc(5.35px * $pdf-scale);
    background-color: #f8b500;
  }

  .legend3 {
    margin-left: calc(12.24px * $pdf-scale);

    display: inline-block;
    margin-right: calc(2.75px * $pdf-scale);

    width: calc(5.35px * $pdf-scale);
    height: calc(5.35px * $pdf-scale);
    background-color: #5ab651;
  }
  h3 {
    font-size: calc(12px * $pdf-scale);
    font-weight: 500;
  }
  span {
    display: inline-block;
    font-size: calc(6.5px * $pdf-scale);
  }

  h3 {
    font-size: calc(12px * $pdf-scale);
  }
}

.data {
  @include flex(flex-start, flex-start);
  width: 100%;
  height: calc(189.39px * $pdf-scale);

  border-top: calc(0.3px * $pdf-scale) solid #000000;
  border-bottom: calc(0.3px * $pdf-scale) solid #000000;

  .item1 {
    position: relative;

    padding: calc(12.02px * $pdf-scale) calc(10.79px * $pdf-scale);
    width: calc(174.81px * $pdf-scale);
    height: 100%;
    border-right: calc(0.5px * $pdf-scale) solid #000000;
    font-size: calc(12px * $pdf-scale);
    line-height: 150%;
  }

  .item2 {
    flex: 1;
    height: 100%;
    font-size: calc(16px * $pdf-scale);
    line-height: 150%;

    padding-left: calc(22.28px * $pdf-scale);
    @include flex(flex-start, center);
  }

  .interest {
    background-color: #eaf6fc;
    .name {
      position: absolute;
      bottom: calc(18.25px * $pdf-scale);
      right: calc(18.56px * $pdf-scale);

      color: #00b4de;
      font-size: calc(19px * $pdf-scale);
    }
  }

  .danger {
    background-color: #fce5e4;
    .name {
      position: absolute;
      bottom: calc(18.25px * $pdf-scale);
      right: calc(18.56px * $pdf-scale);

      color: #ea6176;
      font-size: calc(19px * $pdf-scale);
    }
  }

  .warning {
    background-color: #fbfbe2;
    .name {
      position: absolute;
      bottom: calc(18.25px * $pdf-scale);
      right: calc(18.56px * $pdf-scale);

      color: #f7b141;
      font-size: calc(19px * $pdf-scale);
    }
  }
}

.bold-light {
  font-weight: 700;
}

hr {
  margin-top: calc(139px * $pdf-scale);
}
</style>
