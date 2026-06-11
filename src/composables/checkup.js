import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { getCommonInfo } from '@/apis/checkup'
import { computed } from 'vue'

/**
 * 관심 건강분야 및 남/여에 따라 다음 화면 동적으로 변경됨
 * dynamicRouterMap 객체에 선언된 프로퍼티 순서대로 노출
 **/
export const dynamicRouterMap = {
  hthMemory: 'CheckupMemory',
  hthEye: 'CheckupEye',
  hthNose: 'CheckupNoseHypersensitivity',
  hthStomach: 'CheckupStomach',
  hthIntestine: 'CheckupIntestine',
  hthBj: 'CheckupJointAndBone',
  hthImmune: 'CheckupImmunity',
  hthMen: 'CheckupProstate',
  hthSexHor: 'CheckupMenopause',
  hthWomen: 'CheckupMenstrual'
}

/**
 * lowerStepList 기반으로 동적 이전 페이지 이동
 * @returns {Function} 동적 이전 페이지 이동 함수
 */
export const useDynamicMovePrev = () => {
  const store = useStore()
  const route = useRoute()
  const router = useRouter()

  const moveDynamicPrev = async () => {
    try {
      // API에서 lowerStepList 정보 가져오기
      const analysisType = store.getters['checkup/getAnalysisType']
      const response = await getCommonInfo(analysisType)
      const commonInfo = response.data.commonInfo

      if (!commonInfo.lowerStepList) {
        // lowerStepList가 없으면 CheckupInterestHealth로 이동
        router.push({ name: 'CheckupInterestHealth' })
        return
      }

      const lowerStepList = commonInfo.lowerStepList.map((item) => {
        return Object.keys(item)[0]
      })

      // 현재 페이지가 lowerStepList에서 몇 번째인지 찾기
      const currentStep = Object.keys(dynamicRouterMap).find((key) => {
        return dynamicRouterMap[key] === route.name
      })

      if (!currentStep) {
        // 현재 페이지가 lowerStepList에 없으면 CheckupInterestHealth로 이동
        router.push({ name: 'CheckupInterestHealth' })
        return
      }

      const currentIndex = lowerStepList.findIndex((item) => item === currentStep)

      if (currentIndex > 0) {
        // 이전 페이지가 있으면 이전 페이지로 이동
        const prevStep = lowerStepList[currentIndex - 1]
        const prevRouteName = dynamicRouterMap[prevStep]
        router.push({ name: prevRouteName })
      } else {
        // 이전 페이지가 없으면 CheckupInterestHealth로 이동
        router.push({ name: 'CheckupInterestHealth' })
      }
    } catch (e) {
      console.error('moveDynamicPrev error', e)
      // 에러 발생 시 CheckupInterestHealth로 이동
      router.push({ name: 'CheckupInterestHealth' })
    }
  }

  return moveDynamicPrev
}

