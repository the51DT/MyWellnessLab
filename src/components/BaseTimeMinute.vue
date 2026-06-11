<script>
/**
 * 웰니스 분석 시 시간과 분을 함께 입력받는 콤포넌트
 */
import BaseInput from '@/components/BaseInput.vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
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
    },
    hr: {
      type: String
    },
    mnt: {
      type: String
    },
    limitEight: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      waitInputHr: true,
      waitInputMnt: true,
      validationTxt: '',
      hour: '',
      minute: ''
    }
  },
  methods: {
    inputTxt ($event, type) {
      // $event.target.value = Number($event.target.value.replace(/^0+/, '')); //LeadingZero 수정
      $event.target.value = Number($event.target.value) // LeadingZero 수정
      /* switch(type) {
        case 'hr':
          if(this.waitInputHr){
            this.waitInputHr = false;
            $event.target.value = Number($event.target.value.substring(0, 1));
            this.hour = ($event.target.value);
          }
          break;
        case 'mnt':
          if(this.waitInputMnt){
            this.waitInputMnt = false;
            $event.target.value = Number($event.target.value.substring(0, 1));
            this.minute = ($event.target.value);
          }
          break;
      } */
    }
  },
  mounted () {
    this.hour = this.hr
    this.minute = this.mnt
  },
  watch: {
    hr () {
      this.hour = this.hr
    },
    mnt () {
      this.minute = this.mnt
    },
    hour () {
      const value = this.hour
      if (value < 0 || !Number.isInteger(value)) {
        this.hour = ''
        return
      }
      if (value > 23) {
        this.validationTxt = t('BaseTimeMinute.val1')
        this.hour = ''
        return
      }
      if (this.limitEight && Number(this.hour) * 60 + Number(this.minute) >= 480) {
        this.validationTxt = t('BaseTimeMinute.val2')
        this.hour = ''
        this.minute = ''
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
        this.validationTxt = t('BaseTimeMinute.val3')
        this.minute = ''
        return
      }
      if (this.limitEight && Number(this.hour) * 60 + Number(this.minute) >= 480) {
        this.validationTxt = t('BaseTimeMinute.val2')
        this.hour = ''
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
      <label :for="id + index" class="BaseTimeMinute--label">
        <input
          v-model="hour"
          type="number"
          ref="hour"
          @input="inputTxt($event, `hr`)"
          name=""
          min="0"
          step="1"
          :id="id + index"
          placeholder="0"
          class="BaseTimeMinute--input" />
        <span class="BaseTimeMinute--txt">{{ $t('BaseTimeMinute.txt1') }}</span>
      </label>
    </div>
    <div>
      <label :for="id + '2' + index" class="BaseTimeMinute--label">
        <input
          v-model="minute"
          type="number"
          ref="minute"
          @input="inputTxt($event, 'mnt')"
          name=""
          min="0"
          step="1"
          :id="id + '2' + index"
          placeholder="0"
          class="BaseTimeMinute--input" />
        <span class="BaseTimeMinute--txt">{{ $t('BaseTimeMinute.txt2') }}</span>
      </label>
    </div>
  </div>
  <div v-if="validationTxt" class="validation">{{validationTxt}}</div>
</template>

<style scoped>

</style>
