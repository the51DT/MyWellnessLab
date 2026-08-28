<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import * as bodykeyApi from '@/apis/bodykey'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useStore()
const basicsId = store.getters['checkup/getBasicsId']

// Emits 정의
const emit = defineEmits([
  'update:selectedBodyComposition',
  'nextStep',
  'prevStep'
])

// 로컬 상태 관리
const isLoading = ref(false)
const BodyCompositionDataList = ref([])
// 2606 퍼블 확인용 - route meta로 체성분 데이터 유무 제어
const hasPublishingBodyCompositionData = computed(() => {
  return router.currentRoute.value.meta.hasPublishingBodyCompositionData !== false
})
// 2606 퍼블 확인용 - 기존 체성분 데이터
const publishingBodyCompositionDataList = [
  {
    id: 1,
    basicsId: basicsId || 1,
    surveyDate: '2026.10.25',
    datetimes: '20261025103000',
    height: 175,
    weight: 78,
    bodyFatMass: 18.5,
    percentBodyFat: 23.7,
    skeletalMuscleMass: 31.8,
    bmi: 25.5,
    waist: 88,
    dataType: 'existing'
  },
  {
    id: 2,
    basicsId: basicsId || 1,
    surveyDate: '2026.09.25',
    datetimes: '20260925103000',
    height: 175,
    weight: 79,
    bodyFatMass: 19.2,
    percentBodyFat: 24.3,
    skeletalMuscleMass: 31.2,
    bmi: 25.8,
    waist: 89,
    dataType: 'existing'
  },
  {
    id: 3,
    basicsId: basicsId || 1,
    surveyDate: '2026.08.25',
    datetimes: '20260825103000',
    height: 175,
    weight: 80,
    bodyFatMass: 20.1,
    percentBodyFat: 25.1,
    skeletalMuscleMass: 30.9,
    bmi: 26.1,
    waist: 90,
    dataType: 'existing'
  },
  {
    id: 4,
    basicsId: basicsId || 1,
    surveyDate: '2026.10.25',
    datetimes: '20261025103000',
    height: 175,
    weight: 78,
    bodyFatMass: 18.5,
    percentBodyFat: 23.7,
    skeletalMuscleMass: 31.8,
    bmi: 25.5,
    waist: 88,
    dataType: 'existing'
  },
  {
    id: 5,
    basicsId: basicsId || 1,
    surveyDate: '2026.09.25',
    datetimes: '20260925103000',
    height: 175,
    weight: 79,
    bodyFatMass: 19.2,
    percentBodyFat: 24.3,
    skeletalMuscleMass: 31.2,
    bmi: 25.8,
    waist: 89,
    dataType: 'existing'
  },
  {
    id: 6,
    basicsId: basicsId || 1,
    surveyDate: '2026.08.25',
    datetimes: '20260825103000',
    height: 175,
    weight: 80,
    bodyFatMass: 20.1,
    percentBodyFat: 25.1,
    skeletalMuscleMass: 30.9,
    bmi: 26.1,
    waist: 90,
    dataType: 'existing'
  }
]

// 기존 데이터 선택 시
const selectExistingBodyComposition = (item) => {
  // 선택된 데이터를 store에 저장
  store.commit('checkup/SET_SELECTED_BODY_KEY_DATA', item)
  
  // 체성분 상세 페이지로 이동 (읽기 전용 모드)
  router.push({ 
    name: 'pubCheckupBodyDirectInput', // 2606 퍼블 확인용 아래 주석이 원본
    // name: 'CheckupBodyDirectInput',
    query: { 
      mode: 'view',  // 읽기 전용 모드
      dataType: 'existing'  // 기존 데이터 타입
    }
  })
}

// 직접 입력 프로세스 시작
const startDirectInputProcess = () => {
  // 2606 퍼블 확인용 아래 주석이 원본
  router.push({ name: 'pubCheckupBodyDateSelect' })
  // router.push({ name: 'CheckupBodyDateSelect' })
}

// 바디키 로그인 페이지로 이동
const goToBodyKeyLogin = () => {
  // 2606 퍼블 확인용 아래 주석이 원본
  router.push({ name: 'pubCheckupBodyKeyLogin' })
  // router.push({ name: 'CheckupBodyKeyLogin' })
}

const handleBack = async () => {
  // 2606 퍼블 확인용 아래 주석이 원본
  router.push({ name: 'pubCheckupBodyGuide' })
  // router.push({ name: 'CheckupBodyGuide' })
}