// 설문 이전 화면 이동
export const useMovePrev = () => {
  const store = useStore()
  const route = useRoute()
  const router = useRouter()

  /**
   * 동적으로 변하는 설문 화면에서 이전 화면으로 이동할 라우터 이름 가져오기
   * @returns {string} router name
   */
  const getDynamicPrevRouterName = async () => {
    const routerName = route.name

    const dynamicPages = Object.values(dynamicRouterMap)
    if (dynamicPages.includes(routerName)) {
      return 'CheckupInterestHealth'
    }

    // 기존 로직 (CheckupMedication 등 다른 페이지들)
    const analysisType = store.getters['checkup/getAnalysisType']
    const response = await getCommonInfo(analysisType)
    const commonInfo = response.data.commonInfo

    const lowerStep = Object.keys(dynamicRouterMap).find((key) => {
      return dynamicRouterMap[key] === routerName
    })
    
    // lowerStepList가 null이나 undefined인 경우 체크
    if (!commonInfo.lowerStepList) {
      return 'CheckupInterestHealth'
    }
    
    const lowerStepList = commonInfo.lowerStepList.map((item) => {
      return Object.keys(item)[0]
    })

    // CheckupMedication, CheckupDiet, CheckupSleep, CheckupPhysicalActivity, CheckupDrinkSmokeSleep, CheckupEq5d는
    // 모두 lowerStepList의 마지막 항목으로 이동
    const healthLifePages = ['CheckupMedication', 'CheckupDiet', 'CheckupSleep', 'CheckupPhysicalActivity', 'CheckupDrinkSmokeSleep', 'CheckupEq5d']
    if (healthLifePages.includes(routerName)) {
      return dynamicRouterMap[lowerStepList[lowerStepList.length - 1]]
    }

    if (!lowerStep) {
      return 'CheckupInterestHealth'
    }

    if (lowerStepList && lowerStepList.length > 0) {
      const lowerStepIndex = lowerStepList.findIndex((item) => item === lowerStep)

      if (lowerStepIndex !== -1) {
        const prevLowerStepIndex = lowerStepIndex - 1
        const existPrev = prevLowerStepIndex >= 0

        if (existPrev) {
          return dynamicRouterMap[lowerStepList[prevLowerStepIndex]]
        } else {
          return 'CheckupInterestHealth'
        }
      }
    } else {
      return 'CheckupInterestHealth'
    }
  }

  /**
   * 체성분 관련 페이지 목록
   */
  const bodyCompositionPages = [
    'CheckupBodyGuide',
    'CheckupBody',
    'CheckupBodyKeyLogin',
    'CheckupBodyKeyDataList',
    'CheckupBodyDateSelect',
    'CheckupBodyDirectInput'
  ]

  /**
   * CheckupInterestHealth에서 이전 페이지 결정
   * 체성분 데이터가 있으면 CheckupBodyDirectInput (읽기 전용), 없으면 CheckupBodyGuide
   * @returns {string} router name
   */
  const getCheckupInterestHealthPrevRoute = async () => {
    try {
      const analysisType = store.getters['checkup/getAnalysisType']
      const response = await getCommonInfo(analysisType)
      const commonInfo = response.data.commonInfo
      
      if (!commonInfo.basicsId) {
        console.warn('basicsId가 없습니다')
        return 'CheckupBodyGuide'
      }
      
      // 체성분 데이터 확인
      const inbodyResponse = await import('@/apis/checkup').then(api => 
        api.getInbodyTemporary(commonInfo.basicsId)
      )
      
      if (inbodyResponse && inbodyResponse.data.inbody) {
        const inbodyData = inbodyResponse.data.inbody
        
        if (inbodyData.connectType === 'CUSTOM') {
          // 직접 입력으로 생성된 데이터면 직접 입력 모드로 이동
          router.push({ name: 'CheckupBodyDirectInput' })
        } else {
          // 바디키 등 기존 데이터면 읽기 전용 모드로 이동
          router.push({ 
            name: 'CheckupBodyDirectInput',
            query: { 
              mode: 'view',
              dataType: 'existing'
            }
          })
        }
        return null // router.push를 직접 호출했으므로 null 반환
      } else {
        // 체성분 데이터가 없으면 CheckupBodyGuide
        return 'CheckupBodyGuide'
      }
    } catch (e) {
      console.error('체성분 데이터 확인 실패:', e)
      // 에러 발생 시 기본적으로 CheckupBodyGuide로 이동
      return 'CheckupBodyGuide'
    }
  }

  /**
   * 이전 설문 화면으로 이동할 라우터 이름 가져오기
   * @returns {string} router name
   */
  const getPrevRouterName = async () => {
    const routerName = route.name

    // 체성분 관련 페이지들은 모두 CheckupBlood로 이동
    if (bodyCompositionPages.includes(routerName)) {
      return 'CheckupBlood'
    }

    const interestDetailPages = new Set(Object.values(dynamicRouterMap))

    // 관심 상세 설문들은 전부 관심 선택 화면으로
    if (interestDetailPages.has(routerName)) {
      return 'CheckupInterestHealth'
    }

    switch (routerName) {
      case 'CheckupBasics':
        return 'CheckupSideSelect'
      case 'CheckupBlood':
        return 'CheckupBasics'
      case 'CheckupInterestHealth':
        return await getCheckupInterestHealthPrevRoute()
      case 'CheckupMedication':
      case 'CheckupDiet':
      case 'CheckupSleep':
      case 'CheckupPhysicalActivity':
      case 'CheckupDrinkSmokeSleep':
      case 'CheckupEq5d':
        return await getDynamicPrevRouterName()
    }
  }

  const movePrev = async () => {
    const prevRouterName = await getPrevRouterName()
    // prevRouterName이 null이면 이미 router.push가 호출된 상태
    if (prevRouterName) {
      router.push({ name: prevRouterName })
    }
  }

  return movePrev
}

