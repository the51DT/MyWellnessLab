<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BaseEditorViewer from '@/components/BaseEditorViewer.vue'
import BasePopup from '@/components/BasePopup.vue'
import * as loginApi from '@/apis/login'

const store = useStore()
const router = useRouter()

const user = computed(() => store.getters.getUser || {})
const isLoadingUser = ref(false)

// user.uid에서 -P 또는 -p 제거
const cleanedUid = computed(() => {
  if (!user.value.uid) return ''
  return user.value.uid.replace(/-[pP]$/i, '')
})

/**
 * 사용자 정보가 없을 경우 다시 호출
 */
const refetchUserInfo = async () => {
  if (isLoadingUser.value) return

  isLoadingUser.value = true

  try {
    // 1. CustomerUid 가져오기
    const customerUid = store.getters.getCustomerUid
    if (!customerUid) {
      console.error('CustomerUid가 없습니다.')
      return false
    }

    // 2. 프로필 목록 가져오기
    const params = { fields: 'LOGME' }
    const response = await loginApi.getAmwayProfileList(customerUid, params)
    const profileList = response.customers || []

    if (profileList.length === 0) {
      console.error('프로필 목록이 비어있습니다.')
      return false
    }

    // 3. 프로필 선택 로직
    let selectedProfile = null

    // 먼저 기존에 선택된 프로필이 있는지 확인 (joinInfo에서)
    const joinInfo = store.getters.getJoinInfo
    if (joinInfo && joinInfo.customerId) {
      // joinInfo에 선택된 프로필이 있으면 해당 프로필 찾기
      selectedProfile = profileList.find(profile =>
        profile.customerId === joinInfo.customerId
      )
      if (selectedProfile) {
        console.log('기존에 선택된 프로필을 찾았습니다.')
      }
    }

    // 선택된 프로필이 없으면 프로필 개수에 따라 처리
    if (!selectedProfile) {
      if (profileList.length === 1) {
        // 프로필이 1개면 자동 선택
        selectedProfile = profileList[0]
        console.log('프로필이 1개입니다. 자동 선택합니다.')
      } else {
        // 프로필이 여러 개면 프로필 선택 페이지로 이동
        console.warn(`프로필이 ${profileList.length}개 있습니다. 프로필 선택 페이지로 이동합니다.`)
        store.dispatch('setProfileList', profileList)
        router.push({ name: 'LoginProfile' })
        return false
      }
    }

    // 5. 프로필을 user로 설정
    store.dispatch('setUser', selectedProfile)

    return true
  } catch (e) {
    console.error('사용자 정보 재호출 실패:', e)
    return false
  } finally {
    isLoadingUser.value = false
  }
}

const termsList = ref([])
const checkList = ref([])

const isAllChecked = ref(false)
const isShowJoinConfirmPopup = ref(false)

watch(
    () => checkList.value,
    () => {
      isAllChecked.value = termsList.value.every((item) => {
        return checkList.value.includes(`${item.termsTypeCode},${item.termsVersion}`)
      })
    }
)

/**
 * 전체 동의 체크시 호출
 */
const checkAll = () => {
  if (isAllChecked.value) {
    checkList.value = termsList.value.map((item) => `${item.termsTypeCode},${item.termsVersion}`)
  } else {
    checkList.value = []
  }
}

/**
 * 체크되었는지 확인
 * @param {*} accountTypeCode
 * @returns {boolean}
 */
const isChecked = (accountTypeCode) => {
  return checkList.value.includes(accountTypeCode)
}

/**
 * 비동의 약관 조회
 */
const getDisagreeTermsList = async () => {
  try {
    // user 정보가 없으면 재호출 시도
    if (!user.value.customerId) {
      const refetchSuccess = await refetchUserInfo()
      if (!refetchSuccess) {
        console.error('사용자 정보를 가져올 수 없습니다.')
        return
      }
    }

    const customerId = user.value.customerId
    const response = await loginApi.getDisagreeTermsList(customerId)

    termsList.value = response.data
  } catch (e) {
    console.error(e)
  }
}

/**
 * 사용자 약관 동의
 */
const setTerms = async () => {
  // user 정보가 없으면 재호출 시도
  if (!user.value.customerId) {
    const refetchSuccess = await refetchUserInfo()
    if (!refetchSuccess) {
      throw new Error('사용자 정보를 가져올 수 없습니다.')
    }
  }

  const params = {
    customerId: user.value.customerId,
    termsAgree: checkList.value
  }
  await loginApi.setTerms(params)
}

/**
 * 사용자 로그인
 */
