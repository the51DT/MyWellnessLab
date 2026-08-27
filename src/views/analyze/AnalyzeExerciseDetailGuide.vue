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
// 2606 퍼블 확인용 데이터
const publishingExerciseSendData = {
  hqMusMass: {
    exerciseData: [
      {
        exCode: 'UPPER_001',
        target: 1,
        exName: '밴트오버 로우',
        reps: 15,
        sets: 3,
        exEffect: '대표적인 등 운동으로 굽은 어깨를 개선하고 약해진 등 근육을 강화하고 코어 안정성을 높혀 허리통증 예방 및 완화에 도움을 줍니다. 수건을 활용하면 더욱 효과적으로 수행할 수 있습니다.',
        qrURL: 'https://www.youtube.com/embed/EQibcTZgfEs',
        msg: '@@@님께서는 하체와 전신 근육을 함께 강화하는 운동을 권장합니다.'
      },
      {
        exCode: 'UPPER_002',
        target: 1,
        exName: '맨손 플로어 T',
        reps: 15,
        sets: 3,
        exEffect: '플랭크 응용 동작으로, 한쪽 다리를 번갈아 들어서 한쪽 다리로만 몸을 지탱함으로서 균형감각을 비롯한 복근과 허리 근육을 강화하는 운동입니다. 하체 근육의 안정성을 증가시키면서 복부 지방 감소 및 후면 코어 근육 강화에 탁월하지만, 허리 통증 및 부상이 있으셨던 분들은 표준 플랭크 자세로 운동하는 것을 권합니다.',
        qrURL: 'https://www.youtube.com/embed/EQibcTZgfEs'
      },
      {
        exCode: 'LOWER_001',
        target: 2,
        exName: '싱글 레그 스퀘드',
        reps: 15,
        sets: 3,
        exEffect: '플랭크 응용 동작으로, 한쪽 다리를 번갈아 들어서 한쪽 다리로만 몸을 지탱함으로서 균형감각을 비롯한 복근과 허리 근육을 강화하는 운동입니다. 하체 근육의 안정성을 증가시키면서 복부 지방 감소 및 후면 코어 근육 강화에 탁월하지만, 허리 통증 및 부상이 있으셨던 분들은 표준 플랭크 자세로 운동하는 것을 권합니다.',
        qrURL: 'https://www.youtube.com/embed/EQibcTZgfEs'
      },
      {
        exCode: 'LOWER_002',
        target: 2,
        exName: '원 레그 데드리프트',
        reps: 15,
        sets: 3,
        exEffect: '플랭크 응용 동작으로, 한쪽 다리를 번갈아 들어서 한쪽 다리로만 몸을 지탱함으로서 균형감각을 비롯한 복근과 허리 근육을 강화하는 운동입니다. 하체 근육의 안정성을 증가시키면서 복부 지방 감소 및 후면 코어 근육 강화에 탁월하지만, 허리 통증 및 부상이 있으셨던 분들은 표준 플랭크 자세로 운동하는 것을 권합니다.',
        qrURL: 'https://www.youtube.com/embed/EQibcTZgfEs'
      }
    ]
  }
}
// 2606 퍼블 확인용 아래 주석이 원본
const sendData = computed(() => {
  const detailData = detail.value || {}

  return {
    ...publishingExerciseSendData,
    ...detailData,
    hqMusMass: {
      ...publishingExerciseSendData.hqMusMass,
      ...(detailData.hqMusMass || {}),
      exerciseData: detailData.hqMusMass?.exerciseData?.length
        ? detailData.hqMusMass.exerciseData
        : publishingExerciseSendData.hqMusMass.exerciseData
    }
  }
})
// const sendData = computed(() => {
//   return detail.value
// })

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
            <span>다리 근육 강화를 최우선으로 하면서 몸통과 팔 근육까지 함께 단련 할수있는 운동을 통해 전신을 균영있게 관리 해보세요.</span> <!-- 2606 .AnalyzeExerciseDetailGuide-con-desc 내부 span 태그 텍스트 추가 -->
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