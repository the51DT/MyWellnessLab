<script setup>
import { onBeforeMount, ref } from 'vue'
import BaseCertificationInput from '@/components/BaseCertificationInput.vue'
import * as loginApi from '@/apis/login'
import {useI18n} from "vue-i18n";

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => null
  }
})
const emit = defineEmits(['next'])
const { t } = useI18n()
const phoneNumber = ref('')
const message = ref('')
const phoneNumberMessage = ref('')
const timerReady = ref(false) /* 3분 유효한지 여부 */
const BaseCertificationInputRef = ref(null) /* 인증번호 입력 컴포넌트 */
const isCertification = ref(false)

/**
 * 인증번호 입력시 호출
 */
const checkCertificationNumber = () => {
  if (document.getElementById('jpc02').value.length < 6) {
    message.value = ''
  }
}

/**
 * 문자발송
 */
const pushSMS = async () => {
  timerReady.value = false
  phoneNumberMessage.value = ''
  message.value = ''

  try {
    const customerId = props.userInfo.customerId
    const phoneNumberStr = phoneNumber.value.split('-').join('')
    const mobileArea = phoneNumberStr.substring(0, 3)
    const mobileNumber = phoneNumberStr.substring(3, phoneNumberStr.length)

    const params = {
      name: props.userInfo.name,
      mobileArea,
      mobileNumber
    }
    await loginApi.pushSMS(customerId, params)

    BaseCertificationInputRef.value.timerStart()
    timerReady.value = true
    // 인증보내기 버튼 누르면 disable 처리
    document.querySelector('.BasePhoneInput--btn').disabled = true
  } catch (e) {
    phoneNumberMessage.value = e.response?.data?.message
    console.error(e)
  }
}

/**
 * 인증 process
 * @param {*} certificationNumber
 */
const handleCertification = async (certificationNumber) => {
  if (!certificationNumber.value) {
    return
  }

  if (!timerReady.value) {
    message.value = t('PhoneCertificationModal.text7')
    return
  }

  try {
    const customerId = props.userInfo.customerId
    await loginApi.getCertificationSMS(customerId, certificationNumber.value)

    timerReady.value = false
    message.value = t('PhoneCertificationModal.text8')
    BaseCertificationInputRef.value.timerStart('complete')

    isCertification.value = true
  } catch (e) {
    message.value = t('PhoneCertificationModal.text9')

    console.error(e)
  }
}

/**
 * 인증시간 타임아웃시
 */
const handleTimeOut = () => {
  timerReady.value = false
  message.value = $t('PhoneCertificationModal.text10')
  document.querySelector('.BasePhoneInput--btn').disabled = false
}

/**
 * 사용자 핸드폰 번호 조회
 */
const getUserMobile = async () => {
  try {
    const customerId = props.userInfo.customerId
    const response = await loginApi.getUserMobile(customerId)
    phoneNumber.value = response.data.mobile
  } catch (e) {
    console.error(e)
  }
}

/**
 * 다음 버튼 클릭시
 */
const handleNext = () => {
  emit('next')
}

onBeforeMount(() => {
  getUserMobile()
})
</script>

<template>
  <div>
    <section class="JoinPhoneCertification--wrap">
      <div class="JoinPhoneCertification--in-wrap">
        <div class="txt--center JoinPhoneCertification--txt">
          <span class="gray">{{ $t('PhoneCertificationModal.text1') }}</span><br />{{ $t('PhoneCertificationModal.text2') }}
        </div>
        <div class="JoinPhoneCertification--txt2" v-html="$t('PhoneCertificationModal.text3')">
        </div>

        <div class="JoinPhoneCertification--phone-wrap">
          <h2 class="JoinPhoneCertification--h2">
            <label for="jpc01" class="JoinPhoneCertification--phone-tit">{{ $t('PhoneCertificationModal.text4') }}</label>
          </h2>

          <div class="BasePhoneInput">
            <div class="BasePhoneInput--input">
              <span class="BasePhoneInput--phone">{{ phoneNumber }}</span>
            </div>
            <button type="button" class="BasePhoneInput--btn" @click="pushSMS">{{ $t('PhoneCertificationModal.text5') }}</button>
          </div>

          <div v-if="phoneNumberMessage" class="JoinPhoneCertification--validation">
            {{ phoneNumberMessage }}
          </div>
        </div>

        <div class="JoinPhoneCertification--certi-wrap">
          <h2 class="JoinPhoneCertification--h2">
            <label for="jpc02" class="JoinPhoneCertification--certi-tit">{{ $t('PhoneCertificationModal.text6') }}</label>
          </h2>
          <BaseCertificationInput
            :totalSeconds="180"
            @timerEnd="handleTimeOut"
            @certificationConfirm="handleCertification"
            @keyup="checkCertificationNumber"
            ref="BaseCertificationInputRef"
            class="JoinPhoneCertification--certi-input" />
          <div v-if="message" class="JoinPhoneCertification--validation2" :class="isCertification ? 'ok' : ''">{{ message }}</div>
        </div>
      </div>
      <div class="btn--bottom">
        <button
          class="JoinPhoneCertification--btn"
          type="button"
          :disabled="!isCertification"
          @click="handleNext">
          {{ $t('PhoneCertificationModal.text11') }}
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.BasePhoneInput--input {
  height: 4.25rem;
  display: flex;
  align-items: center;
  margin-left: 1.5rem;
}
</style>
