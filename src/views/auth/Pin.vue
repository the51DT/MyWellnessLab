<script setup>
import { onMounted, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BasePinInput from '@/components/BasePinInput.vue'
import PinLostModal from './PinLostModal'
import * as loginApi from '@/apis/login'
import * as mypageApi from '@/apis/mypage'
import BasePopup from '@/components/BasePopup.vue'
import message from '@/components/message'

const store = useStore()
const router = useRouter()
const { t } = useI18n()

const user = store.getters.getUser

const isShowPinLostModal = ref(false)
const errorMessage = ref('')
const pinErrorCount = ref('')
const isFail = ref(false)
const isInputDisabled = ref(false)
const pinArr = ref(['', '', '', ''])

const pinStr = computed(() => pinArr.value.join(''))
const isDisabled = computed(() => {
  return pinStr.value.length !== 4
})
const openPopPin1 = ref(false)
const openPopWithDraw = ref(false)
const pin = ref(null)

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
      break
    default:
      break
  }

  // PIN 입력이 시작되면 이전 오류 메시지 초기화
  if (pinStr.value.length === 1 && value.tg === 'p1') {
    errorMessage.value = ''
  }
}

/**
 * 실패카운트 오버시 호출
 */
const handleFailCountOver = () => {
  openPopPin1.value = true
}

/**
 * 모단 컨트롤
 */
const openChangeModal = () => {
  openPopPin1.value = false
  isFail.value = true
  isShowPinLostModal.value = true
}

/**
 * 사용자 정보가 일치하지 않을 때 호출
 */
const handleUserInfoMismatch = async () => {
  await message.alert(t('Pin.text8'))
  pin.value.reset()
}

/**
 * 사용자 탈퇴시 호출
 */
const handleFailWithDrowUserOver = () => {
  openPopWithDraw.value = true
  pin.value.reset()
}

/**
 * PopWithDraw 종료
 */
const closeWithDrowModal = () => {
  openPopWithDraw.value = false
}

/**
 * 사용자 현재 핀번호 실패회수 조회
 * @returns {number}
 */
const getPinFailCount = async () => {
  try {
    const params = { customerId: user.customerId }
    const response = await loginApi.getPinFailCount(params)
    return response.data.pinFailCount
  } catch (e) {
    console.log(e)
  }
}

/**
 * 최신 약관 중 미동의 목록 조회
 * @returns {Array}
 */
const getDisagreeTermsList = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const customerId = user.customerId
    const response = await loginApi.getDisagreeTermsList(customerId)

    return response.data
  } catch (e) {
    throw e
  }
}

/**
 * 사용자 로그인
 */
const login = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const params = {
      userId: user.customerId,
      password: pinStr.value
    }
    const response = await loginApi.login(params)

    return response.data
  } catch (e) {
    throw e
  }
}

/**
 * 핀번호 체크
 */
const handlePinChecked = async () => {
  if (isDisabled.value) return
  errorMessage.value = ''

  try {
    isInputDisabled.value = true

    const params = {
      customerId: user.customerId,
      pinCode: pinStr.value
    }

    const response = await loginApi.getPinCheck(params)
    const isSuccess = response.data.success

    if (isSuccess) {
      const disagreeTermsList = await getDisagreeTermsList()

      if (disagreeTermsList.length > 0) {
        store.dispatch('setPin', pinStr.value)
        router.push({ name: 'LoginTerms' })
      } else {
        const tokenInfo = await login()
        store.dispatch('setToken', `${tokenInfo.type} ${tokenInfo.token}`)
        store.dispatch('setUsername', tokenInfo.username)

        const userInfo = await mypageApi.getLoggedInUserInfo()

        // 힙 코드 등록
        // loginApi.heapData(loginApi.heapDataParam, userInfo.data)

        store.dispatch('setUser', userInfo.data)
        router.push({ name: 'Home' })
      }
    } else {
      pin.value.reset()
      pinArr.value = ['', '', '', '']
      errorMessage.value = t('Pin.text2')
      pinErrorCount.value = response.data.pinFailCount
    }
  } catch (e) {
    if (e.response.data != null && e.response.data.info != null) {
      const code = e.response.data.info.code
      if( code === '1107') {
        // 사용자 정보가 일치하지 않음
        handleUserInfoMismatch()
      } else if (code === '1109') {
        // 사용자 잠김
        handleFailCountOver()
      } else if (code === '1110') {
        // 사용자 탈퇴
        handleFailWithDrowUserOver()
      } else {
        console.error(e)
      }
    } else {
      console.error(e)
    }
  } finally {
    isInputDisabled.value = false
  }
}

/**
 * PinLostModal 오픈
 */
const showPinLostModal = () => {
  isShowPinLostModal.value = true
}

/**
 * PinLostModal 종료
 */
const closePinLostModal = () => {
  isShowPinLostModal.value = false
}

/**
 * 핀 초기값 세팅
 */
const handlePinChangeCompleted = () => {
  pin.value.reset()
  isFail.value = false
}

onMounted(async () => {
  const pinFailCount = await getPinFailCount()
  if (pinFailCount >= 5) {
    handleFailCountOver()
  }
})

</script>

<template>
  <div class="login--pin-wrap">

    <div class="login--pin-center">
      <div class="txt--center login--txt">
        <label for="lp01" v-html="$t('Pin.text1')"></label>
      </div>
      <BasePinInput
        @inputTxt="changePin"
        :focus="true"
        class="login--input"
        :disabled="isInputDisabled"
        :autoCheck="true"
        @checkEnter="handlePinChecked"
        ref="pin" />
      <div v-if="errorMessage" class="login--validation">{{ errorMessage }}({{pinErrorCount}}/5)</div>
      <div class="txt--center login--pin-find">
        <a href="javascript: void(0);" class="btn--txt2 c5" @click="showPinLostModal">{{ $t('Pin.text3') }}</a>
      </div>

    </div>
    <div class="btn--bottom txt--center login--btn-wrap">
      <button
        @click="handlePinChecked"
        :disabled="isFail || isDisabled"
        type="button"
        class="login--btn">{{ $t('Common.confirm') }}</button>
    </div>

    <PinLostModal v-if="isShowPinLostModal" @close="closePinLostModal" @complete="handlePinChangeCompleted" />
  </div>

  <base-popup v-if="openPopPin1" class="openPopContinue pin-lost-modal">
    <template v-slot:contents>
      <p class="pop-text-light" v-html="$t('Pin.text4')"></p>
      <p class="pop-text-bold" v-html="$t('Pin.text5')"></p>
      <div class="pop-btn-wrap">
        <button @click="openChangeModal" class="pop-btn pop-btn--green" type="button">{{ $t('Common.confirm') }}</button>
      </div>
    </template>
  </base-popup>

  <base-popup v-if="openPopWithDraw" class="openPopContinue">
    <template v-slot:contents>
      <p class="pop-text-light">{{ $t('Pin.text6') }}</p>
      <p class="pop-text-bold">{{ $t('Pin.text7') }}</p>
      <div class="pop-btn-wrap">
        <button @click="closeWithDrowModal" class="pop-btn pop-btn--green" type="button">{{ $t('Common.confirm') }}</button>
      </div>
    </template>
  </base-popup>

</template>