// 설문 다음 화면 이동
export const useMoveNext = () => {
  const store = useStore()
  const route = useRoute()
  const router = useRouter()

  /**
   * 동적으로 변하는 설문 화면에서 다음 화면으로 이동할 라우터 이름 가져오기
   * @returns {string} router name
   */
  const getDynamicNextRouterName = async () => {
    try {
      const analysisType = store.getters['checkup/getAnalysisType']

      const response = await getCommonInfo(analysisType)
      const commonInfo = response.data.commonInfo

      if (!commonInfo.lowerStepList) {
        return 'CheckupMedication'
      }

      const lowerStep = commonInfo.lowerStep
      const lowerStepList = commonInfo.lowerStepList.map((item) => {
        return Object.keys(item)[0]
      })

      if (lowerStep === 'notInterested' || !lowerStep) {
        return dynamicRouterMap[lowerStepList[0]]
      }

      if (lowerStepList && lowerStepList.length > 0) {
        const lowerStepIndex = lowerStepList.findIndex((item) => item === lowerStep)

        if (lowerStepIndex !== -1) {
          const nextLowerStepIndex = lowerStepIndex + 1
          const existNext = nextLowerStepIndex < lowerStepList.length

          if (existNext) {
            return dynamicRouterMap[lowerStepList[nextLowerStepIndex]]
          } else {
            return 'CheckupMedication'
          }
        }
      }
    } catch (e) {
      console.error('getDynamicRouterName error', e)
    }
  }

  /**
   * 다음 설문 화면으로 이동할 라우터 이름 가져오기
   * @returns {string} router name
   */
  const getNextRouterName = async () => {
    const routerName = route.name

    switch (routerName) {
      case 'CheckupBasics':
        return 'CheckupBlood'
      case 'CheckupBlood':
        return 'CheckupBodyGuide'
      case 'CheckupBodyGuide':
        return 'CheckupInterestHealth'
      case 'CheckupInterestHealth':
      case 'CheckupMemory':
      case 'CheckupEye':
      case 'CheckupNoseHypersensitivity':
      case 'CheckupStomach':
      case 'CheckupIntestine':
      case 'CheckupJointAndBone':
      case 'CheckupImmunity':
      case 'CheckupMenopause':
        return await getDynamicNextRouterName()
      case 'CheckupProstate':
      case 'CheckupMenstrual':
        return 'CheckupMedication'
      case 'CheckupMedication':
        return 'CheckupDiet'
      case 'CheckupDiet':
        return 'CheckupSleep'
      case 'CheckupSleep':
        return 'CheckupPhysicalActivity'
      case 'CheckupPhysicalActivity':
        return 'CheckupDrinkSmokeSleep'
      case 'CheckupDrinkSmokeSleep':
        return 'CheckupEq5d'
      case 'CheckupEq5d':
        return 'CheckupSideComplete'
    }
  }

  const moveNext = async () => {
    const nextRouterName = await getNextRouterName()

    router.push({ name: nextRouterName })
  }

  return moveNext
}

