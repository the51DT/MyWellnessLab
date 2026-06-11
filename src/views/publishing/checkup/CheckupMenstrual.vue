<script>

import BaseStep from '@/views/publishing/checkup/BaseStep.vue'
import router from '@/router'

export default {
  name: 'CheckupMenstrual',
  components: { BaseStep },
  data() {
    return {
      nextDisabled: true, /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
      data: [
        {
          answer: [
            { label: '생리(월경) 중', value: 0 },
            { label: '6개월 내 자녀계획 있음', value: 1 },
            { label: '임신 중', value: 2 },
            { label: '수유 중', value: 3 },
            { label: '폐경기 (마지막 생리 후 1년 미만)', value: 4 },
            { label: '폐경 (마지막 생리 후 1년 이상)', value: 5 },
            { label: '인공 폐경', value: 6 }]
        }
      ],
      selectedValues: [] /* 선택된 값 */
    }
  },
  methods: {
    next() {
      router.push('/checkup-eq5d')
    }
  },
  watch: {
    selectedValues: {
      handler() {
        if (this.selectedValues.length === this.data.length && this.selectedValues.indexOf(null) === -1) {
          this.nextDisabled = false
        }
      },
      deep: true
    }
  }
}
</script>

<template>
  <section class="container CheckupMenstrual">
    <BaseStep :step="`step3`" class="CheckupMenstrual--step" />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-wrapT">
        <div class="CheckupMenstrual--info">
          <p class="CheckupMenstrual--p">
            현재 <strong>월경(생리, 달거리)</strong> 여부를 알려주세요!
          </p>
        </div>
        <div class="CheckupMenstrual--con">
          <div v-for="(item, index) in data" :key="index" class="CheckupMenstrual--div">
            <p class="CheckupMenstrual--q">
              {{ item.question }}
            </p>
            <div class="CheckupMenstrual--a-div">
              <div v-for="(ite, idx) in item.answer" :key="idx" class="CheckupMenstrual--for">
                <label :for="'cm' + index + idx" class="CheckupMenstrual--label"
                  :class="selectedValues[index] === idx ? 'active' : ''">
                  <input v-model="selectedValues[index]" :value="ite.value" type="radio" :name="'cm' + index"
                    :id="'cm' + index + idx" class="CheckupMenstrual--input" hidden="hidden">
                  <span v-html="ite.label" class="CheckupMenstrual--span"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn--bottom CheckupMenstrual--btn-div">
        <button @click="next" :disabled="nextDisabled" type="button" class="CheckupMenstrual--btn">다음</button>
      </div>
    </div>

  </section>
</template>

<style lang="scss"></style>
