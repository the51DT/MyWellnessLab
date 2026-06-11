<script>

import BaseStep from '@/views/publishing/checkup/BaseStep.vue'
import router from '@/router'
// 231201 답변 선택 시 다음 문항으로 넘기는 nextStep을 다른 방식으로 바꿔서 삭제

export default {
  name: 'CheckupMemory',
  components: { BaseStep },
  data() {
    return {
      nextDisabled: true, /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
      data: [
        { question: '자신의 기억력에 문제가 있다고 느끼나요?' },
        { question: '자신의 기억력이 10년 전보다 나빠졌다고 느끼나요?' },
        { question: '자신의 기억력이 같은 또래의 사람들에 비해 나쁘다고 느끼나요?' },
        { question: '기억력 저하로 일상생활에  불편을 느끼나요?' },
        { question: '최근에 일어난 일을 기억하는 것이 어렵나요?' },
        { question: '며칠 전에 나눈 대화 내용을 기억하는 것이 어렵나요?' },
        { question: '며칠 전에 한 약속을 기억하는 것이 어렵나요?' },
        { question: '친한 사람의 이름을 기억하기 어렵나요?' },
        { question: '물건을 둔 위치를 기억하기 어렵나요?' },
        { question: '이전에 비해 물건을 자주 잃어버리나요?' },
        { question: '집 근처에서 길을 잃은 적이 있나요?' },
        { question: '가게에서 물건을 구매할 때 2~3가지의 구매 목록을 기억하기 어렵나요?' },
        { question: '가스불이나 전등 스위치를 끄는 것을 기억하기 어렵나요?' },
        { question: '일상에서 자주 사용하는 번호(차량번호 혹은 전화번호 등)나 자주 가는 장소의 위치를 기억하기 어렵나요?' }
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
      // if(this.nullIndex === -1){
      //   return;
      // }
      // this.scroll(this.nullIndex);
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
    next() { /* 다음 페이지 이동 */
      this.nextCheck = true

      // 231201 로직 추가
      if (this.nullIndex >= 0) {
        if (confirm("모든 항목을 입력하셔야 설문을 완료할 수 있습니다\n'확인'을 누르시면 이어서 설문을 진행할 수 있고 '취소'를 누르시면 임시저장 후 종료됩니다")) {
          this.go(this.nullIndex)
        } else {
          // 임시저장 후 이동 로직 추가바랍니다
        }
        return
      }
      router.push('/checkup-eye')
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
        // if(this.selectedValues.includes(null) === -1) {
        //   window.scrollBy({top: document.querySelector(".btn--bottom").getBoundingClientRect().top, behavior: "smooth"}); /*231204 로직 추가*/
        // this.nextDisabled = false;
        // }
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

    // 231201 beforeDestroy 삭제

  }
}
</script>

<template>
  <section class="container CheckupMemory">
    <BaseStep :step="`step3`" class="CheckupMemory--step" />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-wrapT">
        <div class="CheckupMemory--info">
          <strong>기억력</strong>과 관련하여 아래의 증상에 답 해주세요
        </div>
        <div class="CheckupMemory--con">
          <div v-for="(item, index) in data" :key="index" :id="'q' + index" class="CheckupMemory--div">
            <!--231201 다음 문항 이동 처리 때문에 동적 id 추가-->
            <p class="CheckupMemory--q">
              {{ item.question }}
            </p>
            <div class="align--between CheckupMemory--a-div">
              <div v-for="(ite, idx) in answer" :key="idx" class="CheckupMemory--for">
                <label @click="go(index)" :for="'CheckupMemory' + index + idx" class="CheckupMemory--label"
                  :class="selectedValues[index] === idx ? 'active' : ''"> <!--231201 다음 문항이동 처리로 클릭 이벤트 함수 변경-->
                  <input v-model="selectedValues[index]" :value="ite.value" type="radio" :name="'CheckupMemory' + index"
                    :id="'CheckupMemory' + index + idx" class="CheckupMemory--input" hidden="hidden">
                  <span class="CheckupMemory--span">{{ ite.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn--bottom CheckupMemory--btn-div">
        <!--          <button @click="next" :disabled="nextDisabled" type="button" class="CheckupMemory&#45;&#45;btn">다음</button>-->
        <button @click="next" type="button" class="CheckupMemory--btn">다음 <span
            class="answerNum">(8<span>/</span>{{ data.length }})</span></button> <!--231205 미답변/답변 카운팅-->
      </div>
    </div>
  </section>
</template>

<style lang="scss"></style>
