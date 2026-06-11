<script>

import BaseInput from '@/components/BaseInput.vue'

export default {
  components: { BaseInput },
  emits: ['inputTxtHour', 'inputTxtMinute'],
  name: 'BaseTimeMinute',
  props: {
    index: { /* 부모에게서 반복문 속에 속해 있을 때 구분값 */
      type: Number,
      default: 0
    },
    focus: { /* 부모의 밸리데이션 처리 후 input에 포커스를 날릴 때 받는 변수 */
      type: String,
      default: ''
    },
    id: {
      type: String
    }
  },
  data () {
    return {
      validationTxt: '',
      hour: '',
      minute: '',
      focusTg: false, /* 인풋 포커스 들어가면 div 포커스 나오도록하는 변수, 231204 인풋 포커스 추가용 */
      focusTg2: false /* 인풋 포커스 들어가면 div 포커스 나오도록하는 변수, 231204 인풋 포커스 추가용 */
    }
  },

  methods: { /* 231204 인풋 포커스 위해 추가됨 */
    focusDom (val) { /* 231129 함수 추가 */
      this.focusTg = val
    },
    focusDom2 (val) { /* 231129 함수 추가 */
      this.focusTg2 = val
    }
  },
  watch: {
    hour () {
      const value = this.hour
      if (value < 0 || !Number.isInteger(value)) {
        this.hour = ''
        return
      }
      if (value > 23) {
        this.validationTxt = '시간은 24시간을 초과하여 입력할 수 없습니다'
        this.hour = ''
        return
      }
      this.validationTxt = ''
      this.$emit('inputTxtHour', {
        index: this.index,
        value: this.hour
      }) /* 부모에게 전달 */
    },
    minute () {
      const value = this.minute
      if (value < 0 || !Number.isInteger(value)) {
        this.minute = ''
        return
      }
      if (value > 59) {
        this.validationTxt = '시간을 59 초과의 수를 입력할 수 없습니다'
        this.minute = ''
        return
      }
      this.validationTxt = ''
      this.$emit('inputTxtMinute', {
        index: this.index,
        value: this.minute
      }) /* 부모에게 전달 */
    },
    focus () {
      switch (this.focus) {
        case 'hour':
          this.$refs.hour.focus()
          break
        case 'minute':
          this.$refs.minute.focus()
          break
      }
    }
  }
}
</script>

<template>
  <div class="align--between BaseTimeMinute">
    <div>
      <label :for="id + index" class="BaseTimeMinute--label" :class="focusTg ? 'active' : ''"> <!--231204 인풋 포커스 위해 추가-->
        <input
          v-model="hour"
          @focus="focusDom(true)"
          @blur="focusDom(false)"
          type="number"
          ref="hour"
          name=""
          min="0"
          step="1"
          :id="id + index"
          class="BaseTimeMinute--input" /> <!--231204 인풋 포커스 위해 추가-->
        <span class="BaseTimeMinute--txt">시간</span>
      </label>
    </div>
    <div>
      <label :for="id + '2' + index" class="BaseTimeMinute--label" :class="focusTg2 ? 'active' : ''"> <!--231204 인풋 포커스 위해 추가-->
        <input
          v-model="minute"
          @focus="focusDom2(true)"
          @blur="focusDom2(false)"
          type="number"
          ref="minute"
          name=""
          min="0"
          step="1"
          :id="id + '2' + index"
          placeholder="0"
          class="BaseTimeMinute--input" /> <!--231204 인풋 포커스 위해 추가-->
        <span class="BaseTimeMinute--txt">분</span>
      </label>
    </div>
  </div>
  <div v-if="validationTxt" class="validation">{{validationTxt}}</div>
</template>

<style scoped>

</style>
