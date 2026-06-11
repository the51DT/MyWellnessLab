<script setup>
/**
 * 가입 시 휴대폰 인증을 위해 입력 비교하는 콤포넌트
 */
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import * as joinApi from '@/apis/join'

const { t } = useI18n()
const message = ref('')
const phoneNumber = ref('')

/**
 * 사용자가 입력한 전화번호를 받아 체크하고, 문제가 없다면 SMS 인증 메시지를 전송하는 역할
 * @returns {Promise<void>}
 */
const pushSMS = async () => {
  if (!phoneNumber.value) {
    message.value = t('BasePhoneCertification.inputPhoneNumberMessage')
    timerReady.value = false
    return
  }

  try {
    const customerId = user.customerId
    const mobileArea = phoneNumber.value.substring(0, 3)
    const mobileNumber = phoneNumber.value.substring(3, phoneNumber.value.length)

    const params = {
      name: user.name,
      mobileArea,
      mobileNumber
    }
    await joinApi.pushSMS(customerId, params)

    BaseCertificationInputRef.value.timerStart()
    timerReady.value = true
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div>
    <div class="JoinPhoneCertification--phone-wrap">
      <h2 class="JoinPhoneCertification--h2">
        <label for="jpc01" class="JoinPhoneCertification--phone-tit">{{ $t('BasePhoneCertification.phoneNumberInput') }}</label>
      </h2>

      <div class="BasePhoneInput">
        <input
          v-model="phoneNumber"
          type="text"
          id="jpc01"
          class="BasePhoneInput--input"
          :maxlength="11"
          @input="inputEmit" />
        <button
          :disabled="!phoneNumber"
          @click="pushSMS"
          type="button"
          class="btn--small2 BasePhoneInput--btn">
          {{ $t('BasePhoneCertification.sendVerification') }}
        </button>
      </div>

      <div class="JoinPhoneCertification--validation">
        {{ $t('BasePhoneCertification.phoneNumberValidation') }}
      </div>
    </div>

    <div class="JoinPhoneCertification--certi-wrap">
      <h2 class="JoinPhoneCertification--h2">
        <label for="jpc02" class="JoinPhoneCertification--certi-tit">{{ $t('BasePhoneCertification.verificationCodeInput') }}</label>
      </h2>
      <!-- <BaseCertificationInput :totalSeconds="180" @timerEnd="handleTimeOut" @certificationConfirm="handleCertification" ref="BaseCertificationInputRef" class="JoinPhoneCertification--certi-input"/> -->
      <div v-if="message" class="JoinPhoneCertification--validation2">{{ message }}</div>
    </div>
  </div>
</template>
