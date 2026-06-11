export const rstHE = {
  SBP: '수축기 혈압',
  DBP: '이완기 혈압',
  WC: '허리둘레',
  BMI: '체질량 지수',
  WBT_pBF: '체지방률',
  GLU: '공복혈당',
  HbA1c: '당화 혈색소',
  TC: '총 콜레스테롤',
  LDL: '저밀도 콜레스테롤',
  HDL: '고밀도 콜레스테롤',
  TG: '중성지방',
  GOT: 'AST',
  GPT: 'GPT',
  BUN: '혈중 요소 질소',
  CREA: '혈청 크레아티닌',
  hsCRP: '고감도 C반응 단백질',
  MCHC: '평균 혈구내 혈색소 농도',
  WBC: '백혈구',
  RBC: '적혈구',
  HB: '혈색소',
  HCT: '적혈구 용적률',
  PLT: '혈소판',
  DIFF_MONO: '단핵구',
  DIFF_LYMP: '임파구',
  DIFF_ESNO: '호산구',
  DIFF_NEUT: '호중구',
  GW_BW: '상대악력',
  FMR: '지방/근육 비율'
}

export const rstDetail = {
  // 1:남자, 2:여자
  1: [
    // type: 0-정상, 주의, 위험
    // 1 - 정상, 위험
    // 2 - 위험, 정상 범위, 위험
    // 3 - 위험, 정상
    {
      type: 0,
      variables: 'SBP',
      name: '수축기 혈압',
      min: 120,
      max: 140,
      unit: 'mmHg'
    },
    {
      type: 0,
      variables: 'DBP',
      name: '이완기 혈압',
      min: 80,
      max: 90,
      unit: 'mmHg'
    },
    {
      type: 1,
      variables: 'WC',
      name: '허리둘레',
      min: 90,
      unit: 'cm'
    },
    {
      type: 0,
      variables: 'BMI',
      name: '체질량 지수',
      min: 23,
      max: 25,
      unit: 'kg/m²'
    },
    {
      type: 0,
      variables: 'GLU',
      name: '공복 혈당',
      min: 100,
      max: 125,
      unit: 'mg/㎗'
    },
    {
      type: 0,
      variables: 'HbA1c',
      name: '당화 혈색소',
      min: 5.6,
      max: 6.5,
      unit: '%'
    },
    {
      type: 0,
      variables: 'TG',
      name: '중성 지방',
      min: 150,
      max: 200,
      unit: 'mg/㎗'
    },
    {
      type: 0,
      variables: 'TC',
      name: '총 콜레스테롤',
      min: 200,
      max: 240,
      unit: 'mg/㎗'
    },
    {
      type: 1,
      variables: 'HDL',
      name: '고밀도 콜레스테롤',
      min: 40,
      unit: 'mg/㎗'
    },
    {
      type: 0,
      variables: 'LDL',
      name: '저밀도 콜레스테롤',
      min: 130,
      max: 160,
      unit: 'mg/㎗'
    },
    {
      type: 1,
      variables: 'GOT',
      name: '아스파테이트 아미노전이효소\n(AST/SGOT)',
      min: 40,
      unit: 'IU/ℓ'
    },
    {
      type: 1,
      variables: 'GPT',
      name: '알라닌 아미노전이효소\n(ALT/SGPT)',
      min: 35,
      unit: 'IU/ℓ'
    },
    {
      type: 1,
      variables: 'rGTP',
      name: 'GGT',
      min: 63,
      unit: 'IU/ℓ'
    },
    {
      type: 2,
      variables: 'WBC',
      name: '백혈구',
      min: 4.0,
      max: 10.0,
      unit: 'Thous/uℓ'
    },
    {
      type: 2,
      variables: 'RBC',
      name: '적혈구',
      min: 4.2,
      max: 6.3,
      unit: 'Mil/uℓ'
    },
    {
      type: 2,
      variables: 'PLT',
      name: '혈소판',
      min: 150,
      max: 350,
      unit: 'Thous/uℓ'
    },
    {
      type: 2,
      variables: 'HB',
      name: '혈색소',
      min: 13.0,
      max: 16.5,
      unit: 'Thous/uℓ'
    },

    {
      type: 2,
      variables: 'HCT',
      name: '적혈구 용적률',
      min: 36.0,
      max: 55.0,
      unit: '%'
    },
    {
      type: 2,
      variables: 'BUN',
      name: '혈중 요소 질소',
      min: 8.0,
      max: 22.0,
      unit: 'mg/㎗'
    },
    {
      type: 1,
      variables: 'CREA',
      name: '혈청 크레아티닌',
      min: 1.5,
      unit: 'mg/㎗'
    },
    {
      type: 0,
      variables: 'hsCRP',
      name: '고감도 C반응 단백질',
      min: 1.0,
      max: 3.0,
      unit: 'mg/ℓ'
    },
    {
      type: 2,
      variables: 'MCV',
      name: '평균 적혈구 용적',
      min: 81.0,
      max: 96.0,
      unit: 'fL'
    },
    {
      type: 2,
      variables: 'MCH',
      name: '평균 적혈구 색소량',
      min: 27.0,
      max: 33.0,
      unit: 'pg'
    },
    {
      type: 2,
      variables: 'MCHC',
      name: '평균 적혈구 색소농도',
      min: 33.0,
      max: 35.0,
      unit: '%'
    },
    {
      type: 2,
      variables: 'ESR',
      name: '적혈구 침강 속도',
      min: 2.0,
      max: 15.0,
      unit: 'mmHr'
    },
    {
      type: 2,
      variables: 'DIFF_NEUT',
      name: '호중구',
      min: 38.0,
      max: 78.0,
      unit: '%'
    },
    {
      type: 2,
      variables: 'DIFF_LYMP',
      name: '림프구',
      min: 17.0,
      max: 46.0,
      unit: '%'
    },
    {
      type: 2,
      variables: 'DIFF_MONO',
      name: '단구',
      min: 2.0,
      max: 8.0,
      unit: '%'
    },
    {
      type: 2,
      variables: 'DIFF_ESNO',
      name: '호산구',
      min: 1.0,
      max: 6.0,
      unit: '%'
    },
    {
      type: 2,
      variables: 'DIFF_BASO',
      name: '호염구',
      min: 0.0,
      max: 2.0,
      unit: '%'
    }
  ],
  2: [
    // type: 0-정상, 주의, 위험
    // 1 - 정상, 위험
    // 2 - 위험, 정상 범위, 위험
    // 3 - 위험, 정상
    {
      type: 0,
      variables: 'SBP',
      name: '수축기 혈압',
      min: 120,
      max: 140,
      unit: 'mmHg'
    },
    {
      type: 0,
      variables: 'DBP',
      name: '이완기 혈압',
      min: 80,
      max: 90,
      unit: 'mmHg'
    },
    {
      type: 1,
      variables: 'WC',
      name: '허리둘레',
      min: 85,
      unit: 'cm'
    },
    {
      type: 0,
      variables: 'BMI',
      name: '체질량 지수',
      min: 23,
      max: 25,
      unit: 'kg/m²'
    },
    {
      type: 0,
      variables: 'GLU',
      name: '공복 혈당',
      min: 100,
      max: 125,
      unit: 'mg/㎗'
    },
    {
      type: 0,
      variables: 'HbA1c',
      name: '당화 혈색소',
      min: 5.6,
      max: 6.5,
      unit: '%'
    },
    {
      type: 0,
      variables: 'TG',
      name: '중성 지방',
      min: 150,
      max: 200,
      unit: 'mg/㎗'
    },
    {
      type: 0,
      variables: 'TC',
      name: '총 콜레스테롤',
      min: 200,
      max: 240,
      unit: 'mg/㎗'
    },
    {
      type: 1,
      variables: 'HDL',
      name: '고밀도 콜레스테롤',
      min: 40,
      unit: 'mg/㎗'
    },
    {
      type: 0,
      variables: 'LDL',
      name: '저밀도 콜레스테롤',
      min: 130,
      max: 160,
      unit: 'mg/㎗'
    },
    {
      type: 1,
      variables: 'GOT',
      name: '아스파테이트 아미노전이효소\n(AST/SGOT)',
      min: 40,
      unit: 'IU/ℓ'
    },
    {
      type: 1,
      variables: 'GPT',
      name: '알라닌 아미노전이효소\n(ALT/SGPT)',
      min: 35,
      unit: 'IU/ℓ'
    },
    {
      type: 1,
      variables: 'rGTP',
      name: 'GGT',
      min: 35,
      unit: 'IU/ℓ'
    },
    {
      type: 2,
      variables: 'WBC',
      name: '백혈구',
      min: 4.0,
      max: 10.0,
      unit: 'Thous/uℓ'
    },
    {
      type: 2,
      variables: 'RBC',
      name: '적혈구',
      min: 4.0,
      max: 5.4,
      unit: 'Mil/uℓ'
    },
    {
      type: 2,
      variables: 'PLT',
      name: '혈소판',
      min: 150,
      max: 350,
      unit: 'Thous/uℓ'
    },
    {
      type: 2,
      variables: 'HB',
      name: '혈색소',
      min: 12.0,
      max: 15.5,
      unit: 'Thous/uℓ'
    },

    {
      type: 2,
      variables: 'HCT',
      name: '적혈구 용적률',
      min: 33.0,
      max: 51.0,
      unit: '%'
    },
    {
      type: 2,
      variables: 'BUN',
      name: '혈중 요소 질소',
      min: 8.0,
      max: 22.0,
      unit: 'mg/㎗'
    },
    {
      type: 1,
      variables: 'CREA',
      name: '혈청 크레아티닌',
      min: 1.5,
      unit: 'mg/㎗'
    },
    {
      type: 0,
      variables: 'hsCRP',
      name: '고감도 C반응 단백질',
      min: 1.0,
      max: 3.0,
      unit: 'mg/ℓ'
    },
    {
      type: 2,
      variables: 'MCV',
      name: '평균 적혈구 용적',
      min: 79.0,
      max: 95.0,
      unit: 'fL'
    },
    {
      type: 2,
      variables: 'MCH',
      name: '평균 적혈구 색소량',
      min: 26.0,
      max: 32.0,
      unit: 'pg'
    },
    {
      type: 2,
      variables: 'MCHC',
      name: '평균 적혈구 색소농도',
      min: 33.0,
      max: 35.0,
      unit: '%'
    },
    {
      type: 2,
      variables: 'ESR',
      name: '적혈구 침강 속도',
      min: 2.0,
      max: 20.0,
      unit: 'mmHr'
    },
    {
      type: 2,
      variables: 'DIFF_NEUT',
      name: '호중구',
      min: 38.0,
      max: 78.0,
      unit: '%'
    },
    {
      type: 2,
      variables: 'DIFF_LYMP',
      name: '림프구',
      min: 17.0,
      max: 46.0,
      unit: '%'
    },
    {
      type: 2,
      variables: 'DIFF_MONO',
      name: '단구',
      min: 2.0,
      max: 8.0,
      unit: '%'
    },
    {
      type: 2,
      variables: 'DIFF_ESNO',
      name: '호산구',
      min: 1.0,
      max: 6.0,
      unit: '%'
    },
    {
      type: 2,
      variables: 'DIFF_BASO',
      name: '호염구',
      min: 0.0,
      max: 2.0,
      unit: '%'
    }
  ]
}