const login = async () => {
  // user 정보가 없으면 재호출 시도
  if (!user.value.customerId) {
    const refetchSuccess = await refetchUserInfo()
    if (!refetchSuccess) {
      throw new Error('사용자 정보를 가져올 수 없습니다.')
    }
  }

  const params = {
    userId: user.value.customerId,
    password: store.getters.getPin
  }
  const response = await loginApi.login(params)

  return response.data
}

/**
 * 가입하기 버튼 클릭 시 팝업 닫기
 */
const handleJoinConfirm = () => {
  isShowJoinConfirmPopup.value = false
}

/**
 * 취소 버튼 클릭 시 환경에 따라 다른 암웨이 사이트로 이동
 */
const handleJoinCancel = () => {
  const isDev = import.meta.env.DEV || window.location.hostname.includes('dev')
  const targetUrl = isDev ? 'https://www.uat.amway.co.kr/main' : 'https://amway.co.kr'
  window.location.href = targetUrl
}

/**
 * 다음 버튼 클릭시 호출 토큰, 유저네임을 스토어에 저장한다.
 */
const handleNext = async () => {
  if (store.getters.getPin) {
    try {
      await setTerms()
      const loginUserInfo = await login()

      store.dispatch('setToken', `${loginUserInfo.type} ${loginUserInfo.token}`)
      store.dispatch('setUsername', loginUserInfo.username)
      store.dispatch('setPin', '')
      router.push({ name: 'Home' })
    } catch (e) {
      console.error(e)
    }
  } else {
    store.dispatch('setJoinInfo', { termsAgree: checkList.value })
    router.push({ name: 'JoinPhoneCertification' })
  }
}

onMounted(async () => {
  // 페이지 진입 시 가입 확인 팝업 표시
  isShowJoinConfirmPopup.value = true

  // user 정보가 없으면 재호출 시도
  if (!user.value.customerId) {
    await refetchUserInfo()
  }

  await getDisagreeTermsList()
})
</script>

<template>
  <section class="JoinTermsAgree--wrap">
    <div class="JoinTermsAgree--in-wrap">
      <div class="JoinTermsAgree--txt">
        <span class="gray">{{ $t('TermsAgree.text1') }}</span> <br />
        {{ $t('TermsAgree.text2') }}
      </div>
      <div class="JoinTermsAgree--wrap2">
        <div class="JoinTermsAgree--all-check-wrap">
          <label class="JoinTermsAgree--all">
            <span class="checkbox" :class="isAllChecked ? 'active' : ''">
              <input
                  v-model="isAllChecked"
                  type="checkbox"
                  class="JoinTermsAgree--all-check"
                  hidden
                  @change="checkAll" />
              <span />
            </span>
            <span class="JoinTermsAgree--all-txt">{{ $t('TermsAgree.text3') }}</span>
          </label>
        </div>

        <hr class="gray2 JoinTermsAgree--hr" />

        <div v-for="item in termsList" :key="item.id" class="JoinTermsAgree--terms-wrap">
          <div class="align--between JoinTermsAgree--terms-in-wrap">
            <label class="JoinTermsAgree--terms">
              <span class="checkbox" :class="isChecked(`${item.termsTypeCode},${item.termsVersion}`) ? 'active' : ''">
                <input
                    v-model="checkList"
                    :value="`${item.termsTypeCode},${item.termsVersion}`"
                    id="123"
                    type="checkbox"
                    class="JoinTermsAgree--check"
                    hidden />
                <span />
              </span>
              <span class="JoinTermsAgree--tit">{{ item.termsTypeName }}</span>
            </label>
          </div>
          <div class="JoinTermsAgree--texts"> <!--231222 약관 추가로 변경-->
            <BaseEditorViewer v-if="item.termsContent" v-model="item.termsContent" />
          </div>
        </div>
      </div>
    </div>

    <div class="btn--bottom">
      <button
          @click="handleNext"
          :disabled="!isAllChecked"
          type="button">{{ $t('Common.next') }}</button>
    </div>

    <!-- 가입 확인 팝업 -->
    <BasePopup v-if="isShowJoinConfirmPopup" class="TermsAgree--join-confirm">
      <template v-slot:contents>
        <div class="join-confirm-content">
          <p class="pop-text-light mint">{{ cleanedUid }}</p>
          <p class="pop-text-bold mint">{{ user.name || '' }}</p>
          <p class="pop-text-bold">{{ $t('TermsAgree.text4') }}</p>
        </div>
        <div class="pop-btn-wrap">
          <button type="button" @click="handleJoinCancel" class="pop-btn pop-btn--gray">{{ $t('Common.cancle') }}</button>
          <button type="button" @click="handleJoinConfirm" class="pop-btn pop-btn--green">{{ $t('TermsAgree.text5') }}</button>
        </div>
      </template>
    </BasePopup>
  </section>
</template>
