<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useMovePrev } from '@/composables/checkup'
import { formatDatetime } from '@/assets/js/common'
import { useBodyCompositionAPI } from '@/composables/useBodyCompositionAPI'

const router = useRouter()
const store = useStore()
const movePrev = useMovePrev()

// API composable에서 데이터 변환 함수 가져오기
const { parseBodyKeyDataToInbody } = useBodyCompositionAPI()

// 로컬 상태 관리
const bodyKeyDataList = ref([])
const selectedBodyKeyData = ref(null)
const isLoading = ref(false)

// 바디키 데이터 선택
const selectBodyKeyData = (item) => {
  selectedBodyKeyData.value = item
  
  // useBodyComposition에서 사용하는 것과 동일한 방식으로 완전한 데이터 변환
  const basicsId = store.getters['checkup/getBasicsId']
  const convertedData = parseBodyKeyDataToInbody(item, basicsId)
  
  // 변환된 완전한 데이터를 store에 저장
  store.commit('checkup/SET_SELECTED_BODY_KEY_DATA', convertedData.inbody)
  
  // 체성분 상세 페이지로 이동 (읽기 전용 모드)
  router.push({ 
    name: 'CheckupBodyDirectInput',
    query: { 
      mode: 'view',  // 읽기 전용 모드
      dataType: 'existing',  // 기존 데이터 타입
      from: 'CheckupBodyKeyDataList'  // 출처 정보 추가
    }
  })
}

// 바디키 데이터 확인 및 다음 단계로 이동
const confirmBodyKeyData = async () => {
  // 테스트용: CheckupBody 페이지로 이동
  router.push({ name: 'CheckupBody' })
  return

  // 실제 로직 (테스트 완료 후 주석 해제)
  /*
  if (!selectedBodyKeyData.value) {
    alert('데이터를 선택해주세요.')
    return
  }
  
  try {
    // 선택된 바디키 데이터를 store에 저장
    store.commit('checkup/SET_SELECTED_BODY_KEY_DATA', selectedBodyKeyData.value)
    
    // 다음 단계로 이동
    router.push({ name: 'CheckupInterestHealth' })
  } catch (error) {
    console.error('바디키 데이터 처리 실패:', error)
    alert('바디키 데이터 처리 중 오류가 발생했습니다.')
  }
  */
}

// 이전 단계로 이동 (바디키 로그인 페이지)
const handleBack = () => {
  router.push({ name: 'CheckupBodyKeyLogin' })
}

// 직접 입력으로 이동
const goToDirectInput = () => {
  router.push({ name: 'CheckupBodyDateSelect' })
}

// 컴포넌트 마운트 시 store에서 바디키 데이터 가져오기
onMounted(() => {
  // store에서 바디키 데이터 가져오기
  bodyKeyDataList.value = store.getters['checkup/getBodyKeyDataList'] || []
})
</script>

<template>
  <section class="CheckupBodyKeyDataList checkupBody">

    <!-- 바디키 데이터 리스트 -->
    <div class="BodyCompositionPop-con-wrap">
      <div class="BodyCompositionPop-con">

        <!-- 바디키 데이터 없을 때 -->
        <div v-if="bodyKeyDataList.length === 0" class="BodyCompositionPop-con--no-data">
          <div class="BodyCompositionPop-con--no-data-wrap">
            <img class="BodyCompositionPop-con--img" src="/img/ic_no-data.png">
            <p class="BodyCompositionPop-con--text">
              {{ $t('BodyCompositionPop.text16') }}
            </p>
            <p class="BodyCompositionPop-con--desc">{{ $t('BodyCompositionPop.text34') }}</p>
          </div>

          <!-- 선택 버튼들 -->
          <div class="BodyCompositionPop-btn">
            <div class="btn--bottom">
              <button @click="goToDirectInput" type="button">
                {{ $t('BodyCompositionPop.text9') }}
              </button>
            </div>
            <div class="btn--bottom btn--bottom-line">
              <button @click="handleBack" type="button" >
                {{ $t('Common.prev') }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- 바디키 데이터 있을 때 -->
        <div v-else class="BodyCompositionPop-con--data bodykey">
          <div class="checkupBody-header">
            <h1 class="checkupBody-header-part-tit">
              <span class="checkupBody-header-part-tit-ic"><img src="/img/ic_step2_n.png" alt="체성분"></span>
              {{ $t('CheckupBody.text3') }}
            </h1>
            <h2 class="checkupBody-header-part-tit-sub">{{ $t('BodyCompositionPop.text8') }}</h2>
          </div>
            
          <p class="BodyCompositionPop-con--text">
            <span class="BodyCompositionPop-con--text-light">{{ $t('BodyCompositionPop.text41') }}</span>
            <span class="BodyCompositionPop-con--text-color">{{ bodyKeyDataList.length }}{{ $t('BodyCompositionPop.text42') }}</span>{{ $t('BodyCompositionPop.text43') }}
          </p>
              
          <div class="BodyCompositionPop-con--list">
            <div 
              v-for="(item, index) in bodyKeyDataList" 
              :key="index"
              :class="['data-item', { selected: selectedBodyKeyData === item }]"
              @click="selectBodyKeyData(item)"
            >
              {{ formatDatetime(item.datetimes) }}
            </div>
          </div>

          <!-- 액션 버튼들 -->
          <div class="BodyCompositionPop-btn scroll-btn-wrap">
            <div class="btn--bottom">
              <button @click="handleBack" type="button" >
                {{ $t('Common.prev') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>