export const comph = {
  CK_18_2N6: '오메가6 (리롤레산)',
  CK_18_3N3: '오메가3 (알파리놀레산)',
  CK_20_5N3: 'EPA',
  CK_B2: '리보플라민',
  CK_B12: '비타민B12',
  CK_CA: '칼슘',
  CK_CHOL: '콜레스테롤',
  CK_CU: '구리',
  CK_EN: '에너지',
  CK_EN_CHO: '탄수화물',
  CK_EN_Comp: '에너지 구성',
  CK_EN_FAT: '지방',
  CK_EN_PRO: '단백질',
  CK_EN_SUGAR: '총 당류',
  CK_EPA_DHA: '오메가3 (EPA+DHA)',
  CK_FE: '철',
  CK_FOLA: '엽산',
  CK_Ile: '이소류신',
  CK_Isofla: '이소플라본',
  CK_K: '칼륨',
  CK_Leu: '류신',
  //   CK_MET: "활동량",
  CK_MG: '마그네슘',
  //   CK_MH_stress: "스트레스",
  CK_MUFA: '단일 불포화 지방산',
  CK_NA: '나트륨',
  CK_SFA: '포화지방산',
  CK_TDF: '식이섬유',
  CK_TotCar: '총 카로티노이드',
  CK_VITC: '비타민C',
  CK_VITE: '비타민E',
  CK_Val: '발린',
  CK_ZN: '아연'
  //   CK_drink: "음주",
  //   CK_sleep_time: "수면",
  //   CK_smok: "흡연",
  //   CK_water_amt: "수분 섭취",
}

