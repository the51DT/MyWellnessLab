<script>

import BaseStep from '@/views/publishing/checkup/BaseStep.vue'
import router from '@/router'
// 231204 함수 변경

export default {
  name: 'CheckupEye',
  components: { BaseStep },
  data() {
    return {
      nextDisabled: true, /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
      data: [
        { question: '눈이 피로하다' },
        { question: '눈이 시리다, 아프다' },
        { question: '눈이  자극감이 든다' },
        { question: '눈물이 난다' },
        { question: '눈이 건조하다' },
        { question: '눈에 압박감이 있다' },
        { question: '눈이 뜨겁다' },
        { question: '흐리게 보인다 ' },
        { question: '초점 맞추기 어렵다' },
        { question: '시청에 불편감이 있다' }
      ],
      answer: [ /* 240103 4단계로 줄어듬 */
        { label: '증상 없음', value: 0 },
        { label: '경미', value: 1 },
        { label: '중간', value: 3 },
        { label: '심함', value: 5 }
      ],
      selectedValues: [], /* 선택된 값 */
      nullIndex: 0, /* 231201 선택하지 않은 문항 */
      nextCheck: false /* 하단의 다음 버튼을 눌렀는지? */
    }
  },
  methods: {
    /* 231201 답변 선택 시 다음 문항 이동 관련 */
    go(val) {
      if (!this.nextCheck) {
        if (val >= this.data.length - 1) {
          return
        }
        val += 1
      }
      this.scroll(val)
    },
    scroll(nullIndex) {
      let firstQ = 0
      if (nullIndex === 0) {
        firstQ = -70
      }
      window.scrollBy({ top: document.getElementById('q' + nullIndex).getBoundingClientRect().top + firstQ, behavior: 'smooth' })
    },
    next() {
      this.nextCheck = true
      if (this.nullIndex >= 0) {
        if (confirm("모든 항목을 입력하셔야 설문을 완료할 수 있습니다\n'확인'을 누르시면 이어서 설문을 진행할 수 있고 '취소'를 누르시면 임시저장 후 종료됩니다")) {
          this.go(this.nullIndex)
        } else {
          // 임시저장 후 이동 로직 추가바랍니다
        }
        return
      }
      router.push('/checkup-nose-hypersensitivity')
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
      },
      deep: true
    },

    nullIndex() { /* 231201 다음 문항 이동 처리로 추가 */
      if (this.nextCheck) {
        if (this.nullIndex >= 0) {
          this.go(this.nullIndex)
        } else {
          this.go(this.data.length - 1)
        }
      }
    }

  }
}
</script>

<template>
  <section class="container CheckupEye">
    <BaseStep :step="`step3`" class="CheckupEye--step" />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-wrapT">
        <div class="CheckupEye--info">
          <strong>눈 건강</strong>과 관련하여
          아래 증상의 정도를 답 해주세요
        </div>
        <div class="CheckupEye--con">
          <div v-for="(item, index) in data" :key="index" :id="'q' + index" class="CheckupEye--div"> <!--231204 동적 id 추가-->
            <p class="CheckupEye--q">
              {{ item.question }}
            </p>
            <div class="align--between CheckupEye--a-div">
              <div v-for="(ite, idx) in answer" :key="idx" class="CheckupEye--for">
                <label @click="go(index)" :for="'eye' + index + idx" class="txt--center CheckupEye--label"
                  :class="selectedValues[index] === idx ? 'active' : ''"> <!--231204 함수변경, 동적 class 추가-->
                  <input v-model="selectedValues[index]" :value="ite.value" type="radio" :name="'eye' + index"
                    :id="'eye' + index + idx" class="CheckupEye--input" hidden="hidden">
                  <span class="radio--icon"></span>
                  <span class="CheckupEye--span" v-html="ite.label"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn--bottom CheckupEye--btn-div">
        <button @click="next" type="button" class="CheckupEye--btn">다음</button>
      </div>
    </div>
  </section>
</template>

<style lang="scss"></style>
