<script>

import BaseStep from '@/views/publishing/checkup/BaseStep.vue'
import router from '@/router'
// 231204 함수 삭제

export default {
  name: 'CheckupMenopause',
  components: { BaseStep },
  data() {
    return {
      nextDisabled: true, /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
      data: [
        { question: '얼굴이 달아오르거나 밤에 땀이 난다' },
        { question: '손발이 저리거나 짜릿한 느낌이 든다' },
        { question: '잠들기 어렵거나 깨어나서 다시 자기 어렵다' },
        { question: '신경질을 잘 부리고 괜히 불안해진다' },
        { question: '울적한 느낌이 들 때가 있다' },
        { question: '현기증이 난다' },
        { question: '쉽게 피로하다' },
        { question: '관절 마디나 근육에 통증이 느껴진다' },
        { question: '머리가 자주 아프다' },
        { question: '가슴이 두근두근 거린다' },
        { question: '작은 곤충이 피부에 기어가는 듯한 가려움이 있다' },
        { question: '질이 건조하고 분비물이 감소된 것 같다' }
      ],
      answer: [
        { label: '없음', value: 0 },
        { label: '가끔', value: 1 },
        { label: '자주', value: 2 },
        { label: '항상', value: 3 }
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
      router.push('/checkup-prostate')
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
  <section class="container CheckupMenopause">
    <BaseStep :step="`step3`" class="CheckupMenopause--step" />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-wrapT">
        <div class="CheckupMenopause--info">
          <strong>여성 갱년기</strong> 증상과 관련하여
          아래 증상에 답 해주세요
        </div>
        <div class="CheckupMenopause--con">
          <div v-for="(item, index) in data" :key="index" :id="'q' + index" class="CheckupMenopause--div">
            <!--231204 동적 id추가-->
            <p class="CheckupMenopause--q">
              {{ item.question }}
            </p>
            <div class="align--around CheckupMenopause--a-div">
              <div v-for="(ite, idx) in answer" :key="idx" class="CheckupMenopause--for">
                <label @click="go" :for="'Menopause' + index + idx" class="txt--center CheckupMenopause--label"
                  :class="selectedValues[index] === idx ? 'active' : ''"> <!--231204 함수 변경, 동적 class 추가-->
                  <input v-model="selectedValues[index]" :value="ite.value" type="radio" :name="'Menopause' + index"
                    :id="'Menopause' + index + idx" class="CheckupMenopause--input" hidden="hidden">
                  <span class="radio--icon"></span>
                  <span class="CheckupMenopause--span" v-html="ite.label"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn--bottom CheckupMenopause--btn-div">
        <button @click="next" :disabled="nextDisabled" type="button" class="CheckupMenopause--btn">다음</button>
      </div>
    </div>
  </section>
</template>

<style lang="scss"></style>
