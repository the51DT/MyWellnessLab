<script>

import BaseStep from '@/views/publishing/checkup/BaseStep.vue'
import router from '@/router'
import BaseTimeMinute from '@/views/publishing/checkup/BaseTimeMinute.vue'

export default {
  name: 'CheckupPhysicalActivity',
  components: { BaseTimeMinute, BaseStep },
  data() {
    return {
      nextDisabled: false, /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
      data: [
        { question: '1지난 7일간 숨이 찰 만큼 몸을 움직이는 날은 얼마나 되나요?', description: '(무거운 짐 나르기, 달리기, 에어로빅 등  격렬한 신체활동)', select: [{ item: '전혀 없음', value: 0 }, { item: '1일', value: 1 }, { item: '2일', value: 2 }, { item: '3일', value: 3 }, { item: '4일', value: 4 }, { item: '5일', value: 5 }, { item: '6일', value: 6 }, { item: '7일', value: 7 }], question2: '격렬한 신체활동으로 하루를 보낸 시간은 얼마나 되나요?', description2: '시간을 24 이상의 수를 입력할 수 없습니다<br>분을 59 이상의 수를 입력할 수 없습니다' },
        { question: '지난 7일간 중간정도의 신체 활동을 한날은 얼마나 되나요?', description: '(걷기제외,  가벼운 물건 나르기,  보통 속도의 자전거 타기 등)', select: [{ item: '전혀 없음', value: 0 }, { item: '1일', value: 1 }, { item: '2일', value: 2 }, { item: '3일', value: 3 }, { item: '4일', value: 4 }, { item: '5일', value: 5 }, { item: '6일', value: 6 }, { item: '7일', value: 7 }], question2: '중간정도의 신체활동으로 하루를 보낸 시간은 얼마나 되나요?', description2: '시간을 24 이상의 수를 입력할 수 없습니다<br>분을 59 이상의 수를 입력할 수 없습니다' },
        { question: '지난 7일간 적어도 10분 이상 걸은 날은  얼마나 되나요?', description: '(대중교통을 이용, 하거나 여가시간에 걸은 것도 포함)', select: [{ item: '전혀 없음', value: 0 }, { item: '1일', value: 1 }, { item: '2일', value: 2 }, { item: '3일', value: 3 }, { item: '4일', value: 4 }, { item: '5일', value: 5 }, { item: '6일', value: 6 }, { item: '7일', value: 7 }], question2: '그러한 날 중 하루동안 걸은 시간은 얼마나 되나요?', description2: '시간을 24 이상의 수를 입력할 수 없습니다<br>분을 59 이상의 수를 입력할 수 없습니다' }
      ],
      validation: [], /* 시간 입력 벨리데이션 */
      inputData: [ /* 입력받을 데이터 */
        { select: '', hour: '', minute: '' },
        { select: '', hour: '', minute: '' },
        { select: '', hour: '', minute: '' }
      ]
    }
  },
  methods: {
    inputTxtHour(val) {
      const { index, value } = val
      this.inputData[index].hour = value
    },
    inputTxtMinute(val) {
      const { index, value } = val
      this.inputData[index].minute = value
    },
    next() {
      router.push('/checkup-drink-smoke-sleep')
    }
  }
}
</script>

<template>
  <section class="container CheckupPhysicalActivity">
    <BaseStep :step="`step5`" class="CheckupPhysicalActivity--step" />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-wrapT">
        <div class="CheckupPhysicalActivity--info">
          <p class="CheckupPhysicalActivity--p">
            <strong>운동습관</strong>에 관련된
            정보를 알려주세요
          </p>
        </div>
        <div class="CheckupPhysicalActivity--con">

          <div v-for="(item, index) in data" :key="index" class="CheckupPhysicalActivity--for-wrap">

            <div class="CheckupPhysicalActivity--q-wrap">
              <div class="CheckupPhysicalActivity--q-tit">{{ item.question }}
                <span class="CheckupPhysicalActivity--q-desc">{{ item.description }}</span>
              </div>
              <div class="CheckupPhysicalActivity--select-wrap">
                <select v-model="inputData[index].select" :name="'cpaSelect' + index" id=""
                  class="select CheckupPhysicalActivity--select">
                  <option value="" selected disabled>선택해 주세요</option>
                  <option v-for="itemIn in item.select" :value="itemIn.value">{{ itemIn.item }}</option>
                </select>
              </div>
            </div>

            <div class="CheckupPhysicalActivity--q2-wrap">
              <div class="CheckupPhysicalActivity--q2-tit">{{ item.question2 }}</div>
              <BaseTimeMinute @inputTxtHour="inputTxtHour" @inputTxtMinute="inputTxtMinute" :id="'pa'" :index="index" />
            </div>

          </div>

        </div>
      </div>
      <div class="btn--bottom CheckupPhysicalActivity--btn-div">
        <button @click="next" :disabled="nextDisabled" type="button" class="CheckupPhysicalActivity--btn">다음</button>
      </div>
    </div>
  </section>
</template>

<style lang="scss"></style>
