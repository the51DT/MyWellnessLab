<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BasePinInput from '@/components/BasePinInput.vue'
import * as loginApi from '@/apis/login'
import * as joinApi from '@/apis/join'
import * as mypageApi from '@/apis/mypage'

const store = useStore()
const router = useRouter()
const { t } = useI18n()

const joinInfo = store.getters.getJoinInfo
const user = store.getters.getUser

const errorMessage = ref('')
const isLoading = ref(false)

const pinInput1 = ref()
const pinInput2 = ref()

const pinArr = ref(['', '', '', ''])
const pinReArr = ref(['', '', '', ''])

const pinStr = computed(() => pinArr.value.join(''))
const pinReStr = computed(() => pinReArr.value.join(''))
const isDisabled = computed(() => {
  // 로딩 중이거나 PIN이 매칭되지 않았거나 성공 메시지가 표시되지 않은 경우 버튼 비활성화
  return isLoading.value || !(isPinsMatched.value && messageColor.value)
})
const messageColor = ref(false)

// PIN 매칭 상태를 추적하는 computed
const isPinsMatched = computed(() => {
  return pinStr.value.length === 4 && 
         pinReStr.value.length === 4 && 
         pinStr.value === pinReStr.value
})

/**
 * 핀 번호 변경
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
  }
}

/**
 * 변경 PIN 번호 확인 변경
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

  // PIN 재입력 시작 시 이전 메시지 및 상태 초기화
  if (pinReStr.value.length === 1 && value.tg === 'p1') {
    errorMessage.value = ''
    messageColor.value = false
  }
}

/**
 * 핀체크
 */
const handlePinChecked = async () => {
  errorMessage.value = ''

  try {
    // 첫 번째 PIN이 4자리가 아닌 경우
    if (pinStr.value.length !== 4) {
      errorMessage.value = t('PinRegistration.text7') // "PIN 번호를 4자리로 입력해주세요"
      messageColor.value = false
      return
    }

    // 두 번째 PIN이 4자리가 아닌 경우
    if (pinReStr.value.length !== 4) {
      errorMessage.value = t('PinRegistration.text8') // "PIN 번호 확인을 4자리로 입력해주세요"
      messageColor.value = false
      return
    }

    // PIN 일치 여부 확인
    if (pinStr.value === pinReStr.value) {
      errorMessage.value = t('PinRegistration.text4')
      messageColor.value = true
      // 포커스를 마지막 입력 필드에서 제거
      pinInput2.value.blur()
    } else {
      errorMessage.value = t('PinRegistration.text5')
      pinReArr.value = ['', '', '', '']
      pinInput2.value.reset()
      messageColor.value = false
    }
  } catch (e) {
    console.error(e)
  }
}

/**
 * 로그인한 사용자 정보 조회
 * @returns {object}
 */
const getLoggedInUserInfo = async () => {
  const response = await mypageApi.getLoggedInUserInfo()

  return response.data
}

/**
 * 사용자 서비스 가입
 */
const setUser = async () => {
  const params = {
    ...joinInfo,
    pinCode: pinStr.value
  }
  await joinApi.setUser(params)
}

/**
 * 사용자 로그인
 */
const login = async () => {
  const params = {
    userId: user.customerId,
    password: pinStr.value
  }
  const response = await loginApi.login(params)

  return response.data
}

/**
 * 회원가입 process
 */
const handleJoin = async () => {
  if (isLoading.value) return // 이미 로딩 중이면 중복 실행 방지

  isLoading.value = true

  try {
    // 먼저 가입 상태 확인 (API 응답의 data가 없을 수도 있으므로 방어 코드 추가)
    const joinStatusResponse = await joinApi.getJoinStatus(user.customerId)
    const userCheck = joinStatusResponse?.data?.userCheck

    // userCheck 값이 0일 때만 신규 가입 호출
    if (userCheck === 0) {
      await setUser()
    }

    const tokenInfo = await login()
    store.dispatch('setToken', `${tokenInfo.type} ${tokenInfo.token}`)
    store.dispatch('setUsername', tokenInfo.username)

    const userInfo = await getLoggedInUserInfo()
    store.dispatch('setUser', {
      ...user,
      ...userInfo
    })

    // 힙 코드 등록
    // loginApi.heapData(loginApi.heapDataParam, userInfo)

    store.dispatch('initJoinInfo')
    await router.push({ name: 'Home' })
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  pinInput1.value.focus()
})

</script>

<template>
  <section class="container JoinPinRegistration--wrap first">
    <div class="space--all-default JoinPinRegistration--in-wrap">
      <div class="JoinPinRegistration--txt--sub">
        {{ $t('PinRegistration.text7') }}
      </div>
      <div class="JoinPinRegistration--txt">
        {{ $t('PinRegistration.text1') }}
      </div>
      <div class="JoinPinRegistration--pin-wrap">
        <h2 class="JoinPinRegistration--tit-wrap">
          <label for="jpr01" class="JoinPinRegistration--tit">{{ $t('PinRegistration.text2') }}</label>
        </h2>
        <div class="JoinPinRegistration--input-wrap">
          <BasePinInput
            ref="pinInput1"
            :autoFocus="false"
            @inputTxt="changePin"
            class="login--input" />
        </div>
      </div>
      <div class="JoinPinRegistration--pin2-wrap">
        <h2 class="JoinPinRegistration--tit2-wrap">
          <label for="jpr02" class="JoinPinRegistration--tit2">{{ $t('PinRegistration.text3') }}</label>
        </h2>
        <div class="JoinPinRegistration--input-wrap">
          <BasePinInput
            ref="pinInput2"
            @inputTxt="changeRePin"
            :auto-focus="false"
            :autoCheck="true"
            class="login--input"
            @checkEnter="handlePinChecked" />
        </div>
        <div v-if="errorMessage" class="JoinPinRegistration--validation" :class="messageColor ? 'ok' : ''">{{ errorMessage }}</div>
      </div>
    </div>

    <div class="btn--bottom">
      <button
        :disabled="isDisabled"
        type="button"
        @click="handleJoin">{{ $t('PinRegistration.text6') }}</button>
    </div>
  </section>
</template>
