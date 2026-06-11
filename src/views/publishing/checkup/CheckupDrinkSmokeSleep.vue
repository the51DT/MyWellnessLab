<script>

import BaseStep from '@/views/publishing/checkup/BaseStep.vue'
import BaseTimeMinute from '@/views/publishing/checkup/BaseTimeMinute.vue'
import { focusDom } from '@/assets/js/common' /* 231204 포커스 추리때문에 추가 */

export default {
  name: 'CheckupDrinkSmokeSleep',
  components: { BaseTimeMinute, BaseStep },
  data() {
    return {
      nextDisabled: false, /* 데이터가 다 입력되기 전까지는 하단의 다음 버튼이 비활성되도록 해주세요, true: 비활성 */
      name: '홍길동', /* 사용자명 */
      answer: [ /* 음주 하냐 않하냐 보기, dom 노출 순서 때문에 예가 0이니 주의 */
        { label: '예', value: 0 },
        { label: '아니요', value: 1 }
      ],
      isDrink: '', /* 음주를 하시나요? */
      isDrinkInput: 1, /* 음주 빈도, 양 input 활성/비활성 변수 */
      btn: [ /* 흡연 여부 보기 */
        { label: '현재 흡연을 하거나 금연기간 1년 이내', value: 0 },
        { label: '금연기간 1년 이상', value: 1 },
        { label: '피운 적 없음', value: 2 }
      ],
      selectedBtn: '', /* 흡연 여부 선택 버튼 */
      sleepHour: '', /* 수면 시간 */
      sleepMinute: '', /* 수면 분 */
      validation: { /* 밸리데이션 용 */
        sleep: ''
      },
      focusTg: false /* 231204 포커스 처리로 인해 추가 */
    }
  },
  watch: {
    isDrink() {
      this.isDrink === 0 ? this.isDrinkInput = 1 : this.isDrinkInput = 0
    }
  },
  methods: {
    setSleepHour(value) { /* 자식에게서 받아서 값 세팅 */
      this.sleepHour = value
    },
    setSleepMinute(value) { /* 자식에게서 받아서 값 세팅 */
      this.sleepMinute = value
    },
    focusDom, /* 231204 포커스 처리로 인해 추가 */
    next() {
      if (this.sleepHour === '' || this.sleepHour === null) {
        alert('수면 시간을 입력해야 합니다')
        this.validation.sleep = 'hour'
        return
      }
      this.$router.push('/checkup-complete')
    }
  }
}
</script>

