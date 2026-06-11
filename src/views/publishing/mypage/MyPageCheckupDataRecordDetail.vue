<script>

import BaseInput from '@/views/publishing/checkup/BaseInput.vue'

export default {
  name: 'MyPageCheckupDataRecordDetail',
  components: { BaseInput },
  data () {
    return {
      prefix: 'MyPageCheckupDataRecordDetail', /* 231211 클래스 접두어 */
      data: {
        date: '2023. 10. 25',
        label: '국민건강보험공단'
      },
      index: [
        {
          tit: '수축기 혈압',
          index: 81,
          unit: 'mmHg'
        },
        {
          tit: '이완기 혈압',
          index: 98,
          unit: 'mmHg'
        },
        {
          tit: '공복혈당',
          index: '-',
          unit: 'mg/dl'
        },
        {
          tit: '중성지방',
          index: '-',
          unit: 'mg/dl'
        },
        {
          tit: '총콜레스테롤',
          index: '-',
          unit: 'mg/dl'
        },
        {
          tit: '고밀도 콜레스테롤',
          index: '-',
          unit: 'mg/dl'
        },
        {
          tit: '저밀도 콜레스테롤',
          index: '-',
          unit: 'mg/dl'
        },
        {
          tit: '체질량지수',
          index: 110,
          unit: 'kg/m2'
        },
        {
          tit: '허리둘레',
          index: 32,
          unit: 'cm'
        },
        {
          tit: '아스파테이트, 아미노 전이효소',
          index: 56,
          unit: 'IU/ℓ'
        },
        {
          tit: '알라닌, 아미노 전이효소',
          index: 87,
          unit: 'IU/ℓ'
        },
        {
          tit: '혈청 크레아타닌',
          index: 110,
          unit: 'mg/dl'
        },
        {
          tit: '혈색소',
          index: 90,
          unit: 'g/dl'
        }
      ]
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<template>
  <div :class="prefix">
    <div :class="prefix + '--top'">
      <dl :class="prefix + '--dl'">
        <dt>건강 검진일</dt>
        <dd>: {{ data.date }}</dd>
        <dt>건강 데이터</dt>
        <dd>: {{ data.label }}</dd>
      </dl>
      <div :class="prefix + '--btn-wrap'">
        <button type="button" :class="prefix + '--btn'">이 검진 데이터로 분석 시작하기</button>
      </div>
    </div>
    <div :class="prefix + '--data'">
      <BaseInput
        v-for="item in index"
        :itemName="item.tit"
        :value="item.index"
        :disabled="false"
        :suf="item.unit"
        class="CheckupBasicsBasic--name" />
    </div>
  </div>
</template>

<style lang="scss"></style>
