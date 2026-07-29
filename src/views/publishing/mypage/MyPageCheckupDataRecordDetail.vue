<script>

import BaseInput from '@/views/publishing/checkup/BaseInput.vue'
import BtnTop from '@/views/publishing/BtnTop.vue'

export default {
  name: 'MyPageCheckupDataRecordDetail',
  components: { BaseInput, BtnTop },
  data () {
    return {
      prefix: 'MyPageCheckupDataRecordDetail', /* 231211 클래스 접두어 */
      data: {
        date: '2023.10.25',
        label: '국민건강보험공단'
      },
      index: [
        {
          tit: '수축기(최고) 혈압',
          index: 81,
          unit: 'mmHg'
        },
        {
          tit: '이완기(최저) 혈압',
          index: 98,
          unit: 'mmHg'
        },
        {
          tit: '공복혈당\n(Glucose)',
          index: 56,
          unit: 'mg/dl'
        },
        {
          tit: '중성지방\n(Triglyceride)',
          index: '-',
          unit: 'mg/dl'
        },
        {
          tit: '총콜레스테롤\n(T-Cholesterol)',
          index: '-',
          unit: 'mg/dl'
        },
        {
          tit: '고밀도 콜레스테롤\n(HDL-C)',
          index: '-',
          unit: 'mg/dl'
        },
        {
          tit: '저밀도 콜레스테롤\n(LDL-C)',
          index: '-',
          unit: 'mg/dl'
        },
        {
          tit: '체질량지수',
          index: 61,
          unit: 'kg/m2'
        },
        {
          tit: '허리둘레',
          index: 110,
          unit: 'cm'
        },
        {
          tit: '아스파테이트 아미노전이효소\n(AST/SGOT)',
          index: 98,
          unit: 'IU/ℓ'
        },
        {
          tit: '알라닌 아미노전이효소\n(ALT/SGPT)',
          index: 56,
          unit: 'IU/ℓ'
        },
        {
          tit: '혈청 크레아타닌\n(Cr/Creatinine)',
          index: 1,
          unit: 'mg/dl'
        },
        {
          tit: '혈색소\n(Hb/Hemoglobin)',
          index: 61,
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
      <div class="tag-wrap">
        <span class="tag" :class="data.label === '국민건강보험공단' ? 'red' : '직접입력' ? 'biolet' : ''">
          {{ data.label }}
        </span>
      </div>
      <dl :class="prefix + '--dl'">
        <dt>건강 검진일</dt>
        <dd>{{ data.date }}</dd>
      </dl>
      <div :class="prefix + '--btn-wrap'">
        <button type="button" :class="prefix + '--btn'">이 검진 데이터로 분석 시작하기</button>
      </div>
    </div>
    <div :class="prefix + '--data'">
      <BaseInput
        v-for="item in index"
        :key="item.tit"
        :itemName="item.tit"
        :value="item.index"
        :disabled="false"
        :suf="item.unit"
        :type="item.index === '-' ? 'text' : 'number'"
        class="CheckupBasicsBasic--name" />
    </div> <!-- 202626 데이터 없으면='-' type text-->
    
    <BtnTop />
  </div>
</template>

<style lang="scss"></style>
