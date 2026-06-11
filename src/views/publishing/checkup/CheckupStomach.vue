<script>

import BaseStep from '@/views/publishing/checkup/BaseStep.vue'
import router from '@/router'
// 231204 함수 삭제

export default {
  name: 'CheckupStomach',
  components: { BaseStep },
  data() {
    return {
      nextDisabled: true, /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
      data: [
        { question: '속이 메스껍다고 느끼나요?' },
        { question: '권태감(나른함)을 느끼나요?' },
        { question: '구역질을 자주 하거나 구토를 할 때가 있나요?' },
        { question: '소화가 잘 되지 않고 더부룩한 포만감을 느끼나요?' },
        { question: '경련성 복통이 있나요?' },
        { question: '조금만 먹어도 배가 부르고, 속이 가득 차다고 느끼나요?' },
        { question: '목에 이물질이 걸린 듯한 느낌이 들며, 속쓰림 증상이 있나요?' },
        { question: '식욕이 부진한가요?' },
        { question: '흉골 바로 뒤 가슴(가슴 중앙 부위)이 타는 듯한 느낌 또는 불편감을 느끼나요?' },
        { question: '명치 부근에서 발생하는 상복부 통증을 느끼나요?' }
      ],
      answer: [
        { label: '증상 없음', value: 0 },
        { label: '가벼운', value: 1 },
        { label: '중간', value: 2 },
        { label: '심함', value: 3 },
        { label: '매우 심함', value: 4 }
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
      router.push('/checkup-intestine')
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
  <section class="container CheckupStomach">
    <BaseStep :step="`step3`" class="CheckupStomach--step" />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-wrapT">
        <div class="CheckupStomach--info">
          <strong>위 건강</strong>과 관련하여
          아래 증상의 정도를 답 해주세요
        </div>
        <div class="CheckupStomach--con">
          <div v-for="(item, index) in data" :key="index" :id="'q' + index" class="CheckupStomach--div">
            <!--231204 동적 id추가-->
            <p class="CheckupStomach--q">
              {{ item.question }}
            </p>
            <div class="align--between CheckupStomach--a-div">
              <div v-for="(ite, idx) in answer" :key="idx" class="CheckupStomach--for">
                <label @click="go(index)" :for="'stomach' + index + idx" class="txt--center CheckupStomach--label"
                  :class="selectedValues[index] === idx ? 'active' : ''"> <!--231204 함수 변경, 동적 class 추가-->
                  <input v-model="selectedValues[index]" :value="ite.value" type="radio" :name="'stomach' + index"
                    :id="'stomach' + index + idx" class="CheckupStomach--input" hidden="hidden">
                  <span class="radio--icon"></span>
                  <span class="CheckupStomach--span" v-html="ite.label"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn--bottom topMargin CheckupStomach--btn-div">
        <button @click="next" type="button" class="CheckupStomach--btn">다음</button>
      </div>
    </div>
  </section>
</template>

<style lang="scss"></style>
