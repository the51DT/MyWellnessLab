<script setup>
import { computed, getCurrentInstance, ref } from 'vue'
import BasePinInput from '@/components/BasePinInput.vue'
import BasePopupTit from '@/components/BasePopupTit.vue'
import * as mypageApi from '@/apis/mypage'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const props = defineProps({
  isPopupPin: { /* 231212 팝업 오프너 */
    type: Boolean,
    default: false
  }
})

const pinResult1 = ref('') /* 벨리데이션 텍스트 */
const pinResult1Ok = ref(false) /* 벨리데이션 텍스트 색상 */
const pinResult2 = ref('') /* 벨리데이션 텍스트 */
const pinResult2Ok = ref(false) /* 벨리데이션 텍스트 색상 */
const pinResult3 = ref('') /* 벨리데이션 텍스트 */
const pinResult3Ok = ref(false) /* 벨리데이션 텍스트 색상 */
const btnNext = ref(false) /* 다음 버튼 */
const instance = getCurrentInstance()

const pinArr = ref(['', '', '', ''])
const pinStr = computed(() => pinArr.value.join(''))
const isDisabled = computed(() => {
  return pinStr.value.length !== 4
})
const pinArr2 = ref(['', '', '', ''])
const pinStr2 = computed(() => pinArr2.value.join(''))
const isDisabled2 = computed(() => {
  return pinStr2.value.length !== 4
})
const pinArr3 = ref(['', '', '', ''])
const pinStr3 = computed(() => pinArr3.value.join(''))
const isDisabled3 = computed(() => {
  return pinStr3.value.length !== 4
})
const pin1 = ref(null)
const pin2 = ref(null)
const pin3 = ref(null)

// value 객체의 'tg' 키에 따라
// 여러개의 경우 중 하나를 선택하고 `pinArr.value` 배열의 각 요소에 값을 설정합니다.
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

  if (pinStr.value.length < 4 && pinResult1.value !== '') {
    pinResult1.value = ''
  }
}

/**
 * pin 번호를 체크하는 함수로,
 * 비밀번호를 입력한 후 서버에 검증 요청을 위해 API를 호출합니다.
 * 이후 응답에 따라 상황별로 메시지를 설정하고 PIN 번호 입력 부분을 조작합니다.
 * @returns {Promise<void>}
 */
const handlePinChecked = async () => {
  if (isDisabled.value) return

  pinResult1.value = ''

  try {
    await mypageApi.checkPin(pinStr.value)

    pinResult1.value = t('MyPagePinChangePopup.text4')
    pinResult1Ok.value = true
    // 이미 확인된 pin번호는 disable
    const listLength = document.querySelectorAll('.txt--center.pinI').length

    for (let i = 0; i < listLength; i++) {
      if (i < 4) {
        document.querySelectorAll('.txt--center.pinI')[i].disabled = true
      } else if (i > 3 && i < 8) {
        document.querySelectorAll('.txt--center.pinI')[i].disabled = false
      }
    }
    document.querySelectorAll('.txt--center.pinI')[4].focus()
  } catch (e) {
    console.error(e)
    pinResult1.value = t('MyPagePinChangePopup.text5')
    pinResult1Ok.value = false
    pinArr.value = ['', '', '', '']
    pin1.value.reset()
  }
}

/**
 * 입력된 값에 따라 pinArr2의 값 변경,
 * pin 문자열의 길이가 4보다 작고 pin 결과값이 비어 있지 않으면 결과값 초기화 및 버튼 비활성화
 * @param value
 */
const changePin2 = (value) => {
  switch (value.tg) {
    case 'p1':
      pinArr2.value[0] = value.val
      break
    case 'p2':
      pinArr2.value[1] = value.val
      break
    case 'p3':
      pinArr2.value[2] = value.val
      break
    case 'p4':
      pinArr2.value[3] = value.val
      break
    default:
      break
  }

  if (pinStr2.value.length < 4 && pinResult2.value !== '') {
    pinResult2.value = ''
    btnNext.value = false
  }
}

/**
 * 두 번째 입력되는 PIN 값을 체크하고, 그에 따라 다른 동작을 수행합니다.
 * 두 번째 입력되는 PIN 값(pinStr2)이 첫 번째 값(pinStr)과 동일한 경우 오류로 처리하고, 오류 메시지를 출력합니다
 * @returns {Promise<void>}
 */
const handlePinChecked2 = async () => {
  if (isDisabled2.value) return

  pinResult2.value = ''

  try {
    if (pinStr.value === pinStr2.value) {
      pinResult2.value = t('MyPagePinChangePopup.text7')
      pinResult2Ok.value = false
      pinArr2.value = ['', '', '', '']
      pin2.value.reset()
    } else {
      pinResult2.value = t('MyPagePinChangePopup.text8')
      pinResult2Ok.value = true
      const pinElement = document.querySelectorAll('.txt--center.pinI')
      pinElement[8].disabled = false; pinElement[9].disabled = false
      pinElement[10].disabled = false; pinElement[11].disabled = false
      pinElement[8].focus()
    }

    if (pinStr2.value.length === 4 && pinStr3.value.length === 4) {
      handlePinChecked3()
    }
  } catch (e) {
    console.error(e)
  }
}

/**
 * 사용자가 PIN(개인 식별 번호)를 입력하면서 각 PIN 자릿수 값에 따라 변수를 업데이트하는 함수
 * @param value - 입력값
 */
const changePin3 = (value) => {
  switch (value.tg) {
    case 'p1':
      pinArr3.value[0] = value.val
      break
    case 'p2':
      pinArr3.value[1] = value.val
      break
    case 'p3':
      pinArr3.value[2] = value.val
      break
    case 'p4':
      pinArr3.value[3] = value.val
      break
    default:
      break
  }

  if (pinStr3.value.length < 4 && pinResult3.value !== '') {
    pinResult3.value = ''
    btnNext.value = false
  }
}