export const comphSm = {
  //   CK_nutrition: "영양",
  MET: '활동량',
  sleep_time: '수면',
  drink_amt: '음주',
  CK_water_amt: '수분',
  CK_smok: '흡연',
  CK_MH_stress: '스트레스'
}

export const comphSmCheckRange = {
  CK_smok_dur: {
    check_max: 12.39234,
    min: 0,
    max: 31
  },
  CK_smok_amt: {
    check_max: 6.907437,
    min: 0,
    max: 14
  },
  CK_sleep_time: {
    check_min: 6.987878,
    min: 0,
    max: 14
  },
  CK_MET: {
    check_min: 5.347205,
    min: 0,
    max: 11
  },
  CK_drink_amt: {
    check_max: 10.97853,
    min: 0,
    max: 22
  },
  CK_eq5d: {
    check_min: 0.942851,
    min: 0,
    max: 1
  }
}

export const comphAll = {
  ...comph,
  ...comphSm
}

export const Dis = {
  HTN_SC_N: '고혈압',
  Obe_SC_N: '비만',
  T2D_SC_N: '고혈당',
  Liver_SC_N: '간 기능 저하',
  Anem_SC_N: '빈혈',
  Lipid_SC_N: '고지혈증',
  Infla_SC_N: '만성염증',
  Circ_SC_N: '혈행 이상',
  Musc_SC_N: '근손실'
}

