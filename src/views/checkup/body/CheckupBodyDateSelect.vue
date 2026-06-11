<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { calcAge, dateConvert } from '@/assets/js/common'
import { format } from 'date-fns'

const router = useRouter()
const store = useStore()

// 날짜 선택 관련 변수들
const selectDate = ref(new Date())
const attributes = ref([])
const config = ref({
  type: 'string',
  mask: 'YYYY-MM-DD'
})
const mask = ref({
  input: 'YYYY-MM-DD'
})

// 다음 버튼 비활성화 조건
const nextDisabled = computed(() => {
  if (!selectDate.value) {
    return true  // 날짜가 선택되지 않은 경우
  }
  
  // 미래 날짜 방지: 오늘 이후 날짜 선택 시 버튼 비활성화
  const curDate = new Date()
  curDate.setHours(0, 0, 0, 0)  // 시간을 00:00:00으로 설정
  
  const selectedDate = new Date(selectDate.value)
  selectedDate.setHours(0, 0, 0, 0)  // 시간을 00:00:00으로 설정
  
  if (selectedDate > curDate) {
    return true  // 미래 날짜 선택 시 버튼 비활성화
  }
  
  return false  // 유효한 날짜 선택 시 버튼 활성화
})

// 이전 단계로 이동
const handleBack = () => {
  router.push({ name: 'CheckupBody' })
}

// 다음 단계로 이동 (날짜 선택 완료)
const handleProceed = () => {
  if (!selectDate.value) {
    alert('날짜를 선택해주세요.')
    return
  }
  
  // 선택된 날짜를 store에 저장
  store.commit('checkup/SET_CHECK_DATE', selectDate.value)
  
  // 직접 입력 페이지로 이동
  router.push({ name: 'CheckupBodyDirectInput' })
}
</script>

<template>
  <div class="CheckupBodyDateSelect">
    <section class="AnalyzeCheckDateSelect">
      <!-- 헤더 -->
      <div class="checkupBody-header">
        <h1 class="checkupBody-header-part-tit">
          <span class="checkupBody-header-part-tit-ic"><img src="/img/ic_step2_n.png" alt="체성분"></span>
          {{ $t('CheckupBody.text3') }}
        </h1>
        <h2 class="checkupBody-header-part-tit-sub">{{ $t('CheckupBody.text9') }}</h2>
      </div>

      <div class="AnalyzeCheckDateSelect--contents">
        <div class="AnalyzeCheckDateSelect--msg">
          {{ $t('BodyCompositionPop.text39') }}
        </div>
        <div class="AnalyzeCheckDateSelect--cal">
          <VDatePicker
            v-model="selectDate"
            mode="date"
            :isToday="true"
            :attributes="attributes"
            :model-config="config"
            :masks="mask"
            is-required />
        </div>
      </div>
    </section>
        
    <!-- 선택 버튼들 -->
    <div class="Checkup--btn-wrap">
      <div class="btn--bottom">
        <button 
          @click="handleProceed"
          :disabled="nextDisabled"
          type="button">
          {{ $t('Common.next') }}
        </button>
      </div>
      <div class="btn--bottom btn--bottom-line">
        <button
          @click="handleBack"
          type="button">
          {{ $t('Common.prev') }}
        </button>
      </div>
    </div>

  </div>
</template>