class HealthCheckupRecord {
  constructor() {
    // ** 항목 중, 위험-정상-위험 혹은 정상-위험 과 같은 범위를 바꾸려면 type 속성, 수치 속성을 변경 해야함.
    // ## 25.07.23
    // PDF 화면에 표시되는 순서가 필요하여 order 속성을 추가

    this.check_date = ""; // 검사일자

    this.WC = {
      name: "허리둘레",
      order: 1,
      en_name: "",
      unit: "cm",
      data: 0,
      type: "nwd",
      normal_range_min: 0,
      normal_range_max: 0,
      warning_range_min: 0,
      warning_range_max: 0,
      danger_range_min: 0,
      danger_range_max: 0,
      range_min: 0,
      range_max: 0,
    };
    this.BMI = {
      name: "체질량지수",
      order: 2,
      en_name: "",
      unit: "kg/m²",
      data: 0,
      type: "dnd",
      normal_range_min: 0,
      normal_range_max: 0,
      warning_range_min: 0,
      warning_range_max: 0,
      danger_range_min: 0,
      danger_range_max: 0,
      range_min: 0,
      range_max: 0,
    };
    this.GLU = {
      name: "공복혈당",
      order: 3,
      en_name: "Glucose",
      unit: "mg/dL",
      data: 0,
      type: "nwd",
      normal_range_min: 0,
      normal_range_max: 0,
      warning_range_min: 0,
      warning_range_max: 0,
      danger_range_min: 0,
      danger_range_max: 0,
      range_min: 0,
      range_max: 0,
    };
    this.HB = {
      name: "혈색소",
      order: 4,
      en_name: "Hb/Hemoglobin",
      unit: "g/dL",
      data: 0,
      type: "dnd",
      normal_range_min: 0,
      normal_range_max: 0,
      warning_range_min: 0,
      warning_range_max: 0,
      danger_range_min: 0,
      danger_range_max: 0,
      range_min: 0,
      range_max: 0,
    };
    this.TC = {
      name: "총콜레스테롤",
      order: 5,
      en_name: "T-Cholesterol",
      unit: "mg/dL",
      data: 0,
      type: "nwd",
      normal_range_min: 0,
      normal_range_max: 0,
      warning_range_min: 0,
      warning_range_max: 0,
      danger_range_min: 0,
      danger_range_max: 0,
      range_min: 0,
      range_max: 0,
    };
    this.LDL = {
      name: "저밀도 콜레스테롤",
      order: 6,
      en_name: "LDL-C",
      unit: "mg/dL",
      data: 0,
      type: "nwd",
      normal_range_min: 0,
      normal_range_max: 0,
      warning_range_min: 0,
      warning_range_max: 0,
      danger_range_min: 0,
      danger_range_max: 0,
      range_min: 0,
      range_max: 0,
    };
    this.HDL = {
      name: "고밀도 콜레스테롤",
      order: 7,
      en_name: "HDL-C",
      unit: "mg/dL",
      data: 0,
      type: "dwn",
      normal_range_min: 0,
      normal_range_max: 0,
      warning_range_min: 0,
      warning_range_max: 0,
      danger_range_min: 0,
      danger_range_max: 0,
      range_min: 0,
      range_max: 0,
    };
    this.TG = {
      name: "중성지방",
      order: 8,
      en_name: "Triglyceride",
      unit: "mg/dL",
      data: 0,
      type: "nwd",
      normal_range_min: 0,
      normal_range_max: 0,
      warning_range_min: 0,
      warning_range_max: 0,
      danger_range_min: 0,
      danger_range_max: 0,
      range_min: 0,
      range_max: 0,
    };
    this.SBP = {
      name: "수축기 혈압",
      order: 9,
      en_name: "SBP",
      unit: "mmHg",
      data: 0,
      type: "nwd",
      normal_range_min: 0,
      normal_range_max: 0,
      warning_range_min: 0,
      warning_range_max: 0,
      danger_range_min: 0,
      danger_range_max: 0,
      range_min: 0,
      range_max: 0,
    };
    this.DBP = {
      name: "이완기 혈압",
      order: 10,
      en_name: "DBP",
      unit: "mmHg",
      data: 0,
      type: "nwd",
      normal_range_min: 0,
      normal_range_max: 0,
      warning_range_min: 0,
      warning_range_max: 0,
      danger_range_min: 0,
      danger_range_max: 0,
      range_min: 0,
      range_max: 0,
    };

    this.GOT = {
      name: "아스파테이트 아미노전이효소\n",
      order: 11,
      en_name: "AST/SGOT",
      unit: "IU/L",
      data: 0,
      type: "nwd",
      normal_range_min: 0,
      normal_range_max: 0,
      warning_range_min: 0,
      warning_range_max: 0,
      danger_range_min: 0,
      danger_range_max: 0,
      range_min: 0,
      range_max: 0,
    };

    this.GPT = {
      name: "알라닌 아미노전이효소\n",
      order: 12,
      en_name: "ALT/SGPT",
      unit: "IU/L",
      data: 0,
      type: "nwd",
      normal_range_min: 0,
      normal_range_max: 0,
      warning_range_min: 0,
      warning_range_max: 0,
      danger_range_min: 0,
      danger_range_max: 0,
      range_min: 0,
      range_max: 0,
    };

    this.CREA = {
      name: "혈청크레이타닌",
      order: 13,
      en_name: "Cr/Creatinine",
      unit: "mg/dL",
      data: 0,
      type: "dnd",
      normal_range_min: 0,
      normal_range_max: 0,
      warning_range_min: 0,
      warning_range_max: 0,
      danger_range_min: 0,
      danger_range_max: 0,
      range_min: 0,
      range_max: 0,
    };
  }

  /** 검진 이력에 대한 리스트 */
  setData(data) {
    const datas = [];

    data.hcrData.forEach((item) => {
      var temp_obj = {};
      for (let key in this) {
        temp_obj[key] = { ...this[key] }; // 복사본 생성
      }
      temp_obj.check_date = item.check_date; // check date
      for (let key in data.hcrReference) {
        for (let this_key in this) {
          /** hcrReference 의 key 와 this_key가 같은 의미인데 기재되는 명칭이 다름 */
          /** 예를들어 허리둘레의 경우 hcrData 은 'WC' , hcrReference 은 'HE_wc' */

          var temp_key = data.hcrReference[key].variable;
          if (temp_key.indexOf("_") > 0) {
            temp_key = temp_key.split("_")[1].toUpperCase();
          }

          if (temp_key == this_key) {
            temp_obj[this_key].normal_range_min =
              data.hcrReference[key].normal_range_min;
            temp_obj[this_key].normal_range_max =
              data.hcrReference[key].normal_range_max;
            temp_obj[this_key].warning_range_min =
              data.hcrReference[key].warning_range_min;
            temp_obj[this_key].warning_range_max =
              data.hcrReference[key].warning_range_max;
            temp_obj[this_key].danger_range_min =
              data.hcrReference[key].danger_range_min;
            temp_obj[this_key].danger_range_max =
              data.hcrReference[key].danger_range_max;
            temp_obj[this_key].range_min = data.hcrReference[key].range_min;
            temp_obj[this_key].range_max = data.hcrReference[key].range_max;
            temp_obj[this_key].data = item[this_key];
          }
        }
      }
      datas.push(temp_obj);
    });

    return datas;
  }
}

export default HealthCheckupRecord;
