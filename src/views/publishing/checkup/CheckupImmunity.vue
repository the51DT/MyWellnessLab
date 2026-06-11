<script>

import BaseStep from '@/views/publishing/checkup/BaseStep.vue'
import router from '@/router'
// 231204 함수 삭제

export default {
  name: 'CheckupImmunity',
  components: { BaseStep },
  data() {
    return {
      nextDisabled: true, /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
      data: [
        { question: '피로가 잘 풀리지 않는다' },
        { question: '감기에 자주 걸리고 잘 낫지 않는다' },
        { question: '입안이 헐거나 입 주위 물집이 생긴다' },
        { question: '눈에 염증이 자주 생긴다' },
        { question: '스트레스가 자주 쌓인다' },
        { question: '상처가 잘 낫지 않는다' },
        { question: '체력이 급격히 떨어진다' },
        { question: '인내력과 끈기가 없어진다' },
        { question: '배탈 혹은 설사가 잦다' },
        { question: '눈 밑에 다크서클이 자주 생긴다' }
      ],
      answer: [
        { label: '아니요', value: 0 },
        { label: '예', value: 1 }
      ],
      selectedValues: [], /* 선택된 값 */
      nullIndex: 0 /* 231201 선택하지 않은 문항 */
    }
  },
  methods: {
    /* 231201 답변 선택 시 다음 문항 이동 관련 */
    go() {
      if (this.nullIndex === -1) {
        return
      }
      this.scroll(this.nullIndex)
    },
    scroll(nullIndex) {
      let firstQ = 0
      if (nullIndex === 0) {
        firstQ = -70
      }
      window.scrollBy({ top: document.getElementById('q' + nullIndex).getBoundingClientRect().top + firstQ, behavior: 'smooth' })
    },
    next() {
      router.push('/checkup-menopause')
    }
  },
  mounted() { /* 231201 추가 */
    this.selectedValues = Array.from({ length: this.data.length }, () => null) /* 문항 수 만큼의 빈 배열 생성 */
  },
  watch: {
    selectedValues: {
      handler() {
        // 231201 다음 문항 이동 로직 변경
        this.nullIndex = this.selectedValues.indexOf(null)
        if (!this.selectedValues.includes(null)) {
          window.scrollBy({ top: document.querySelector('.btn--bottom').getBoundingClientRect().top, behavior: 'smooth' })
          this.nextDisabled = false
        }
      },
      deep: true
    },
    nullIndex() { /* 231201 다음 문항 이동 처리로 추가 */
      this.go()
    }
  }
}
</script>

<template>
  <section class="container CheckupImmunity">
    <BaseStep :step="`step3`" class="CheckupImmunity--step" />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-wrapT">
        <div class="CheckupImmunity--info">
          <strong>면역</strong>과 관련하여
          아래 증상에 답 해주세요
        </div>
        <div class="CheckupImmunity--con">
          <div v-for="(item, index) in data" :key="index" :id="'q' + index" class="CheckupImmunity--div">
            <!--231204 동적 id 추가-->
            <p class="CheckupImmunity--q">
              {{ item.question }}
            </p>
            <div class="align--between CheckupImmunity--a-div">
              <div v-for="(ite, idx) in answer" :key="idx" class="CheckupImmunity--for">
                <label @click="go" :for="'ci' + index + idx" class="CheckupImmunity--label"
                  :class="selectedValues[index] === idx ? 'active' : ''"> <!--231204 함수 변경-->
                  <input v-model="selectedValues[index]" :value="ite.value" type="radio" :name="'ci' + index"
                    :id="'ci' + index + idx" class="CheckupImmunity--input" hidden="hidden">
                  <span class="CheckupImmunity--span">{{ ite.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn--bottom CheckupImmunity--btn-div">
        <button @click="next" :disabled="nextDisabled" type="button" class="CheckupImmunity--btn">다음</button>
      </div>
    </div>
  </section>
</template>

<style lang="scss"></style>
