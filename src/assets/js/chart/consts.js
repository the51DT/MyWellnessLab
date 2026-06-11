export const VAR_EXIST_REPORT = 100;
export const VAR_MAX_INPUT_PROGRESS = 26;
export const VAR_RECORD_NO_BLOOD = 1000; //스크래핑 지질대사 없는 경우
export const VAR_RECORD_INPUT_BLOOD = 2000; //스크래핑 지질대사 입력한 경우
export const VAR_RECORD_EXIST_BLOOD = 3000; //스크래핑 지질대사 있는 경우
export const TARGET_WIDTH = 960; //1280;

export const input_limitation = {
  age: { min: 1, max: 120 },
  sex: { min: 1, max: 2 },
  HT: { min: 125.3, max: 198 }, //키
  WT: { min: 30.6, max: 164.8 }, //체중
  WC: { min: 50.5, max: 147.5 }, //허리둘레
  BMI: { min: 11.4, max: 62.6 }, //체질량지수

  SBP: { min: 76, max: 243 }, //수축기혈압
  DBP: { min: 10, max: 148 }, //이완기혈압
  GLU: { min: 40, max: 553 }, //공복혈당
  HbA1c: { min: 5, max: 21.3 }, //당화혈색소
  TC: { min: 68, max: 482 }, //총콜레스테롤
  LDL: { min: 0, max: 382.6 }, //저밀도콜레스테롤
  HDL: { min: 5.918, max: 145.298 }, //고밀도콜레스테롤
  TG: { min: 19, max: 2455 }, //중성지방
  GOT: { min: 1, max: 732 }, //AST
  GPT: { min: 1, max: 927 }, //ALT
  CREA: { min: 0.2, max: 14.38 }, //혈청크레아티닌
  HB: { min: 5, max: 21.3 }, //혈색소
};

export const color = {
  red: "#c2373f",
  yellow: "#fdc840",
  green: "#59c370",
};

export const reage_data = [
  {
    age: 20,
    OXI_MIN: 15,
    OXI_MEAN: 79,
    OXI_MAX: 100,
    MET_MIN: 25,
    MET_MEAN: 78,
    MET_MAX: 95,
  },
  {
    age: 30,
    OXI_MIN: 0,
    OXI_MEAN: 73,
    OXI_MAX: 99,
    MET_MIN: 35,
    MET_MEAN: 75,
    MET_MAX: 96,
  },
  {
    age: 40,
    OXI_MIN: 4,
    OXI_MEAN: 68,
    OXI_MAX: 94,
    MET_MIN: 0,
    MET_MEAN: 73,
    MET_MAX: 89,
  },
  {
    age: 50,
    OXI_MIN: 9,
    OXI_MEAN: 63,
    OXI_MAX: 89,
    MET_MIN: 34,
    MET_MEAN: 71,
    MET_MAX: 100,
  },
  {
    age: 60,
    OXI_MIN: 17,
    OXI_MEAN: 57,
    OXI_MAX: 84,
    MET_MIN: 39,
    MET_MEAN: 69,
    MET_MAX: 88,
  },
  {
    age: 70,
    OXI_MIN: 18,
    OXI_MEAN: 53,
    OXI_MAX: 77,
    MET_MIN: 40,
    MET_MEAN: 68,
    MET_MAX: 89,
  },
  {
    age: 80,
    OXI_MIN: 16,
    OXI_MEAN: 51,
    OXI_MAX: 72,
    MET_MIN: 48,
    MET_MEAN: 68,
    MET_MAX: 81,
  },
];