<template>
  <section class="container CheckupDrinkSmokeSleep">
    <BaseStep :step="`step6`" class="CheckupDrinkSmokeSleep--step" />
    <div class="Checkup--contents-wrap">
      <div class="Checkup--contents-wrapT">
        <div class="CheckupDrinkSmokeSleep--info-wrap">
          <p class="CheckupDrinkSmokeSleep--info">
            <strong>음주</strong>에 관련된 정보를 알려주세요 <!--231219 타이틀을 4개로 각각 넣기로 해서 수정-->
          </p>
        </div>
        <div class="CheckupDrinkSmokeSleep--con-wrap">

          <div class="CheckupDrinkSmokeSleep--con"> <!--음주-->

            <div class="CheckupDrinkSmokeSleep--unit">
              <p class="CheckupDrinkSmokeSleep--unit-tit">
                {{ name }}님, 음주를 하시나요?
              </p>
              <div class="align--between CheckupDrinkSmokeSleep--unit-input">
                <div v-for="(item, index) in answer" :key="index" class="CheckupDrinkSmokeSleep--unit-l">
                  <label :for="'cdss' + index" class="CheckupDrinkSmokeSleep--unit-label"
                    :class="isDrink === index ? 'active' : ''">
                    <input v-model="isDrink" :value="item.value" type="radio" name="cdss" :id="'cdss' + index"
                      class="CheckupDrinkSmokeSleep--unit-radio" hidden="hidden">
                    <span class="CheckupDrinkSmokeSleep--unit-span">
                      {{ item.label }}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div class="CheckupDrinkSmokeSleep--dink-group" :class="isDrinkInput === 0 ? 'disabled' : ''">

              <div class="CheckupDrinkSmokeSleep--drink-fre">
                <p class="CheckupDrinkSmokeSleep--drink-fre--q">
                  음주 빈도는 어떻게 되시나요?
                </p>
                <div class="align--between CheckupDrinkSmokeSleep--drink-fre--con-wrap">
                  <div class="CheckupDrinkSmokeSleep--drink-fre--select-wrap" :class="!isDrinkInput ? 'disabled' : ''">
                    <select name="cdss-s" id="" class="CheckupDrinkSmokeSleep--drink-fre--select"
                      :disabled="!isDrinkInput">
                      <option value="">주</option>
                      <option value="">월</option>
                    </select>
                  </div>
                  <label for="cdss03" class="CheckupDrinkSmokeSleep--drink-fre--label inputBox"
                    :class="!isDrinkInput ? 'disabled' : ''">
                    <input @focus="focusDom($event, true)" @blur="focusDom($event, false)" type="number" name=""
                      id="cdss03" min="0" step="1" :placeholder="2" class="CheckupDrinkSmokeSleep--drink-fre--input"
                      :disabled="!isDrinkInput"> <!--231204 포커스 처리로 이벤트 추가-->
                    <span class="CheckupDrinkSmokeSleep--drink-fre--span inputBox--txt">회</span>
                  </label>
                </div>
                <p class="CheckupDrinkSmokeSleep--drink-fre--desc txt--desc">월 1회 미만의 경우는 0회로 입력하세요</p>
              </div>

              <div class="CheckupDrinkSmokeSleep--drink-size--wrap">
                <p class="CheckupDrinkSmokeSleep--drink-size--q">한 번에 술은 얼마나 마시나요? </p>
                <div class="CheckupDrinkSmokeSleep--drink-size--con-wrap">
                  <label for="cdss04" class="CheckupDrinkSmokeSleep--drink-size--label inputBox"
                    :class="!isDrinkInput ? 'disabled' : ''">
                    <input @focus="focusDom($event, true)" @blur="focusDom($event, false)" type="number" name="" min="0"
                      step="1" id="cdss04" placeholder="2" class="CheckupDrinkSmokeSleep--drink-size--input"
                      :disabled="!isDrinkInput"> <!--231204 포커스 처리를 위해 이벤트 추가-->
                    <span class="CheckupDrinkSmokeSleep--drink-size--span inputBox--txt">잔</span>
                  </label>
                </div>
                <p class="CheckupDrinkSmokeSleep--drink-size--desc txt--desc">소주, 양주 구분없이 각각의 술잔으로 계산해주세요 소주 1병은 7잔과 같고
                  캔맥주 1개(355cc)는 맥주 1.6잔과 같습니다 </p>
              </div>

            </div>

          </div>

          <div class="CheckupDrinkSmokeSleep--smoke--wrap"> <!--흡연-->

            <!--              231219 타이틀 추가-->
            <div class="CheckupDrinkSmokeSleep--info-wrap">
              <p class="CheckupDrinkSmokeSleep--info">
                <strong>흡연</strong>에 관련된 정보를 알려주세요
              </p>
            </div>

            <div class="CheckupDrinkSmokeSleep--smoke--con-wrap">
              <p class="CheckupDrinkSmokeSleep--smoke--q">{{ name }}님, 흡연 여부를 알려주세요!</p>
              <div class="CheckupDrinkSmokeSleep--smoke--input-wrap">
                <div v-for="(item, index) in btn" class="CheckupDrinkSmokeSleep--smoke--btn-wrap">
                  <label :for="'btn' + index" class="CheckupDrinkSmokeSleep--smoke--label"
                    :class="selectedBtn === index ? 'active' : ''">
                    <input v-model="selectedBtn" :value="item.value" type="radio" name="btn" :id="'btn' + index"
                      hidden="hidden" class="CheckupDrinkSmokeSleep--smoke--input">
                    <span class="CheckupDrinkSmokeSleep--smoke--span">{{ item.label }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="CheckupDrinkSmokeSleep--smoke-fre">
              <p class="CheckupDrinkSmokeSleep--smoke-fre--q">총 흡연 기간이 어떻게 되시나요?</p>
              <div class="CheckupDrinkSmokeSleep--smoke-fre--con-wrap">
                <label for="cdss05" class="CheckupDrinkSmokeSleep--smoke-fre--label inputBox"
                  :class="selectedBtn === 2 ? 'disabled' : ''">
                  <input :disabled="selectedBtn === 2" @focus="focusDom($event, true)" @blur="focusDom($event, false)"
                    type="number" name="" min="0" step="1" id="cdss05" class="CheckupDrinkSmokeSleep--smoke-fre--input">
                  <!--231204 포커스 처리때문에 이벤트 추가-->
                  <span class="CheckupDrinkSmokeSleep--smoke-fre--span inputBox--txt">년</span>
                </label>
              </div>
            </div>

            <div class="CheckupDrinkSmokeSleep--smoke-quan--wrap">
              <p class="CheckupDrinkSmokeSleep--smoke-quan--q">하루에 평균 몇 개비를 피우시나요?</p>
              <label for="cdss06" class="CheckupDrinkSmokeSleep--smoke-quan--label inputBox"
                :class="selectedBtn === 2 ? 'disabled' : ''">
                <input :disabled="selectedBtn === 2" @focus="focusDom($event, true)" @blur="focusDom($event, false)"
                  type="number" name="" min="0" step="1" id="cdss06" class="CheckupDrinkSmokeSleep--smoke-quan--input">
                <!--231204 포커스 처리로 이벤트 추가-->
                <span class="CheckupDrinkSmokeSleep--smoke-quan--span inputBox--txt">개비</span>
              </label>
            </div>

          </div>

          <div class="CheckupDrinkSmokeSleep--sleep--wrap"> <!--수면-->

            <!--              231219 타이틀 추가-->
            <div class="CheckupDrinkSmokeSleep--info-wrap">
              <p class="CheckupDrinkSmokeSleep--info">
                <strong>수면</strong>에 관련된 정보를 알려주세요
              </p>
            </div>

            <p class="CheckupDrinkSmokeSleep--sleep--q">지난 한달 동안의 하루 평균 수면시간은 얼마나 되나요?</p>
            <BaseTimeMinute @inputTxtHour="setSleepHour" @inputTxtMinute="setSleepMinute" :id="'dss'"
              :focus="validation.sleep" /> <!--밸리데이션 처리 후 입력이 안된 input을 focus하기 위해 값 전달-->
          </div>

          <div class="CheckupDrinkSmokeSleep--moi"> <!--수분-->

            <!--              231219 타이틀 추가-->
            <div class="CheckupDrinkSmokeSleep--info-wrap">
              <p class="CheckupDrinkSmokeSleep--info">
                <strong>물섭취</strong>에 관련된 정보를 알려주세요
              </p>
            </div>

            <p class="CheckupDrinkSmokeSleep--moi--q">하루에 물을 얼마나 섭취하세요?</p>
            <p class="CheckupDrinkSmokeSleep--moi--desc txt--desc2">(생수, 보리차, 결명자차, 옥수수차 등)</p>
            <div class="CheckupDrinkSmokeSleep--moi--con-wrap">
              <label for="cdss09" class="CheckupDrinkSmokeSleep--moi--label inputBox long-txt">
                <input @focus="focusDom($event, true)" @blur="focusDom($event, false)" type="number" name="" min="0"
                  step="1" placeholder="20" id="cdss09" class="CheckupDrinkSmokeSleep--moi--input">
                <!--231204 포커스 처리로 이벤트 추가-->
              <span class="CheckupDrinkSmokeSleep--moi--span inputBox--txt">컵(200ml)</span>
            </label>
          </div>
        </div>

      </div>
    </div>
    <div class="btn--bottom CheckupDrinkSmokeSleep--btn-div">
      <button @click="next" :disabled="nextDisabled" type="button" class="CheckupDrinkSmokeSleep--btn">입력 완료</button>
    </div>
  </div>

</section></template>

<style lang="scss"></style>
