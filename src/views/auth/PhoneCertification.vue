<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import BasePhoneInput from '@/components/BasePhoneInput.vue'
import BaseCertificationInput from '@/components/BaseCertificationInput.vue'
import BasePopup from '@/components/BasePopup.vue'
import * as joinApi from '@/apis/join'
import * as loginApi from '@/apis/login'

const store = useStore()
const router = useRouter()
const { t } = useI18n()

const user = store.getters.getUser

const message = ref('')
const phoneNumberMessage = ref('')
const showTokenFailPopup = ref(false)

/**
 * user 데이터 유효성 검사 및 복구
 * @returns {object|null} 유효한 user 데이터 또는 null
 */
const validateAndRecoverUserData = async () => {
  // 1단계: 현재 user 데이터 확인
  let currentUser = store.getters.getUser
  
  // user 데이터가 유효한 경우
  if (currentUser && currentUser.customerId && currentUser.name) {
    return currentUser
  }
  
  // 2단계: SessionStorage에서 복구 시도 (빠르고 customerUid도 함께 복구)
  try {
    const vuexData = sessionStorage.getItem('vuex')
    if (vuexData) {
      const parsed = JSON.parse(vuexData)

      // user와 customerUid를 함께 복구
      if (parsed.user?.user?.customerId && parsed.user?.user?.name) {
        console.log('SessionStorage에서 user 데이터 복구 성공')
        store.dispatch('setUser', parsed.user.user)

        // customerUid도 함께 복구
        if (parsed.user?.customerUid) {
          store.dispatch('setCustomerUid', parsed.user.customerUid)
        }

        return parsed.user.user
      }
    }
  } catch (error) {
    console.warn('SessionStorage 복구 실패:', error)
  }

  // 3단계: SessionStorage 복구도 실패한 경우 Amway API로 시도
  try {
    // CustomerUid 가져오기 (SessionStorage에서 복구되었을 수도 있음)
    const customerUid = store.getters.getCustomerUid
    if (!customerUid) {
      console.error('CustomerUid가 없습니다. 이전 단계로 돌아가야 합니다.')
      router.push({ name: 'LoginProfile' })
      return null
    }

    // Hybris 토큰이 없으면 발급받기
    const hasHybrisToken = store.getters.getHybrisToken
    if (!hasHybrisToken) {
      try {
        console.log('Hybris 토큰 발급 시도...')
        const hybrisTokenResponse = await loginApi.getHybrisToken()
        const hybrisToken = `${hybrisTokenResponse.data.token_type} ${hybrisTokenResponse.data.access_token}`
        store.dispatch('setHybrisToken', hybrisToken)
        console.log('Hybris 토큰 발급 성공')
      } catch (tokenError) {
        console.error('Hybris 토큰 발급 실패:', tokenError)
        showTokenFailPopup.value = true
        return null
      }
    }

    // Amway 프로필 목록 가져오기
    const params = { fields: 'LOGME' }
    const response = await loginApi.getAmwayProfileList(customerUid, params)
    const profileList = response.customers || []

    if (profileList.length === 0) {
      console.error('프로필 목록이 비어있습니다.')
      return null
    }

    // joinInfo에서 선택된 프로필 찾기
    const joinInfo = store.getters.getJoinInfo
    let selectedProfile = null

    if (joinInfo && joinInfo.customerId) {
      // joinInfo에 customerId가 있으면 해당 프로필 찾기
      selectedProfile = profileList.find(profile =>
        profile.customerId === joinInfo.customerId
      )
    } else if (profileList.length === 1) {
      // 프로필이 1개면 자동 선택
      selectedProfile = profileList[0]
    }

    if (selectedProfile && selectedProfile.customerId && selectedProfile.name) {
      store.dispatch('setUser', selectedProfile)
      return selectedProfile
    }

    console.error('적절한 프로필을 찾을 수 없습니다.')
    return null
  } catch (error) {
    console.error('API 복구 실패:', error)
    return null
  }
}

const phoneNumber = ref('')
const timerReady = ref(false) /* 3분 유효한지 여부 */
const BaseCertificationInputRef = ref(null) /* 인증번호 입력 컴포넌트 */
const isCertification = ref(false)

/**
 * 핸드폰 번호 변경되었을때 호출
 * @param {*} value
 */
const changePhoneNumber = (value) => {
  phoneNumber.value = value
  phoneNumberMessage.value = ''
}

/**
 * 핸드폰 번호 유효성 체크
 * @returns {boolean}
 */
const validPhoneNumber = () => {
  timerReady.value = false
  phoneNumberMessage.value = ''
  message.value = ''

  if (!phoneNumber.value) {
    phoneNumberMessage.value = t('PhoneCertification.text5')
    return false
  }

  const phoneNumberRegex = /^01(0|1|6|7|8|9)([0-9]{3,4})([0-9]{4})$/

  if (phoneNumber.value.length < 11 || !phoneNumberRegex.test(phoneNumber.value)) {
    phoneNumberMessage.value = t('PhoneCertification.text6')
    return false
  }

  return true
}

/**
 * 인증번호 체크
 */
const checkCertificationNumber = () => {
  if (document.getElementById('jpc02').value.length < 6) {
    message.value = ''
  }
}

/**
 * 문자보내기
 */