export const com = {
  CK_water_amt: '수분섭취량',
  CK_drink_amt: '음주',
  CK_smok: '흡연',
  CK_MET: '신체 활동량',
  CK_sleep_time: '수면시간',
  CK_eq5d: '삶의 질'
}
export const rst = {
  SBP: '수축기 혈압',
  DBP: '이완기 혈압',
  WC: '허리둘레',
  BMI: '체질량 지수',
  //   WBT_pBF: "체지방률",
  GLU: '공복혈당',
  //   HbA1c: "당화 혈색소",
  TC: '총 콜레스테롤',
  LDL: '저밀도 콜레스테롤',
  HDL: '고밀도 콜레스테롤',
  TG: '중성지방',
  GOT: '아스파 테이트아미노 전이효소',
  GPT: '알라닌 아미노 전이효소',
  //   BUN: "혈중 요소 질소",
  CREA: '혈청 크레아티닌',
  //   hsCRP: "고감도 C반응 단백질",
  //   MCHC: "평균 혈구내 혈색소 농도",
  //   WBC: "백혈구",
  //   RBC: "적혈구",
  HB: '혈색소'
  //   HCT: "적혈구 용적률",
  //   PLT: "혈소판",
  //   DIFF_MONO: "단핵구",
  //   DIFF_LYMP: "임파구",
  //   DIFF_ESNO: "호산구",
  //   DIFF_NEUT: "호중구",
  //   GW_BW: "상대악력",
  //   FMR: "지방/근육 비율",
}

