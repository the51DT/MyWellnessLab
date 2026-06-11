<script>

import BaseStep from '@/views/publishing/checkup/BaseStep.vue'
import router from '@/router'

export default {
  name: 'CheckupInterestHealth',
  components: { BaseStep },
  data() {
    return {
      nextDisabled: true, /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
      data: [
        { label: '기억력', value: 0 },
        { label: '긴장완화', value: 1 },
        { label: '수면', value: 2 },
        { label: '피로', value: 3 },
        { label: '눈', value: 4 },
        { label: '피부', value: 5 },
        { label: '위', value: 6 },
        { label: '간', value: 7 },
        { label: '체지방', value: 8 },
        { label: '중성지방', value: 9 },
        { label: '콜레스테롤', value: 10 },
        { label: '혈압', value: 11 },
        { label: '혈행', value: 12 },
        { label: '혈당', value: 13 },
        { label: '전립선', value: 14 }, /* 여성일 경우: {label: "갱년기", value: "갱년기"}, */
        { label: '관절/뼈', value: 15 },
        { label: '근육', value: 16 },
        { label: '과민 피부상태', value: 17 },
        { label: '면역', value: 18 },
        { label: '항산화', value: 19 },
        { label: '코 과민반응', value: 20 },
        { label: '운동/지구력', value: 21 }
      ],
      checkedValues: [], /* 선택된 분야 */
      notInterest: false /* 관심 분야 없음 */
    }
  },
  methods: {
    next() {
      if (this.checkedValues.length === 0) {
        alert('한 개 이상 선택해야 합니다')
        return
      }
      if (this.notInterest) {
        router.push('') /* 삶의 질로 이동 처리 요망 */
        return
      }
      router.push('/checkup-memory')
    }
  },
  watch: {
    checkedValues() {
      if (this.checkedValues.length > 3) {
        alert('3개 초과 선택할 수 없습니다')
        this.checkedValues.pop()
      } else if (this.checkedValues.length > 0) {
        this.notInterest = false
        this.nextDisabled = false
      } else if (this.checkedValues.length === 0) {
        this.nextDisabled = true
      }
    }
  }

}
</script>

<template>
  <section class="container CheckupInterestHealth">
    <BaseStep :step="`step3`" class="CheckupInterestHealth--step" />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-wrapT">
        <div class="CheckupInterestHealth--info">
          <strong class="CheckupInterestHealth--info-strong">관심 건강분야를 최대 3개</strong>까지 선택해주세요.
        </div>
        <div class="CheckupInterestHealth--item-div">
          <label v-for="(item, index) in data" :for="'cih' + index" class="CheckupInterestHealth--label"
            :class="{ 'active': checkedValues.includes(item.value), 'disabled': notInterest }">
            <input v-model="checkedValues" :value="item.value" :disabled="notInterest" type="checkbox" name=""
              :id="'cih' + index" hidden="hidden" class="CheckupInterestHealth--input">
            <span class="CheckupInterestHealth--span">{{ item.label }}</span>
          </label>
        </div>
        <hr class="gray">
        <label for="qqw" class="CheckupInterestHealth--noSelect" :class="notInterest ? 'active' : ''">
          <input v-model="notInterest" type="checkbox" name="" id="qqw" hidden="hidden">
          <span>관심 건강분야 없음</span>
        </label>
        <!--          <button type="button" class="CheckupInterestHealth&#45;&#45;noSelect">관심 건강분야 없음</button>-->
        <p class="CheckupInterestHealth--msg">
          * 관심 건강분야가 없는 경우 선택해주세요
        </p>
      </div>
      <div class="btn--bottom CheckupInterestHealth----btn-div">
        <button @click="next" :disabled="nextDisabled" type="button" class="CheckupInterestHealth----btn">다음</button>
      </div>
    </div>
  </section>
</template>

<style lang="scss"></style>