const pushSMS = async () => {
  if (!validPhoneNumber()) {
    return
  }

  // user 데이터 유효성 검사 및 복구
  const validUser = await validateAndRecoverUserData()
  if (!validUser) {
    phoneNumberMessage.value = '사용자 정보를 불러올 수 없습니다. 다시 시도해주세요.'
    return
  }

  try {
    const customerId = validUser.customerId
    const mobileArea = phoneNumber.value.substring(0, 3)
    const mobileNumber = phoneNumber.value.substring(3, phoneNumber.value.length)

    const params = {
      name: validUser.name,
      mobileArea,
      mobileNumber
    }
    await joinApi.pushSMS(customerId, params)

    BaseCertificationInputRef.value.timerStart()
    timerReady.value = true
    // 인증보내기 버튼 누르면 disable 처리
    document.querySelector('.BasePhoneInput--btn').disabled = true
    document.getElementById('jpc01').disabled = true
  } catch (e) {
    // 중복 휴대폰 번호 에러 처리
    if (e.response?.status === 401) {
      phoneNumberMessage.value = e.response?.data?.message
    } else {
      phoneNumberMessage.value = e.response?.data?.message || 'SMS 전송에 실패했습니다'
    }
    console.error(e)
  }
}

/**
 * 안중 벨리데이션
 * @param {*} certificationNumber
 */
const handleCertification = async (certificationNumber) => {
  if (!certificationNumber.value) {
    return
  }

  if (!timerReady.value) {
    message.value = t('PhoneCertification.text8')
    return
  }

  // user 데이터 유효성 검사 및 복구
  const validUser = await validateAndRecoverUserData()
  if (!validUser) {
    message.value = '사용자 정보를 불러올 수 없습니다. 다시 시도해주세요.'
    return
  }

  try {
    const customerId = validUser.customerId
    await joinApi.getCertificationSMS(customerId, certificationNumber.value)

    timerReady.value = false
    message.value = t('PhoneCertification.text9')
    BaseCertificationInputRef.value.timerStart('complete')

    isCertification.value = true

    store.dispatch('changePhoneCertification', true)

    store.dispatch('setJoinInfo', {
      mobileArea: phoneNumber.value.substring(0, 3),
      mobileNumber: phoneNumber.value.substring(3, phoneNumber.value.length)
    })
  } catch (e) {
    message.value = t('PhoneCertification.text10')

    console.error(e)
  }
}

/**
 * 휴대폰 인증시간 타임아웃시
 */
const handleTimeOut = () => {
  timerReady.value = false
  message.value = t('PhoneCertification.text8')
  // 입력창, 인증보내기 버튼 활성화
  document.getElementById('jpc01').disabled = false
  document.querySelector('.BasePhoneInput--btn').disabled = false
}

/**
 * PIN 번호 등록 이동
 */
const handleNext = () => {
  router.push({ name: 'JoinPinRegistration' })
}

/**
 * 토큰 발급 실패 팝업 확인 버튼 클릭
 */
const handleTokenFailConfirm = () => {
  showTokenFailPopup.value = false
  router.push({ name: 'Intro' })
}
</script>

<template>
  <section class="container JoinPhoneCertification--wrap JoinPhoneCertification--first">
    <div class="space--all-default JoinPhoneCertification--in-wrap">
      <div class="txt--center JoinPhoneCertification--txt">
        {{ t('PhoneCertification.text1') }}
      </div>
      <div class="JoinPhoneCertification--txt2">
        {{ t('PhoneCertification.text2') }}
      </div>

      <div class="JoinPhoneCertification--phone-wrap">
        <h2 class="JoinPhoneCertification--h2">
          <label for="jpc01" class="JoinPhoneCertification--phone-tit">{{ t('PhoneCertification.text3') }}</label>
        </h2>
        <BasePhoneInput
          :maxlength="11"
          :id="`jpc01`"
          @inputTxt="changePhoneNumber"
          @certificationStart="pushSMS"
          class="JoinPhoneCertification--phone-input"
          :placeholder="t('PhoneCertification.text4')" />
        <div v-if="phoneNumberMessage" class="JoinPhoneCertification--validation">
          {{ phoneNumberMessage }}
        </div>
      </div>

      <div class="JoinPhoneCertification--certi-wrap">
        <h2 class="JoinPhoneCertification--h2">
          <label for="jpc02" class="JoinPhoneCertification--certi-tit">{{ t('PhoneCertification.text7') }}</label>
        </h2>
        <BaseCertificationInput
          :totalSeconds="180"
          @timerEnd="handleTimeOut"
          @certificationConfirm="handleCertification"
          @keyup="checkCertificationNumber"
          ref="BaseCertificationInputRef"
          class="JoinPhoneCertification--certi-input" />
        <div v-if="message" class="JoinPhoneCertification--validation2" :class="isCertification ? 'ok' : ''">{{ message }}
        </div>
      </div>
    </div>

    <div class="btn--bottom">
      <button
        @click="handleNext"
        :disabled="!isCertification"
        type="button">{{ t('Common.next') }}</button>
    </div>
  </section>

  <base-popup v-if="showTokenFailPopup" class="token-fail-popup">
    <template v-slot:contents>
      <p class="pop-text-bold">{{ t('PhoneCertification.tokenFailMessage') }}</p>
      <div class="pop-btn-wrap">
        <button @click="handleTokenFailConfirm" class="pop-btn pop-btn--green" type="button">{{ t('Common.confirm') }}</button>
      </div>
    </template>
  </base-popup>
</template>
