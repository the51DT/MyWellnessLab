<script>

import BaseStep from '@/views/publishing/checkup/BaseStep.vue'
import router from '@/router'
// 231204 함수 삭제

export default {
  name: 'CheckupProstate',
  components: { BaseStep },
  data() {
    return {
      nextDisabled: true, /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
      data: [
        { question: '소변을 다 보았는데도 소변이 남아있는 것 같이 느끼는 경우가 있습니까?' },
        { question: '소변을 보고 난 후 2시간 이내에 다시 소변을 보는 경우가 있습니까?' },
        { question: '소변 줄기가 끊어져서 다시 힘주어 소변을 보는 경우가 있습니까?' },
        { question: '소변을 참기가 어려운 경우가 있습니까?' },
        { question: '소변줄기가 약하거나  가늘다고 생각되는 경우가 있습니까?' },
        { question: '소변이 금방 나오지 않아서 아랫배에 힘을 주어야 하는 경우가 있습니까?' },
        { question: '잠을 자다 일어나서 소변을 보는 경우가 하룻밤에 몇 번이나 있습니까?', answer: [{ label: '없다', value: 0 }, { label: '1번', value: 1 }, { label: '2번', value: 2 }, { label: '3번', value: 3 }, { label: '4번', value: 4 }, { label: '5번', value: 5 }] }
      ],
      answer: [
        { label: '전혀 없음', value: 0 },
        { label: '5번 중 한 번', value: 1 },
        { label: '5번 중 1~2번', value: 2 },
        { label: '5번 중 2~3번', value: 3 },
        { label: '5번 중 3~4번', value: 4 },
        { label: '거의 항상', value: 5 }
      ],
      selectedValues: [], /* 선택된 값 */
      nullIndex: 0 /* 231201 선택하지 않은 문항 */
    }
  },
  methods: {
    /* 231201 답변 선택 시 다음 문항 이동 관련 */
    go() {
      if (this.nullIndex === -1) {
        window.scrollBy({ top: document.getElementById('q6').getBoundingClientRect().top, behavior: 'smooth' })
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
      router.push('/checkup-menstrual')
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
  <section class="container CheckupProstate">
    <BaseStep :step="`step3`" class="CheckupProstate--step" />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-wrapT">
        <div class="CheckupProstate--info">
          <p class="CheckupProstate--p">
            <strong>전립선 건강</strong>에 관하여 지난 한 달간 소변을 볼 때, 아래 증상 정도에 답해주세요
          </p>
        </div>
        <div class="CheckupProstate--con">
          <div v-for="(item, index) in data" :key="index" :id="'q' + index" class="CheckupProstate--div">
            <!--231204 동적 id추가-->
            <p class="CheckupProstate--q">
              {{ item.question }}
            </p>
            <div class="CheckupProstate--a-div">

              <div v-if="index === 6" v-for="(ite, idx) in item.answer" :key="idx" class="CheckupProstate--for">
                <label :for="'cp' + index + idx" class="CheckupProstate--label"
                  :class="selectedValues[index] === idx ? 'active' : ''">
                  <input v-model="selectedValues[index]" :value="ite.value" type="radio" :name="'cp' + index"
                    :id="'cp' + index + idx" class="CheckupProstate--input" hidden="hidden">
                  <span v-html="ite.label" class="CheckupProstate--span"></span>
                </label>
              </div>

              <div v-else v-for="(ite, idx2) in answer" :key="idx2" class="CheckupProstate--for">
                <label @click="go" :for="'cp' + index + idx2" class="CheckupProstate--label"
                  :class="selectedValues[index] === idx2 ? 'active' : ''"> <!--231204 함수 변경-->
                  <input v-model="selectedValues[index]" :value="ite.value" type="radio" :name="'cp' + index"
                    :id="'cp' + index + idx2" class="CheckupProstate--input" hidden="hidden">
                  <span v-html="ite.label" class="CheckupProstate--span"></span>
                </label>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div class="btn--bottom CheckupProstate--btn-div">
        <button @click="next" :disabled="nextDisabled" type="button" class="CheckupProstate--btn">다음</button>
      </div>
    </div>

  </section>
</template>

<style lang="scss"></style>
