class HealthARIndicator {
  // 25.07.23
  // PDF 항목에 보여지는 순서로 인해 order 속성 추가
  // normal, warning, danger 의 각 ratio 는 클라이언트에서 설정되는 값이며 그래프 이미지 상에 구간의 비율을 의미한다.
  // type: nwd, dwn, dnd, nd, dn
  // 만약 노화속도에 영향을 준 요인에서 그래프 이미지가 바뀔 경우 assets/images 의 이미지 변경과 각 그래프 이미지 상 내에 구간비율, type 속성을 변경해줘야 한다.
  constructor() {
    this.per_bodyfat = {
      name: "체지방률",
      order: 3,
      en_name: "",
      unit: "",
      keyword: "체지방률",
      type: "nwd",
      normal_range_min: 0,
      normal_range_max: 0.35,
      normal_range_ratio: 0,
      warning_range_min: 0.35,
      warning_range_max: 0.5,
      warning_range_ratio: 0.5,
      danger_range_min: 0.5,
      danger_range_max: 1.5,
      danger_range_ratio: 0.9,
      range_min: 0,
      range_max: 1.5,
      status: 0,
      check: 0,
      imgSrc: "per_bodyfat",
      imgTop: "9",
      risk: 0,
    };
    this.WASM = {
      name: "체중 대비 팔다리 근육률",
      order: 4,
      en_name: "",
      unit: "",
      keyword: "체중 대비 팔다리 근육률",
      type: "dwn",
      normal_range_min: 5,
      normal_range_max: 10.3,
      normal_range_ratio: 0.5,
      warning_range_min: 10.3,
      warning_range_max: 11.1,
      warning_range_ratio: 0.1,
      danger_range_min: 11.1,
      danger_range_max: 15,
      danger_range_ratio: 0,
      range_min: 0,
      range_max: 15,
      status: 0,
      check: 0,
      imgSrc: "wasm",
      imgTop: "9",
      risk: 0,
    };
    this.WWI = {
      name: "체중 대비 허리둘레",
      en_name: "",
      unit: "",
      keyword: "체중 대비 허리둘레",
      type: "nwd",
      normal_range_min: 5,
      normal_range_max: 10.3,
      normal_range_ratio: 0,
      warning_range_min: 10.3,
      warning_range_max: 11.1,
      warning_range_ratio: 0.5,
      danger_range_min: 11.1,
      danger_range_max: 15,
      danger_range_ratio: 0.85,
      range_min: 0,
      range_max: 15,
      status: 0,
      check: 0,
      imgSrc: "wwi",
      imgTop: "9",
      risk: 0,
    };
    this.FMR = {
      name: "근육량 대비 체지방량",
      en_name: "",
      unit: "",
      keyword: "근육량 대비 체지방량",
      type: "nwd",
      normal_range_min: 0,
      normal_range_max: 0.35,
      normal_range_ratio: 0,
      warning_range_min: 0.35,
      warning_range_max: 0.5,
      warning_range_ratio: 0.5,
      danger_range_min: 0.5,
      danger_range_max: 1.5,
      danger_range_ratio: 0.85,
      range_min: 0,
      range_max: 1.5,
      status: 0,
      check: 0,
      imgSrc: "fmr",
      imgTop: "9",
      risk: 0,
    };

    this.SBP = {
      name: "수축기 혈압",
      order: 11,
      en_name: "SBP",
      keyword: "수축기 혈압",
      unit: "mmHg",
      data: 0,
      type: "nwd",
      normal_range_min: 0,
      normal_range_max: 119.5,
      normal_range_ratio: 0,
      warning_range_min: 119.5,
      warning_range_max: 140,
      warning_range_ratio: 0.5,
      danger_range_min: 140,
      danger_range_max: 240,
      danger_range_ratio: 0.865,
      range_min: 0,
      range_max: 240,
      status: 0,
      check: 0,
      imgSrc: "sbp",
      imgTop: "9",
      risk: 0,
    };
    this.DBP = {
      name: "이완기 혈압",
      order: 12,
      en_name: "DBP",
      keyword: "이완기 혈압",
      unit: "mmHg",
      data: 0,
      type: "nwd",
      normal_range_min: 0,
      normal_range_max: 75.2,
      normal_range_ratio: 0,
      warning_range_min: 75.2,
      warning_range_max: 88,
      warning_range_ratio: 0.5,
      danger_range_min: 88,
      danger_range_max: 160,
      danger_range_ratio: 0.9,
      range_min: 0,
      range_max: 160,
      status: 0,
      check: 0,
      imgSrc: "dbp",
      imgTop: "9",
      risk: 0,
    };
    this.GLU = {
      name: "공복혈당",
      order: 5,
      en_name: "Glucose",
      keyword: "공복혈당",
      unit: "mg/㎗",
      data: 0,
      type: "nwd",
      normal_range_min: 0,
      normal_range_max: 100,
      normal_range_ratio: 0,
      warning_range_min: 100,
      warning_range_max: 123,
      warning_range_ratio: 0.5,
      danger_range_min: 123,
      danger_range_max: 200,
      danger_range_ratio: 0.9,
      range_min: 0,
      range_max: 200,
      status: 0,
      check: 0,
      imgSrc: "glu",
      imgTop: "9",
      risk: 0,
    };

    this.TG = {
      name: "중성지방",
      order: 10,
      en_name: "Triglyceride",
      keyword: "중성지방",
      unit: "mg/㎗",
      data: 0,
      type: "nwd",
      normal_range_min: 0,
      normal_range_max: 133.3,
      normal_range_ratio: 0,
      warning_range_min: 133.3,
      warning_range_max: 200,
      warning_range_ratio: 0.5,
      danger_range_min: 200,
      danger_range_max: 300,
      danger_range_ratio: 0.865,
      range_min: 0,
      range_max: 300,
      status: 0,
      check: 0,
      imgSrc: "tg",
      imgTop: "9",
      risk: 0,
    };

    this.TC = {
      name: "총 콜레스테롤",
      order: 7,
      en_name: "T-Cholesterol",
      keyword: "총 콜레스테롤",
      unit: "mg/㎗",
      data: 0,
      type: "nwd",
      normal_range_min: 0,
      normal_range_max: 191.1,
      normal_range_ratio: 0,
      warning_range_min: 191.1,
      warning_range_max: 240,
      warning_range_ratio: 0.5,
      danger_range_min: 240,
      danger_range_max: 400,
      danger_range_ratio: 0.9,
      range_min: 0,
      range_max: 400,
      status: 0,
      check: 0,
      imgSrc: "tc",
      imgTop: "9",
      risk: 0,
    };
    this.HDL = {
      name: "고밀도 콜레스테롤",
      order: 9,
      en_name: "HDL-C",
      keyword: "고밀도 콜레스테롤",
      unit: "mg/㎗",
      data: 0,
      type: "dwn",
      normal_range_min: 51.3,
      normal_range_max: 80,
      normal_range_ratio: 0.5,
      warning_range_min: 40,
      warning_range_max: 51.3,
      warning_range_ratio: 0.135,
      danger_range_min: 0,
      danger_range_max: 40,
      danger_range_ratio: 0,
      range_min: 0,
      range_max: 80,
      status: 0,
      check: 0,
      imgSrc: "hdl",
      imgTop: "9",
      risk: 0,
    };
    this.LDL = {
      name: "저밀도 콜레스테롤",
      order: 8,
      en_name: "LDL-C",
      keyword: "저밀도 콜레스테롤",
      unit: "mg/㎗",
      data: 0,
      type: "nwd",
      normal_range_min: 0,
      normal_range_max: 113.4,
      normal_range_ratio: 0,
      warning_range_min: 113.4,
      warning_range_max: 157.2,
      warning_range_ratio: 0.5,
      danger_range_min: 157.2,
      danger_range_max: 260,
      danger_range_ratio: 0.9,
      range_min: 0,
      range_max: 260,
      status: 0,
      check: 0,
      imgSrc: "ldl",
      imgTop: "9",
      risk: 0,
    };
    this.BMI = {
      name: "체질량지수",
      order: 2,
      en_name: "",
      keyword: "체질량지수",
      unit: "kg/m²",
      data: 0,
      type: "dnd",
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
      status: 0,
      check: 0,
      imgSrc: "bmi",
      imgTop: "9.4",
      risk: 0,
    };
    this.WC = {
      name: "허리둘레",
      order: 1,
      en_name: "",
      keyword: "허리둘레",
      unit: "cm",
      data: 0,
      type: "nwd",
      normal_range_min: 0,
      normal_range_max: 87.1,
      normal_range_ratio: 0,
      warning_range_min: 87.1,
      warning_range_max: 90,
      warning_range_ratio: 0.5,
      danger_range_min: 90,
      danger_range_max: 160,
      danger_range_ratio: 0.865,
      range_min: 0,
      range_max: 160,
      status: 0,
      check: 0,
      imgSrc: "wc",
      imgTop: "9",
      risk: 0,
    };
    this.GOT = {
      name: "아스파테이트 아미노전이효소",
      order: 13,
      en_name: "AST/SGOT",
      keyword: "아스파테이트 아미노전이효소",
      unit: "IU/ℓ",
      data: 0,
      type: "nwd",
      normal_range_min: 0,
      normal_range_max: 23.7,
      normal_range_ratio: 0,
      warning_range_min: 23.7,
      warning_range_max: 33,
      warning_range_ratio: 0.5,
      danger_range_min: 33,
      danger_range_max: 80,
      danger_range_ratio: 0.9,
      range_min: 0,
      range_max: 80,
      status: 0,
      check: 0,
      imgSrc: "got",
      imgTop: "9",
      risk: 0,
    };
    this.GPT = {
      name: "알라닌 아미노전이효소",
      order: 14,
      en_name: "ALT/SGPT",
      keyword: "알라닌 아미노전이효소",
      unit: "IU/ℓ",
      data: 0,
      type: "nwd",
      normal_range_min: 0,
      normal_range_max: 22.4,
      normal_range_ratio: 0,
      warning_range_min: 22.4,
      warning_range_max: 35,
      warning_range_ratio: 0.5,
      danger_range_min: 35,
      danger_range_max: 70,
      danger_range_ratio: 0.865,
      range_min: 0,
      range_max: 70,
      status: 0,
      check: 0,
      imgSrc: "gpt",
      imgTop: "9",
      risk: 0,
    };
    this.CREA = {
      name: "혈청크레아티닌",
      order: 15,
      en_name: "Cr/Creatinine",
      keyword: "혈청크레아티닌",
      unit: "mg/㎗",
      data: 0,
      type: "nd",
      normal_range_min: 0,
      normal_range_max: 1.05,
      normal_range_ratio: 0,
      danger_range_min: 1.05,
      danger_range_max: 3,
      danger_range_ratio: 0.5,
      range_min: 0,
      range_max: 3,
      status: 0,
      check: 0,
      imgSrc: "crea",
      imgTop: "9.4",
      risk: 0,
    };

    this.HB = {
      name: "혈색소",
      order: 6,
      en_name: "Hb/Hemoglobin",
      keyword: "혈색소",
      unit: "Thous/uℓ",
      data: 0,
      type: "dnd",
      normal_range_min: 13.6,
      normal_range_max: 16.6,
      normal_range_ratio: 0.1,
      danger_1_range_min: 0,
      danger_1_range_max: 13.6,
      danger_1_range_ratio: 0,
      danger_2_range_min: 16.6,
      danger_2_range_max: 26,
      danger_2_range_ratio: 0.9,
      range_min: 0,
      range_max: 26,
      status: 0,
      check: 0,
      imgSrc: "hb",
      imgTop: "9.4",
      risk: 0,
    };
    this.smok_dur = {
      name: "총 흡연기간",
      order: 20,
      en_name: "",
      keyword: "총 흡연기간",
      unit: "년",
      type: "nwd",
      normal_range_min: 0,
      normal_range_max: 0,
      normal_range_ratio: 0,
      warning_range_min: 0,
      warning_range_max: 12.4,
      warning_range_ratio: 0.1,
      danger_range_min: 12.4,
      danger_range_max: 31,
      danger_range_ratio: 0.5,
      range_min: 0,
      range_max: 31,
      status: 0,
      check: 0,
      imgSrc: "smok-dur",
      imgTop: "9",
      risk: 0,
    };
    this.pack_year = {
      name: "담배 소비량",
      order: 19,
      en_name: "",
      keyword: "담배 소비량",
      type: "nd",
      unit: "갑/년",
      normal_range_min: 0,
      normal_range_max: 6.9,
      normal_range_ratio: 0,
      danger_range_min: 6.9,
      danger_range_max: 14,
      danger_range_ratio: 0.5,
      range_min: 0,
      range_max: 14,
      status: 0,
      check: 0,
      imgSrc: "pack-year",
      imgTop: "9",
      risk: 0,
    };
    this.sleep_time = {
      name: "수면시간",
      order: 18,
      en_name: "",
      keyword: "수면시간",
      type: "dn",
      unit: "hour",
      normal_range_min: 0,
      normal_range_max: 6.98,
      normal_range_ratio: 0.5,
      danger_range_min: 6.98,
      danger_range_max: 14,
      danger_range_ratio: 0,
      range_min: 0,
      range_max: 14,
      status: 0,
      check: 0,
      imgSrc: "sleep-time",
      imgTop: "9.3",
      risk: 0,
    };
    this.MET = {
      name: "활동량",
      order: 16,
      en_name: "",
      keyword: "활동량",
      unit: "MET",
      type: "dwn",
      normal_range_min: 0,
      normal_range_max: 0,
      normal_range_ratio: 0.5,
      warning_range_min: 0,
      warning_range_max: 5.34,
      warning_range_ratio: 0.1,
      danger_range_min: 5.34,
      danger_range_max: 11,
      danger_range_ratio: 0,
      range_min: 0,
      range_max: 11,
      status: 0,
      check: 0,
      imgSrc: "met",
      imgTop: "9",
      risk: 0,
    };
    this.drink_amt = {
      name: "음주량",
      order: 17,
      en_name: "",
      keyword: "음주량",
      unit: "g/일",
      type: "nwd",
      normal_range_min: 0,
      normal_range_max: 10.97,
      normal_range_ratio: 0,
      warning_range_min: 10.97,
      warning_range_max: 49,
      warning_range_ratio: 0.5,
      danger_range_min: 49,
      danger_range_max: 53,
      danger_range_ratio: 0.865,
      range_min: 0,
      range_max: 53,
      status: 0,
      check: 0,
      imgSrc: "drink-amt",
      imgTop: "9",
      risk: 0,
    };
    this.EQ5D = {
      name: "삶의질",
      order: 21,
      en_name: "",
      keyword: "삶의질",
      type: "dn",
      unit: "점",
      normal_range_min: 0,
      normal_range_max: 0.94,
      normal_range_ratio: 0.5,
      danger_range_min: 0.94,
      danger_range_max: 1,
      danger_range_ratio: 0,
      range_min: 0,
      range_max: 1,
      status: 0,
      check: 0,
      imgSrc: "eq5d",
      imgTop: "9.4",
      risk: 0,
    };
    this.RFS = {
      name: "식사의질",
      order: 22,
      keyword: "식사의질",
      type: "dwn",
      normal_range_min: 0,
      normal_range_max: 27.47,
      normal_range_ratio: 0.85,
      warning_range_min: 27.47,
      warning_range_max: 37,
      warning_range_ratio: 0.5,
      danger_range_min: 37,
      danger_range_max: 47,
      danger_range_ratio: 0,
      range_min: 0,
      range_max: 47,
      status: 0,
      check: 0,
      imgSrc: "rfs",
      imgTop: "9.4",
      risk: 0,
    };

    this.WC.list = [
      "허리둘레는 복부비만을 판정할 수 있는 신체계측치입니다. 체질량지수로는 확인되지 않은 마른 비만도 확인할 수 있기 때문에 체질량지수와 함께 관심을 가지는 것이 좋습니다.",
      "복부비만인 경우, 고혈압, 공복혈당장애, 고중성지방, 낮은HDL콜레스테롤을 주의해야 합니다. 이들 위험요인이 있으면 심뇌혈관의 질환 발생 위험이 커지고 다른 만성질환을 유발할 수 있어 주의해야 합니다.",
      "참고로, 건강검진 기준에 의하면 허리둘레가 성인 남자 90cm 이상, 성인 여자 85cm 이상이면 복부비만입니다.",
    ];

    this.BMI.list = [
      "체질량지수는 키와 몸무게를 이용해 간접적으로 비만 위험도를 측정하는데 사용됩니다. 단, 체질량지수는 근육과 지방 무게를 구별하지 못하므로 참고만 하는 것이 좋습니다.",
      "체질량지수가 너무 낮거나 너무 높으면 사망률이 높아지는 상관관계가 있습니다.",
      "참고로, 건강검진 기준에 의하면 체질량지수가 18.5~22.9 사이면 정상 범위에 속하며, 비만으로 인한 질병이나 사망에 대한 위험도는 상대적으로 낮다고 볼 수 있습니다.",
    ];

    // this.WWI.list = [
    //   "체중과 허리둘레는 비만으로 발생하는 다양한 건강관련 위험을 판단하는데 중요한 계측 지표입니다. ",
    //   "체중 대비 허리둘레가 높을 수록 비만과 관련한 대사 질환 위험이 높아집니다. <br/>허리둘레를 감소시키기 위해서는 체지방 감소를 위해 노력해야하며, 꾸준한 유산소 운동과 식습관 조절이 필요합니다."
    // ];

    // this.FMR.list = [
    //   "근육은 우리 몸의 자세 유지 및 독립적인 움직임의 바탕이 됩니다. 나이가 들수록 근손실이 발생하므로 근육량을 표준 이상으로 관리하는 것은 활기찬 일상을 위해 중요한 요소입니다. ",
    //   "높은 근육량은 인슐린 저항성을 낮추어 적정 혈당을 유지하는데 도움을 주지만, 과도한 체지방량은 인슐린 저항성을 높이고 염증 수치를 증가시킵니다. ",
    //   "근육량 대비 체지방량의 비율을 낮추면 신체활동 능력을 증가시키고, 당뇨를 비롯한 다양한 대사 질환을 예방할 수 있습니다."
    // ];

    this.SBP.list = [
      "혈압은 동맥혈관 벽에 대항한 혈액의 압력을 말합니다. 혈액의 압력은 심장이 수축하여 동맥혈관을 통해 온 몸으로 혈액을 내보낼 때 가장 높은데, 이때의 혈압을 수축기 혈압이라고 합니다.",
      "고혈압은 동맥 혈압이 정상보다 높아진 상태이며, 혈압이 높을수록 심장병과 뇌졸중에 미치는 영향은 크게 증가하는 것으로 알려져 있습니다.",
      "참고로, 건강검진 기준에 의하면 수축기 혈압이 120 ~139 mmHg 사이는 고혈압 주의, 140mmHg 이상이면 고혈압으로 진단됩니다.",
    ];

    this.DBP.list = [
      "혈압은 동맥혈관 벽에 가해지는 혈액의 압력을 말합니다. 심장근육을 늘려 심장으로 혈액을 받아들일 때 혈압이 가장 낮아지는데, 이때의 혈압을 이완기 혈압이라고 합니다.",
      "이완기 혈압은 특히 당뇨병 환자와 노인에서 중요합니다. 고령의 고혈압 환자 중에는 수축기 혈압이 유독 높으면서 이완기 혈압은 정상이거나 심지어 정상 이하인 경우가 적지 않습니다.",
      "참고로, 건강검진 기준에 의하면 이완기 혈압이 80 ~89 mmHg 사이는 고혈압 주의, 90mmHg 이상이면 고혈압으로 진단됩니다.",
    ];

    this.GLU.list = [
      "혈당은 혈액 속에 포함된 포도당의 농도를 말합니다. 포도당은 우리 몸이 사용하는 가장 기본적인 에너지원이므로 혈당을 적정 수치로 유지하는 것은 신체 대사에 매우 중요합니다.",
      "제2형 당뇨병은 포도당이 세포 속으로 들어가 에너지원으로 이용되지 못해 혈당이 비정상적으로 올라가는 질환입니다. 당뇨병은 많은 합병증을 유발하며, 비만과 심혈관계 질환이 동반될 수 있습니다.",
      "참고로, 건강검진 기준에 의하면 공복혈당이 100~125 mg/dL 사이는 공복 혈당 장애 (당뇨 전단계), 126 mg/dL 이상은 당뇨로 진단됩니다.",
    ];

    this.TC.list = [
      "총콜레스테롤은 혈액 속에 포함된 콜레스테롤의 총량을 말합니다. 콜레스테롤은 세포를 둘러싸고 있는 세포막과 스테로이드 호르몬, 식사로 섭취한 지방의 소화액인 담즙의 구성성분으로써 우리 몸에 꼭 필요한 물질입니다.",
      "그러나, 혈중 콜레스테롤 수치가 과도하게 증가하면 혈관벽에 플라크(plaque)가 쌓여 혈관벽이 좁아지거나 막히는 동맥경화가 생깁니다. 즉, 총콜레스테롤 수치가 높으면 급성심근경색, 뇌경색 같은 질병이 생길 확률이 높아집니다.",
      "참고로, 건강검진 기준에 의하면 200~239 mg/dL 사이이면 경계 상태, 240 mg/dL 이상이면 고콜레스테롤혈증으로 진단되며, 동맥경화 여부를 의심할 수 있습니다.",
    ];

    this.LDL.list = [
      "저밀도 콜레스테롤(LDL-콜레스테롤)은 혈중 총 콜레스테롤의 3/4을 차지하며 간으로부터 세포로 콜레스테롤을 운반합니다.",
      "저밀도 콜레스테롤이 혈관벽에 들어붙어 혈전을 형성하고 동맥경화를 일으킵니다.",
      "참고로, 건강검진 기준에 의하면 130~159 mg/dL 사이면 경계치, 160 mg/dL 이상이면 고콜레스테롤혈증으로 진단됩니다.",
    ];

    this.HDL.list = [
      "고밀도 콜레스테롤(HDL-콜레스테롤)은 세포로부터 간으로 콜레스테롤을 운반하여, 간에서 이를 대사하게 하는 ‘청소부’ 역할을 합니다.",
      "HDL 수치가 높을수록 혈관 내 콜레스테롤 제거에 효과적이며, 이는 심장 질환과 뇌졸중 예방에 도움이 됩니다.",
      "참고로, 건강검진 기준에 따르면 HDL 수치는 남성의 경우 40 mg/dL 이상, 여성의 경우 50 mg/dL 이상이 정상으로 간주됩니다.",
    ];

    this.TG.list = [
      "중성지방은 지질의 한 종류로, 체지방과 간에 저장되어 있다가 칼로리 섭취가 부족한 경우 에너지원으로 사용됩니다. 체지방의 대부분이 중성지방이며, 체온유지와 장기를 보호하는 역할도 합니다.",
      "음식을 통해 중성지방을 과도하게 섭취할 경우, 피하나 내장에 축적되어 복부비만과 지방간을 일으킬 수 있습니다. 또한, 혈중 중성지방이 많아지면 나쁜 콜레스테롤이 혈관벽에 쌓이는 것을 돕고, 좋은 콜레스테롤이 분해되는 것을 촉진하여 동맥경화의 원인이 됩니다.",
      "참고로, 건강검진 기준에 의하면 중성지방이 150~199 mg/dL 사이는 고지혈증 경계, 200 mg/dL 보다 높으면 고지질혈증으로 진단됩니다.",
    ];

    this.GOT.list = [
      "아스파테이트 아미노전이효소(AST;GOT)는 아미노산 대사에 관여하는 효소로 간, 심장, 골격근 등에 존재합니다. 혈액에 늘 소량 존재하지만 세포가 손상되면 세포 속에 있던 AST가 혈액으로 빠져나와 혈중 수치가 올라갑니다.",
      "AST수치 상승은 간염, 지방간과 같은 간손상, 급성심근경색, 골격근 질환 등과 관련 있습니다.",
      "참고로, 건강검진 기준에 의한 AST의 정상 범위는 40 IU/L 이하 입니다.",
    ];

    this.GPT.list = [
      "알라닌 아미노전이효소(ALT;GPT)는 아미노산 대사에 관여하는 효소로 주로 간에 많이 포함되어 있습니다. 간 손상으로 간세포가 파괴되면 세포 속에 있던 ALT가 빠져나와 혈중 농도가 급격히 상승합니다.",
      "ALT수치 상승은 급성간염, 만성간염, 간경변, 간암, 지방간, 알코올성 간염 등 간질환과 관련이 있습니다.",
      "참고로, 건강검진 기준에 의한 ALT의 정상 범위는 35 IU/L 이하 입니다.",
    ];

    this.CREA.list = [
      "크레아티닌은 근육에서 생성되는 노폐물로, 혈액으로 분비되어 신장에서 여과 후 소변으로 배설됩니다. 크레아티닌은 신장에서 여과된 후 재흡수는 일어나지 않으며, 신장 외 다른 영향을 적게 받기 때문에 신장 배설 기능을 평가하는데 활용됩니다.",
      "신장 결석, 신장 염증, 신부전, 약물에 의한 세뇨관 괴사 등 신장에 문제가 있으면 크레아티닌 수치가 올라갑니다.",
      "참고로, 건강검진 기준에 의하면 1.5 mg/dL 보다 높을시 신장 질환을 의심할 수 있습니다.",
    ];

    this.HB.list = [
      "혈색소(헤모글로빈)는 적혈구의 구성요소로 산소를 붙잡아 혈액의 산소를 운반하는 역할을 합니다.      ",
      "혈색소는 주로 빈혈, 수술이나 월경과 같은 출혈, 혈색소를 생산하는 골수의 병, 철분 영양결핍으로도 감소할 수 있습니다. 반대로 혈색소가 많이 생성되는 적혈구 증가증도 감별할 수 있습니다.",
    ];

    this.RFS.list = [
      "좋은 식사는 영양소가 균형 있게 다양하게 포함된 식단을 의미하며, 건강을 유지하기 위해 매우 중요합니다.",
      "식사의 질이 나쁘면 필수영양소의 부족으로 인한 영양실조가 발생하거나, 과다한 칼로리, 나트륨, 당, 포화지방 섭취에 따른 비만, 고혈압, 당뇨병, 이상지질혈증 등의 만성질환 위험이 증가합니다. 또한, 식습관은 우울감을 포함한 정신적 건강에도 영향을 미칩니다. ",
      "제철 과일과 채소, 곡물, 단백질원 등 다양한 식품군을 조화롭게 섭취하는 것이 좋습니다.",
    ];
  }

