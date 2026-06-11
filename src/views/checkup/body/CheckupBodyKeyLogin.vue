<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import * as bodykeyApi from '@/apis/bodykey'
import message from '@/components/message'

const router = useRouter()
const store = useStore()
const { t } = useI18n()

// 로컬 상태 관리
const bodyKeyId = ref('')
const bodyKeyPassword = ref('')
const hasLoginError = ref(false)
const isLoading = ref(false)
const showPassword = ref(false)
const isPasswordToggleActive = ref(false) // 토글 버튼 활성 상태

// 입력 필드 변경 시 에러 상태 제거 및 숫자만 허용
const handleInputChange = () => {
  if (hasLoginError.value) {
    hasLoginError.value = false
  }
  
  // bodyKeyId는 숫자만 허용
  bodyKeyId.value = bodyKeyId.value.replace(/[^0-9]/g, '')
}

// 비밀번호 보임/숨김 토글
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
  isPasswordToggleActive.value = true
  
  // 짧은 시간 후 활성 상태 해제
  setTimeout(() => {
    isPasswordToggleActive.value = false
  }, 150)
}

// 바디키 로그인 처리
const handleBodyKeyLogin = async () => {
  
  // 입력값 검증
  if (!bodyKeyId.value || !bodyKeyPassword.value) {
    hasLoginError.value = true
    return
  }
  
  // 에러 상태 초기화
  hasLoginError.value = false
  
  isLoading.value = true
  try {
    const data = await bodykeyApi.getBodykeyData({
      BodyKeyID: bodyKeyId.value,
      BodyKeyPW: bodyKeyPassword.value
    })
    
    const bodyKeyData = data.data?.Data || []
    
    // 바디키 데이터를 store에 저장
    store.commit('checkup/SET_BODY_KEY_DATA_LIST', bodyKeyData)
    
    // 데이터 리스트 페이지로 이동
    router.push({ name: 'CheckupBodyKeyDataList' })
    
  } catch (error) {
    console.error('바디키 데이터 조회 실패:', error)
    hasLoginError.value = true
  } finally {
    isLoading.value = false
  }
}

// 이전 단계로 이동
const handleBack = () => {
  router.push({ name: 'CheckupBody' })
}


</script>

<template>
  <section class="CheckupBodyKeyLogin checkupBody">
    <!-- 헤더 -->
    <div class="checkupBody-header">
      <h1 class="checkupBody-header-part-tit">
        <span class="checkupBody-header-part-tit-ic"><img src="/img/ic_step2_n.png" alt="체성분"></span>
        {{ $t('CheckupGuide.text4') }}
      </h1>
      <h2 class="checkupBody-header-part-tit-sub">{{ $t('BodyCompositionPop.text8') }}</h2>
    </div>

    <!-- 로그인 폼 -->
    <div class="BodyCompositionPop-BodykeyLogin">
      <div class="BodyCompositionPop-BodykeyLogin--con">
        <div class="BodyCompositionPop-BodykeyLogin--con--input" :class="{ 'input-error': hasLoginError }">
          <label for="bodyKeyId">
            {{ $t('BodyCompositionPop.text12') }}
            <span>({{ $t('BodyCompositionPop.text13') }})</span>
          </label>
          <input 
            id="bodyKeyId"
            v-model="bodyKeyId"
            type="text" 
            inputmode="numeric"
            pattern="[0-9]*"
            :placeholder="$t('BodyCompositionPop.text36')"
            @input="handleInputChange"
          />
        </div>
        
        <div class="BodyCompositionPop-BodykeyLogin--con--input" :class="{ 'input-error': hasLoginError }">
          <label for="bodyKeyPassword">{{ $t('BodyCompositionPop.text14') }}</label>
          <div class="password-input-wrapper">
            <input 
              id="bodyKeyPassword"
              v-model="bodyKeyPassword"
              :type="showPassword ? 'text' : 'password'" 
              :placeholder="$t('BodyCompositionPop.text37')"
              @input="handleInputChange"
            />
            <button 
              type="button" 
              :class="['password-toggle-btn', { 'password-toggle-btn-active': isPasswordToggleActive }]"
              @click="togglePasswordVisibility"
            >
              <img 
                :src="showPassword ? '/img/icon-show.svg' : '/img/icon-hide.svg'" 
                :alt="showPassword ? '비밀번호 숨기기' : '비밀번호 보기'"
              />
            </button>
          </div>
          <p v-if="hasLoginError" class="error-message">{{ $t('BodyCompositionPop.text15') }}</p>
        </div>
        
        <p class="BodyCompositionPop-BodykeyLogin--con--guide-text">
          {{ $t('BodyCompositionPop.text44') }}</p>
      </div>
    </div>

    <!-- 액션 버튼들 -->
    <div class="Checkup--btn-wrap">
      <div class="btn--bottom">
        <button 
          @click="handleBodyKeyLogin" 
          :disabled="isLoading" 
          type="button"
          class="btn btn-primary"
        >
          {{ isLoading ? '조회 중...' : $t('Common.confirm') }}
        </button>
      </div>
      <div class="btn--bottom btn--bottom-line">
        <button @click="handleBack" type="button" class="btn btn-secondary">
          {{ $t('Common.prev') }}
        </button>
      </div>
    </div>
  </section>
</template>
