import { useI18n } from 'vue-i18n'


export const useCommonForm = () => {
  const { t } = useI18n()

  const AGING_ANALYSIS_FORM = {
    20: {
      male: [73.5, 79.6],
      female: [80, 86.1]
    },
    30: {
      male: [66.3, 72.4],
      female: [74.2, 80.3]
    },
    40: {
      male: [61.1, 67.2],
      female: [68.6, 74.7]
    },
    50: {
      male: [57, 63.1],
      female: [61.8, 67.9]
    },
    60: {
      male: [53.7, 59.8],
      female: [55.3, 61.4]
    },
    70: {
      male: [50.7, 56.8],
      female: [50, 56.1]
    },
    80: {
      male: [49.5, 55.6],
      female: [47.3, 53.4]
    }
  }
  
  /**
   * 노화 억제 분석지수 기준
   *
   * 연령대: {
   *  성별: [낮은, 비슷한, 높은]
   * }
   */
  const DISEASE_ANALYSIS_FORM = {
    20: {
      male: [73.4, 79.5],
      female: [78.2, 84.3]
    },
    30: {
      male: [68.8, 74.9],
      female: [75.2, 81.3]
    },
    40: {
      male: [66.7, 72.8],
      female: [72.6, 78.7]
    },
    50: {
      male: [65.2, 71.3],
      female: [69.3, 75.4]
    },
    60: {
      male: [64.4, 70.5],
      female: [67, 73.1]
    },
    70: {
      male: [63.8, 69.9],
      female: [65.4, 71.5]
    },
    80: {
      male: [64, 70.1],
      female: [65.4, 71.5]
    }
  }
  
  /**
   * 노화 속도 요인 기준
   */
  const barType = {
    type1: {
      class: 'type1',
      ratio: [5, 3.5, 1.5]
    },
    type1_reverse: {
      class: 'type1 reverse',
      ratio: [1.5, 3.5, 5]
    },
    type2: {
      class: 'type2',
      ratio: [1, 8, 1]
    },
    type3: {
      class: 'type3',
      ratio: [5, 4, 1]
    },
    type3_reverse: {
      class: 'type3 reverse',
      ratio: [1, 4, 5]
    },
    type4: {
      class: 'type4',
      ratio: [1, 4, 5]
    },
    type5: {
      class: 'type5',
      ratio: [5, 5]
    },
    type5_reverse: {
      class: 'type5 reverse',
      ratio: [5, 5]
    },
    type7: {
      class: 'type7',
      ratio: [5, 5]
    },
  }
  
  const AGING_SPEED_FORM = { 
    WC: {                    // 허리둘레
      label: t('CommonForm.waist_circumference_full'),
      unit: 'cm',
      type: 'nwd',
      normal_range_min: 0,
      normal_range_max: [87.09477, 79.97035],    // value1 (남성, 여성)
      normal_range_ratio: 0,
      warning_range_min: [87.09477, 79.97035],   // value1 (남성, 여성)
      warning_range_max: [90, 85],               // value2 (남성, 여성)
      warning_range_ratio: 0.5,
      danger_range_min: [90, 85],                // value2 (남성, 여성)
      danger_range_max: 160,                     // max
      danger_range_ratio: 0.865,
      range_min: 0,
      range_max: 160,
      average: [87.09477, 79.97035],
      barType: barType.type1
    },
    BMI: {                   // 체질량지수
      label: t('CommonForm.bmi_full'),
      unit: 'kg/㎡',
      type: 'dnd',
      normal_range_min: 18.5,
      normal_range_max: 23.0,
      normal_range_ratio: 0.1,
      danger_1_range_min: 0,
      danger_1_range_max: 18.5,
      danger_1_range_ratio: 0,
      danger_2_range_min: 23.0,
      danger_2_range_max: 46,
      danger_2_range_ratio: 0.9,
      range_min: 0,
      range_max: 46,
      average: 23.96281,
      barType: barType.type2
    },
    per_bodyfat: {           // 체지방률
      label: t('CommonForm.body_fat_risk'),
      unit: '%',
      type: 'nwd',
      normal_range_min: 0,
      normal_range_max: [20, 28],        // value1 (남성, 여성)
      normal_range_ratio: 0,
      warning_range_min: [20, 28],       // value1 (남성, 여성)
      warning_range_max: [30.7, 40.7],   // value2 (남성, 여성)
      warning_range_ratio: 0.5,
      danger_range_min: [30.7, 40.7],    // value2 (남성, 여성)
      danger_range_max: 50,              // max
      danger_range_ratio: 0.9,
      range_min: 0,
      range_max: 50,
      average: [22.9111, 32.5599],
      barType: barType.type1
    },
    WASM: {                  // 체중대비팔다리근육률
      label: t('CommonForm.arm_leg_muscle_full'),
      unit: '%',
      type: 'dwn',
      normal_range_min: [32.96215, 26.91535],     // value1 (남성, 여성)
      normal_range_max: 45,                     // max
      normal_range_ratio: 0.5,
      warning_range_min: [29.58288, 23.42124],    // value2 (남성, 여성)
      warning_range_max: [32.96215, 26.91535],    // value1 (남성, 여성)
      warning_range_ratio: 0.1,
      danger_range_min: 0,                      // range_min
      danger_range_max: [29.58288, 23.42124],     // value2 (남성, 여성)
      danger_range_ratio: 0,
      range_min: 0,
      range_max: 45,
      average: [32.96215, 26.91535],
      barType: barType.type3_reverse
    },
    GLU: {                   // 공복혈당
      label: t('CommonForm.fasting_glucose_full'),
      unit: 'mg/dL',
      type: 'nwd',
      normal_range_min: 0,
      normal_range_max: 100,        // value1
      normal_range_ratio: 0,
      warning_range_min: 100,       // value1
      warning_range_max: 123,       // value2
      warning_range_ratio: 0.5,
      danger_range_min: 123,        // value2
      danger_range_max: 200,        // max
      danger_range_ratio: 0.9,
      range_min: 0,
      range_max: 200,
      average: 101.6457,
      barType: barType.type3
    },
    HB: {                    // 혈색소
      label: t('CommonForm.hemoglobin_full'),
      unit: 'g/dL',
      type: 'dnd',
      normal_range_min: [13.6, 12],          // 정상 구간 최소값 (남성, 여성)
      normal_range_max: [16.6, 14.4],        // 정상 구간 최대값 (남성, 여성)
      normal_range_ratio: 0.1,
      danger_1_range_min: 0,                 // 첫 번째 위험 구간 (낮은 값)
      danger_1_range_max: [16.6, 14.4],        // 첫 번째 위험 구간 최대값 (남성, 여성) // ?? 
      danger_1_range_ratio: 0,
      danger_2_range_min: [13.6, 12],      // 두 번째 위험 구간 최소값 (남성, 여성)
      danger_2_range_max: 26,                // 두 번째 위험 구간 최대값
      danger_2_range_ratio: 0.9,
      range_min: 0,
      range_max: 26,
      average: [15.13481, 13.07844],
      barType: barType.type2
    },
    TC: {                    // 총콜레스테롤
      label: t('CommonForm.total_cholesterol_full'),
      unit: 'mg/dL',
      type: 'nwd',
      normal_range_min: 0,
      normal_range_max: 191.1115,    // value1
      normal_range_ratio: 0,
      warning_range_min: 191.1115,   // value1
      warning_range_max: 240,        // value2
      warning_range_ratio: 0.5,
      danger_range_min: 240,         // value2
      danger_range_max: 400,         // max
      danger_range_ratio: 0.9,
      range_min: 0,
      range_max: 400,
      average: 191.1115,
      barType: barType.type3
    },
    LDL: {                   // 저밀도콜레스테롤
      label: t('CommonForm.ldl_cholesterol_full'),
      unit: 'mg/dL',
      type: 'nwd',
      normal_range_min: 0,
      normal_range_max: 113.4704,    // value1
      normal_range_ratio: 0,
      warning_range_min: 113.4704,   // value1
      warning_range_max: 157.20306,  // value2
      warning_range_ratio: 0.5,
      danger_range_min: 157.20306,   // value2
      danger_range_max: 260,         // max
      danger_range_ratio: 0.9,
      range_min: 0,
      range_max: 260,
      average: 113.4704,
      barType: barType.type3
    },
    HDL: {                   // 고밀도콜레스테롤
      label: t('CommonForm.hdl_cholesterol_full'),
      unit: 'mg/dL',
      type: 'dwn',
      normal_range_min: 51.33564,     // 정상 최소값 (51.33564 초과)
      normal_range_max: 80,           // 정상 최대값 (80 이하)
      normal_range_ratio: 0.5,
      warning_range_min: 40,          // 주의 최소값 (40 이상)
      warning_range_max: 51.33564,   // 주의 최대값 (51.33564 이하)
      warning_range_ratio: 0.135,
      danger_range_min: 0,            // 위험 최소값 (0 이상)
      danger_range_max: 40,           // 위험 최대값 (40 미만)
      danger_range_ratio: 0,
      range_min: 0,
      range_max: 80,
      average: 51.33564,
      barType: barType.type1_reverse
    },
    TG: {                    // 중성지방
      label: t('CommonForm.triglyceride_full'),
      unit: 'mg/dL',
      type: 'nwd',
      normal_range_min: 0,
      normal_range_max: 133.3174,    // value1
      normal_range_ratio: 0,
      warning_range_min: 133.3174,   // value1
      warning_range_max: 200,        // value2
      warning_range_ratio: 0.5,
      danger_range_min: 200,         // value2
      danger_range_max: 300,         // max
      danger_range_ratio: 0.865,
      range_min: 0,
      range_max: 300,
      average: 133.3174,
      barType: barType.type1
    },
    SBP: {                   // 수축기혈압
      label: t('CommonForm.systolic_blood_pressure'),
      unit: 'mmHg',
      type: 'nwd',
      normal_range_min: 0,
      normal_range_max: 119.474,    // value1
      normal_range_ratio: 0,
      warning_range_min: 119.474,   // value1
      warning_range_max: 140,        // value2
      warning_range_ratio: 0.5,
      danger_range_min: 140,         // value2
      danger_range_max: 240,         // max
      danger_range_ratio: 0.865,
      range_min: 0,
      range_max: 240,
      average: 119.474,
      barType: barType.type1
    },
    DBP: {                   // 이완기혈압
      label: t('CommonForm.diastolic_blood_pressure'),
      unit: 'mmHg',
      type: 'nwd',
      normal_range_min: 0,
      normal_range_max: 75.22055,    // value1
      normal_range_ratio: 0,
      warning_range_min: 75.22055,   // value1
      warning_range_max: 88,         // value2
      warning_range_ratio: 0.5,
      danger_range_min: 88,          // value2
      danger_range_max: 160,         // max
      danger_range_ratio: 0.9,
      range_min: 0,
      range_max: 160,
      average: 75.22055,
      barType: barType.type3
    },
    GOT: {                   // AST
      label: t('CommonForm.ast_got_full'),
      unit: 'IU/L',
      type: 'nwd',
      normal_range_min: 0,
      normal_range_max: 23.5126,     // value1
      normal_range_ratio: 0,
      warning_range_min: 23.5126,    // value1
      warning_range_max: 33,         // value2
      warning_range_ratio: 0.5,
      danger_range_min: 33,          // value2
      danger_range_max: 80,          // max
      danger_range_ratio: 0.9,
      range_min: 0,
      range_max: 80,
      average: 23.5126,
      barType: barType.type3
    },
    GPT: {                   // ALT
      label: t('CommonForm.alt_gpt_full'),
      unit: 'IU/L',
      type: 'nwd',
      normal_range_min: 0,
      normal_range_max: 22.39827,    // value1
      normal_range_ratio: 0,
      warning_range_min: 22.39827,   // value1
      warning_range_max: 35,         // value2
      warning_range_ratio: 0.5,
      danger_range_min: 35,          // value2
      danger_range_max: 70,          // max
      danger_range_ratio: 0.865,
      range_min: 0,
      range_max: 70,
      average: 22.39827,
      barType: barType.type1
    },
    CREA: {                  // 혈청크레아티닌
      label: t('CommonForm.creatinine_full'),
      unit: 'mg/dL',
      type: 'nd',
      normal_range_min: 0,
      normal_range_max: 1.05,        // value1
      normal_range_ratio: 0,
      danger_range_min: 1.05,        // value1
      danger_range_max: 3,           // max
      danger_range_ratio: 0.5,
      range_min: 0,
      range_max: 3,
      average: 0.81943,
      barType: barType.type5
    },
    RFS_score: {             // RFS 점수
      label: t('CommonForm.diet_quality_full'),
      unit: t('CommonForm.diet_quality_unit'),
      type: 'dwn',
      normal_range_min: 64,          // 64 이상 정상
      normal_range_max: 100,         // 최대값
      normal_range_ratio: 0.5,      // 정상 구간 시작점 (50%에서 시작)
      warning_range_min: 49,         // 49 이상 64 미만 주의
      warning_range_max: 64,         // 64 미만
      warning_range_ratio: 0.135,     // 주의 구간 시작점 (15%에서 시작)
      danger_range_min: 0,           // 49 미만 위험
      danger_range_max: 49,          // 49 미만
      danger_range_ratio: 0,         // 위험 구간 시작점 (0%에서 시작)
      range_min: 0,
      range_max: 100,
      average: 49,
      barType: barType.type7
    },
    MET: {                   // 활동량
      label: t('CommonForm.activity_level_full'),
      unit: 'MET',
      type: 'dwn',
      normal_range_min: 600,         // value2 (정상 기준)
      normal_range_max: 4620,        // max
      normal_range_ratio: 0.5,
      warning_range_min: 150,        // value1 (주의 기준)
      warning_range_max: 600,        // value2 (정상 기준)
      warning_range_ratio: 0.1,
      danger_range_min: 0,           // range_min
      danger_range_max: 150,         // value1 (주의 기준)
      danger_range_ratio: 0,
      range_min: 0,
      range_max: 4620,
      average: 1621,
      barType: barType.type3_reverse
    },
    drink_amt: {             // 음주량
      label: t('CommonForm.alcohol_consumption_full'),
      unit: t('CheckupDrinkSmokeSleep.text11'),
      type: 'nwd',
      normal_range_min: 0,
      normal_range_max: [9.207, 2.351],        // 정상 범위 (남성, 여성)
      normal_range_ratio: 0,
      warning_range_min: [9.207, 2.351],       // 주의 범위 시작 (남성, 여성)
      warning_range_max: [49, 35],               // 주의 범위 끝 (남성, 여성)
      warning_range_ratio: 0.5,
      danger_range_min: [49, 35],                // 위험 범위 시작 (남성, 여성)
      danger_range_max: 53,                      // max
      danger_range_ratio: 0.865,
      range_min: 0,
      range_max: 53,
      average: [9.207, 2.351],                 // 평균값 (남성, 여성)
      barType: barType.type1
    },
    sleep_time: {            // 수면시간
      label: t('CommonForm.sleep_time_full'),
      unit: t('BaseTimeInput.txt1'),
      type: 'dn',
      normal_range_min: 6.987878,    // value1 (정상 최소값)
      normal_range_max: 14,          // max (정상 최대값)
      normal_range_ratio: 0.5,
      danger_range_min: 0,           // range_min (위험 최소값)
      danger_range_max: 6.987878,    // value1 (위험 최대값)
      danger_range_ratio: 0,
      range_min: 0,
      range_max: 14,
      average: 6.987878,
      barType: barType.type5_reverse
    },
    pack_year: {             // 흡연량
      label: t('CommonForm.smoking_pack_year_full'),
      unit: '갑/년',
      type: 'nd',
      normal_range_min: 0,
      normal_range_max: 6.907437,    // value1
      normal_range_ratio: 0,
      danger_range_min: 6.907437,    // value1
      danger_range_max: 14,          // max
      danger_range_ratio: 0.5,
      range_min: 0,
      range_max: 14,
      average: 6.907437,
      barType: barType.type5
    },
    smok_dur: {              // 흡연기간
      label: t('CommonForm.smoking_duration_full'),
      unit: t('CheckupDrinkSmokeSleep.text19'),
      type: 'nwd',
      normal_range_min: 0,
      normal_range_max: 0,           // value1
      normal_range_ratio: 0,
      warning_range_min: 0,          // value1
      warning_range_max: 12.39234,   // value2
      warning_range_ratio: 0.1,
      danger_range_min: 12.39234,    // value2
      danger_range_max: 31,          // max
      danger_range_ratio: 0.5,
      range_min: 0,
      range_max: 31,
      average: 12.39234,
      barType: barType.type4
    },
    EQ5D: {                  // 삶의질
      label: t('CommonForm.quality_of_life_full'),
      type: 'dn',
      normal_range_min: 0.942851,    // value1 (정상 최소값)
      normal_range_max: 1,           // max (정상 최대값)
      normal_range_ratio: 0.5,
      danger_range_min: 0,            // range_min (위험 최소값)
      danger_range_max: 0.942851,    // value1 (위험 최대값)
      danger_range_ratio: 0,
      range_min: 0,
      range_max: 1,
      average: 0.942851,
      barType: barType.type5_reverse
    }
  }
  
  /**
   * 검진 데이터
   */
  const EXAMINATION_FORM = {
    SBP: {
      label: t('CommonForm.systolic_bp_full'),
      unit: t('CommonForm.systolic_bp_unit'),
      // 기준치 설정
      range_min: 0,
      range_max: 240,
      normal_range_min: 0,
      normal_range_max: 119.4743,
      warning_range_min: 119.4743,
      warning_range_max: 140,
      danger_range_min: 140,
      danger_range_max: 240,
      // inequality 설정
      normal_inequlity_min: '>=',
      normal_inequlity_max: '<',
      warning_inequlit_min: '>=',
      warning_inequlit_max: '<',
      danger_inequlit_min: '>=',
      danger_inequlit_max: '<='
    },
    DBP: {
      label: t('CommonForm.diastolic_bp_full'),
      unit: t('CommonForm.diastolic_bp_unit'),
      // 기준치 설정
      range_min: 0,
      range_max: 160,
      normal_range_min: 0,
      normal_range_max: 75.22055,
      warning_range_min: 75.22055,
      warning_range_max: 88,
      danger_range_min: 88,
      danger_range_max: 160,
      // inequality 설정
      normal_inequlity_min: '>=',
      normal_inequlity_max: '<',
      warning_inequlit_min: '>=',
      warning_inequlit_max: '<',
      danger_inequlit_min: '>=',
      danger_inequlit_max: '<='
    },
    GLU: {
      label: t('CommonForm.fasting_glucose_full'),
      unit: t('CommonForm.fasting_glucose_unit'),
      // 기준치 설정
      range_min: 0,
      range_max: 200,
      normal_range_min: 0,
      normal_range_max: 100,
      warning_range_min: 100,
      warning_range_max: 123,
      danger_range_min: 123,
      danger_range_max: 200,
      // inequality 설정
      normal_inequlity_min: '>=',
      normal_inequlity_max: '<',
      warning_inequlit_min: '>=',
      warning_inequlit_max: '<',
      danger_inequlit_min: '>=',
      danger_inequlit_max: '<='
    },
    TG: {
      label: t('CommonForm.triglyceride_full'),
      unit: t('CommonForm.triglyceride_unit'),
      // 기준치 설정
      range_min: 0,
      range_max: 300,
      normal_range_min: 0,
      normal_range_max: 133.3174,
      warning_range_min: 133.3174,
      warning_range_max: 200,
      danger_range_min: 200,
      danger_range_max: 300,
      // inequality 설정
      normal_inequlity_min: '>=',
      normal_inequlity_max: '<',
      warning_inequlit_min: '>=',
      warning_inequlit_max: '<',
      danger_inequlit_min: '>=',
      danger_inequlit_max: '<='
    },
    TC: {
      label: t('CommonForm.total_cholesterol_full'),
      unit: t('CommonForm.total_cholesterol_unit'),
      // 기준치 설정
      range_min: 0,
      range_max: 400,
      normal_range_min: 0,
      normal_range_max: 191.1115,
      warning_range_min: 191.1115,
      warning_range_max: 240,
      danger_range_min: 240,
      danger_range_max: 400,
      // inequality 설정
      normal_inequlity_min: '>=',
      normal_inequlity_max: '<',
      warning_inequlit_min: '>=',
      warning_inequlit_max: '<',
      danger_inequlit_min: '>=',
      danger_inequlit_max: '<='
    },
    HDL: {
      label: t('CommonForm.hdl_cholesterol_full'),
      unit: t('CommonForm.hdl_cholesterol_unit'),
      // 기준치 설정 (높을수록 좋음)
      range_min: 0,
      range_max: 80,
      normal_range_min: 51.33564,
      normal_range_max: 80,
      warning_range_min: 40,
      warning_range_max: 51.33564,
      danger_range_min: 0,
      danger_range_max: 40,
      // inequality 설정
      normal_inequlity_min: '>',
      normal_inequlity_max: '<=',
      warning_inequlit_min: '>=',
      warning_inequlit_max: '<=',
      danger_inequlit_min: '<',
      danger_inequlit_max: '<'
    },
    LDL: {
      label: t('CommonForm.ldl_cholesterol_full'),
      unit: t('CommonForm.ldl_cholesterol_unit'),
      // 기준치 설정
      range_min: 0,
      range_max: 260,
      normal_range_min: 0,
      normal_range_max: 113.4704,
      warning_range_min: 113.4704,
      warning_range_max: 157.20306,
      danger_range_min: 157.20306,
      danger_range_max: 260,
      // inequality 설정
      normal_inequlity_min: '>=',
      normal_inequlity_max: '<',
      warning_inequlit_min: '>=',
      warning_inequlit_max: '<',
      danger_inequlit_min: '>=',
      danger_inequlit_max: '<='
    },
    BMI: {
      label: t('CommonForm.bmi_full'),
      unit: t('CommonForm.bmi_unit'),
      // 기준치 설정
      range_min: 0,
      range_max: 46,
      normal_range_min: 18.5,
      normal_range_max: 23.0,
      warning_range_min: 0,
      warning_range_max: 0,
      danger_range_min: 0,
      danger_range_max: 46,
      // inequality 설정
      normal_inequlity_min: '>=',
      normal_inequlity_max: '<',
      warning_inequlit_min: '>=',
      warning_inequlit_max: '<',
      danger_inequlit_min: '<',
      danger_inequlit_max: '>='
    },
    WC: {
      label: t('CommonForm.waist_circumference_full'),
      unit: t('CommonForm.waist_circumference_unit'),
      // 기준치 설정 (성별별) - [남성, 여성] 순서
      range_min: [0, 0],
      range_max: [160, 160],
      normal_range_min: [0, 0],
      normal_range_max: [87.09477, 79.97035],
      warning_range_min: [87.09477, 79.97035],
      warning_range_max: [90, 85],
      danger_range_min: [90, 85],
      danger_range_max: [160, 160],
      // inequality 설정
      normal_inequlity_min: '>=',
      normal_inequlity_max: '<',
      warning_inequlit_min: '>=',
      warning_inequlit_max: '<',
      danger_inequlit_min: '>=',
      danger_inequlit_max: '<='
    },
    GOT: {
      label: t('CommonForm.ast_got_full'),
      unit: t('CommonForm.ast_unit'),
      // 기준치 설정
      range_min: 0,
      range_max: 80,
      normal_range_min: 0,
      normal_range_max: 23.65014,
      warning_range_min: 23.65014,
      warning_range_max: 33,
      danger_range_min: 33,
      danger_range_max: 80,
      // inequality 설정
      normal_inequlity_min: '>=',
      normal_inequlity_max: '<',
      warning_inequlit_min: '>=',
      warning_inequlit_max: '<=',
      danger_inequlit_min: '>',
      danger_inequlit_max: '<='
    },
    GPT: {
      label: t('CommonForm.alt_gpt_full'),
      unit: t('CommonForm.alt_unit'),
      // 기준치 설정
      range_min: 0,
      range_max: 70,
      normal_range_min: 0,
      normal_range_max: 22.39827,
      warning_range_min: 22.39827,
      warning_range_max: 35,
      danger_range_min: 35,
      danger_range_max: 70,
      // inequality 설정
      normal_inequlity_min: '>=',
      normal_inequlity_max: '<',
      warning_inequlit_min: '>=',
      warning_inequlit_max: '<=',
      danger_inequlit_min: '>',
      danger_inequlit_max: '<='
    },
    CREA: {
      label: t('CommonForm.creatinine_full'),
      unit: t('CommonForm.creatinine_unit'),
      // 기준치 설정
      range_min: 0,
      range_max: 3,
      normal_range_min: 0,
      normal_range_max: 1.05,
      warning_range_min: 0,
      warning_range_max: 0,
      danger_range_min: 1.05,
      danger_range_max: 3,
      // inequality 설정
      normal_inequlity_min: '>=',
      normal_inequlity_max: '<=',
      warning_inequlit_min: '>=',
      warning_inequlit_max: '<',
      danger_inequlit_min: '>',
      danger_inequlit_max: '<='
    },
    HB: {
      label: t('CommonForm.hemoglobin_full'),
      unit: t('CommonForm.hemoglobin_unit'),
      // 기준치 설정 (성별별) - [남성, 여성] 순서
      range_min: [0, 0],
      range_max: [26, 26],
      normal_range_min: [13.6, 12.0],
      normal_range_max: [16.6, 14.4],
      warning_range_min: [0, 0],
      warning_range_max: [0, 0],
      danger_range_min: [0, 0],
      danger_range_max: [26, 26],
      // inequality 설정
      normal_inequlity_min: '>=',
      normal_inequlity_max: '<=',
      warning_inequlit_min: '>=',
      warning_inequlit_max: '<',
      danger_inequlit_min: '<',
      danger_inequlit_max: '>'
    }
  }
  
  /**
   * ABC 건강지표
   */
  const ABC_FORM = {
    SBP: {
      label: t('CommonForm.systolic_bp_abc'),
      labelUnit: t('CommonForm.systolic_bp_abc')
    },
    DBP: {
      label: t('CommonForm.diastolic_bp_abc'),
      labelUnit: t('CommonForm.diastolic_bp_abc')
    },
    GLU: {
      label: t('CommonForm.fasting_glucose_abc'),
      labelUnit: t('CommonForm.fasting_glucose_full')
    },
    TG: {
      label: t('CommonForm.triglyceride_abc'),
      labelUnit: t('CommonForm.triglyceride_full')
    },
    TC: {
      label: t('CommonForm.total_cholesterol_abc'),
      labelUnit: t('CommonForm.total_cholesterol_full')
    },
    HDL: {
      label: t('CommonForm.hdl_cholesterol_abc'),
      labelUnit: t('CommonForm.hdl_cholesterol_full')
    },
    LDL: {
      label: t('CommonForm.ldl_cholesterol_abc'),
      labelUnit: t('CommonForm.ldl_cholesterol_full')
    },
    BMI: {
      label: t('CommonForm.bmi_abc'),
      labelUnit: t('CommonForm.bmi_abc')
    },
    WC: {
      label: t('CommonForm.waist_circumference_abc'),
      labelUnit: t('CommonForm.waist_circumference_abc')
    },
    GOT: {
      label: t('CommonForm.ast_multiline'),
      labelUnit: t('CommonForm.ast_got_full')
    },
    GPT: {
      label: t('CommonForm.alt_multiline'),
      labelUnit: t('CommonForm.alt_gpt_full')
    },
    CREA: {
      label: t('CommonForm.serum_creatinine_abc'),
      labelUnit: t('CommonForm.creatinine_full')
    },
    HB: {
      label: t('CommonForm.hemoglobin_abc'),
      labelUnit: t('CommonForm.hemoglobin_full')
    },
    CK_sleep_time: {
      label: t('CommonForm.sleep'),
      labelUnit: t('CommonForm.sleep')
    },
    CK_water_amt: {
      label: t('CommonForm.water'),
      labelUnit: t('CommonForm.water')
    },
    CK_MH_stress: {
      label: t('CommonForm.stress'),
      labelUnit: t('CommonForm.stress')
    },
    CK_MET: {
      label: t('CommonForm.activity'),
      labelUnit: t('CommonForm.activity')
    },
    CK_drink: {
      label: t('CommonForm.alcohol'),
      labelUnit: t('CommonForm.alcohol')
    },
    CK_smok: {
      label: t('CommonForm.smoking'),
      labelUnit: t('CommonForm.smoking')
    }
  }
  
  /**
   * 주요 건강 위험 요인 팝업
   */
  const MAJOR_HEALTH_RIST_FORM = {
    SBP: {
      label: t('CommonForm.systolic_bp_risk'),
      unit: t('CommonForm.systolic_bp_unit'),
      description: t('CommonForm.systolic_bp_desc')
    },
    DBP: {
      label: t('CommonForm.diastolic_bp_risk'),
      unit: t('CommonForm.diastolic_bp_unit'),
      description: t('CommonForm.diastolic_bp_desc')
    },
    GLU: {
      label: t('CommonForm.fasting_glucose_risk'),
      unit: t('CommonForm.fasting_glucose_unit'),
      description: t('CommonForm.fasting_glucose_desc')
    },
    TG: {
      label: t('CommonForm.triglyceride_risk'),
      unit: t('CommonForm.triglyceride_unit'),
      description: t('CommonForm.triglyceride_desc')
    },
    TC: {
      label: t('CommonForm.total_cholesterol_risk'),
      unit: t('CommonForm.total_cholesterol_unit'),
      description: t('CommonForm.total_cholesterol_desc')
    },
    HDL: {
      label: t('CommonForm.hdl_cholesterol_risk'),
      unit: t('CommonForm.hdl_cholesterol_unit'),
      description: t('CommonForm.hdl_cholesterol_desc')
    },
    LDL: {
      label: t('CommonForm.ldl_cholesterol_risk'),
      unit: t('CommonForm.ldl_cholesterol_unit'),
      description: t('CommonForm.ldl_cholesterol_desc')
    },
    BMI: {
      label: t('CommonForm.bmi_risk'),
      unit: t('CommonForm.bmi_unit'),
      description: t('CommonForm.bmi_desc')
    },
    per_bodyfat: {
      label: t('CommonForm.body_fat_risk'),
      unit: t('CommonForm.body_fat_unit'),
      description: t('CommonForm.body_fat_desc')
    },
      WASM: {
        label: t('CommonForm.arm_leg_muscle_full'),
        unit: t('CommonForm.arm_leg_muscle_unit'),
        description: t('CommonForm.arm_leg_muscle_desc')
    },
    GOT: {
      label: t('CommonForm.ast_risk'),
      unit: t('CommonForm.ast_unit'),
      description: t('CommonForm.ast_desc')
    },
    GPT: {
      label: t('CommonForm.alt_risk'),
      unit: t('CommonForm.alt_unit'),
      description: t('CommonForm.alt_desc')
    },
    CREA: {
      label: t('CommonForm.creatinine_risk'),
      unit: t('CommonForm.creatinine_unit'),
      description: '',
      description_high: t('CommonForm.creatinine_desc_high'),
      description_row: t('CommonForm.creatinine_desc_low')
    },
    HB: {
      label: t('CommonForm.hemoglobin_risk'),
      unit: t('CommonForm.hemoglobin_unit'),
      description: [
        t('CommonForm.hemoglobin_desc_male'),
        t('CommonForm.hemoglobin_desc_female')
      ]
    },
    CK_sleep_time: {
      label: t('CommonForm.sleep_time_risk'),
      unit: t('CommonForm.sleep_time_unit'),
      description: t('CommonForm.sleep_time_desc')
    },
    CK_water_amt: {
      label: t('CommonForm.water_risk'),
      unit: t('CommonForm.water_unit'),
      description: t('CommonForm.water_desc')
    },
    CK_MH_stress: {
      label: t('CommonForm.stress_risk'),
      unit: '',
      description: t('CommonForm.stress_desc')
    },
    CK_MET: {
      label: t('CommonForm.activity_risk'),
      unit: t('CommonForm.activity_unit'),
      description: t('CommonForm.activity_desc')
    },
    CK_drink: {
      label: t('CommonForm.alcohol_risk'),
      unit: t('CommonForm.alcohol_unit'),
      description: [
        t('CommonForm.alcohol_desc_male'),
        t('CommonForm.alcohol_desc_female')
      ]
    },
    CK_smok: {
      label: t('CommonForm.smoking_risk'),
      unit: '',
      description: t('CommonForm.smoking_desc')
    },
    WC: {
      label: t('CommonForm.waist_circumference_full'),
      unit: t('CommonForm.waist_circumference_unit'),
      description: t('CommonForm.waist_circumference_desc')
    },
    RFS_score : {
      label : t('CommonForm.diet_quality_full'),
      unit : t('CommonForm.diet_quality_unit'),
      description : t('CommonForm.diet_quality_desc')
    }
  }

  // 노화속도 영향을 준 요인 툴팁 매핑 (item.label 기준)
  const AGING_SPEED_TOOLTIP_FORM = {
    [t('CommonForm.waist_circumference_full')]: t('CommonForm.waist_circumference_desc'),
    [t('CommonForm.arm_leg_muscle_full')]: t('CommonForm.arm_leg_muscle_desc'),
    [t('CommonForm.bmi_full')]: t('CommonForm.bmi_desc'),
    [t('CommonForm.body_fat_risk')]: t('CommonForm.body_fat_desc'),
    [t('CommonForm.systolic_blood_pressure')]: t('CommonForm.systolic_bp_desc'),
    [t('CommonForm.diastolic_blood_pressure')]: t('CommonForm.diastolic_bp_desc'),
    [t('CommonForm.fasting_glucose_full')]: t('CommonForm.fasting_glucose_desc'),
    [t('CommonForm.total_cholesterol_full')]: t('CommonForm.total_cholesterol_desc'),
    [t('CommonForm.ldl_cholesterol_full')]: t('CommonForm.ldl_cholesterol_desc'),
    [t('CommonForm.hdl_cholesterol_full')]: t('CommonForm.hdl_cholesterol_desc'),
    [t('CommonForm.triglyceride_full')]: t('CommonForm.triglyceride_desc'),
    [t('CommonForm.ast_got_full')]: t('CommonForm.ast_desc'),
    [t('CommonForm.alt_gpt_full')]: t('CommonForm.alt_desc'),
    [t('CommonForm.creatinine_full')]: t('CommonForm.creatinine_desc_high'),
    [t('CommonForm.hemoglobin_full')]: [t('CommonForm.hemoglobin_desc_male'), t('CommonForm.hemoglobin_desc_female')],
    [t('CommonForm.sleep_time_full')]: t('CommonForm.sleep_time_desc'),
    [t('CommonForm.water_full')]: t('CommonForm.water_desc'),
    [t('CommonForm.stress_full')]: t('CommonForm.stress_desc'),
    [t('CommonForm.activity_level_full')]: t('CommonForm.activity_desc'),
    [t('CommonForm.alcohol_consumption_full')]: [t('CommonForm.alcohol_desc_male'), t('CommonForm.alcohol_desc_female')],
    [t('CommonForm.quality_of_life_full')]: t('CommonForm.life_quality_desc'),
    [t('CommonForm.smoking_duration_full')]: t('CommonForm.smoking_years_desc'),
    [t('CommonForm.smoking_pack_year_full')]: t('CommonForm.smoking_amount_desc'),
  }

  return {
    AGING_ANALYSIS_FORM,
    DISEASE_ANALYSIS_FORM,
    AGING_SPEED_FORM,
    EXAMINATION_FORM,
    ABC_FORM,
    MAJOR_HEALTH_RIST_FORM,
    AGING_SPEED_TOOLTIP_FORM
  }
}