<script>

import BaseStep from '@/views/publishing/checkup/BaseStep.vue'
import router from '@/router'
import BaseOpener from '@/views/publishing/checkup/BaseOpener.vue'
// 231204 함수 삭제

export default {
  name: 'CheckupJointAndBone',
  components: { BaseOpener, BaseStep },
  data() {
    return {
      nextDisabled: true, /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
      isOpen: [true, true, true], /* 내용부분 열고 닫는 오프너 */
      data: [ /* 그룹별로 나누었음 */
        { question: '걷기' },
        { question: '계단 오르기' },
        { question: '수면 시' },
        { question: '앉아 있거나 혹은 누워있기' },
        { question: '똑바로 서 있기' }
      ],
      selectedValues: [], /* 그룹1 선택된 값 */

      nullIndex: 0, /* 231201 선택하지 않은 문항 */

      isData: false,
      data2: [
        { question: '아침 경직' },
        { question: '낮 동안의 경직' }
      ],
      selectedValues2: [], /* 그룹2 선택된 값 */

      nullIndex2: 0, /* 231201 선택하지 않은 문항 */

      isData2: false,
      // isOpen2: true, /*그룹2 오프너*/
      data3: [ /* 그룹별로 나누었음 */
        { question: '계단 내려오기' },
        { question: '계단 올라오기' },
        { question: '앉은 자세에서 일어나기' },
        { question: '서기' },
        { question: '무릎 굽히기' },
        { question: '평지 걷기' },
        { question: '자동차 타기와 내리기' },
        { question: '쇼핑하기' },
        { question: '양말신기' },
        { question: '침대에서 일어나기' },
        { question: '양말벗기' },
        { question: '침대에 눕기' },
        { question: '욕조에 들어가기와 나오기' },
        { question: '앉기' },
        { question: '화장실에 들어가기와 나오기' },
        { question: '힘든 집안일' },
        { question: '가벼운 집안일' }
      ],
      selectedValues3: [], /* 그룹3 선택된 값 */

      nullIndex3: 0, /* 231201 선택하지 않은 문항 */

      isData3: false,
      // isOpen3: true, /*그룹3 오프너*/
      answer: [
        { label: '불편하지 않다', value: 0 },
        { label: '조금 불편하다', value: 1 },
        { label: '보통이다', value: 2 },
        { label: '많이 불편하다', value: 3 },
        { label: '매우 많이 불편하다', value: 4 }
      ]
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
    go2() {
      if (this.nullIndex2 === -1) {
        return
      }
      this.scroll2(this.nullIndex2)
    },
    scroll2(nullIndex2) {
      let firstQ = 0
      if (nullIndex2 === 0) {
        firstQ = -70
      }
      window.scrollBy({ top: document.getElementById('q2' + nullIndex2).getBoundingClientRect().top + firstQ, behavior: 'smooth' })
    },
    go3() {
      if (this.nullIndex3 === -1) {
        return
      }
      this.scroll3(this.nullIndex3)
    },
    scroll3(nullIndex3) {
      let firstQ = 0
      if (nullIndex3 === 0) {
        firstQ = -70
      }
      window.scrollBy({ top: document.getElementById('q3' + nullIndex3).getBoundingClientRect().top + firstQ, behavior: 'smooth' })
    },

    open(val) { /* 내용 열고 닫는 */
      this.isOpen[val[1]] = val[0]
    },
    next() {
      router.push('/checkup-immunity')
    }
  },

  mounted() { /* 231201 추가 */
    this.selectedValues = Array.from({ length: this.data.length }, () => null) /* 문항 수 만큼의 빈 배열 생성 */
    this.selectedValues2 = Array.from({ length: this.data2.length }, () => null) /* 문항 수 만큼의 빈 배열 생성 */
    this.selectedValues3 = Array.from({ length: this.data3.length }, () => null) /* 문항 수 만큼의 빈 배열 생성 */
  },

  watch: {
    selectedValues: {
      handler() {
        this.nullIndex = this.selectedValues.indexOf(null) /* 231204 로직 추가 */
        if (!this.selectedValues.includes(null)) { /* 231204 조건 변경 */
          this.isData = true
          if (this.isData2 && this.isData3) {
            this.nextDisabled = false
          }
        }
      },
      deep: true
    },
    selectedValues2: {
      handler() {
        this.nullIndex2 = this.selectedValues2.indexOf(null) /* 231204 로직 추가 */
        if (!this.selectedValues2.includes(null)) { /* 231204 조건 변경 */
          this.isData2 = true
          if (this.isData && this.isData3) {
            this.nextDisabled = false
          }
        }
      },
      deep: true
    },
    selectedValues3: {
      handler() {
        this.nullIndex3 = this.selectedValues3.indexOf(null) /* 231204 로직 추가 */
        if (!this.selectedValues3.includes(null)) { /* 231204 조건 변경 */
          this.isData3 = true
          if (this.isData && this.isData2) {
            this.nextDisabled = false
          }
        }
      },
      deep: true
    },

    nullIndex() { /* 231201 다음 문항 이동 처리로 추가 */
      if (this.nullIndex >= 0) {
        this.go()
        return
      }
      if (this.nullIndex2 >= 0) {
        this.go2()
        return
      }
      if (this.nullIndex3 >= 0) {
        this.go3()
      }
    },
    nullIndex2() { /* 231201 다음 문항 이동 처리로 추가 */
      if (this.nullIndex >= 0) {
        this.go()
        return
      }
      if (this.nullIndex2 >= 0) {
        this.go2()
        return
      }
      if (this.nullIndex3 >= 0) {
        this.go3()
      }
    },
    nullIndex3() { /* 231201 다음 문항 이동 처리로 추가 */
      if (this.nullIndex >= 0) {
        this.go()
        return
      }
      if (this.nullIndex2 >= 0) {
        this.go2()
        return
      }
      if (this.nullIndex3 >= 0) {
        this.go3()
      }
    }

  }
}
</script>

<template>
  <section class="container CheckupJointAndBone">
    <BaseStep :step="`step3`" class="CheckupJointAndBone--step" />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-wrapT">
        <div class="CheckupJointAndBone--info">
          <p class="CheckupJointAndBone--p">
            <strong>관절 건강</strong>과 관련된 설문입니다
          </p>
        </div>

        <div class="CheckupJointAndBone--con">
          <div class="align--between">
            <p class="CheckupJointAndBone--p2">
              아래 활동 시 느끼는 증상
              정도에 답해주세요
            </p>
            <BaseOpener :order=0 @open="open" />
          </div>
          <transition name="downUp">
            <div v-show="isOpen[0]" class="CheckupJointAndBone--div-wrap">
              <!--                <hr class="gray2">-->
              <div v-for="(item, index) in data" :key="index" :id="'q' + index" class="CheckupJointAndBone--div">
                <!--231204 동적 id 추가-->
                <p class="CheckupJointAndBone--q">
                  {{ item.question }}
                </p>
                <div class="CheckupJointAndBone--a-div">
                  <div v-for="(ite, idx) in answer" :key="idx" class="CheckupJointAndBone--for">
                    <label @click="go" :for="'cjab' + index + idx" class="CheckupJointAndBone--label"
                      :class="selectedValues[index] === idx ? 'active' : ''"> <!--231204 함수 변경-->
                      <input v-model="selectedValues[index]" :value="ite.value" type="radio" :name="'cjab' + index"
                        :id="'cjab' + index + idx" class="CheckupJointAndBone--input" hidden="hidden">
                      <span v-html="ite.label" class="CheckupJointAndBone--span"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <div class="CheckupJointAndBone--con">
          <div class="align--between">
            <p class="CheckupJointAndBone--p2">
              아래 시간에 경직을 느끼는
              정도를 선택해주세요
            </p>
            <BaseOpener :order=1 @open="open" />
          </div>
          <transition name="downUp">
            <div v-show="isOpen[1]" class="CheckupJointAndBone--div-wrap">
              <div v-for="(item, index) in data2" :key="index" :id="'q2' + index" class="CheckupJointAndBone--div">
                <!--231204 동적 id추가-->
                <p class="CheckupJointAndBone--q">
                  {{ item.question }}
                </p>
                <div class="CheckupJointAndBone--a-div">
                  <div v-for="(ite, idx) in answer" :key="idx" class="CheckupJointAndBone--for">
                    <label @click="go2" :for="'cjab2' + index + idx" class="CheckupJointAndBone--label"
                      :class="selectedValues2[index] === idx ? 'active' : ''"> <!--231204 함수 변경-->
                      <input v-model="selectedValues2[index]" :value="ite.value" type="radio" :name="'cjab2' + index"
                        :id="'cjab2' + index + idx" class="CheckupJointAndBone--input" hidden="hidden">
                      <span v-html="ite.label" class="CheckupJointAndBone--span"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <div class="CheckupJointAndBone--con">
          <div class="align--between">
            <p class="CheckupJointAndBone--p2">
              아래 활동 시 불편함을
              느끼는 정도를 선택해주세요
            </p>
            <BaseOpener :order=2 @open="open" />
          </div>
          <transition name="downUp">
            <div v-show="isOpen[2]" class="CheckupJointAndBone--div-wrap">
              <div v-for="(item, index) in data3" :key="index" :id="'q3' + index" class="CheckupJointAndBone--div">
                <!--231204 동적 id추가-->
                <p class="CheckupJointAndBone--q">
                  {{ item.question }}
                </p>
                <div class="CheckupJointAndBone--a-div">
                  <div v-for="(ite, idx) in answer" :key="idx" class="CheckupJointAndBone--for">
                    <label @click="go3" :for="'cjab3' + index + idx" class="CheckupJointAndBone--label"
                      :class="selectedValues3[index] === idx ? 'active' : ''"> <!--231204 함수 변경-->
                      <input v-model="selectedValues3[index]" :value="ite.value" type="radio" :name="'cjab3' + index"
                        :id="'cjab3' + index + idx" class="CheckupJointAndBone--input" hidden="hidden">
                      <span v-html="ite.label" class="CheckupJointAndBone--span"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
      <div class="btn--bottom CheckupJointAndBone--btn-div">
        <button @click="next" :disabled="nextDisabled" type="button" class="CheckupJointAndBone--btn">다음</button>
      </div>
    </div>
</section></template>

<style lang="scss"></style>
