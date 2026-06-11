<script>

import BaseStep from '@/views/publishing/checkup/BaseStep.vue'
import router from '@/router'
import { bodyScroll } from '@/assets/js/common'
// 231204 다음 문항 자동 넘기는 함수 변경으로 기존 함수 삭제

export default {
  name: 'CheckupEq5d',
  components: {
    BaseStep
  },
  data () {
    return {
      nextDisabled: true, /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
      data: [
        {
          question: '일상생활 중에 스트레스를 어느정도 느끼고 있나요?',
          answer: [{
            label: '거의 없다',
            value: 0
          }, {
            label: '조금 있다',
            value: 1
          }, {
            label: '많이 있다',
            value: 2
          }, {
            label: '대단히 있다',
            value: 3
          }]
        },
        { question: '일상생활 중 걸을 때 지장이 있나요?' },
        { question: '일상생활 중 목욕을 하거나 옷을 입는데 지장이 있나요?' },
        { question: '평범한 일상생활을 하는데 지장이 있나요?' },
        { question: '일상생활에서 주로 사용하는 목, 어깨, 허리, 골반 등의 부위에서 움직이기 불편할 정도의 통증을 느끼나요?' },
        { question: '일상생활이 하기 힘들 정도로 불안하거나 우울한가요?' }
      ],
      answer: [
        {
          label: '거의 없다',
          value: 0
        },
        {
          label: '조금 있다',
          value: 1
        },
        {
          label: '많이 있다',
          value: 2
        }
      ],
      selectedValues: [], /* 선택된 값 */
      nullIndex: 0, /* 231201 선택하지 않은 문항, 231204 자동 문항 넘기기로 추가 */
      isPopWhyLife: false /* 삶의 질 넘어오기 전 나오는 팝업 오프너 */
    }
  },
  methods: {
    bodyScroll,
    /* 231201 답변 선택 시 다음 문항 이동 관련 */
    go () {
      if (this.nullIndex === -1) {
        return
      }
      this.scroll(this.nullIndex)
    },
    scroll (nullIndex) {
      let firstQ = 0
      if (nullIndex === 0) {
        firstQ = -70
      }
      window.scrollBy({
        top: document.getElementById('q' + nullIndex).getBoundingClientRect().top + firstQ,
        behavior: 'smooth'
      })
    },
    next () {
      router.push('/checkup-physical-activity')
    }
  },
  mounted () { /* 231201 추가 */
    this.selectedValues = Array.from({ length: this.data.length }, () => null) /* 문항 수 만큼의 빈 배열 생성 */
  },
  watch: {
    selectedValues: {
      handler () {
        // 231201 다음 문항 이동 로직 변경
        this.nullIndex = this.selectedValues.indexOf(null)
        if (!this.selectedValues.includes(null)) {
          window.scrollBy({
            top: document.querySelector('.btn--bottom').getBoundingClientRect().top,
            behavior: 'smooth'
          })
          this.nextDisabled = false
        }
      },
      deep: true
    },
    nullIndex () { /* 231201 다음 문항 이동 처리로 추가 */
      this.go()
    }
  }
}
</script>

<template>
  <section class="container CheckupEq5d">
    <BaseStep :step="`step4`" class="CheckupEq5d--step" />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-wrapT">
        <div class="CheckupEq5d--info">
          <p class="CheckupEq5d--p">
            <strong>일상생활</strong>에서 겪는
            증상을 아래 중 선택하세요
          </p>
        </div>
        <div class="CheckupEq5d--con">
          <div
            v-for="(item, index) in data"
            :key="index"
            :id="'q' + index"
            class="CheckupEq5d--div"> <!--231204 동적 id추가-->
            <p class="CheckupEq5d--q">
              {{ item.question }}
            </p>
            <div class="CheckupEq5d--a-div">

              <div
                v-if="index === 0"
                v-for="(ite, idx) in item.answer"
                :key="idx"
                class="CheckupEq5d--for">
                <label
                  @click="go"
                  :for="'ce' + index + idx"
                  class="CheckupEq5d--label"
                  :class="selectedValues[index] === idx ? 'active' : ''"> <!--231204 함수 변경-->
                  <input
                    v-model="selectedValues[index]"
                    :value="ite.value"
                    type="radio"
                    :name="'ce' + index"
                    :id="'ce' + index + idx"
                    class="CheckupEq5d--input"
                    hidden="hidden" />
                  <span v-html="ite.label" class="CheckupEq5d--span" />
                </label>
              </div>

              <div
                v-else
                v-for="(ite, idx2) in answer"
                :key="idx2"
                class="CheckupEq5d--for">
                <label
                  @click="go"
                  :for="'ce' + index + idx2"
                  class="CheckupEq5d--label"
                  :class="selectedValues[index] === idx2 ? 'active' : ''"> <!--231204 함수 변경-->
                  <input
                    v-model="selectedValues[index]"
                    :value="ite.value"
                    type="radio"
                    :name="'ce' + index"
                    :id="'ce' + index + idx2"
                    class="CheckupEq5d--input"
                    hidden="hidden" />
                  <span v-html="ite.label" class="CheckupEq5d--span" />
                </label>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div class="btn--bottom CheckupEq5d--btn-div">
        <button
          @click="next"
          :disabled="nextDisabled"
          type="button"
          class="CheckupEq5d--btn">다음</button>
      </div>
    </div>

    <button @click="isPopWhyLife = true" type="button">삶의 질 페이지 넘어보기 전 나오는 팝업 띄우기(개발 후 삭제 요망)</button>

    <!-- 팝업을 띄울 때는 onBeforeMounted에 bodyScroll(true): 바닥페이지 스크롤 없앰, unBeforeMounted에 bodyScroll(false)을 넣어줘야 함-->
    <div v-if="isPopWhyLife" class="popup base-pop whyLife">
      <div class="popup--wrap tit">
        <div class="align--between popup--header">
          <div>
            <button
              class="header--back-btn"
              title="뒤로"
              type="button" />
          </div>
          <div class="popup--tit-wrap" />
          <div>

            <!--이 버튼의 기능은 팝업을 닫는 것과 임시저장의 기능이 함께 있다고 함, 문의사항 발생 시 기획자에게 문의 요망-->
            <button
              @click="isPopWhyLife = false"
              type="button"
              class="popup--close"
              aria-label="임시저장" />

          </div>
        </div>
        <div class="popup--space space">
          <p class="whyLife--txt">삶의 질 설문은 왜 필요할까요?</p>
          <p class="whyLife--con">본 설문은 질병관리청에서 검증한 표준화된 내용으로 건강과 관련된 삶의 질을 평가하기 위해 국민건강영양조사에서도 사용하는 공신력 있는 질문입니다.</p>
          <div class="base-pop--footer">
            <button class="btn--big6" type="button">확인</button>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<style lang="scss"></style>
