<script setup>
import { ref, reactive, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import * as checkupApi from '@/apis/checkup'
import * as analysisApi from '@/apis/analysis'

const router = useRouter()
const store = useStore()
const { t } = useI18n()

// 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
const getTodayDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 기본 정보
const basicInfo = reactive({
  name: 'TEST', // 이름 (화면에 표시하지 않고 서버에만 전송)
  ht: '', // 키
  wt: '', // 몸무게
  age: '', // 나이
  gender: 'M', // 성별 (M/F)
  waist: '', // 허리둘레
  sbp: '', // 수축기 혈압
  dbp: '' // 이완기 혈압
})

// 혈액 검사 데이터
const bloodData = reactive({
  hb: '', // 혈색소
  glu: '', // 공복혈당
  crea: '', // 혈청 크레아티닌
  got: '', // 아스파테이트 아미노전이효소 (AST)
  gpt: '', // 알라닌 아미노전이효소 (ALT)
  tc: '', // 총 콜레스테롤
  hdl: '', // 고밀도 콜레스테롤 (HDL)
  tg: '', // 중성지방
  ldl: '', // 저밀도 콜레스테롤 (LDL)
  checkDate: getTodayDate() // 검진일 (오늘 날짜로 디폴트 설정)
})

// 체성분 데이터
const bodyComposition = reactive({
  bfm: '', // 체지방량
  pbf: '', // 체지방률
  smm: '', // 골격근량
  ram: '', // 우측 팔 근육량
  lam: '', // 좌측 팔 근육량
  trk: '', // 몸통 근육량
  rlm: '', // 우측 다리 근육량
  llm: '', // 좌측 다리 근육량
  pilra: '', // 우측 팔 근육률
  pilla: '', // 좌측 팔 근육률
  pilt: '', // 몸통 근육률
  pilrl: '', // 우측 다리 근육률
  pilll: '' // 좌측 다리 근육률
})

// 관심 건강분야와 설문 매핑 (실제 존재하는 설문만)
const interestToSurveyMapping = {
  'memory': 'memory',
  'eye': 'eye',
  'stomach': 'stomach',
  'intestine': 'intestine',
  'prostate': 'prostate',
  'menopause': 'menopause',
  'jointbone': 'jointBone',
  'immunity': 'immunity',
  'nose': 'nose'
}

// 관심 건강분야 옵션 (실제 설문이 있는 것만)
const interestOptions = [
  { key: 'memory', label: t('CheckupInterestHealth.text3') },
  { key: 'eye', label: t('CheckupInterestHealth.text7') },
  { key: 'stomach', label: t('CheckupInterestHealth.text9') },
  { key: 'intestine', label: t('CheckupInterestHealth.text11') },
  { key: 'prostate', label: t('CheckupInterestHealth.text18') },
  { key: 'menopause', label: t('CheckupInterestHealth.text19') },
  { key: 'jointbone', label: t('CheckupInterestHealth.text20') },
  { key: 'immunity', label: t('CheckupInterestHealth.text23') },
  { key: 'nose', label: t('CheckupInterestHealth.text25') }
]

// 선택된 관심 건강분야
const selectedInterests = ref([])

// 자동 입력 함수들
const autoFillBasicInfo = () => {
  const placeholders = {
    ht: 170,
    wt: 70,
    age: 30,
    waist: 80,
    sbp: 120,
    dbp: 80
  }
  
  Object.keys(placeholders).forEach(key => {
    const baseValue = placeholders[key]
    const min = Math.round(baseValue * 0.7) // -30%
    const max = Math.round(baseValue * 1.3) // +30%
    basicInfo[key] = Math.floor(Math.random() * (max - min + 1)) + min
  })
  
  // 성별은 랜덤 선택
  basicInfo.gender = Math.random() > 0.5 ? 'M' : 'F'
}

const autoFillBloodData = () => {
  const placeholders = {
    hb: 14,
    glu: 100,
    crea: 1.0,
    got: 25,
    gpt: 25,
    tc: 200,
    hdl: 50,
    tg: 150,
    ldl: 130
  }
  
  Object.keys(placeholders).forEach(key => {
    const baseValue = placeholders[key]
    const min = Math.round(baseValue * 0.7 * 10) / 10 // -30%, 소수점 1자리
    const max = Math.round(baseValue * 1.3 * 10) / 10 // +30%, 소수점 1자리
    bloodData[key] = Math.round((Math.random() * (max - min) + min) * 10) / 10
  })
}

const autoFillBodyComposition = () => {
  const placeholders = {
    bfm: 15,
    pbf: 20,
    smm: 30,
    ram: 3,
    lam: 3,
    trk: 25,
    rlm: 8,
    llm: 8,
    pilra: 35,
    pilla: 35,
    pilt: 40,
    pilrl: 40,
    pilll: 40
  }
  
  Object.keys(placeholders).forEach(key => {
    const baseValue = placeholders[key]
    const min = Math.round(baseValue * 0.7 * 10) / 10 // -30%, 소수점 1자리
    const max = Math.round(baseValue * 1.3 * 10) / 10 // +30%, 소수점 1자리
    bodyComposition[key] = Math.round((Math.random() * (max - min) + min) * 10) / 10
  })
}

// 설문 자동 입력 함수들 (개별 선택된 값 사용)
const autoFillMemorySurvey = () => {
  memoryQuestions.forEach(question => {
    surveyData.memory[question.key] = individualAutoFillValues.memory
  })
}

const autoFillEyeSurvey = () => {
  eyeQuestions.forEach(question => {
    surveyData.eye[question.key] = individualAutoFillValues.eye
  })
}

const autoFillNoseSurvey = () => {
  noseQuestions.forEach(question => {
    surveyData.nose[question.key] = individualAutoFillValues.nose
  })
}

const autoFillStomachSurvey = () => {
  stomachQuestions.forEach(question => {
    surveyData.stomach[question.key] = individualAutoFillValues.stomach
  })
}

const autoFillIntestineSurvey = () => {
  intestineQuestions.forEach((question, index) => {
    // 7번째 질문(대변 모양)은 다른 답변 옵션을 사용
    if (index === 7) {
      // 대변 모양은 1~7 범위이므로 적절한 값 설정
      surveyData.intestine[question.key] = Math.min(individualAutoFillValues.intestine + 1, 7)
    } else {
      // 일반 질문은 0~1 범위
      surveyData.intestine[question.key] = individualAutoFillValues.intestine
    }
  })
}

const autoFillJointBoneSurvey = () => {
  jointBoneQuestions.forEach(question => {
    surveyData.jointBone[question.key] = individualAutoFillValues.jointBone
  })
}

const autoFillImmunitySurvey = () => {
  immunityQuestions.forEach(question => {
    surveyData.immunity[question.key] = individualAutoFillValues.immunity
  })
}

const autoFillMenopauseSurvey = () => {
  menopauseQuestions.forEach(question => {
    surveyData.menopause[question.key] = individualAutoFillValues.menopause
  })
}

const autoFillProstateSurvey = () => {
  prostateQuestions.forEach((question, index) => {
    // 7번째 질문(야간뇨)은 다른 답변 옵션을 사용
    if (index === 6) {
      surveyData.prostate[question.key] = individualAutoFillValues.prostate
    } else {
      surveyData.prostate[question.key] = individualAutoFillValues.prostate
    }
  })
}

const autoFillMenstrualSurvey = () => {
  menstrualQuestions.forEach(question => {
    surveyData.menstrual[question.key] = individualAutoFillValues.menstrual
  })
}

const autoFillLifeSurvey = () => {
  lifeQuestions.forEach((question, index) => {
    // 첫 번째 질문(스트레스)은 다른 답변 옵션을 사용
    if (index === 0) {
      surveyData.life[question.key] = individualAutoFillValues.life
    } else {
      surveyData.life[question.key] = individualAutoFillValues.life
    }
  })
}

// 빠진 설문들의 자동 입력 함수들
const autoFillPhysicalSurvey = () => {
  physicalQuestions.forEach(question => {
    surveyData.physical[question.key] = 1 // 최소값 1로 설정
  })
}

const autoFillFourPowersSurvey = () => {
  fourPowersQuestions.forEach(question => {
    if (question.type === 'radio') {
      surveyData.fourPowers[question.key] = 1 // 라디오 버튼은 최소값 1
    } else if (question.type === 'number') {
      // 숫자 입력은 적절한 기본값 설정
      if (question.key === 'fpsq03') {
        surveyData.fourPowers[question.key] = 7 // 수면시간 7시간
      } else {
        surveyData.fourPowers[question.key] = 8 // 물섭취 8컵
      }
    }
  })
}

const autoFillDrugSurvey = () => {
  // 모든 질문을 false로 초기화
  drugQuestions.forEach(question => {
    surveyData.drug[question.key] = false
  })
  
  // 임의로 5개 정도 체크 (최대 5개, 질문 수가 5개 미만이면 모든 질문 체크)
  const checkCount = Math.min(5, drugQuestions.length)
  const shuffledQuestions = [...drugQuestions].sort(() => Math.random() - 0.5)
  
  for (let i = 0; i < checkCount; i++) {
    surveyData.drug[shuffledQuestions[i].key] = true
  }
}

const autoFillDietSurvey = () => {
  // 모든 음식 항목을 false로 초기화
  dqFoodItems.forEach(item => {
    surveyData.dq[item.key] = false
  })
  
  // 임의로 5개 정도 체크 (최대 5개, 항목 수가 5개 미만이면 모든 항목 체크)
  const checkCount = Math.min(5, dqFoodItems.length)
  const shuffledItems = [...dqFoodItems].sort(() => Math.random() - 0.5)
  
  for (let i = 0; i < checkCount; i++) {
    surveyData.dq[shuffledItems[i].key] = true
  }
}

const autoFillSleepSurvey = () => {
  sleepQuestions.forEach(question => {
    surveyData.sleep[question.key] = 1 // 수면 설문은 최소값 1로 설정
  })
}

// 자동 입력할 값을 선택할 수 있는 상태
const autoFillValue = ref(1) // 기본값은 1

// 각 설문별 개별 자동 입력 값
const individualAutoFillValues = reactive({
  memory: 1,
  eye: 1,
  nose: 1,
  stomach: 1,
  intestine: 1,
  jointBone: 1,
  immunity: 1,
  menopause: 1,
  prostate: 1,
  menstrual: 1,
  life: 1,
  physical: 1,
  fourPowers: 1,
  drug: false, // 체크박스는 boolean
  diet: false, // 체크박스는 boolean
  sleep: 1
})

// 모든 설문 자동 입력 (선택된 값으로)
const autoFillAllSurveys = () => {
  if (selectedSurveys.value.includes('memory')) autoFillMemorySurvey()
  if (selectedSurveys.value.includes('eye')) autoFillEyeSurvey()
  if (selectedSurveys.value.includes('nose')) autoFillNoseSurvey()
  if (selectedSurveys.value.includes('stomach')) autoFillStomachSurvey()
  if (selectedSurveys.value.includes('intestine')) autoFillIntestineSurvey()
  if (selectedSurveys.value.includes('jointBone')) autoFillJointBoneSurvey()
  if (selectedSurveys.value.includes('immunity')) autoFillImmunitySurvey()
  if (selectedSurveys.value.includes('menopause')) autoFillMenopauseSurvey()
  if (selectedSurveys.value.includes('prostate')) autoFillProstateSurvey()
  if (selectedSurveys.value.includes('menstrual')) autoFillMenstrualSurvey()
  autoFillLifeSurvey() // 삶의 질 설문은 항상 포함
  autoFillPhysicalSurvey() // 운동습관 설문은 항상 포함
  autoFillFourPowersSurvey() // 음주/흡연/수면/물섭취 설문은 항상 포함
  autoFillDrugSurvey() // 복약 설문은 항상 포함
  autoFillDietSurvey() // 식이 설문은 항상 포함
  autoFillSleepSurvey() // 수면 설문은 항상 포함
}

// 관심 건강분야 선택 기능
const toggleInterest = (interestKey) => {
  const index = selectedInterests.value.indexOf(interestKey)
  if (index > -1) {
    selectedInterests.value.splice(index, 1)
  } else if (selectedInterests.value.length < 3) {
    selectedInterests.value.push(interestKey)
  }
}

// 선택된 설문들만 필터링
const selectedSurveys = computed(() => {
  try {
    if (!selectedInterests.value || !Array.isArray(selectedInterests.value)) {
      return []
    }
    
    const mapped = selectedInterests.value.map(interest => {
      const survey = interestToSurveyMapping[interest]
      return survey
    })
    const filtered = mapped.filter(survey => survey !== undefined && survey !== null)
    
    // 여성일 때는 월경 설문을 자동으로 포함
    if (basicInfo.gender === 'F' && !filtered.includes('menstrual')) {
      filtered.push('menstrual')
    }
    
    return filtered
  } catch (error) {
    console.error('Error in selectedSurveys computed:', error)
    return []
  }
})

// 설문 데이터 - 실제 구조로 변경
const surveyData = reactive({
  // 관심 건강분야
  interestHealth: {
    basicsId: '',
    interests: []
  },
  // 기억력
  memory: {
    basicsId: '',
    msq01: null,
    msq02: null,
    msq03: null,
    msq04: null,
    msq05: null,
    msq06: null,
    msq07: null,
    msq08: null,
    msq09: null,
    msq10: null
  },
  // 눈
  eye: {
    basicsId: '',
    esq01: null,
    esq02: null,
    esq03: null,
    esq04: null,
    esq05: null,
    esq06: null,
    esq07: null,
    esq08: null,
    esq09: null,
    esq10: null
  },
  // 코 과민반응
  nose: {
    basicsId: '',
    nsq01: null,
    nsq02: null,
    nsq03: null,
    nsq04: null,
    nsq05: null,
    nsq06: null,
    nsq07: null,
    nsq08: null,
    nsq09: null,
    nsq10: null
  },
  // 위
  stomach: {
    basicsId: '',
    ssq01: null,
    ssq02: null,
    ssq03: null,
    ssq04: null,
    ssq05: null,
    ssq06: null,
    ssq07: null,
    ssq08: null,
    ssq09: null,
    ssq10: null
  },
  // 장
  intestine: {
    basicsId: '',
    isq01: null,
    isq02: null,
    isq03: null,
    isq04: null,
    isq05: null,
    isq06: null,
    isq07: null,
    isq08: null,
    isq09: null,
    isq10: null
  },
  // 관절, 뼈
  jointBone: {
    basicsId: '',
    jbsq01: null,
    jbsq02: null,
    jbsq03: null,
    jbsq04: null,
    jbsq05: null,
    jbsq06: null,
    jbsq07: null,
    jbsq08: null,
    jbsq09: null,
    jbsq10: null,
    jbsq11: null,
    jbsq12: null,
    jbsq13: null,
    jbsq14: null,
    jbsq15: null,
    jbsq16: null,
    jbsq17: null,
    jbsq18: null,
    jbsq19: null,
    jbsq20: null,
    jbsq21: null,
    jbsq22: null,
    jbsq23: null,
    jbsq24: null,
    jbsq25: null,
    jbsq26: null,
    jbsq27: null,
    jbsq28: null,
    jbsq29: null,
    jbsq30: null,
    jbsq31: null,
    jbsq32: null
  },
  // 면역
  immunity: {
    basicsId: '',
    imsq01: null,
    imsq02: null,
    imsq03: null,
    imsq04: null,
    imsq05: null,
    imsq06: null,
    imsq07: null,
    imsq08: null,
    imsq09: null,
    imsq10: null
  },
  // 갱년기
  menopause: {
    basicsId: '',
    mpsq01: null,
    mpsq02: null,
    mpsq03: null,
    mpsq04: null,
    mpsq05: null,
    mpsq06: null,
    mpsq07: null,
    mpsq08: null,
    mpsq09: null,
    mpsq10: null,
    mpsq11: null,
    mpsq12: null
  },
  // 전립선
  prostate: {
    basicsId: '',
    psq01: null,
    psq02: null,
    psq03: null,
    psq04: null,
    psq05: null,
    psq06: null,
    psq07: null
  },
  // 월경
  menstrual: {
    basicsId: '',
    mesq01: null
  },
  // 삶의 질
  life: {
    basicsId: '',
    lsq01: null,
    lsq02: null,
    lsq03: null,
    lsq04: null,
    lsq05: null,
    lsq06: null
  },
  // 운동습관
  physical: {
    basicsId: '',
    activInts: null,
    activIntsTime: null,
    activMod: null,
    activModTime: null,
    activWalk: null,
    activWalkTime: null
  },
  // 음주, 흡연, 수면, 물섭취
  fourPowers: {
    basicsId: '',
    fpsq01: null,
    fpsq02: null,
    fpsq03: null,
    fpsq04: null
  },
  // 복약
  drug: {
    basicsId: '',
    drugMemory: false,
    drugTension: false,
    drugSleep: false,
    drugTired: false,
    drugEye: false,
    drugSkin: false,
    drugStomach: false,
    drugLiver: false,
    drugIntestine: false,
    drugBodyfat: false,
    drugTG: false,
    drugTC: false,
    drugBP: false,
    drugBF: false,
    drugGLU: false,
    drugMen: false,
    drugBJ: false,
    drugMuscle: false,
    drugAtopy: false,
    drugImmune: false
  },
  // 식이
  dq: {
    basicsId: '',
    dqsq01: null,
    dqsq02_01: false,
    dqsq02_02: false,
    dqsq02_03: false,
    dqsq02_04: false,
    dqsq02_05: false,
    dqsq02_06: false,
    dqsq02_07: false,
    dqsq02_08: false,
    dqsq02_09: false,
    dqsq02_10: false,
    dqsq02_11: false,
    dqsq02_12: false,
    dqsq02_13: false,
    dqsq02_14: false,
    dqsq02_15: false,
    dqsq02_16: false,
    dqsq02_17: false,
    dqsq02_18: false,
    dqsq02_19: false,
    dqsq02_20: false,
    dqsq02_21: false,
    dqsq02_22: false,
    dqsq02_23: false,
    dqsq02_24: false,
    dqsq02_25: false,
    dqsq02_26: false,
    dqsq02_27: false,
    dqsq02_28: false,
    dqsq02_29: false,
    dqsq02_30: false,
    dqsq02_31: false,
    dqsq02_32: false,
    dqsq02_33: false,
    dqsq02_34: false,
    dqsq02_35: false,
    dqsq02_36: false,
    dqsq02_37: false,
    dqsq02_38: false,
    dqsq02_39: false,
    dqsq02_40: false,
    dqsq02_41: false,
    dqsq02_42: false,
    dqsq02_43: false,
    dqsq02_44: false,
    dqsq02_45: false,
    dqsq02_46: false
  },
  // 수면
  sh: {
    basicsId: '',
    shsq01: null,
    shsq02: null,
    shsq03: null,
    shsq04: null,
    shsq05: null,
    shsq06: null,
    shsq07: null,
    shsq08: null,
    shsq09: null,
    shsq10: null,
    shsq11: null,
    shsq12: null,
    shsq13: null,
    shsq14: null,
    shsq15: null
  }
})

const isLoading = ref(false)
const analysisResult = ref(null)

// 설문 질문 목록 생성
const createQuestionList = (prefix, count, textPrefix, startIndex = 2) => {
  return Array.from({ length: count }, (_, i) => ({
    key: `${prefix}${String(i + 1).padStart(2, '0')}`,
    label: t(`${textPrefix}.text${i + startIndex}`)
  }))
}

// 답변 옵션 생성
const createAnswerOptions = (textPrefix) => {
  return [
    { label: t(`${textPrefix}.text12`), value: 0 },
    { label: t(`${textPrefix}.text13`), value: 1 },
    { label: t(`${textPrefix}.text14`), value: 2 },
    { label: t(`${textPrefix}.text15`), value: 3 }
  ]
}

// 각 설문의 질문 목록
const eyeQuestions = createQuestionList('esq', 10, 'CheckupEye')
const memoryQuestions = createQuestionList('msq', 10, 'CheckupMemory', 3)
const noseQuestions = createQuestionList('nsq', 10, 'CheckupNoseHypersensitivity')
const stomachQuestions = createQuestionList('ssq', 10, 'CheckupStomach', 1)
// 장 설문 질문 목록 (수동 정의)
const intestineQuestions = [
  { key: 'isq01', label: t('CheckupIntestine.text4') },
  { key: 'isq02', label: t('CheckupIntestine.text5') },
  { key: 'isq03', label: t('CheckupIntestine.text6') },
  { key: 'isq04', label: t('CheckupIntestine.text7') },
  { key: 'isq05', label: t('CheckupIntestine.text8') },
  { key: 'isq06', label: t('CheckupIntestine.text9') },
  { key: 'isq07', label: t('CheckupIntestine.text10') },
  { key: 'isq08', label: t('CheckupIntestine.text13') } // 대변 모양 질문
]
// 관절, 뼈 설문 질문 목록 (수동 정의)
const jointBoneQuestions = [
  // 첫 번째 섹션 (text4-8)
  { key: 'jbsq01', label: t('CheckupJointAndBone.text4') },
  { key: 'jbsq02', label: t('CheckupJointAndBone.text5') },
  { key: 'jbsq03', label: t('CheckupJointAndBone.text6') },
  { key: 'jbsq04', label: t('CheckupJointAndBone.text7') },
  { key: 'jbsq05', label: t('CheckupJointAndBone.text8') },
  // 두 번째 섹션 (text14-16)
  { key: 'jbsq06', label: t('CheckupJointAndBone.text14') },
  { key: 'jbsq07', label: t('CheckupJointAndBone.text15') },
  { key: 'jbsq08', label: t('CheckupJointAndBone.text16') },
  // 세 번째 섹션 (text17-34)
  { key: 'jbsq09', label: t('CheckupJointAndBone.text17') },
  { key: 'jbsq10', label: t('CheckupJointAndBone.text18') },
  { key: 'jbsq11', label: t('CheckupJointAndBone.text19') },
  { key: 'jbsq12', label: t('CheckupJointAndBone.text20') },
  { key: 'jbsq13', label: t('CheckupJointAndBone.text21') },
  { key: 'jbsq14', label: t('CheckupJointAndBone.text22') },
  { key: 'jbsq15', label: t('CheckupJointAndBone.text23') },
  { key: 'jbsq16', label: t('CheckupJointAndBone.text24') },
  { key: 'jbsq17', label: t('CheckupJointAndBone.text25') },
  { key: 'jbsq18', label: t('CheckupJointAndBone.text26') },
  { key: 'jbsq19', label: t('CheckupJointAndBone.text27') },
  { key: 'jbsq20', label: t('CheckupJointAndBone.text28') },
  { key: 'jbsq21', label: t('CheckupJointAndBone.text29') },
  { key: 'jbsq22', label: t('CheckupJointAndBone.text30') },
  { key: 'jbsq23', label: t('CheckupJointAndBone.text31') },
  { key: 'jbsq24', label: t('CheckupJointAndBone.text32') },
  { key: 'jbsq25', label: t('CheckupJointAndBone.text33') },
  { key: 'jbsq26', label: t('CheckupJointAndBone.text34') }
]
const immunityQuestions = createQuestionList('imsq', 10, 'CheckupImmunity')
const menopauseQuestions = createQuestionList('mpsq', 12, 'CheckupMenopause', 4)
const prostateQuestions = createQuestionList('psq', 7, 'CheckupProstate', 1)
// 월경 설문 질문 목록 (수동 정의)
const menstrualQuestions = [
  { key: 'mesq01', label: t('CheckupMenstrual.text1') } // 현재 월경(생리, 달거리) 여부를 알려주세요!
]
// 삶의 질 설문 질문 목록 (수동 정의)
const lifeQuestions = [
  { key: 'lsq01', label: t('CheckupEq5d.text4') },  // 스트레스 질문
  { key: 'lsq02', label: t('CheckupEq5d.text9') },  // 걸을 때 지장
  { key: 'lsq03', label: t('CheckupEq5d.text10') }, // 목욕/옷입기 지장
  { key: 'lsq04', label: t('CheckupEq5d.text11') }, // 일상생활 지장
  { key: 'lsq05', label: t('CheckupEq5d.text12') }, // 통증
  { key: 'lsq06', label: t('CheckupEq5d.text13') }  // 불안/우울
]
// 운동습관 설문은 다른 구조를 가짐
const physicalQuestions = [
  {
    key: 'activInts',
    label: t('CheckupPhysicalActivity.text3')
  },
  {
    key: 'activIntsTime',
    label: t('CheckupPhysicalActivity.text13')
  },
  {
    key: 'activMod',
    label: t('CheckupPhysicalActivity.text16')
  },
  {
    key: 'activModTime',
    label: t('CheckupPhysicalActivity.text18')
  },
  {
    key: 'activWalk',
    label: t('CheckupPhysicalActivity.text19')
  },
  {
    key: 'activWalkTime',
    label: t('CheckupPhysicalActivity.text21')
  }
]
// 음주, 흡연, 수면, 물섭취 설문 질문 목록 (수동 정의)
const fourPowersQuestions = [
  { key: 'fpsq01', label: t('CheckupDrinkSmokeSleep.text2'), type: 'radio' },  // 음주를 하시나요?
  { key: 'fpsq02', label: t('CheckupDrinkSmokeSleep.text14'), type: 'radio' }, // 흡연 여부를 알려주세요!
  { key: 'fpsq03', label: t('CheckupDrinkSmokeSleep.text25'), type: 'number' }, // 수면시간 (시간)
  { key: 'fpsq04', label: t('CheckupDrinkSmokeSleep.text27'), type: 'number' }  // 물섭취 (컵)
]
// 복약 설문은 체크박스 형태
const drugQuestions = [
  { key: 'drugMemory', label: t('CheckupInterestHealth.text3') },
  { key: 'drugTension', label: t('CheckupInterestHealth.text4') },
  { key: 'drugSleep', label: t('CheckupInterestHealth.text5') },
  { key: 'drugTired', label: t('CheckupInterestHealth.text6') },
  { key: 'drugEye', label: t('CheckupInterestHealth.text7') },
  { key: 'drugSkin', label: t('CheckupInterestHealth.text8') },
  { key: 'drugStomach', label: t('CheckupInterestHealth.text9') },
  { key: 'drugLiver', label: t('CheckupInterestHealth.text10') },
  { key: 'drugIntestine', label: t('CheckupInterestHealth.text11') },
  { key: 'drugBodyfat', label: t('CheckupInterestHealth.text12') },
  { key: 'drugTG', label: t('CheckupInterestHealth.text13') },
  { key: 'drugTC', label: t('CheckupInterestHealth.text14') },
  { key: 'drugBP', label: t('CheckupInterestHealth.text15') },
  { key: 'drugBF', label: t('CheckupInterestHealth.text16') },
  { key: 'drugGLU', label: t('CheckupInterestHealth.text17') },
  { key: 'drugMen', label: t('CheckupInterestHealth.text18') },
  { key: 'drugBJ', label: t('CheckupInterestHealth.text20') },
  { key: 'drugMuscle', label: t('CheckupInterestHealth.text21') },
  { key: 'drugAtopy', label: t('CheckupInterestHealth.text22') },
  { key: 'drugImmune', label: t('CheckupInterestHealth.text23') }
]
// 식이 설문 질문 목록 (체크박스 형태)
const dqQuestions = [
  { key: 'dqsq01', label: t('CheckupDiet.text3'), type: 'radio' } // 하루 3끼 식사를 하시나요?
]

// 식이 설문 음식 항목들 (체크박스)
const dqFoodItems = [
  { key: 'dqsq02_01', label: t('CheckupDiet.text5') },   // 잡곡밥
  { key: 'dqsq02_02', label: t('CheckupDiet.text6') },   // 된장류
  { key: 'dqsq02_03', label: t('CheckupDiet.text7') },   // 콩반찬
  { key: 'dqsq02_04', label: t('CheckupDiet.text8') },   // 견과류
  { key: 'dqsq02_05', label: t('CheckupDiet.text9') },   // 두부
  { key: 'dqsq02_06', label: t('CheckupDiet.text10') },  // 두유
  { key: 'dqsq02_07', label: t('CheckupDiet.text11') },  // 우유
  { key: 'dqsq02_08', label: t('CheckupDiet.text12') },  // 요구르트/요플레
  { key: 'dqsq02_09', label: t('CheckupDiet.text13') },  // 치즈
  { key: 'dqsq02_10', label: t('CheckupDiet.text14') },  // 배추
  { key: 'dqsq02_11', label: t('CheckupDiet.text15') },  // 상추
  { key: 'dqsq02_12', label: t('CheckupDiet.text16') },  // 시금치
  { key: 'dqsq02_13', label: t('CheckupDiet.text17') },  // 들깻잎
  { key: 'dqsq02_14', label: t('CheckupDiet.text18') },  // 고추잎/참·취나물
  { key: 'dqsq02_15', label: t('CheckupDiet.text19') },  // 쑥갓/부추/미나리
  { key: 'dqsq02_16', label: t('CheckupDiet.text20') },  // 오이
  { key: 'dqsq02_17', label: t('CheckupDiet.text21') },  // 풋고추
  { key: 'dqsq02_18', label: t('CheckupDiet.text22') },  // 야채쌈/샐러드
  { key: 'dqsq02_19', label: t('CheckupDiet.text23') },  // 녹색 채소류
  { key: 'dqsq02_20', label: t('CheckupDiet.text24') },  // 양파
  { key: 'dqsq02_21', label: t('CheckupDiet.text25') },  // 콩나물/숙주
  { key: 'dqsq02_22', label: t('CheckupDiet.text26') },  // 당근/당근쥬스
  { key: 'dqsq02_23', label: t('CheckupDiet.text27') },  // 애호박
  { key: 'dqsq02_24', label: t('CheckupDiet.text28') },  // 늙은호박/호박즙
  { key: 'dqsq02_25', label: t('CheckupDiet.text29') },  // 느타리버섯
  { key: 'dqsq02_26', label: t('CheckupDiet.text30') },  // 기타 버섯
  { key: 'dqsq02_27', label: t('CheckupDiet.text31') },  // 김
  { key: 'dqsq02_28', label: t('CheckupDiet.text32') },  // 다시마/미역
  { key: 'dqsq02_29', label: t('CheckupDiet.text33') },  // 멸치/멸치볶음
  { key: 'dqsq02_30', label: t('CheckupDiet.text34') },  // 명태/동태/북어
  { key: 'dqsq02_31', label: t('CheckupDiet.text35') },  // 등푸른 생선
  { key: 'dqsq02_32', label: t('CheckupDiet.text36') },  // 조기/도미/가자미
  { key: 'dqsq02_33', label: t('CheckupDiet.text37') },  // 갈치
  { key: 'dqsq02_34', label: t('CheckupDiet.text38') },  // 수박
  { key: 'dqsq02_35', label: t('CheckupDiet.text39') },  // 참외/멜론
  { key: 'dqsq02_36', label: t('CheckupDiet.text40') },  // 사과
  { key: 'dqsq02_37', label: t('CheckupDiet.text41') },  // 배/배즙
  { key: 'dqsq02_38', label: t('CheckupDiet.text42') },  // 딸기
  { key: 'dqsq02_39', label: t('CheckupDiet.text43') },  // 바나나
  { key: 'dqsq02_40', label: t('CheckupDiet.text44') },  // 복숭아/자두
  { key: 'dqsq02_41', label: t('CheckupDiet.text45') },  // 감/곶감
  { key: 'dqsq02_42', label: t('CheckupDiet.text46') },  // 포도
  { key: 'dqsq02_43', label: t('CheckupDiet.text47') },  // 귤
  { key: 'dqsq02_44', label: t('CheckupDiet.text48') },  // 오렌지
  { key: 'dqsq02_45', label: t('CheckupDiet.text49') },  // (방울)토마토
  { key: 'dqsq02_46', label: t('CheckupDiet.text50') }   // 녹차
]
const shQuestions = createQuestionList('shsq', 15, 'CheckupSleep')

// 각 설문의 답변 옵션
const eyeAnswers = createAnswerOptions('CheckupEye')
// 기억력 설문 답변 옵션 (예/아니요)
const memoryAnswers = [
  { label: t('Common.no'), value: 0 },
  { label: t('Common.yes'), value: 1 }
]
// 코 과민반응 설문 답변 옵션
const noseAnswers = [
  { label: t('Common.no'), value: 0 },
  { label: t('Common.yes'), value: 1 }
]
// 위 설문 답변 옵션 (증상 없음, 가벼운, 중간, 심함, 매우 심함)
const stomachAnswers = [
  { label: t('CheckupStomach.text11'), value: 0 }, // 증상 없음
  { label: t('CheckupStomach.text12'), value: 1 }, // 가벼운
  { label: t('CheckupStomach.text13'), value: 2 }, // 중간
  { label: t('CheckupStomach.text14'), value: 3 }, // 심함
  { label: t('CheckupStomach.text15'), value: 4 }  // 매우 심함
]
// 장 설문 답변 옵션 (질문 1-6용)
const intestineAnswers = [
  { label: t('CheckupIntestine.text11'), value: 0 }, // 전혀 아니거나 거의 드물다 (25% 미만)
  { label: t('CheckupIntestine.text12'), value: 1 }  // 가끔 또는 항상 그렇다 (25% 초과)
]

// 장 설문 대변 모양 답변 옵션 (질문 7용)
const intestineShapeAnswers = [
  { label: t('CheckupIntestine.text16'), value: 1 }, // 단단해서 알갱이 같다
  { label: t('CheckupIntestine.text17'), value: 2 }, // 단단해서 알갱이 같지만 한 덩어리다
  { label: t('CheckupIntestine.text18'), value: 3 }, // 소시지처럼 한 덩어리나 표면이 갈라졌다
  { label: t('CheckupIntestine.text19'), value: 4 }, // 소시지처럼 한 덩어리나 매끈하고 부드럽다
  { label: t('CheckupIntestine.text20'), value: 5 }, // 부드러운 여러 개의 덩어리이다
  { label: t('CheckupIntestine.text21'), value: 6 }, // 무른 대변으로 변기에 흩어진다
  { label: t('CheckupIntestine.text22'), value: 7 }  // 물과 같은 변이다
]
// 관절, 뼈 설문 답변 옵션
const jointBoneAnswers = [
  { label: t('CheckupJointAndBone.text9'), value: 0 },
  { label: t('CheckupJointAndBone.text10'), value: 1 },
  { label: t('CheckupJointAndBone.text11'), value: 2 },
  { label: t('CheckupJointAndBone.text12'), value: 3 },
  { label: t('CheckupJointAndBone.text13'), value: 4 }
]
// 면역 설문 답변 옵션
const immunityAnswers = [
  { label: '아니요', value: 0 },
  { label: '예', value: 1 }
]
// 갱년기 설문 답변 옵션
const menopauseAnswers = [
  { label: t('CheckupMenopause.text16'), value: 0 },
  { label: t('CheckupMenopause.text17'), value: 1 },
  { label: t('CheckupMenopause.text18'), value: 2 },
  { label: t('CheckupMenopause.text19'), value: 3 }
]

// 전립선 설문 답변 옵션 (질문 1-6용)
const prostateAnswers = [
  { label: t('CheckupProstate.text14'), value: 0 }, // 전혀 없음
  { label: t('CheckupProstate.text15'), value: 1 }, // 5번 중 한 번
  { label: t('CheckupProstate.text16'), value: 2 }, // 5번 중 1~2번
  { label: t('CheckupProstate.text17'), value: 3 }, // 5번 중 2~3번
  { label: t('CheckupProstate.text18'), value: 4 }, // 5번 중 3~4번
  { label: t('CheckupProstate.text19'), value: 5 }  // 거의 항상
]

// 전립선 설문 야간 소변 횟수 답변 옵션 (질문 7용)
const prostateNightAnswers = [
  { label: t('CheckupProstate.text8'), value: 0 },  // 없다
  { label: t('CheckupProstate.text9'), value: 1 },  // 1번
  { label: t('CheckupProstate.text10'), value: 2 }, // 2번
  { label: t('CheckupProstate.text11'), value: 3 }, // 3번
  { label: t('CheckupProstate.text12'), value: 4 }, // 4번
  { label: t('CheckupProstate.text13'), value: 5 }  // 5번
]
// 월경 설문 답변 옵션
const menstrualAnswers = [
  { label: t('CheckupMenstrual.text4'), value: 0 }, // 생리(월경 중)
  { label: t('CheckupMenstrual.text5'), value: 1 }, // 생리(6개월 내 자녀계획 있음)
  { label: t('CheckupMenstrual.text6'), value: 2 }, // 임신 중
  { label: t('CheckupMenstrual.text7'), value: 3 }, // 수유 중
  { label: t('CheckupMenstrual.text8'), value: 4 }, // 폐경기(불규칙한 월경 주기 및 마지막 생리 후 1년 이내)
  { label: t('CheckupMenstrual.text9'), value: 5 }, // 폐경 (마지막 생리 후 1년 이상 지남)
  { label: t('CheckupMenstrual.text10'), value: 6 } // 인공 폐경
]
// 삶의 질 설문 답변 옵션 (첫 번째 질문용)
const lifeStressAnswers = [
  { label: t('CheckupEq5d.text5'), value: 0 }, // 거의 없다
  { label: t('CheckupEq5d.text6'), value: 1 }, // 조금 있다
  { label: t('CheckupEq5d.text7'), value: 2 }, // 많이 있다
  { label: t('CheckupEq5d.text8'), value: 3 }  // 대단히 있다
]

// 삶의 질 설문 답변 옵션 (나머지 질문용 - 예/아니요)
const lifeAnswers = [
  { label: t('Common.no'), value: 0 }, // 아니요
  { label: t('Common.yes'), value: 1 }  // 예
]
// 운동습관 답변 옵션
const physicalAnswers = [
  { label: t('CheckupPhysicalActivity.text5'), value: 0 },
  { label: t('CheckupPhysicalActivity.text6'), value: 1 },
  { label: t('CheckupPhysicalActivity.text7'), value: 2 },
  { label: t('CheckupPhysicalActivity.text8'), value: 3 },
  { label: t('CheckupPhysicalActivity.text9'), value: 4 },
  { label: t('CheckupPhysicalActivity.text10'), value: 5 },
  { label: t('CheckupPhysicalActivity.text11'), value: 6 },
  { label: t('CheckupPhysicalActivity.text12'), value: 7 }
]
// 음주, 흡연, 수면, 물섭취 설문 답변 옵션
const fourPowersAnswers = [
  { label: t('Common.no'), value: 0 }, // 아니요
  { label: t('Common.yes'), value: 1 }  // 예
]
// 식이 설문 답변 옵션 (예/아니요)
const dqAnswers = [
  { label: t('Common.no'), value: 0 }, // 아니요
  { label: t('Common.yes'), value: 1 }  // 예
]
// 수면 설문 답변 옵션
const shAnswers = [
  { label: t('CheckupSleep.text18'), value: 0 },
  { label: t('CheckupSleep.text19'), value: 1 },
  { label: t('CheckupSleep.text20'), value: 2 },
  { label: t('CheckupSleep.text21'), value: 3 }
]

// 인증 상태 확인
const checkAuthStatus = () => {
  const token = store.getters.getToken
  if (!token) {
    alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.')
    router.push('/login')
    return false
  }
  return true
}

// 인증 상태 계산 속성
const isAuthenticated = computed(() => {
  return !!store.getters.getToken
})

// 분석 실행
const runAnalysis = async () => {
  // 인증 체크
  if (!checkAuthStatus()) {
    return
  }

  if (!validateData()) {
    alert('필수 데이터를 모두 입력해주세요.')
    return
  }

  isLoading.value = true
  
  try {
    // 1. 기본 정보 저장 (검진일 포함)
    // CheckupBasics와 동일한 구조로 데이터 변환
    const basicInfoWithDate = {
      ...basicInfo,
      checkDate: bloodData.checkDate,
      // 필드명 매핑
      sex: basicInfo.gender === 'M' ? 1 : 2,  // gender -> sex 변환
      wc: basicInfo.waist,                    // waist -> wc 변환
      // CheckupBasics와 동일한 추가 필드들
      id: null,
      commonId: null,
      bmi: null,
      healthDataName: '',
      healthDataType: 'normal',
      birthDate: '',
      createdDate: '',
      modifiedDate: ''
    }
    
    // 백엔드가 기대하는 구조로 데이터 래핑
    const requestData = {
      basics: basicInfoWithDate
    }

    // 디버깅: 전송할 데이터 로그
    console.log('전송할 기본 정보:', basicInfoWithDate)
    console.log('백엔드 요청 데이터 구조:', requestData)
    console.log('기본 정보 필드 확인:', {
      name: basicInfoWithDate.name,
      ht: basicInfoWithDate.ht,
      wt: basicInfoWithDate.wt,
      age: basicInfoWithDate.age,
      sex: basicInfoWithDate.sex,
      wc: basicInfoWithDate.wc,
      sbp: basicInfoWithDate.sbp,
      dbp: basicInfoWithDate.dbp,
      checkDate: basicInfoWithDate.checkDate
    })

    // 필수 필드 검증
    const requiredFields = ['name', 'ht', 'wt', 'age', 'sex', 'checkDate']
    const missingFields = requiredFields.filter(field => !basicInfoWithDate[field])

    if (missingFields.length > 0) {
      throw new Error(`필수 필드가 누락되었습니다: ${missingFields.join(', ')}`)
    }

    // API 요청 URL 확인 (PUT 메서드로 변경됨)
    console.log('API 요청 URL (PUT):', `/v1/api/user/survey/basics/temporary/normal/third-party-agree/Y`)
    console.log('API 요청 데이터:', JSON.stringify(requestData, null, 2))

    const basicResponse = await checkupApi.setBasicsTemporary('normal', 'Y', requestData)
    const basicsId = basicResponse.data?.basicsId
    
    if (!basicsId) {
      throw new Error('기본 정보 저장 실패')
    }

    // 2. 혈액 데이터 저장
    await checkupApi.setBloodTemporary({
      basicsId,
      ...bloodData
    })

    // 3. 체성분 데이터 저장
    await checkupApi.setInbodyTemporary({
      inbody: {
        basicsId,
        connectType: 'CUSTOM',
        ht: parseFloat(basicInfo.ht),
        wt: parseFloat(basicInfo.wt),
        wbtBfMass: parseFloat(bodyComposition.bfm) || 0,
        wbtBfPercent: parseFloat(bodyComposition.pbf) || 0,
        wbtSmMass: parseFloat(bodyComposition.smm) || 0,
        ramMass: parseFloat(bodyComposition.ram) || 0,
        lamMass: parseFloat(bodyComposition.lam) || 0,
        trkMass: parseFloat(bodyComposition.trk) || 0,
        rlmMass: parseFloat(bodyComposition.rlm) || 0,
        llmMass: parseFloat(bodyComposition.llm) || 0,
        ramPercent: parseFloat(bodyComposition.pilra) || 0,
        lamPercent: parseFloat(bodyComposition.pilla) || 0,
        trkPercent: parseFloat(bodyComposition.pilt) || 0,
        rlmPercent: parseFloat(bodyComposition.pilrl) || 0,
        llmPercent: parseFloat(bodyComposition.pilll) || 0
      }
    })

    // 4. 설문 데이터 저장 (선택된 관심 건강분야에 해당하는 설문만)
    // 관심 건강분야
    if (surveyData.interestHealth.interests.length > 0) {
      await checkupApi.setInterestHealthTemporary({
        basicsId,
        interests: surveyData.interestHealth.interests
      })
    }

    // 선택된 설문만 저장
    for (const surveyKey of selectedSurveys.value) {
      switch (surveyKey) {
        case 'memory':
          await checkupApi.setMemoryTemporary({
            memory: {
              ...surveyData.memory,
              basicsId
            }
          })
          break
        case 'eye':
          await checkupApi.setEyeTemporary({
            eye: {
              ...surveyData.eye,
              basicsId
            }
          })
          break
        case 'nose':
          await checkupApi.setNoseTemporary({
            nose: {
              ...surveyData.nose,
              basicsId
            }
          })
          break
        case 'stomach':
          await checkupApi.setStomachTemporary({
            stomach: {
              ...surveyData.stomach,
              basicsId
            }
          })
          break
        case 'intestine':
          await checkupApi.setIntestineTemporary({
            intestine: {
              ...surveyData.intestine,
              basicsId
            }
          })
          break
        case 'jointBone':
          await checkupApi.setJoinAndBoneTemporary({
            jointBone: {
              ...surveyData.jointBone,
              basicsId
            }
          })
          break
        case 'immunity':
          await checkupApi.setImmunityTemporary({
            immunity: {
              ...surveyData.immunity,
              basicsId
            }
          })
          break
        case 'menopause':
          await checkupApi.setMenopauseTemporary({
            menopause: {
              ...surveyData.menopause,
              basicsId
            }
          })
          break
        case 'prostate':
          await checkupApi.setProstateTemporary({
            prostate: {
              ...surveyData.prostate,
              basicsId
            }
          })
          break
        case 'menstrual':
          await checkupApi.setMenstrualTemporary({
            menstrual: {
              ...surveyData.menstrual,
              basicsId
            }
          })
          break
        case 'life':
          await checkupApi.setLifeTemporary({
            life: {
              ...surveyData.life,
              basicsId
            }
          })
          break
        case 'physical':
          await checkupApi.setPhysicalTemporary({
            physical: {
              ...surveyData.physical,
              basicsId
            }
          })
          break
        case 'fourPowers':
          await checkupApi.setFourPowersTemporary({
            fourPowers: {
              ...surveyData.fourPowers,
              basicsId
            }
          })
          break
        case 'drug':
          await checkupApi.setDrugTemporary({
            drug: {
              ...surveyData.drug,
              basicsId
            }
          })
          break
        case 'dq':
          await checkupApi.setDqTemporary({
            dq: {
              ...surveyData.dq,
              basicsId
            }
          })
          break
        case 'sh':
          await checkupApi.setShTemporary({
            sh: {
              ...surveyData.sh,
              basicsId
            }
          })
          break
      }
    }

    // 5. 분석 실행
    const analysisResponse = await analysisApi.runAnalysis(basicsId)
    analysisResult.value = analysisResponse.data
    
    alert('분석이 완료되었습니다!')
    
  } catch (error) {
    console.error('분석 실패:', error)
    
    // 상세한 에러 처리
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          alert('인증이 만료되었습니다. 다시 로그인해주세요.')
          router.push('/login')
          break
        case 400:
          console.error('400 에러 상세 정보:', data)
          alert('요청 데이터에 문제가 있습니다. 입력값을 확인해주세요.')
          break
        case 500:
          alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
          break
        default:
          alert('분석에 실패했습니다: ' + (data?.message || error.message))
      }
    } else if (error.request) {
      alert('네트워크 연결을 확인해주세요.')
    } else {
      alert('분석에 실패했습니다: ' + error.message)
    }
  } finally {
    isLoading.value = false
  }
}