/**
 * 재확인을 위해 사용자가 입력한 핀 번호(PIN)를 검사하는 기능을 수행합니다.
 * @returns {Promise<void>}
 */
const handlePinChecked3 = async () => {
  if (isDisabled3.value) return

  pinResult3.value = ''

  try {
    if (pinStr2.value === pinStr3.value) {
      pinResult3.value = t('MyPagePinChangePopup.text10')
      pinResult3Ok.value = true
      if (pinStr.value !== pinStr2.value && pinStr2.value === pinStr3.value) {
        btnNext.value = true
      }
      document.querySelectorAll('.txt--center.pinI')[11].blur()
    } else {
      pinResult3.value = t('MyPagePinChangePopup.text11')
      pinResult3Ok.value = false
      pinArr3.value = ['', '', '', '']
      pin3.value.reset()
      btnNext.value = false
    }
  } catch (e) {
    console.error(e)
  }
}

const isToast = ref(false)

/**
 * 사용자의 핀 번호를 변경하는 역할을 합니다.
 * @returns {Promise<void>}
 */
const changePinNumber = async () => {
  try {
    await mypageApi.checkPin(pinStr.value)

    if (pinStr2.value === pinStr3.value) {
      const param = {
        currentPinCode: pinStr.value,
        changePinCode: pinStr3.value
      }
      await mypageApi.changePin(param)

      isToast.value = true
      setTimeout(() => {
        isToast.value = false
      }, 2000)
      popupClose()
    }
  } catch (e) {
    console.error(e)
  }
}

function popupClose () {
  btnNext.value = false
  pinResult1.value = ''
  pinResult2.value = ''
  pinResult3.value = ''
  pinArr.value = ['', '', '', '']
  pinArr2.value = ['', '', '', '']
  pinArr3.value = ['', '', '', '']
  instance.emit('popupClose')
}
</script>

<template>
  <div>
    <base-popup-tit v-if="props.isPopupPin" @popupClose="popupClose">
      <template v-slot:title>
        {{ $t('MyPagePinChangePopup.text1') }}
      </template>
      <template v-slot:contents>
        <section class="JoinPinRegistration--wrap"> <!--231129 클래스 삭제-->
          <div class="space--all-default JoinPinRegistration--in-wrap">

            <div class="JoinPinRegistration--txt">
              {{ $t('MyPagePinChangePopup.text2') }}
            </div>
            <div class="JoinPinRegistration--pin-wrap">
              <h2 class="JoinPinRegistration--tit-wrap">
                <label for="jpr01" class="JoinPinRegistration--tit">{{ $t('MyPagePinChangePopup.text3') }}</label>
              </h2>
              <div class="JoinPinRegistration--input-wrap">
                <!--              <BasePinInput @inputTxt="inputTxt" :focus="true" :id="`jpr01`" class="login&#45;&#45;input"/> &lt;!&ndash;231129 콘포넌트 바꿈&ndash;&gt;-->
                <BasePinInput
                  ref="pin1"
                  @inputTxt="changePin"
                  :id="`jpr01`"
                  class="login--input"
                  :autoCheck="true"
                  @checkEnter="handlePinChecked" /> <!--231129 콘포넌트 바꿈-->
              </div>
              <div v-if="pinResult1" class="JoinPinRegistration--validation" :class="pinResult1Ok ? 'ok' : ''">{{ pinResult1 }}</div>
            </div>
            <div class="JoinPinRegistration--pin-wrap">
              <h2 class="JoinPinRegistration--tit-wrap">
                <label for="jpr02" class="JoinPinRegistration--tit">{{ $t('MyPagePinChangePopup.text6') }}</label>
              </h2>
              <div class="JoinPinRegistration--input-wrap">
                <BasePinInput
                  ref="pin2"
                  :autoFocus="false"
                  @inputTxt="changePin2"
                  :id="`jpr02`"
                  :disabled="true"
                  class="login--input"
                  :autoCheck="true"
                  @checkEnter="handlePinChecked2" />
                <!--231129 콘포넌트 바꿈-->
              </div>
              <div v-if="pinResult2" class="JoinPinRegistration--validation" :class="pinResult2Ok ? 'ok' : ''">{{ pinResult2 }}</div>
            </div>
            <div class="JoinPinRegistration--pin2-wrap">
              <h2 class="JoinPinRegistration--tit2-wrap">
                <label for="jpr03" class="JoinPinRegistration--tit2">{{ $t('MyPagePinChangePopup.text9') }}</label>
              </h2>
              <div class="JoinPinRegistration--input-wrap">
                <BasePinInput
                  ref="pin3"
                  :autoFocus="false"
                  @inputTxt="changePin3"
                  :id="`jpr03`"
                  class="login--input"
                  :disabled="true"
                  :autoCheck="true"
                  @checkEnter="handlePinChecked3" />
                <!--231129 콘포넌트 바꿈-->
              </div>
              <div v-if="pinResult3" class="JoinPinRegistration--validation" :class="pinResult3Ok ? 'ok' : ''">{{ pinResult3 }}</div>
            </div>
          </div>

          <div class="btn--bottom">
            <button
              :disabled="!btnNext"
              @click="changePinNumber"
              type="button">{{ $t('MyPagePinChangePopup.text12') }}</button>
          </div>
        </section>
      </template>
    </base-popup-tit>

    <transition name="toastFade">
      <div v-if="isToast" class="toast">
        {{ $t('MyPagePinChangePopup.text13') }}
      </div>
    </transition>
  </div>
</template>