export const useMoveStep = () => {
  const router = useRouter()

  const moveStep = (commonInfo) => {
    const step = commonInfo.step
    const lowerStep = commonInfo.lowerStep

    const getDynamicRouterName = () => {
      const name = dynamicRouterMap[lowerStep]

      if (!name) {
        return 'CheckupInterestHealth'
      }

      return name
    }

    const getRouterNameByStep = () => {
      switch (step) {
        case 1:
          return 'CheckupBasics'
        case 2:
          return 'CheckupBlood'
        case 3:
          return 'CheckupBody'
        case 4:
          return getDynamicRouterName()
        case 5:
          return 'CheckupMedication'
        case 6:
          return 'CheckupDiet'
        case 7:
          return 'CheckupSleep'
        case 8:
          return 'CheckupPhysicalActivity'
        case 9:
          return 'CheckupDrinkSmokeSleep'
        case 10:
          return 'CheckupEq5d'
      }
    }

    const name = getRouterNameByStep()

    router.push({ name })
  }

  return moveStep
}

export const useStepNavigation = ({
                                    current,
                                    isDisabled,
                                    handleSave,
                                    user,
                                    router,
                                    healthInterest,
                                    progressbar
                                  }) => {
  const handleStepClick = async (stepIndex) => {
    // 조건 확인
    if (stepIndex > current.value && isDisabled.value) return

    // 선택된 키 추출
    const detailSurveyKeys = Object.keys(dynamicRouterMap)
    const selectedKeys = detailSurveyKeys.filter(
        (key) => healthInterest.value[key] === 1
    )

    if (user.gender === 'FEMALE') {
      selectedKeys.push('hthWomen')
    }

    const targetKey = selectedKeys[stepIndex - 1]
    
    // progressbar에서 해당 단계의 inputYn 확인
    if (progressbar && progressbar.value && targetKey) {
      const targetProgressItem = progressbar.value.find(item => item.ptype === targetKey)
      if (targetProgressItem && targetProgressItem.inputYn === 'N') {
        // inputYn이 'N'인 단계로는 이동 불가
        return
      }
    }

    await handleSave(false)

    if (targetKey) {
      router.push({ name: dynamicRouterMap[targetKey] })
    }
  }

  return { handleStepClick }
}

export const healthLifeStepRoutes = {
  drug: 'CheckupMedication',
  dq: 'CheckupDiet',
  sh: 'CheckupSleep',
  activity: 'CheckupPhysicalActivity',
  dsw: 'CheckupDrinkSmokeSleep',
  eq5d: 'CheckupEq5d',
}

export const healthLifeStepNavigation = (progressbar) => {
  const router = useRouter()

  const handleStepClick = (stepIdx) => {
    const bar = progressbar.value[stepIdx - 1]
    if (!bar) return
    
    // inputYn이 'N'인 단계로는 이동 불가
    if (bar.inputYn === 'N') {
      return
    }
    
    const routeName = healthLifeStepRoutes[bar.pType]
    if (routeName) router.push({ name: routeName })
  }
  return { handleStepClick }
}

export function useSurveyStepCommon(handleSave, handleStepClick, current, isDisabled) {
  const onStepClick = async (stepIdx) => {
    if (stepIdx > current.value && isDisabled.value) return
    await handleSave(false)
    handleStepClick(stepIdx)
  }
  return { onStepClick }
}

/**
 *
 * @param {Ref<boolean>} isDisabled - 필수값 체크 결과 computed
 * @param {Ref<Array>} progressbar   - progressbar 데이터
 */
export function useNextDisabled(isDisabled, progressbar) {
  return computed(() => {
    // 필수 답변 체크
    if (isDisabled.value) return true;
    // 설문 중 미작성 항목 체크
    if (progressbar.value.slice(0, -1).some(item => item.inputYn === 'N')) return true;
    return false;
  })
}