// 체성분 데이터 조회 (기존 완료된 데이터)
const getBodyCompositionData = async () => {
  try {
    isLoading.value = true
    const response = await bodykeyApi.getBodyCompositionData('INBODY')
    
    if (response.data && Array.isArray(response.data)) {
      BodyCompositionDataList.value = response.data
    } else {
      BodyCompositionDataList.value = []
    }
  } catch (error) {
    console.error('체성분 데이터 조회 실패:', error)
    BodyCompositionDataList.value = []
  } finally {
    isLoading.value = false
  }
}

// 일회성 분석 여부 확인
const isOneTimeAnalysis = computed(() => {
  return store.getters['checkup/getAnalysisType'] === 'onetime'
})

// 컴포넌트 마운트 시 데이터 조회 (일회성 분석이 아닐 때만)
onBeforeMount(async () => {
  // 2606 퍼블 확인용 아래 주석이 원본
  if (hasPublishingBodyCompositionData.value) {
    BodyCompositionDataList.value = publishingBodyCompositionDataList
    return
  }
  BodyCompositionDataList.value = []
  // if (!isOneTimeAnalysis.value) {
  //   await getBodyCompositionData()
  // }
})
</script>

<template>
  <section class="CheckupBody CheckupWellnessList">
    <!-- 메인 체성분 선택 화면 -->
    <div class="BodyCompositionPop-con-wrap">

      <!-- 기존 체성분 데이터 리스트 -->
      <div class="BodyCompositionPop-con">
        <!-- 측정 결과 없을 때 또는 일회성 분석일 때 -->
        <div v-if="BodyCompositionDataList.length === 0 || isOneTimeAnalysis" class="BodyCompositionPop-con--no-data">
          <div class="BodyCompositionPop-con--no-data-wrap">
            <img class="BodyCompositionPop-con--img" src="/img/ic_no-data.png">
            <p class="BodyCompositionPop-con--text">
              <span class="BodyCompositionPop-con--text-light">{{ $t('BodyCompositionPop.text5')}}</span>
              {{ $t('BodyCompositionPop.text11')}}
            </p>
            <p class="BodyCompositionPop-con--desc" v-html="$t('BodyCompositionPop.text7')"></p>
          </div>

          <!-- 선택 버튼들 -->
          <div class="BodyCompositionPop-btn scroll-btn-wrap">
            <div v-if ="!isOneTimeAnalysis" class="btn--bottom">
              <button type="button" @click="goToBodyKeyLogin">
                {{ $t('BodyCompositionPop.text8')}}
              </button>
            </div>
            <div class="btn--bottom btn--bottom-line">
              <button type="button" @click="startDirectInputProcess">
                {{ $t('BodyCompositionPop.text9')}}
              </button>
            </div>
            <div class="btn--bottom btn--bottom-line">
                <button type="button" @click="handleBack">
                {{ $t('Common.prev')}}
              </button>
            </div>
          </div>
        </div>

        <!-- 측정 결과 있을 때 (일회성 분석이 아닐 때만) -->
        <div class="BodyCompositionPop-con--data" v-else-if="!isOneTimeAnalysis">
          <div class="checkupBody-header">
            <h1 class="checkupBody-header-part-tit">
              <span class="checkupBody-header-part-tit-ic"><img src="/img/ic_step2_n.png" alt="체성분"></span>
            {{ $t('CheckupBody.text3') }}
            </h1>
            <h2 class="checkupBody-header-part-tit-sub">{{ $t('CheckupBody.text6') }}</h2>
          </div>
          
          <p class="BodyCompositionPop-con--text">
            <span class="BodyCompositionPop-con--text-light">{{ $t('BodyCompositionPop.text5')}}</span>
            <span class="BodyCompositionPop-con--text-color">{{ BodyCompositionDataList.length }}{{ $t('BodyCompositionPop.text33')}}</span>{{ $t('BodyCompositionPop.text6')}}
          </p>
          <div class="BodyCompositionPop-con--list">
            <div
              v-for="(item, index) in BodyCompositionDataList"
              :key="index"
              :class="['data-item', { selected: selectedBodyComposition === item }]"
              @click="selectExistingBodyComposition(item)"
            >
              {{ item.surveyDate }}
            </div>
          </div>

          <!-- 선택 버튼들 -->
          <div class="BodyCompositionPop-btn scroll-btn-wrap">
            <div class="btn--bottom">
              <button type="button" @click="goToBodyKeyLogin">
                {{ $t('BodyCompositionPop.text8')}}
              </button>
            </div>
            <div class="btn--bottom btn--bottom-line">
              <button type="button" @click="startDirectInputProcess">
                {{ $t('BodyCompositionPop.text9')}}
              </button>
            </div>
            <div class="btn--bottom btn--bottom-line">
                <button type="button" @click="handleBack">
                {{ $t('Common.prev')}}
              </button>
            </div>
          </div>
        </div>
        
      </div>

    </div>
  </section>
</template>