// 데이터 검증
const validateData = () => {
  const errors = []
  
  // 기본 정보 검증
  if (!basicInfo.ht) errors.push({ field: 'basicInfo.ht', message: '키를 입력해주세요.' })
  if (!basicInfo.wt) errors.push({ field: 'basicInfo.wt', message: '몸무게를 입력해주세요.' })
  if (!basicInfo.age) errors.push({ field: 'basicInfo.age', message: '나이를 입력해주세요.' })
  if (!basicInfo.gender) errors.push({ field: 'basicInfo.gender', message: '성별을 선택해주세요.' })
  if (!basicInfo.waist) errors.push({ field: 'basicInfo.waist', message: '허리둘레를 입력해주세요.' })
  if (!basicInfo.sbp) errors.push({ field: 'basicInfo.sbp', message: '수축기 혈압을 입력해주세요.' })
  if (!basicInfo.dbp) errors.push({ field: 'basicInfo.dbp', message: '이완기 혈압을 입력해주세요.' })
  
  // 혈액 검사 데이터 검증
  if (!bloodData.hb) errors.push({ field: 'bloodData.hb', message: '혈색소를 입력해주세요.' })
  if (!bloodData.glu) errors.push({ field: 'bloodData.glu', message: '공복혈당을 입력해주세요.' })
  if (!bloodData.crea) errors.push({ field: 'bloodData.crea', message: '혈청 크레아티닌을 입력해주세요.' })
  if (!bloodData.got) errors.push({ field: 'bloodData.got', message: '아스파테이트 아미노전이효소를 입력해주세요.' })
  if (!bloodData.gpt) errors.push({ field: 'bloodData.gpt', message: '알라닌 아미노전이효소를 입력해주세요.' })
  if (!bloodData.tc) errors.push({ field: 'bloodData.tc', message: '총 콜레스테롤을 입력해주세요.' })
  if (!bloodData.hdl) errors.push({ field: 'bloodData.hdl', message: '고밀도 콜레스테롤을 입력해주세요.' })
  if (!bloodData.tg) errors.push({ field: 'bloodData.tg', message: '중성지방을 입력해주세요.' })
  if (!bloodData.ldl) errors.push({ field: 'bloodData.ldl', message: '저밀도 콜레스테롤을 입력해주세요.' })
  
  // 체성분 데이터 검증
  if (!bodyComposition.bfm) errors.push({ field: 'bodyComposition.bfm', message: '체지방량을 입력해주세요.' })
  if (!bodyComposition.pbf) errors.push({ field: 'bodyComposition.pbf', message: '체지방률을 입력해주세요.' })
  if (!bodyComposition.smm) errors.push({ field: 'bodyComposition.smm', message: '골격근량을 입력해주세요.' })
  
  // 관심 건강분야 검증
  if (selectedInterests.value.length === 0) {
    errors.push({ field: 'selectedInterests', message: '관심 건강분야를 최소 1개 이상 선택해주세요.' })
  }
  
  if (errors.length > 0) {
    // 첫 번째 오류 필드로 포커스 이동
    const firstError = errors[0]
    if (firstError.field !== 'selectedInterests') {
      nextTick(() => {
        const field = document.querySelector(`[data-field="${firstError.field}"]`)
        if (field) {
          field.focus()
          field.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      })
    }
    
    // 오류 메시지 표시
    const errorMessages = errors.map(e => e.message).join('\n')
    alert(`다음 항목들을 확인해주세요:\n\n${errorMessages}`)
    return false
  }
  
  return true
}

// 컴포넌트 마운트 시 인증 상태 확인
onMounted(() => {
  checkAuthStatus()
})

// 결과 페이지로 이동
const goToResult = () => {
  if (analysisResult.value?.id) {
    router.push({ 
      name: 'AnalyzeDetail', 
      query: { id: analysisResult.value.id }
    })
  }
}

// 데이터 초기화
const resetData = () => {
  Object.keys(basicInfo).forEach(key => basicInfo[key] = '')
  Object.keys(bloodData).forEach(key => bloodData[key] = '')
  Object.keys(bodyComposition).forEach(key => bodyComposition[key] = '')
  
  // 설문 데이터 초기화
  Object.keys(surveyData).forEach(category => {
    if (category === 'interestHealth') {
      surveyData[category].interests = []
    } else {
      surveyData[category].basicsId = ''
      // 각 설문의 질문들 초기화
      Object.keys(surveyData[category]).forEach(key => {
        if (key !== 'basicsId' && key !== 'interests') {
          surveyData[category][key] = null
        }
      })
    }
  })
  
  analysisResult.value = null
}
</script>

<template>
  <div class="test-analysis">
    <!-- 인증 상태 표시 -->
    <div class="auth-status" :class="{ 'authenticated': isAuthenticated, 'not-authenticated': !isAuthenticated }">
      <span v-if="isAuthenticated">✅ 로그인됨</span>
      <span v-else>❌ 로그인 필요</span>
    </div>
    
    <h1>테스트 분석 페이지</h1>
    
    <div class="analysis-container">
      <!-- 기본 정보 -->
      <section class="data-section">
        <div class="section-header">
          <h2>기본 정보</h2>
          <button @click="autoFillBasicInfo" type="button" class="auto-fill-btn">자동 입력</button>
        </div>
        <div class="basic-grid">
          <div class="form-group">
            <label>키 (cm):</label>
            <input v-model="basicInfo.ht" type="number" placeholder="170" data-field="basicInfo.ht" />
          </div>
          <div class="form-group">
            <label>몸무게 (kg):</label>
            <input v-model="basicInfo.wt" type="number" placeholder="70" data-field="basicInfo.wt" />
          </div>
          <div class="form-group">
            <label>나이:</label>
            <input v-model="basicInfo.age" type="number" placeholder="30" data-field="basicInfo.age" />
          </div>
          <div class="form-group">
            <label>성별:</label>
            <select v-model="basicInfo.gender" data-field="basicInfo.gender">
              <option value="M">남성</option>
              <option value="F">여성</option>
            </select>
          </div>
          <div class="form-group">
            <label>허리둘레 (cm):</label>
            <input v-model="basicInfo.waist" type="number" placeholder="80" data-field="basicInfo.waist" />
          </div>
          <div class="form-group">
            <label>수축기 혈압 (mmHg):</label>
            <input v-model="basicInfo.sbp" type="number" placeholder="120" data-field="basicInfo.sbp" />
          </div>
          <div class="form-group">
            <label>이완기 혈압 (mmHg):</label>
            <input v-model="basicInfo.dbp" type="number" placeholder="80" data-field="basicInfo.dbp" />
          </div>
        </div>
      </section>

      <!-- 혈액 검사 데이터 -->
      <section class="data-section">
        <div class="section-header">
          <h2>혈액 검사 데이터</h2>
          <button @click="autoFillBloodData" type="button" class="auto-fill-btn">자동 입력</button>
        </div>
        <div class="blood-grid">
          <div class="form-group">
            <label>혈색소 (g/dL):</label>
            <input v-model="bloodData.hb" type="number" placeholder="14" data-field="bloodData.hb" />
          </div>
          <div class="form-group">
            <label>공복혈당 (mg/dL):</label>
            <input v-model="bloodData.glu" type="number" placeholder="100" data-field="bloodData.glu" />
          </div>
          <div class="form-group">
            <label>혈청 크레아티닌 (mg/dL):</label>
            <input v-model="bloodData.crea" type="number" placeholder="1.0" data-field="bloodData.crea" />
          </div>
          <div class="form-group">
            <label>아스파테이트 아미노전이효소 (AST, U/L):</label>
            <input v-model="bloodData.got" type="number" placeholder="25" data-field="bloodData.got" />
          </div>
          <div class="form-group">
            <label>알라닌 아미노전이효소 (ALT, U/L):</label>
            <input v-model="bloodData.gpt" type="number" placeholder="25" data-field="bloodData.gpt" />
          </div>
          <div class="form-group">
            <label>총 콜레스테롤 (mg/dL):</label>
            <input v-model="bloodData.tc" type="number" placeholder="200" data-field="bloodData.tc" />
          </div>
          <div class="form-group">
            <label>고밀도 콜레스테롤 (HDL, mg/dL):</label>
            <input v-model="bloodData.hdl" type="number" placeholder="50" data-field="bloodData.hdl" />
          </div>
          <div class="form-group">
            <label>중성지방 (mg/dL):</label>
            <input v-model="bloodData.tg" type="number" placeholder="150" data-field="bloodData.tg" />
          </div>
          <div class="form-group">
            <label>저밀도 콜레스테롤 (LDL, mg/dL):</label>
            <input v-model="bloodData.ldl" type="number" placeholder="130" data-field="bloodData.ldl" />
          </div>
          <div class="form-group">
            <label>검진일:</label>
            <input v-model="bloodData.checkDate" type="date" />
          </div>
        </div>
      </section>

      <!-- 체성분 데이터 -->
      <section class="data-section">
        <div class="section-header">
          <h2>체성분 데이터</h2>
          <button @click="autoFillBodyComposition" type="button" class="auto-fill-btn">자동 입력</button>
        </div>
        <div class="body-composition-grid">
          <div class="form-group">
            <label>체지방량 (kg):</label>
            <input v-model="bodyComposition.bfm" type="number" placeholder="20" data-field="bodyComposition.bfm" />
          </div>
          <div class="form-group">
            <label>체지방률 (%):</label>
            <input v-model="bodyComposition.pbf" type="number" placeholder="25" data-field="bodyComposition.pbf" />
          </div>
          <div class="form-group">
            <label>골격근량 (kg):</label>
            <input v-model="bodyComposition.smm" type="number" placeholder="30" data-field="bodyComposition.smm" />
          </div>
          <div class="form-group">
            <label>우측 팔 근육량 (kg):</label>
            <input v-model="bodyComposition.ram" type="number" placeholder="3" />
          </div>
          <div class="form-group">
            <label>좌측 팔 근육량 (kg):</label>
            <input v-model="bodyComposition.lam" type="number" placeholder="3" />
          </div>
          <div class="form-group">
            <label>몸통 근육량 (kg):</label>
            <input v-model="bodyComposition.trk" type="number" placeholder="15" />
          </div>
          <div class="form-group">
            <label>우측 다리 근육량 (kg):</label>
            <input v-model="bodyComposition.rlm" type="number" placeholder="8" />
          </div>
          <div class="form-group">
            <label>좌측 다리 근육량 (kg):</label>
            <input v-model="bodyComposition.llm" type="number" placeholder="8" />
          </div>
          <div class="form-group">
            <label>우측 팔 근육률 (%):</label>
            <input v-model="bodyComposition.pilra" type="number" placeholder="50" />
          </div>
          <div class="form-group">
            <label>좌측 팔 근육률 (%):</label>
            <input v-model="bodyComposition.pilla" type="number" placeholder="50" />
          </div>
          <div class="form-group">
            <label>몸통 근육률 (%):</label>
            <input v-model="bodyComposition.pilt" type="number" placeholder="40" />
          </div>
          <div class="form-group">
            <label>우측 다리 근육률 (%):</label>
            <input v-model="bodyComposition.pilrl" type="number" placeholder="45" />
          </div>
          <div class="form-group">
            <label>좌측 다리 근육률 (%):</label>
            <input v-model="bodyComposition.pilll" type="number" placeholder="45" />
          </div>
        </div>
      </section>

      <!-- 관심 건강분야 선택 -->
      <section class="data-section">
        <h2>관심 건강분야 선택 (최대 3개)</h2>
        <div class="interest-grid">
          <div 
            v-for="option in interestOptions" 
            :key="option.key"
            class="interest-option"
            :class="{ selected: selectedInterests.includes(option.key) }"
            @click="toggleInterest(option.key)"
          >
            {{ option.label }}
          </div>
        </div>
        <div v-if="selectedInterests.length >= 3" class="warning-text">
          최대 3개까지 선택 가능합니다
        </div>
      </section>

      <!-- 설문 데이터 -->
      <section class="data-section">
        <div class="section-header">
          <h2>설문 데이터</h2>
          <div class="auto-fill-controls">
            <div class="auto-fill-value-selector">
              <label>자동 입력 값:</label>
              <select v-model="autoFillValue" class="value-select">
                <option value="1">1 (최소값)</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5 (최대값)</option>
              </select>
            </div>
            <button @click="autoFillAllSurveys" type="button" class="auto-fill-btn">모든 설문 자동 입력</button>
          </div>
        </div>
        
        <div class="survey-grid">
          <!-- 눈 설문 -->
          <div v-if="selectedSurveys.includes('eye')" class="survey-section">
            <div class="survey-header">
              <h3>눈 설문</h3>
              <div class="survey-auto-fill-controls">
                <select v-model="individualAutoFillValues.eye" class="value-select small">
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
                <button @click="autoFillEyeSurvey" type="button" class="auto-fill-btn small">자동 입력</button>
              </div>
            </div>
            <div class="form-group" v-for="question in eyeQuestions" :key="question.key">
              <label>{{ question.label }}</label>
              <div class="answer-options">
                <label v-for="answer in eyeAnswers" :key="answer.value" class="answer-option">
                  <input 
                    type="radio" 
                    :name="question.key" 
                    :value="answer.value" 
                    v-model="surveyData.eye[question.key]"
                  />
                  <span>{{ answer.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 기억력 설문 -->
          <div v-if="selectedSurveys.includes('memory')" class="survey-section">
            <div class="survey-header">
              <h3>기억력 설문</h3>
              <div class="survey-auto-fill-controls">
                <select v-model="individualAutoFillValues.memory" class="value-select small">
                  <option value="0">0 (아니요)</option>
                  <option value="1">1 (예)</option>
                </select>
                <button @click="autoFillMemorySurvey" type="button" class="auto-fill-btn small">자동 입력</button>
              </div>
            </div>
            <div class="form-group" v-for="question in memoryQuestions" :key="question.key">
              <label>{{ question.label }}</label>
              <div class="answer-options">
                <label v-for="answer in memoryAnswers" :key="answer.value" class="answer-option">
                  <input type="radio" :name="question.key" :value="answer.value" v-model="surveyData.memory[question.key]" />
                  <span>{{ answer.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 코 과민반응 설문 -->
          <div v-if="selectedSurveys.includes('nose')" class="survey-section">
            <div class="survey-header">
              <h3>코 과민반응 설문</h3>
              <div class="survey-auto-fill-controls">
                <select v-model="individualAutoFillValues.nose" class="value-select small">
                  <option value="0">0 (아니요)</option>
                  <option value="1">1 (예)</option>
                </select>
                <button @click="autoFillNoseSurvey" type="button" class="auto-fill-btn small">자동 입력</button>
              </div>
            </div>
            <div class="form-group" v-for="question in noseQuestions" :key="question.key">
              <label>{{ question.label }}</label>
              <div class="answer-options">
                <label v-for="answer in noseAnswers" :key="answer.value" class="answer-option">
                  <input type="radio" :name="question.key" :value="answer.value" v-model="surveyData.nose[question.key]" />
                  <span>{{ answer.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 위 설문 -->
          <div v-if="selectedSurveys.includes('stomach')" class="survey-section">
            <div class="survey-header">
              <h3>위 설문</h3>
              <div class="survey-auto-fill-controls">
                <select v-model="individualAutoFillValues.stomach" class="value-select small">
                  <option value="0">0 (증상 없음)</option>
                  <option value="1">1 (가벼운)</option>
                  <option value="2">2 (중간)</option>
                  <option value="3">3 (심함)</option>
                  <option value="4">4 (매우 심함)</option>
                </select>
                <button @click="autoFillStomachSurvey" type="button" class="auto-fill-btn small">자동 입력</button>
              </div>
            </div>
            <div class="form-group" v-for="question in stomachQuestions" :key="question.key">
              <label>{{ question.label }}</label>
              <div class="answer-options">
                <label v-for="answer in stomachAnswers" :key="answer.value" class="answer-option">
                  <input type="radio" :name="question.key" :value="answer.value" v-model="surveyData.stomach[question.key]" />
                  <span>{{ answer.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 장 설문 -->
          <div v-if="selectedSurveys.includes('intestine')" class="survey-section">
            <div class="survey-header">
              <h3>장 설문</h3>
              <div class="survey-auto-fill-controls">
                <select v-model="individualAutoFillValues.intestine" class="value-select small">
                  <option value="0">0 (전혀 아니거나 거의 드물다)</option>
                  <option value="1">1 (가끔 또는 항상 그렇다)</option>
                </select>
                <button @click="autoFillIntestineSurvey" type="button" class="auto-fill-btn small">자동 입력</button>
              </div>
            </div>
            <div class="form-group" v-for="(question, index) in intestineQuestions" :key="question.key">
              <label>{{ question.label }}</label>
              <div class="answer-options">
                <label v-for="answer in (index === 7 ? intestineShapeAnswers : intestineAnswers)" :key="answer.value" class="answer-option">
                  <input type="radio" :name="question.key" :value="answer.value" v-model="surveyData.intestine[question.key]" />
                  <span>{{ answer.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 관절, 뼈 설문 -->
          <div v-if="selectedSurveys.includes('jointBone')" class="survey-section">
            <div class="survey-header">
              <h3>관절, 뼈 설문</h3>
              <div class="survey-auto-fill-controls">
                <select v-model="individualAutoFillValues.jointBone" class="value-select small">
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
                <button @click="autoFillJointBoneSurvey" type="button" class="auto-fill-btn small">자동 입력</button>
              </div>
            </div>
            <div class="form-group" v-for="question in jointBoneQuestions" :key="question.key">
              <label>{{ question.label }}</label>
              <div class="answer-options">
                <label v-for="answer in jointBoneAnswers" :key="answer.value" class="answer-option">
                  <input type="radio" :name="question.key" :value="answer.value" v-model="surveyData.jointBone[question.key]" />
                  <span>{{ answer.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 면역 설문 -->
          <div v-if="selectedSurveys.includes('immunity')" class="survey-section">
            <div class="survey-header">
              <h3>면역 설문</h3>
              <div class="survey-auto-fill-controls">
                <select v-model="individualAutoFillValues.immunity" class="value-select small">
                  <option value="0">0 (아니요)</option>
                  <option value="1">1 (예)</option>
                </select>
                <button @click="autoFillImmunitySurvey" type="button" class="auto-fill-btn small">자동 입력</button>
              </div>
            </div>
            <div class="form-group" v-for="question in immunityQuestions" :key="question.key">
              <label>{{ question.label }}</label>
              <div class="answer-options">
                <label v-for="answer in immunityAnswers" :key="answer.value" class="answer-option">
                  <input type="radio" :name="question.key" :value="answer.value" v-model="surveyData.immunity[question.key]" />
                  <span>{{ answer.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 갱년기 설문 -->
          <div v-if="selectedSurveys.includes('menopause')" class="survey-section">
            <div class="survey-header">
              <h3>갱년기 설문</h3>
              <div class="survey-auto-fill-controls">
                <select v-model="individualAutoFillValues.menopause" class="value-select small">
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
                <button @click="autoFillMenopauseSurvey" type="button" class="auto-fill-btn small">자동 입력</button>
              </div>
            </div>
            <div class="form-group" v-for="question in menopauseQuestions" :key="question.key">
              <label>{{ question.label }}</label>
              <div class="answer-options">
                <label v-for="answer in menopauseAnswers" :key="answer.value" class="answer-option">
                  <input type="radio" :name="question.key" :value="answer.value" v-model="surveyData.menopause[question.key]" />
                  <span>{{ answer.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 전립선 설문 -->
          <div v-if="selectedSurveys.includes('prostate')" class="survey-section">
            <div class="survey-header">
              <h3>전립선 설문</h3>
              <div class="survey-auto-fill-controls">
                <select v-model="individualAutoFillValues.prostate" class="value-select small">
                  <option value="0">0 (전혀 없음)</option>
                  <option value="1">1 (5번 중 한 번)</option>
                  <option value="2">2 (5번 중 1~2번)</option>
                  <option value="3">3 (5번 중 2~3번)</option>
                  <option value="4">4 (5번 중 3~4번)</option>
                  <option value="5">5 (거의 항상)</option>
                </select>
                <button @click="autoFillProstateSurvey" type="button" class="auto-fill-btn small">자동 입력</button>
              </div>
            </div>
            <div class="form-group" v-for="(question, index) in prostateQuestions" :key="question.key">
              <label>{{ question.label }}</label>
              <div class="answer-options">
                <label v-for="answer in (index === 6 ? prostateNightAnswers : prostateAnswers)" :key="answer.value" class="answer-option">
                  <input type="radio" :name="question.key" :value="answer.value" v-model="surveyData.prostate[question.key]" />
                  <span>{{ answer.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 월경 설문 -->
          <div v-if="selectedSurveys.includes('menstrual')" class="survey-section">
            <div class="survey-header">
              <h3>월경 설문 <span v-if="basicInfo.gender === 'F'" class="required-badge">필수</span></h3>
              <div class="survey-auto-fill-controls">
                <select v-model="individualAutoFillValues.menstrual" class="value-select small">
                  <option value="0">0 (생리 중)</option>
                  <option value="1">1 (자녀계획 있음)</option>
                  <option value="2">2 (임신 중)</option>
                  <option value="3">3 (수유 중)</option>
                  <option value="4">4 (폐경기)</option>
                  <option value="5">5 (폐경)</option>
                  <option value="6">6 (인공 폐경)</option>
                </select>
                <button @click="autoFillMenstrualSurvey" type="button" class="auto-fill-btn small">자동 입력</button>
              </div>
            </div>
            <div class="form-group" v-for="question in menstrualQuestions" :key="question.key">
              <label>{{ question.label }}</label>
              <div class="answer-options">
                <label v-for="answer in menstrualAnswers" :key="answer.value" class="answer-option">
                  <input type="radio" :name="question.key" :value="answer.value" v-model="surveyData.menstrual[question.key]" />
                  <span>{{ answer.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 삶의 질 설문 -->
          <div class="survey-section">
            <div class="survey-header">
              <h3>삶의 질 설문</h3>
              <div class="survey-auto-fill-controls">
                <select v-model="individualAutoFillValues.life" class="value-select small">
                  <option value="0">0 (거의 없다/아니요)</option>
                  <option value="1">1 (조금 있다/예)</option>
                  <option value="2">2 (많이 있다)</option>
                  <option value="3">3 (대단히 있다)</option>
                </select>
                <button @click="autoFillLifeSurvey" type="button" class="auto-fill-btn small">자동 입력</button>
              </div>
            </div>
            <div class="form-group" v-for="(question, index) in lifeQuestions" :key="question.key">
              <label>{{ question.label }}</label>
              <div class="answer-options">
                <label v-for="answer in (index === 0 ? lifeStressAnswers : lifeAnswers)" :key="answer.value" class="answer-option">
                  <input type="radio" :name="question.key" :value="answer.value" v-model="surveyData.life[question.key]" />
                  <span>{{ answer.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 운동습관 설문 -->
          <div class="survey-section">
            <div class="survey-header">
              <h3>운동습관 설문</h3>
              <div class="survey-auto-fill-controls">
                <select v-model="individualAutoFillValues.physical" class="value-select small">
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                </select>
                <button @click="autoFillPhysicalSurvey" type="button" class="auto-fill-btn small">자동 입력</button>
              </div>
            </div>
            <div class="form-group" v-for="question in physicalQuestions" :key="question.key">
              <label>{{ question.label }}</label>
              <div class="answer-options">
                <label v-for="answer in physicalAnswers" :key="answer.value" class="answer-option">
                  <input type="radio" :name="question.key" :value="answer.value" v-model="surveyData.physical[question.key]" />
                  <span>{{ answer.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 음주, 흡연, 수면, 물섭취 설문 -->
          <div class="survey-section">
            <div class="survey-header">
              <h3>음주, 흡연, 수면, 물섭취 설문</h3>
              <div class="survey-auto-fill-controls">
                <select v-model="individualAutoFillValues.fourPowers" class="value-select small">
                  <option value="0">0 (아니요)</option>
                  <option value="1">1 (예)</option>
                </select>
                <button @click="autoFillFourPowersSurvey" type="button" class="auto-fill-btn small">자동 입력</button>
              </div>
            </div>
            <div class="form-group" v-for="question in fourPowersQuestions" :key="question.key">
              <label>{{ question.label }}</label>
              <div v-if="question.type === 'radio'" class="answer-options">
                <label v-for="answer in fourPowersAnswers" :key="answer.value" class="answer-option">
                  <input type="radio" :name="question.key" :value="answer.value" v-model="surveyData.fourPowers[question.key]" />
                  <span>{{ answer.label }}</span>
                </label>
              </div>
              <div v-else-if="question.type === 'number'" class="number-input">
                <input 
                  type="number" 
                  v-model="surveyData.fourPowers[question.key]" 
                  :placeholder="question.key === 'fpsq03' ? '시간 (예: 7.5)' : '컵 (예: 8)'"
                  min="0"
                  step="0.1"
                />
                <span class="unit">{{ question.key === 'fpsq03' ? '시간' : '컵(200ml)' }}</span>
              </div>
            </div>
          </div>

                     <!-- 복약 설문 -->
           <div class="survey-section">
             <div class="survey-header">
               <h3>복약 설문</h3>
               <div class="survey-auto-fill-controls">
                 <button @click="autoFillDrugSurvey" type="button" class="auto-fill-btn small">자동 입력</button>
               </div>
             </div>
            <div class="drug-checkboxes">
              <label v-for="question in drugQuestions" :key="question.key" class="checkbox-label">
                <input type="checkbox" v-model="surveyData.drug[question.key]" />
                <span>{{ question.label }}</span>
              </label>
            </div>
          </div>

                     <!-- 식이 설문 -->
           <div class="survey-section">
             <div class="survey-header">
               <h3>식이 설문</h3>
               <div class="survey-auto-fill-controls">
                 <button @click="autoFillDietSurvey" type="button" class="auto-fill-btn small">자동 입력</button>
               </div>
             </div>
            <div class="form-group">
              <label>{{ dqQuestions[0].label }}</label>
              <div class="answer-options">
                <label v-for="answer in dqAnswers" :key="answer.value" class="answer-option">
                  <input type="radio" :name="dqQuestions[0].key" :value="answer.value" v-model="surveyData.dq[dqQuestions[0].key]" />
                  <span>{{ answer.label }}</span>
                </label>
              </div>
            </div>
            <div class="form-group">
              <label>{{ t('CheckupDiet.text4') }}</label>
              <div class="diet-checkboxes">
                <label v-for="item in dqFoodItems" :key="item.key" class="checkbox-label">
                  <input type="checkbox" v-model="surveyData.dq[item.key]" />
                  <span>{{ item.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 수면 설문 -->
          <div class="survey-section">
            <div class="survey-header">
              <h3>수면 설문</h3>
              <div class="survey-auto-fill-controls">
                <select v-model="individualAutoFillValues.sleep" class="value-select small">
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
                <button @click="autoFillSleepSurvey" type="button" class="auto-fill-btn small">자동 입력</button>
              </div>
            </div>
            <div class="form-group" v-for="question in shQuestions" :key="question.key">
              <label>{{ question.label }}</label>
              <div class="answer-options">
                <label v-for="answer in shAnswers" :key="answer.value" class="answer-option">
                  <input type="radio" :name="question.key" :value="answer.value" v-model="surveyData.sh[question.key]" />
                  <span>{{ answer.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 분석 버튼 -->
      <section class="action-section">
        <button 
          @click="runAnalysis" 
          :disabled="isLoading"
          class="btn-analyze"
        >
          {{ isLoading ? '분석 중...' : '분석 실행' }}
        </button>
        
        <button @click="resetData" class="btn-reset">
          데이터 초기화
        </button>
      </section>

      <!-- 분석 결과 -->
      <section v-if="analysisResult" class="result-section">
        <h2>분석 결과</h2>
        <pre>{{ JSON.stringify(analysisResult, null, 2) }}</pre>
        <button @click="goToResult" class="btn-result">
          결과 페이지로 이동
        </button>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.test-analysis {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
  h1 {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
  }
}

.auth-status {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  
  &.authenticated {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  &.not-authenticated {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
}

.analysis-container {
  display: grid;
  gap: 30px;
}

.data-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      margin: 0;
      color: #495057;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
    }
  }
  
  h2 {
    margin-bottom: 20px;
    color: #495057;
    border-bottom: 2px solid #007bff;
    padding-bottom: 10px;
  }
}

.auto-fill-btn {
  padding: 8px 16px;
  background: linear-gradient(135deg, #17a2b8, #138496);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  &:hover {
    background: linear-gradient(135deg, #138496, #117a8b);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.form-group {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #007bff;
  
  label {
    display: block;
    margin-bottom: 10px;
    font-weight: 600;
    color: #495057;
    font-size: 14px;
    line-height: 1.4;
  }
  
  input, select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }
  }
}

.survey-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 25px;
}

.survey-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  max-height: 600px;
  overflow-y: auto;
  
  .survey-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 2px solid #007bff;
    padding-bottom: 10px;
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 10;
    
    h3 {
      margin: 0;
      color: #495057;
      font-size: 18px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
  
  h3 {
    margin-bottom: 20px;
    color: #495057;
    font-size: 18px;
    font-weight: 600;
    border-bottom: 2px solid #007bff;
    padding-bottom: 10px;
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .required-badge {
    background: #dc3545;
    color: white;
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 12px;
    font-weight: 600;
    white-space: nowrap;
  }
}

.auto-fill-btn.small {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
}

.auto-fill-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.auto-fill-value-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  
  label {
    font-size: 14px;
    font-weight: 500;
    color: #495057;
    white-space: nowrap;
  }
  
  .value-select {
    padding: 6px 10px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;
    background: white;
    cursor: pointer;
    
    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }
  }
}

.survey-auto-fill-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .value-select.small {
    padding: 4px 8px;
    font-size: 12px;
    min-width: 50px;
  }
}

.note {
  color: #6c757d;
  font-size: 14px;
  margin-bottom: 20px;
  font-style: italic;
}

.answer-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
}

.answer-option {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e9ecef;
    border-color: #007bff;
  }
  
  input[type="radio"] {
    margin: 0;
    cursor: pointer;
  }
  
  span {
    font-size: 13px;
    color: #495057;
    font-weight: 500;
  }
  
  &:has(input:checked) {
    background: #007bff;
    border-color: #007bff;
    color: #fff;
    
    span {
      color: #fff;
    }
  }
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f8f9fa;
    border-color: #007bff;
  }
  
  &:has(input:checked) {
    background: #28a745;
    color: white;
    border-color: #28a745;
  }
  
  input {
    margin: 0;
  }
}

.interest-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.interest-option {
  padding: 12px 16px;
  background: #fff;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    border-color: #007bff;
    background: #f8f9fa;
  }
  
  &.selected {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }
}

.warning-text {
  color: #dc3545;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  margin-top: 10px;
}

.basic-grid, .blood-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

/* 체성분 데이터 그리드 */
.body-composition-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

/* 숫자 입력 필드 */
.number-input {
  display: flex;
  align-items: center;
  gap: 10px;
  
  input[type="number"] {
    flex: 1;
    padding: 12px;
    border: 2px solid #e9ecef;
    border-radius: 6px;
    font-size: 16px;
    transition: border-color 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }
    
    &::placeholder {
      color: #adb5bd;
    }
  }
  
  .unit {
    color: #6c757d;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
  }
}

/* 복약 설문 체크박스 스타일 */
.drug-checkboxes {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
  gap: 10px !important;
  
  .checkbox-label {
    display: flex !important;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    cursor: pointer;
    background: #fff;
    border: 1px solid #e9ecef;
    
    &:hover {
      background-color: #f8f9fa;
      border-color: #007bff;
    }
    
    input[type="checkbox"] {
      width: auto !important;
      margin: 0 !important;
      flex-shrink: 0;
    }
    
    span {
      font-size: 13px;
      line-height: 1.3;
      color: #495057;
      word-break: keep-all;
    }
  }
}

/* 식이 설문 체크박스 스타일 */
.diet-checkboxes {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 8px !important;
  
  .checkbox-label {
    display: flex !important;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    cursor: pointer;
    background: #fff;
    border: 1px solid #e9ecef;
    
    &:hover {
      background-color: #f8f9fa;
      border-color: #007bff;
    }
    
    input[type="checkbox"] {
      width: auto !important;
      margin: 0 !important;
      flex-shrink: 0;
    }
    
    span {
      font-size: 12px;
      line-height: 1.2;
      color: #495057;
      word-break: keep-all;
    }
  }
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .drug-checkboxes {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  .diet-checkboxes {
    grid-template-columns: repeat(3, 1fr) !important;
  }
}

@media (max-width: 480px) {
  .drug-checkboxes {
    grid-template-columns: 1fr !important;
  }
  .diet-checkboxes {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

.action-section {
  display: flex;
  gap: 20px;
  justify-content: center;
  padding: 25px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn-analyze, .btn-reset, .btn-result {
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.2);
  }
}

.btn-analyze {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #0056b3, #004085);
  }
}

.btn-reset {
  background: linear-gradient(135deg, #6c757d, #545b62);
  color: white;
  
  &:hover {
    background: linear-gradient(135deg, #545b62, #495057);
  }
}

.btn-result {
  background: linear-gradient(135deg, #28a745, #1e7e34);
  color: white;
  
  &:hover {
    background: linear-gradient(135deg, #1e7e34, #155724);
  }
}

.result-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  
  h2 {
    margin-bottom: 20px;
    color: #495057;
  }
  
  pre {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 12px;
    line-height: 1.4;
  }
}
</style> 