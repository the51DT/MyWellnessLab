<script setup>
/**
 * 웰니스 분석 시 시간과 분을 함께 입력받는 콤포넌트
 */
import { onMounted, ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const props = defineProps({
  value: {
    type: Number,
    default: null
  },
  index: {
    type: Number,
    default: 0
  },
  focus: {
    type: String,
    default: ''
  },
  id: {
    type: String
  },
  limit: {
    type: Boolean,
    default: true
  },
  foucusTarget: {
    type: String,
    default: ''
  },
  placeholderHour: {
    type: String,
    default: '8'
  }
})

const emit = defineEmits(['change'])

const hourRef = ref()
const minuteRef = ref()
const validationTxt = ref('')

const hour = computed(() => {
  if (props.value !== null) {
    return Math.floor(props.value / 60)
  }

  return null
})

const minute = computed(() => {
  if (props.value !== null) {
    return props.value % 60
  }

  return null
})

/**
 * 사용자로부터 시각을 입력받아 유효성을 검사하고,
 * 그 결과를 분 단위로 변환하여 다른 이벤트 핸들러에게 전달하는 역할을 합니다.
 * 유효성 검사 조건은 시각이 23시를 초과하거나 일일 총 시간이 24시간을 초과하는 경우 임
 * @param e
 */
const changeHour = (e) => {
  const value = Number(e.target.value)
  e.target.value = value

  if (Number.isNaN(value) && !Number.isInteger(value)) {
    return
  }

  const total = (value * 60) + minute.value
  validationTxt.value = ''

  if (value > 23) {
    validationTxt.value = t('BaseTimeInput.val1')
    return
  }
  if (props.limit && total >= 1440) {
    // validationTxt.value = '시간 합산은 8시간(480분)을 초과할 수 없습니다.'
    validationTxt.value = t('BaseTimeInput.val1')
    return
  }

  emit('change', total)
}

/**
 * 웰니스 분석 시 시간과 분의 유효성 체크
 * @param e
 */
const changeMinute = (e) => {
  const value = Number(e.target.value)
  e.target.value = value

  if (Number.isNaN(value) && !Number.isInteger(value)) {
    return
  }

  const total = (hour.value * 60) + value

  validationTxt.value = ''

  if (value > 59) {
    validationTxt.value = t('BaseTimeInput.val2')
    return
  }
  if (props.limit && total >= 1440) {
    // validationTxt.value = '시간 합산은 8시간(480분)을 초과할 수 없습니다.'
    validationTxt.value = t('BaseTimeInput.val1')
    return
  }

  emit('change', total)
}

onMounted(() => {
  if (props.focus === 'hour' && hourRef.value) {
    hourRef.value.focus()
  } else if (props.focus === 'minute' && hourRef.value) {
    minuteRef.value.focus()
  }
})

watch(() => props.foucusTarget,
  (nv, ov) => {
    switch (nv) {
      case 'hourRef': {
        hourRef.value.focus(); break
      }
      case 'minuteRef': {
        minuteRef.value.focus(); break
      }
      default: break
    }
  }
)
</script>

<template>
  <div class="align--between BaseTimeMinute">
    <div>
      <label :for="id + index" class="BaseTimeMinute--label">
        <input
          ref="hourRef"
          :value="hour"
          type="number"
          inputmode="numeric"
          pattern="\d"
          @input="changeHour"
          name=""
          min="0"
          step="1"
          :id="id + index"
          :placeholder=placeholderHour
          class="BaseTimeMinute--input" />
        <span class="BaseTimeMinute--txt">{{ $t('BaseTimeInput.txt1') }}</span>
      </label>
    </div>

    <div>
      <label :for="id + '2' + index" class="BaseTimeMinute--label">
        <input
          ref="minuteRef"
          :value="minute"
          type="number"
          inputmode="numeric"
          pattern="\d"
          @input="changeMinute"
          name=""
          min="0"
          step="1"
          :id="id + '2' + index"
          placeholder="0"
          class="BaseTimeMinute--input" />
        <span class="BaseTimeMinute--txt">{{ $t('BaseTimeInput.txt2') }}</span>
      </label>
    </div>
  </div>

  <div class="validation"> {{(hour===0&&minute===0) ? $t('BaseTimeInput.val3') : validationTxt}}</div>
</template>
