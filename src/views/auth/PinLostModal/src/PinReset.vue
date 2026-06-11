<script setup>
import { onMounted, computed, ref } from 'vue'
import BasePinInput from '@/components/BasePinInput.vue'
import * as loginApi from '@/apis/login'
import BasePopup from '@/components/BasePopup.vue'
import {useI18n} from "vue-i18n";


const props = defineProps({
  userInfo: {
    type: Object,
    default: () => null
  }
})
const emit = defineEmits(['finish'])
const { t } = useI18n()

const pinInput1 = ref()
const pinInput2 = ref()
const pinArr = ref(['', '', '', ''])
const pinReArr = ref(['', '', '', ''])

const pinStr = computed(() => pinArr.value.join(''))
const pinReStr = computed(() => pinReArr.value.join(''))

const isValidation = ref(false) /* 240110 재 입력 밸리데이션 색상 변수 */
const errorMessage = ref('')

const isDisabled = ref(false)

/**
 * 핀번호 변경시 호출
 * @param {*} value
 */
const changePin = (value) => {
  switch (value.tg) {
    case 'p1':
      pinArr.value[0] = value.val
      break
    case 'p2':
      pinArr.value[1] = value.val
      break
    case 'p3':
      pinArr.value[2] = value.val
      break
    case 'p4':
      pinArr.value[3] = value.val
      pinInput2.value.focus()
      break
    default:
      break
  }

  if (pinStr.value.length < 4 && errorMessage.value !== '') {
    errorMessage.value = ''
    isDisabled.value = false
  }
}

/**
 * 변경 PIN 번호 확인 변경시 호출
 * @param {*} value
 */
const changeRePin = (value) => {
  switch (value.tg) {
    case 'p1':
      pinReArr.value[0] = value.val
      break
    case 'p2':
      pinReArr.value[1] = value.val
      break
    case 'p3':
      pinReArr.value[2] = value.val
      break
    case 'p4':
      pinReArr.value[3] = value.val
      break
    default:
      break
  }

  if (pinReStr.value.length < 4 && errorMessage.value !== '') {
    errorMessage.value = ''
    isDisabled.value = false
  }
}

/**
 * pinCheck process
 */
const handlePinChecked = async () => {
  errorMessage.value = ''

  try {
    if (pinStr.value === pinReStr.value) {
      isDisabled.value = true
      errorMessage.value = t('PinReset.text4')
      isValidation.value = true
      document.querySelectorAll('.txt--center.pinI')[7].blur()
    } else {
      errorMessage.value = t('PinReset.text5')
      pinReArr.value = ['', '', '', '']
      pinInput2.value.reset()
      isDisabled.value = false
      isValidation.value = false
    }
  } catch (e) {
    console.error(e)
  }
}

/**
 * 핀번호를 업데이트한다.
 */
const handleComplete = async () => {
  try {
    const params = {
      customerId: props.userInfo.customerId,
      pinCode: pinStr.value
    }
    await loginApi.updatePin(params)

    // alert('PIN 번호 재설정이 완료되었습니다')
    // openPopPin.value = true;
    emit('finish')
  } catch (e) {
    console.error(e)
    if (e.response?.data?.message) {
      alert(e.response.data.message)
    }
  }
}

onMounted(() => {
  pinInput1.value.focus()
})
</script>

<template>
  <div>
    <section class="JoinPinRegistration--wrap"> <!--231129 클래스 삭제-->
      <div class="space--all-default JoinPinRegistration--in-wrap">
        <div class="JoinPinRegistration--txt">
          {{ $t('PinReset.text1') }}
        </div>
        <div class="JoinPinRegistration--pin-wrap">
          <h2 class="JoinPinRegistration--tit-wrap">
            <label for="jpr01" class="JoinPinRegistration--tit">{{ $t('PinReset.text2') }}</label>
          </h2>
          <div class="JoinPinRegistration--input-wrap">
            <BasePinInput
              ref="pinInput1"
              :autoFocus="false"
              class="login--input"
              :autoCheck="true"
              @inputTxt="changePin" />
          </div>
          <!--          <div v-show="message" class="JoinPinRegistration&#45;&#45;validation1">{{ message }}</div>-->
        </div>

        <div class="JoinPinRegistration--pin2-wrap">
          <h2 class="JoinPinRegistration--tit2-wrap">
            <label for="jpr02" class="JoinPinRegistration--tit2">{{ $t('PinReset.text3') }}</label>
          </h2>
          <div class="JoinPinRegistration--input-wrap">
            <BasePinInput
              ref="pinInput2"
              :autoFocus="false"
              class="login--input"
              @inputTxt="changeRePin"
              :autoCheck="true"
              @checkEnter="handlePinChecked" />
          </div>
          <div v-if="errorMessage" class="JoinPinRegistration--validation" :class="isValidation ? 'ok' : ''">{{ errorMessage }}</div>
        </div>
      </div>
    </section>

    <div class="btn--bottom JoinPinRegistration--btm">
      <button
        :disabled="!isDisabled"
        type="button"
        class="JoinPinRegistration--btn"
        @click="handleComplete">{{ $t('PinReset.text6') }}</button>
    </div>

  </div>

</template>
