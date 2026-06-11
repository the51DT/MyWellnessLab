<script setup>
import { computed, getCurrentInstance, ref } from 'vue'
import { useStore } from 'vuex'
import BasePhoneInput from '@/components/BasePhoneInput.vue'
import BaseCertificationInput from '@/components/BaseCertificationInput.vue'
import BasePopupTit from '@/components/BasePopupTit.vue'
import message from '@/components/message'
import * as mypageApi from '@/apis/mypage'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const store = useStore()
const props = defineProps({
  isPopupPhone: {
    type: Boolean,
    default: false
  },
  user: Object
})

const prefix = ref('JoinPhoneCertification') /* 231212 클래스 접두어 */
const phoneNumber = ref() /* 최종 폰번호 */
const certificationResult = ref() /* 인증 결과 값 */
const timerReady = ref(false) /* 3분 유효한지 여부 */
const BaseCertificationInputRef = ref(null) /* 인증번호 입력 컴포넌트 */
const btnNext = ref(false) /* 다음 버튼 */

const patternPhone = /01[016789][^0][0-9]{2,3}[0-9]{3,4}/
const validPhoneNumber = computed(() => {
  if (!patternPhone.test(phoneNumber.value)) {
    return -1
  } else if (props.user.mobile) {
    const existingMobile = props.user.mobile.replaceAll('-', '')

    if (existingMobile === phoneNumber.value) {
      return -2
    }
  }

  return 0
})

const phoneNumberCheckMessage = ref('') /* 폰번호 message */
const phoneNumberCheck = ref(false) /* 폰번호 validation */
const instance = getCurrentInstance()

const phoneInput = (val) => {
  phoneNumber.value = val
}

const checkCertificationNumber = () => {
  if (phoneNumber.value.length < 6) {
    certificationResult.value = ''
  }
}

// 인증시작
/**
 * 휴대폰 번호를 검증하고, 인증 SMS를 전송하는 역할을 합니다.
 *
 * 세부 동작:
 * 1. 휴대폰 번호를 검사합니다.
 * 2. 번호가 비정상적인 경우 해당하는 오류 메시지를 표시합니다.
 * 3. 번호가 유효한 경우, 인증 SMS를 전송하고 타이머를 시작합니다.
 * 4. 인증 번호 전송이 완료되면, 버튼을 비활성화하여 중복 클릭을 방지합니다.
 */
const certificationStart = async () => {
  if (validPhoneNumber.value === -1) {
    phoneNumberCheck.value = true
    phoneNumberCheckMessage.value = t('MyPagePhoneChangePopup.text7')
    return
  } else if (validPhoneNumber.value === -2) {
    phoneNumberCheck.value = true
    phoneNumberCheckMessage.value = t('MyPagePhoneChangePopup.text8')
    return
  }

  const paramData = {
    name: props.user.name,
    mobileArea: phoneNumber.value.substring(0, 3),
    mobileNumber: phoneNumber.value.substring(3, 11)
  }

  try {
    await mypageApi.sendCertificationSms(paramData)

    BaseCertificationInputRef.value.timerStart()
    timerReady.value = true

    // 인증보내기 버튼 누르면 disable 처리
    document.querySelector('.BasePhoneInput--btn').disabled = true
    document.getElementById('jpc01').disabled = true
  } catch (e) {
    // 중복 휴대폰 번호 에러 처리
    phoneNumberCheck.value = true
    phoneNumberCheckMessage.value = e.response?.data?.message || t('MyPagePhoneChangePopup.text17')
    console.error(e)
  }
}

// 인증번호 판별
const certificationConfirm = async (number) => {
  if (timerReady.value) {
    try {
      await mypageApi.isCertificationSms(number.value)

      certificationResult.value = t('MyPagePhoneChangePopup.text10')
      BaseCertificationInputRef.value.timerStart('complete')
      btnNext.value = true
    } catch (e) {
      certificationResult.value = t('MyPagePhoneChangePopup.text11')
    }
  } else {
    certificationResult.value = t('MyPagePhoneChangePopup.text12')
  }
}

