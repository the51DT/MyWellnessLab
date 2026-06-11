import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { mwlRoundAgingRate, getScoreStatus, getAgingRateStatus, getAriStatusStatus, getHriStatusStatus } from '@/assets/js/common'

export function useAnalysis(sendData) {
  const { t } = useI18n()
  // 노화속도 관련 computed 속성들
  const agingRate = computed(() => {
    return sendData.value?.hqAr?.aging_rate ? 
      mwlRoundAgingRate(sendData.value.hqAr.aging_rate, 2) : 0
  })

  const agingSpeedStatus = computed(() => {
    const status = sendData.value?.hqAr?.status || 2
    
    switch (status) {
      case 1:
        return { text: t('useAnalyze.slowAging'), class: 'good' }
      case 2:
        return { text: t('useAnalyze.normalAging'), class: 'manage' }
      case 3:
        return { text: t('useAnalyze.fastAging'), class: 'warning' }
      default:
        return { text: t('useAnalyze.normalAging'), class: 'manage' }
    }
  })

  const agingSpeedClass = computed(() => {
    const status = sendData.value?.hqAr?.status || 0
    
    switch (status) {
      case 1: return 'green'
      case 2: return 'yellow'
      case 3: return 'red'
      default: return 'yellow'
    }
  })

  // AnalyzeCheckupData.vue용 CSS 클래스 (good, manage, warning)
  const agingSpeedClassForAnalyze = computed(() => {
    const status = sendData.value?.hqAr?.status || 0
    
    switch (status) {
      case 1: return 'good'
      case 2: return 'manage'
      case 3: return 'warning'
      default: return 'manage'
    }
  })

  // 건강위치 관련 computed 속성들
  const healthLocationStatus = computed(() => {
    const status = sendData?.value.hqHtype?.status || 1
    let text = ''
    let className = ''
    
    switch (status) {
      case 1:
        text = t('useAnalyze.good')
        className = 'good'
        break
      case 2:
        text = t('useAnalyze.normal')
        className = 'manage'
        break
      case 3:
        text = t('useAnalyze.needsAttention')
        className = 'warning'
        break
      default:
        text = ''
        className = ''
    }
    
    return { text, class: className }
  })

  // 건강신호등 관련 computed 속성들
  const healthTrafficLight = computed(() => {
    const counts = {
      good: 0,
      manage: 0,
      warning: 0
    }

    // 각 분석 지표들의 상태를 확인하여 카운트
    // 노화 억제 분석지수
    if (sendData.value?.hqOxi?.status !== null && sendData.value?.hqOxi?.status !== undefined) {
      const status = sendData.value.hqOxi.status
      if (status === 1) counts.good++
      else if (status === 2) counts.manage++
      else if (status === 3) counts.warning++
    }

    // 만성질환 억제 분석지수
    if (sendData.value?.hqMet?.status !== null && sendData.value?.hqMet?.status !== undefined) {
      const status = sendData.value.hqMet.status
      if (status === 1) counts.good++
      else if (status === 2) counts.manage++
      else if (status === 3) counts.warning++
    }

    // 근육밸런스 분석지수
    if (sendData.value?.hqMusBal?.status !== null && sendData.value?.hqMusBal?.status !== undefined) {
      const status = sendData.value.hqMusBal.status
      if (status === 1) counts.good++
      else if (status === 2) counts.manage++
      else if (status === 3) counts.warning++
    }

    // 식사, 운동, 수면 데이터도 포함
    if ((sendData.value?.dqData?.RFS_score || 0)  !== null && (sendData.value?.dqData?.RFS_score || 0)  !== undefined) {
      const dietScore = sendData.value.dqData?.RFS_score || 0 
      const dietStatus = getScoreStatus(dietScore, 'rfs')
      if (dietStatus === 1) counts.good++
      else if (dietStatus === 2) counts.manage++
      else if (dietStatus === 3) counts.warning++
    }

    if (sendData.value?.shData?.sh_score !== null && sendData.value?.shData?.sh_score !== undefined) {
      const sleepScore = sendData.value.shData.sh_score
      const sleepStatus = getScoreStatus(sleepScore, 'sh')
      if (sleepStatus === 1) counts.good++
      else if (sleepStatus === 2) counts.manage++
      else if (sleepStatus === 3) counts.warning++
    }

    // 운동 데이터 (metData.met에서 가져옴)
    if (sendData.value?.metData?.met !== null && sendData.value?.metData?.met !== undefined) {
      const exerciseScore = sendData.value.metData.met
      const exerciseStatus = getScoreStatus(exerciseScore, 'musMass')
      if (exerciseStatus === 1) counts.good++
      else if (exerciseStatus === 2) counts.manage++
      else if (exerciseStatus === 3) counts.warning++
    }

    return counts
  })

  return {
    agingRate,
    agingSpeedStatus,
    agingSpeedClass,
    agingSpeedClassForAnalyze,
    healthLocationStatus,
    healthTrafficLight,
    getAgingRateStatus,
    getAriStatusStatus,
    getHriStatusStatus
  }
}
