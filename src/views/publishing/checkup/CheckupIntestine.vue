<script>

import BaseStep from '@/views/publishing/checkup/BaseStep.vue'
import router from '@/router'
// 231204 함수 삭제

export default {
  name: 'CheckupIntestine',
  components: { BaseStep },
  data() {
    return {
      nextDisabled: true, /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
      data: [
        { question: '일주일에 3번 미만(0~2번) 으로 대변을 본 적이 있나요? ' },
        { question: '단단하거나 덩어리 지는 대변을 본 적이 있나요?' },
        { question: '과도하게 힘을 줘야 대변이 나온 적이 있나요?' },
        { question: '대변을 본 후,시원하지 않고 뭔가 남아 있는느낌 (잔변감)이 있었나요? ' },
        { question: '대변을 볼 때  대변이 잘 나가지 않고 막힌 것처럼 느낀 적이 있나요?' },
        { question: '원활한 배변을 위해서 부가적인 처치 (예 : 수지배변유도나 골반저의 입박 등) 가 필요했나요?' },
        { question: '무르거나 물 같은 대변을 본 적이 있나요?' }
      ],
      answer: [
        { label: "아니요<br><span class='txt--desc'>전혀 아니거나 거의 드물다 (  25% 이하  )</span>", value: 0 },
        { label: "예<br><span class='txt--desc'>가끔 또는 항상 그렇다 (  25% 이상  )</span>", value: 1 }
      ],
      selectedValues: [], /* 선택된 값 */
      nullIndex: 0, /* 231201 선택하지 않은 문항 */

      isData: false,
      poopData: [ /* 똥 모양 */
        { label: '단단해서 알갱이 같다', value: '1', imgUrl: 'img_ddong1.svg' },
        { label: '단단해서 알갱이 같지만 한 덩어리다', value: '2', imgUrl: 'img_ddong2.svg' },
        { label: '소시지처럼 한 덩어리나 표면이 갈라졌다', value: '3', imgUrl: 'img_ddong3.svg' },
        { label: '소시지처럼 한 덩어리나 매끈하고 부드럽다', value: '4', imgUrl: 'img_ddong4.svg' },
        { label: '부드러운 여러 개의 덩어리이다', value: '5', imgUrl: 'img_ddong5.svg' },
        { label: '무른 대변으로 변기에 흩어진다', value: '6', imgUrl: 'img_ddong6.svg' },
        { label: '물과 같은 변이다', value: '7', imgUrl: 'img_ddong7.svg' }
      ],
      selectedValuesLast: '', /* 똥 모양 */
      isPoopData: false,
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
      router.push('/checkup-joint-and-bone')
    }
  },

  mounted() { /* 231201 추가 */
    this.selectedValues = Array.from({ length: this.data.length }, () => null) /* 문항 수 만큼의 빈 배열 생성 */
  },

  watch: {
    selectedValues: {
      handler() {
        this.nullIndex = this.selectedValues.indexOf(null) /* 231204 로직 추가 */
        if (this.selectedValues.includes(null) === -1) { /* 231204 로직 변경 */
          this.go()
          this.isData = true
        }

        // console.log("1", this.isData, this.nextDisabled)
      },
      deep: true
    },
    selectedValuesLast: {
      handler() {
        if (this.selectedValuesLast) {
          this.isPoopData = true
        }
        // console.log("2", this.isPoopData, this.nextDisabled)
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
  <section class="container CheckupIntestine">
    <BaseStep :step="`step3`" class="CheckupIntestine--step" />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-wrapT">
        <div class="CheckupIntestine--info">
          <strong>최근 3개월 동안 대변</strong>을 볼 때
          1/4 이상 아래의 증상이 있었나요?
        </div>
        <div class="CheckupIntestine--con">
          <div v-for="(item, index) in data" :key="index" :id="'q' + index" class="CheckupIntestine--div">
            <!--231204 동적 id추가-->
            <p class="CheckupIntestine--q">
              {{ item.question }}
            </p>
            <div class="CheckupIntestine--a-div">
              <div v-for="(ite, idx) in answer" :key="idx" class="CheckupIntestine--for">
                <label @click="go(index)" :for="'ci' + index + idx" class="CheckupIntestine--label"
                  :class="selectedValues[index] === idx ? 'active' : ''"> <!--231204 함수 변경-->
                  <input v-model="selectedValues[index]" :value="ite.value" type="radio" :name="'ci' + index"
                    :id="'ci' + index + idx" class="CheckupIntestine--input" hidden="hidden">
                  <span v-html="ite.label" class="CheckupIntestine--span"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="CheckupIntestine--poop" id="q7">
          <p class="CheckupIntestine--poop--q">
            최근에 가장 흔한 당신의
            <strong>대변 모양</strong>을 한 가지 골라주세요
          </p>
          <div class="align--between CheckupIntestine--poop--div">
            <div v-for="(item, index) in poopData" :key="index" class="CheckupIntestine--poop--label-div">
              <label :for="'cil' + index" class="CheckupIntestine--poop--label"
                :class="Number(selectedValuesLast) === index + 1 ? 'active' : ''">
                <span class="CheckupIntestine--poop--img-wrap">
                  <img :src="'/img/' + item.imgUrl" :alt="item.label" class="CheckupIntestine--poop--img">
                </span>
                <input v-model="selectedValuesLast" :value="item.value" type="radio" name="cil" :id="'cil' + index"
                  hidden="hidden" class="CheckupIntestine--poop--input">
                <span class="CheckupIntestine--poop--span">{{ item.label }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="btn--bottom CheckupIntestine--btn-div">
        <button @click="next" type="button" class="CheckupIntestine--btn">다음</button>
      </div>
    </div>
  </section>
</template>

<style lang="scss"></style>
