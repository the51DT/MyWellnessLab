<script>

import BaseStep from '@/views/publishing/checkup/BaseStep.vue'
import router from '@/router'
// 231204 함수 삭제

export default {
  name: 'CheckupNoseHypersensitivity',
  components: { BaseStep },
  data() {
    return {
      nextDisabled: true, /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
      data: [
        { question: '맑은 콧물이 자주 흐르며, 특히 아침에 심한 편인가요?' },
        { question: '시도때도 없이 발작적인 재채기가 자주 나오나요?' },
        { question: '코가 막혀 답답함을 자주 느끼시나요?' },
        { question: '코 안쪽이 가렵고 답답하여 자주 후비게 되나요?' },
        { question: '눈, 코, 목, 귀 주변이 자주 간지럽다고 느끼나요?' },
        { question: '눈이 자주 충혈되나요?' },
        { question: '눈 밑에 다크서클이 심해지며 자주 피로하다고 느끼나요?' },
        { question: '아침에 차가운 공기를 들이마시면 숨이 차고 기침이 나나요?' },
        { question: '뜨겁거나 매운 음식을 먹을 때 특히 콧물이 더 많이 흐르나요?' },
        { question: '잘 때 입을 벌리고 자거나, 코를 고나요?' }
      ],
      answer: [
        { label: '아니요', value: 0 },
        { label: '예', value: 1 }
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
      router.push('/checkup-stomach')
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
  <section class="container CheckupNoseHypersensitivity">
    <BaseStep :step="`step3`" class="CheckupNoseHypersensitivity--step" />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-wrapT">
        <div class="CheckupNoseHypersensitivity--info">
          <strong>코 과민반응</strong>과 관련하여
          아래 증상에 답 해주세요
        </div>
        <div class="CheckupNoseHypersensitivity--con">
          <div v-for="(item, index) in data" :key="index" :id="'q' + index" class="CheckupNoseHypersensitivity--div">
            <!--231204 동적 id추가-->
            <p class="CheckupNoseHypersensitivity--q">
              {{ item.question }}
            </p>
            <div class="align--between CheckupNoseHypersensitivity--a-div">
              <div v-for="(ite, idx) in answer" :key="idx" class="CheckupNoseHypersensitivity--for">
                <label @click="go(index)" :for="'cm' + index + idx" class="CheckupNoseHypersensitivity--label"
                  :class="selectedValues[index] === idx ? 'active' : ''"> <!--231204 함수 변경-->
                  <input v-model="selectedValues[index]" :value="ite.value" type="radio" :name="'cm' + index"
                    :id="'cm' + index + idx" class="CheckupNoseHypersensitivity--input" hidden="hidden">
                  <span class="CheckupNoseHypersensitivity--span">{{ ite.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn--bottom CheckupNoseHypersensitivity--btn-div">
        <button @click="next" type="button" class="CheckupNoseHypersensitivity--btn">다음</button>
      </div>
    </div>
  </section>
</template>

<style lang="scss"></style>
