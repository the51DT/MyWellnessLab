<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import BasePopupTit from '@/components/BasePopupTit.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const store = useStore()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const detail = computed(() => {
  return store.getters['analyze/getInhibitionAnalysisDetail']
})

const sendData = computed(() => {
  return detail.value
})

// 운동 가이드 메시지 computed
const exerciseGuideMessage = computed(() => {
  const exerciseData = sendData.value?.hqMusMass?.exerciseData
  if (!exerciseData || !exerciseData[0] || !exerciseData[0].msg) {
    return ''
  }
  
  const message = exerciseData[0].msg
  const userName = sendData.value?.name || t('AnalyzeExerciseDetailGuide.user')
  
  // @@@ 부분을 사용자 이름으로 대체
  return message.replace(/@@@/g, userName)
})

// 운동 데이터를 상체/하체로 분류
const upperBodyExercises = computed(() => {
  const exerciseData = sendData.value?.hqMusMass?.exerciseData
  if (!exerciseData) return []
  return exerciseData.filter(ex => ex.target === 1) // 상체
})

const lowerBodyExercises = computed(() => {
  const exerciseData = sendData.value?.hqMusMass?.exerciseData
  if (!exerciseData) return []
  return exerciseData.filter(ex => ex.target === 2) // 하체
})

/**
 * 가이드 팝업 닫기
 */
function closeGuide () {
  emit('close')
}

onMounted(() => {
  if (!detail.value) {
    closeGuide()
    return
  }
  
  // iOS Safari iframe 터치 문제 해결을 위한 더미 터치 리스너 추가
  document.body.addEventListener('touchstart', function(){}, { passive: true })
  document.body.addEventListener('touchend', function(){}, { passive: true })
})
</script>

<template>
  <BasePopupTit v-if="isOpen" @popupClose="closeGuide" class="AnalyzeExerciseDetailGuidePop">
    <template v-slot:title>
      {{ $t('AnalyzeExerciseDetailGuide.customExerciseGuide') }}
    </template>
    <template v-slot:contents>
      <div class="AnalyzeExerciseDetailGuide">
        <p class="AnalyzeDetailGuide-desc" v-html="t('AnalyzeExerciseDetailGuide.description')">
        </p>
        <div class="AnalyzeExerciseDetailGuide-con">
          <p class="AnalyzeExerciseDetailGuide-con-desc">
            {{ exerciseGuideMessage }}
          </p>

          <div class="AnalyzeExerciseDetailGuide-con-exercise">
            <h2>
              <img src="/img/ic_upperbody.svg" :alt="$t('AnalyzeExerciseDetailGuide.upperBody')">
              {{ $t('AnalyzeExerciseDetailGuide.upperBody') }}
            </h2>

            <div v-for="exercise in upperBodyExercises" :key="exercise.exCode" class="AnalyzeExerciseDetailGuide-con-exercise-detail">
              <div class="exercise-video-container">
                <iframe 
                  :src="`${exercise.qrURL}?controls=1&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3&fs=1&rel=0&showinfo=0`"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                  allowfullscreen
                  loading="lazy"
                  scrolling="no"
                  style="border: none; pointer-events: auto;">
                </iframe>
              </div>
              <h3>{{ exercise.exName }}
                <span class="line">|</span>
                <span class="sets">{{ exercise.reps }}{{ $t('AnalyzeExerciseDetailGuide.reps') }} {{ exercise.sets }}{{ $t('AnalyzeExerciseDetailGuide.sets') }}</span>
              </h3>
              <p>{{ exercise.exEffect }}</p>
            </div>

            <h2>
              <img src="/img/ic_lowerbody.svg" :alt="$t('AnalyzeExerciseDetailGuide.lowerBody')">
              {{ $t('AnalyzeExerciseDetailGuide.lowerBody') }}
            </h2>

            <div v-for="exercise in lowerBodyExercises" :key="exercise.exCode" class="AnalyzeExerciseDetailGuide-con-exercise-detail">
              <div class="exercise-video-container">
                <iframe 
                  :src="`${exercise.qrURL}?controls=1&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3&fs=1&rel=0&showinfo=0`"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                  allowfullscreen
                  loading="lazy"
                  scrolling="no"
                  style="border: none; pointer-events: auto;">
                </iframe>
              </div>
              <h3>{{ exercise.exName }}
                <span class="line">|</span>
                <span class="sets">{{ exercise.reps }}{{ $t('AnalyzeExerciseDetailGuide.reps') }} {{ exercise.sets }}{{ $t('AnalyzeExerciseDetailGuide.sets') }}</span>
              </h3>
              <p>{{ exercise.exEffect }}</p>
            </div>
          </div>
          
        </div>
      </div>
    </template>
  </BasePopupTit>
</template>

<style>
.exercise-video-container {
  pointer-events: auto !important;
  position: relative;
  -webkit-overflow-scrolling: touch;
  touch-action: manipulation;
}

.exercise-video-container iframe {
  pointer-events: auto !important;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: none;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  touch-action: manipulation;
  vertical-align: middle;
  border-radius: 1.2rem;
}

/* iOS 디바이스 특별 처리 */
@supports (-webkit-touch-callout: none) {
  .exercise-video-container {
    -webkit-tap-highlight-color: transparent;
  }
  
  .exercise-video-container iframe {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}
</style>