  setData(data, change = false, user_info = null) {
    var data_list = { ...this };

    for (let item in data_list) {
      if (typeof data.ariData[item] !== "undefined") {
        data_list[item].data = Number(data.ariData[item]);
        data_list[item].status = data.ariStatus[item];
        data_list[item].mean = Number(data.ariMean[item]);
        data_list[item].max = Number(data.ariMax[item]);
      }
    }

    // normal, warning, danger 기준 수치 설정
    data.ariReference.forEach((element) => {
      for (let item in data_list) {
        // HE 를 빈 문자열로 바꾸고 소문자로 변환 (HE_wc 와 같은 항목이 있어서)
        var _variable = element.variable.replace("HE_", "");
        
        _variable = _variable.toLowerCase();
        var _item = item.toLowerCase();

        if (_item == _variable) {
          if (data_list[item].type == "nwd") {
            data_list[item].normal_range_min = Number(
              element.normal_range_min
            );
            data_list[item].normal_range_max = Number(
              element.normal_range_max
            );
            data_list[item].warning_range_min = Number(
              element.warning_range_min
            );
            data_list[item].warning_range_max = Number(
              element.warning_range_max
            );
            data_list[item].danger_range_min = Number(
              element.danger_range_min
            );
            data_list[item].danger_range_max = Number(
              element.range_max
            );
            data_list[item].range_min = Number(element.range_min);
            data_list[item].range_max = Number(element.range_max);
          } else if (data_list[item].type == "dnd") {
            data_list[item].normal_range_min = Number(
              element.normal_range_min
            );
            data_list[item].normal_range_max = Number(
              element.normal_range_max
            );
            data_list[item].danger_1_range_min = Number(
              element.range_min
            );
            data_list[item].danger_1_range_max = Number(
              element.danger_range_min
            );
            data_list[item].danger_2_range_min = Number(
              element.danger_range_max
            );
            data_list[item].danger_2_range_max = Number(
              element.range_max
            );
            data_list[item].range_min = Number(element.range_min);
            data_list[item].range_max = Number(element.range_max);
          } else if (data_list[item].type == "dwn") {
            data_list[item].normal_range_min = Number(
              element.normal_range_min
            );
            data_list[item].normal_range_max = Number(
              element.range_max
            );
            data_list[item].warning_range_min = Number(
              element.warning_range_min
            );
            data_list[item].warning_range_max = Number(
              element.warning_range_max
            );
            data_list[item].danger_range_min = Number(
              element.danger_range_min
            );
            data_list[item].danger_range_max = Number(
              element.danger_range_max
            );
            data_list[item].range_min = Number(element.range_min);
            data_list[item].range_max = Number(element.range_max);
          } else if (data_list[item].type == "nd") {
            data_list[item].normal_range_min = Number(
              element.normal_range_min
            );
            data_list[item].normal_range_max = Number(
              element.normal_range_max
            );
            data_list[item].danger_range_min = Number(
              element.danger_range_min
            );
            data_list[item].danger_range_max = Number(
              element.range_max
            );
            data_list[item].range_min = Number(element.range_min);
            data_list[item].range_max = Number(element.range_max);
          } else if (data_list[item].type == "dn") {
            data_list[item].normal_range_min = Number(
              element.normal_range_min
            );
            data_list[item].normal_range_max = Number(
              element.range_max
            );
            data_list[item].danger_range_min = Number(
              element.range_min
            );
            data_list[item].danger_range_max = Number(
              element.danger_range_max
            );
            data_list[item].range_min = Number(element.range_min);
            data_list[item].range_max = Number(element.range_max);
          }
        }
      }
    });

    // Tracking Chart 에서 표현되는 건강위험요인 체크박스
    for (let item in data.ariCheck) {
      for (let element in data_list) {
        if (element == item) {
          data_list[element].check = data.ariCheck[item];
        }
      }
    }

    // 노화 속도에 영향을 준 요인들 나열
    for (let item in data.ariRisk) {
      for (let element in data_list) {
        if (element == item) {
          data_list[element].risk = data.ariRisk[item];
        }
      }
    }

    if (change) {
      var change_data_list = { ...data_list };
      for (let data in change_data_list) {
        if (data == "CREA") {
          change_data_list["CREA_1"] = {
            name: "혈청 크레아티닌 \n (수치가 낮을 때)",
            list: [
              "크레아티닌은 근육에서만 생성되기 때문에 우리 몸을 구성하는 근육량의 총량과 비례합니다. 여성보다 남성의 크레아티닌 수치가 높은 편 입니다.",
              "근육약화, 근육 경직, 근염증 같은 근육 위축성 질병이나 임신 시에는 수치가 낮아집니다.",
              "참고로, 건강검진 기준에 의하면 0.5 mg/dL 보다 낮을시 근육량이 적은 것으로 생각됩니다.",
            ],
          };
          change_data_list[data].name = "혈청 크레아티닌 \n (수치가 높을 때)";
        } else if (data == "GOT") {
          change_data_list[data].name = "아스파테이트 \n 아미노전이효소";
        } else if (data == "GPT") {
          change_data_list[data].name = "알라닌 \n 아미노전이효소";
        }
      }
      // 남성일 경우
      if (user_info.gender == 1) {
        this.HB.list[this.HB.list.length - 1] +=
          "참고로, 건강검진 기준에 의한 남성의 혈색소 정상 범위는 13.0~16.5 g/dL 입니다.";
      } else {
        this.HB.list[this.HB.list.length - 1] +=
          "참고로, 건강검진 기준에 의한 여성의 혈색소 정상 범위는 12.0~15.5 g/dL 입니다.";
      }
      return change_data_list;
    } else {
      return data_list;
    }
  }
}

export default HealthARIndicator;
