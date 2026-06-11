<script setup>
import { computed, getCurrentInstance, ref } from 'vue'
import { useStore } from 'vuex'
import BasePopupTit from '@/components/BasePopupTit.vue'
import BasePopup from '@/components/BasePopup.vue'
import * as leaveApi from '@/apis/leave'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const store = useStore()

const prefix = 'MyPageServiceQuitPopup' /* 231212 클래스 접두어 */
const props = defineProps({
  isQuit: {
    type: Boolean,
    default: false
  }
})
const selectData = ref([
  { txt: t('MyPageServiceQuitPopup.text10') },
  { txt: t('MyPageServiceQuitPopup.text11') },
  { txt: t('MyPageServiceQuitPopup.text12') },
  { txt: t('MyPageServiceQuitPopup.text13') },
  { txt: t('MyPageServiceQuitPopup.text14') },
  { txt: t('MyPageServiceQuitPopup.text15') }
])

const agreeCheck = ref('')
const leaveType = ref(null)
const leaveReason = ref('')
const instance = getCurrentInstance()
const isReal = ref(false) /* 231212 진짜 탈퇴하겠냐는 팝업 오프너 */
const isQuitOk = ref(false) /* 231212 탈퇴 후 팝업 오프너 */
const isPopAgree = ref(false) /* 동의 후 탈퇴 가능하다는 레이어 팝업 오프너 */

/**
 * 사용자가 퇴장할 때 호출하는 asynchronous 함수입니다.
 * 이 함수는 이유와 유형을 기반으로 Leave API를 호출한 다음, user 정보를 초기화합니다.
 */
const handleLeave = async () => {
  const params = {
    leaveReason: leaveReason.value,
    leaveType: leaveType.value
  }

  await leaveApi.leave(params)

  store.dispatch('initUser')
}

const popupClose = () => {
  agreeCheck.value = ''
  leaveType.value = null
  leaveReason.value = ''

  instance.emit('popupClose')
}

const popupQuit = () => {
  if (!agreeCheck.value) {
    isPopAgree.value = true
    return false
  }
  isReal.value = true
}

const popupQuitOk = async () => {
  await handleLeave()
  isReal.value = false
  isQuitOk.value = true
}

const outOk = () => {
  isReal.value = false
  isQuitOk.value = false
  popupClose()

  window.location.href = import.meta.env.VITE_HYBRIS_LOGIN_URL
}

const taDisabled = computed(() => {
  if (leaveType.value === 5) {
    return false
  } else {
    return true
  }
})

// 탈퇴 버튼 활성화 조건: agreeCheck와 leaveType이 모두 선택되어야 함
const isQuitButtonDisabled = computed(() => {
  return !agreeCheck.value || leaveType.value === null
})
</script>

<template>
  <div>
    <base-popup-tit v-if="props.isQuit" @popupClose="popupClose" class="MyPageServiceQuitPopup-wrap">
      <template v-slot:title>
        {{ $t('MyPageServiceQuitPopup.text1') }}
      </template>
      <template v-slot:contents>
        <div :class="prefix">
          <div :class="prefix + '-con--wrap'">
            <div>
              <h2 :class="prefix + '--tit'" v-html="$t('MyPageServiceQuitPopup.text2')">
              </h2>
              <div :class="prefix + '--desc'">
                {{ $t('MyPageServiceQuitPopup.text5') }}
              </div>
              <label for="agree" :class="prefix + '--agree'">
                <input
                  v-model="agreeCheck"
                  type="checkbox"
                  value="Y"
                  name=""
                  id="agree"
                  class="custom" />
                <span />
                <span :class="prefix + '--agree-txt'">{{ $t('MyPageServiceQuitPopup.text6') }}</span>
              </label>
            </div>
            <hr :class="prefix + '--hr gray2'" />
            <div :class="prefix + '--reason-wrap'">
              <h2 :class="prefix + '--tit'" v-html="$t('MyPageServiceQuitPopup.text7')">
              </h2>
              <div :class="prefix + '--radio-wrap'">
                <div v-for="(item, index) in selectData" :key="index">
                  <label :for="index" :class="prefix + '--radio'">
                    <input
                      v-model="leaveType"
                      :value="index"
                      type="radio"
                      name="select"
                      :id="index" />
                    <span class="radio--icon" />
                    <span>{{ item.txt }}</span>
                  </label>
                </div>
                <div v-if="leaveType === 5">
                  <textarea
                    v-model="leaveReason"
                    name="ta"
                    id=""
                    cols="30"
                    rows="3"
                    :class="prefix + '--ta'"
                    :disabled="taDisabled" />
                </div>
              </div>
            </div>
          </div>
          <div :class="prefix + '--btn-wrap'">
            <div>
              <button @click="popupClose" type="button" :class="prefix + '--btn cancel'">{{ $t('Common.cancle') }}</button>
            </div>
            <div>
              <button 
                @click="popupQuit" 
                type="button" 
                :class="prefix + '--btn'"
                :disabled="isQuitButtonDisabled">{{ $t('MyPageServiceQuitPopup.text16') }}</button>
            </div>
          </div>

        </div>
      </template>
    </base-popup-tit>

    <base-popup v-if="isReal" :class="prefix + '--real'">
      <template v-slot:contents>
        <p class="pop-text-bold">{{ $t('MyPageServiceQuitPopup.text17') }}
        </p>
        <p class="pop-text-light">{{ $t('MyPageServiceQuitPopup.text18') }}</p>
        <div class="pop-btn-wrap">
          <button @click="isReal = false" type="button" class="pop-btn pop-btn--gray">{{ $t('Common.cancle') }}</button>
          <button
            @click="popupQuitOk"
            type="button"
            class="pop-btn pop-btn--green">{{ $t('MyPageServiceQuitPopup.text19') }}</button>
        </div>
      </template>
    </base-popup>

    <base-popup v-if="isQuitOk" class="MyPageServiceQuitPopup--real">
      <template v-slot:contents>
        <p class="pop-text-bold">{{ $t('MyPageServiceQuitPopup.text20') }}
        </p>
        <p class="pop-text-light">{{ $t('MyPageServiceQuitPopup.text21') }}
        </p>
        <div class="pop-btn-wrap">
          <button @click="outOk" type="button" class="MyPageServiceQuitPopup--real--btn">확인</button>
        </div>
      </template>
    </base-popup>

    <base-popup v-if="isPopAgree" class="MyPageServiceQuitPopup--real">
      <template v-slot:contents>
        <p class="MyPageServiceQuitPopup--real-txt2">{{ $t('MyPageServiceQuitPopup.text22') }}</p>
        <div class="pop-btn-wrap">
          <button @click="isPopAgree=false" type="button" class="MyPageServiceQuitPopup--real--btn">{{ $t('Common.confirm') }}</button>
        </div>
      </template>
    </base-popup>

  </div>

</template>