export const rstIntegratedAriStatus = {
  WC: '허리둘레',
  BMI: '체질량 지수',
  SBP: '수축기 혈압',
  DBP: '이완기 혈압',
  GLU: '공복혈당',
  TC: '총 콜레스테롤',
  LDL: '저밀도 콜레스테롤',
  HDL: '고밀도 콜레스테롤',
  TG: '중성지방',
  GOT: '아스파테이트 아미노 전이효소',
  GPT: '알라닌 아미노 전이효소',
  CREA: '혈청 크레아티닌',
  HB: '혈색소',
  CK_sleep_time: '수면',
  CK_water_amt: '수분',
  CK_MH_stress: '스트레스',
  CK_MET: '활동량',
  CK_drink: '음주',
  CK_smok: '흡연',
  CK_eq5d: '삶의 질'

}

export const tracking_hcr = [
  {
    variables: 'HE_wc',
    hcr_variables: 'WC',
    name: '허리둘레',
    unit: 'cm',
    check_max: 83.02538
  },
  {
    variables: 'HE_BMI',
    hcr_variables: 'BMI',
    name: '체질량지수',
    unit: 'kg/m²',
    check_min: 18.5,
    check_max: 23.0
  },
  {
    variables: 'SBP',
    hcr_variables: 'SBP',
    name: '수축기혈압',
    unit: 'mmHg',
    check_max: 119.4743
  },
  {
    variables: 'DBP',
    hcr_variables: 'DBP',
    name: '이완기혈압',
    unit: 'mmHg',
    check_max: 75.22055
  },
  {
    variables: 'GLU',
    hcr_variables: 'GLU',
    name: '공복혈당',
    unit: 'mg/dL',
    check_max: 100
  },
  {
    variables: 'TC',
    hcr_variables: 'TC',
    name: '총콜레스테롤',
    unit: 'mg/dL',
    check_max: 191.1115,
    blood: true
  },
  {
    variables: 'LDL',
    hcr_variables: 'LDL',
    name: '저밀도콜레스테롤',
    unit: 'mg/dL',
    check_max: 113.4704,
    blood: true
  },
  {
    variables: 'HDL',
    hcr_variables: 'HDL',
    name: '고밀도 콜레스테롤',
    unit: 'mg/dL',
    check_min: 51.33564,
    blood: true
  },
  {
    variables: 'TG',
    hcr_variables: 'TG',
    name: '중성지방',
    unit: 'mg/dL',
    check_max: 133.3174,
    blood: true
  },
  {
    variables: 'GOT',
    hcr_variables: 'GOT',
    name: '아스파테이트 아미노전이효소',
    unit: '(AST/SGOT, IU/L)',
    check_max: 23.65014
  },
  {
    variables: 'GPT',
    hcr_variables: 'GPT',
    name: '알라닌 아미노전이효소',
    unit: 'ALT/SGPT, IU/L',
    check_max: 22.39827
  },
  {
    variables: 'CREA',
    hcr_variables: 'CREA',
    name: '혈청 크레아티닌',
    unit: 'mg/dL',
    check_min: 0.71,
    check_max: 0.88
  },
  {
    variables: 'HB',
    hcr_variables: 'HB',
    name: '혈색소',
    unit: 'g/dL',
    check_min: 13.2,
    check_max: 14.7
  }
]