const timerEnd = () => {
  timerReady.value = false
  // 입력창, 인증보내기 버튼 활성화
  document.getElementById('jpc01').disabled = false
  document.querySelector('.BasePhoneInput--btn').disabled = false
  certificationResult.value = t('MyPagePhoneChangePopup.text13')
}

// 휴대폰 번호 변경
/**
 * 사용자의 전화번호를 변경하는 과정을 완료합니다.
 * @returns {Promise<void>}
 */
const complete = async () => {
  const mobileArea = phoneNumber.value.substring(0, 3)
  const mobileNumber = phoneNumber.value.substring(3, 11)

  const paramData = {
    mobileArea,
    mobileNumber
  }

  try {
    await mypageApi.changeNumber(paramData)
    await message.alert(t('MyPagePhoneChangePopup.text15'))

    const mobile = `${mobileArea}-${mobileNumber.substring(0, 4)}-${mobileNumber.substring(4,
        mobileNumber.length)}`

    store.dispatch('setUser', {
      ...props.user,
      mobile,
      mobileArea,
      mobileNumber
    })

    changeReload()
    popupClose()
  } catch (e) {
    console.error(e)
  }
}

function popupClose () {
  instance.emit('popupClose')
}

function changeReload () {
  instance.emit('changeReload')
}
</script>

<template>
  <base-popup-tit v-if="props.isPopupPhone" @popupClose="popupClose">
    <template v-slot:title>
      {{ $t('MyPagePhoneChangePopup.text1') }}
    </template>
    <template v-slot:contents>
      <section :class="prefix + '--wrap'">
        <div :class="prefix + '--in-wrap'">
          <div class="txt--center" :class="prefix + '--txt'">
            <span class="gray">{{ $t('MyPagePhoneChangePopup.text2') }}</span><br />{{ $t('MyPagePhoneChangePopup.text3') }}
          </div>
          <div :class="prefix + '--txt2'">
            {{ $t('MyPagePhoneChangePopup.text4') }}<br />
            {{ $t('MyPagePhoneChangePopup.text5') }}
          </div>

          <div :class="prefix + '--phone-wrap'">
            <h2 :class="prefix + '--h2'">
              <label for="jpc01" :class="prefix + '--phone-tit'">{{ $t('MyPagePhoneChangePopup.text6') }}</label>
            </h2>
            <BasePhoneInput
              :maxlength="11"
              :id="`jpc01`"
              @inputTxt="phoneInput"
              @certificationStart="certificationStart" />
            <div v-if="phoneNumberCheck" class="JoinPhoneCertification--validation">
              <!--폰번호가 안 맞을 경우 벨리데이션 처리해주세요-->
              {{ phoneNumberCheckMessage }}
            </div>

          </div>

          <div :class="prefix + '--certi-wrap'">
            <h2 :class="prefix + '--h2'">
              <label for="jpc02" :class="prefix + '--certi-tit'">{{ $t('MyPagePhoneChangePopup.text9') }}</label>
            </h2>
            <BaseCertificationInput
              :totalSeconds="180"
              @timerEnd="timerEnd"
              @certificationConfirm="certificationConfirm"
              @keyup="checkCertificationNumber"
              ref="BaseCertificationInputRef" />
            <div
              v-if="certificationResult"
              class="JoinPhoneCertification--validation2"
              :class="btnNext ? 'ok' : ''">{{ certificationResult }}
            </div> <!--231129 동적 클래스 추가-->
          </div>
        </div>

        <div class="btn--bottom">
          <button
            @click="complete"
            :disabled="!btnNext"
            type="button">{{ $t('MyPagePhoneChangePopup.text14') }}
          </button>
        </div>
      </section>
    </template>
  </base-popup-tit>
</template>
