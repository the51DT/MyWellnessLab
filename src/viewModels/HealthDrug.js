import { dateToFormatString } from "@/utils/common.js";

/** HealthDrug Model */
class HealthDrug {
  constructor() {
    this.check_date = new Date();
    this.drug_memory = 0; // 기억력
    this.drug_tension = 0; // 긴장완화
    this.drug_sleep = 0; // 수면
    this.drug_recog = 0; // 인지기능
    this.drug_tired = 0; //  피로
    this.drug_eye = 0; // 눈
    this.drug_teeth = 0; // 치아
    this.drug_skin = 0; // 피부
    this.drug_stomach = 0; // 위장
    this.drug_liver = 0; // 간
    this.drug_intestine = 0; // 장
    this.drug_bodyfat = 0; // 체지방
    this.drug_calcium = 0; // 칼슘
    this.drug_TG = 0; // 중성지방
    this.drug_TC = 0; // 콜레스테롤
    this.drug_BP = 0; // 혈압
    this.drug_BF = 0; // 혈행
    this.drug_GLU = 0; // 혈당
    this.drug_sex_hor = 0; //   갱년기 여성
    this.drug_men = 0; // 전립선
    this.drug_woman = 0; // 여성 생식
    this.drug_kidney = 0; // 신장 및 요로
    this.drug_BJ = 0; //   뼈, 관절
    this.drug_muscle = 0; // 근육
    this.drug_atopy = 0; //  과민피부상태
    this.drug_immune = 0; //   면역
    this.drug_oxi = 0; // 항산화
    this.drug_sperm = 0; // 정자 운동성
    this.drug_nose = 0; // 코
    this.drug_physi = 0; // 운동수행능력/지구력
    this.noting = 0; // 관심없음 ( SVC API 에서 사용)
  }

  setData(obj) {
    this.check_date = !!obj.check_date === true ? obj.check_date : new Date();
    this.drug_memory = !!obj.drug_memory === true ? obj.drug_memory : 0;
    this.drug_teeth = !!obj.drug_teeth === true ? obj.drug_teeth : 0;
    this.drug_eye = !!obj.drug_eye === true ? obj.drug_eye : 0;
    this.drug_nose = !!obj.drug_nose === true ? obj.drug_nose : 0;
    this.drug_stomach = !!obj.drug_stomach === true ? obj.drug_stomach : 0;
    this.drug_intestine =
      !!obj.drug_intestine === true ? obj.drug_intestine : 0;
    this.drug_BJ = !!obj.drug_BJ === true ? obj.drug_BJ : 0;
    this.drug_immune = !!obj.drug_immune === true ? obj.drug_immune : 0;
    this.drug_atopy = !!obj.drug_atopy === true ? obj.drug_atopy : 0;
    this.drug_tired = !!obj.drug_tired === true ? obj.drug_tired : 0;
    this.drug_sex_hor = !!obj.drug_sex_hor === true ? obj.drug_sex_hor : 0;
    this.drug_men = !!obj.drug_men === true ? obj.drug_men : 0;
    this.drug_woman = !!obj.drug_woman === true ? obj.drug_woman : 0;
    this.drug_tension = !!obj.drug_tension === true ? obj.drug_tension : 0;
    this.drug_sleep = !!obj.drug_sleep === true ? obj.drug_sleep : 0;
    this.drug_skin = !!obj.drug_skin === true ? obj.drug_skin : 0;
    this.drug_liver = !!obj.drug_liver === true ? obj.drug_liver : 0;
    this.drug_bodyfat = !!obj.drug_bodyfat === true ? obj.drug_bodyfat : 0;
    this.drug_TG = !!obj.drug_TG === true ? obj.drug_TG : 0;
    this.drug_TC = !!obj.drug_TC === true ? obj.drug_TC : 0;
    this.drug_BP = !!obj.drug_BP === true ? obj.drug_BP : 0;
    this.drug_BF = !!obj.drug_BF === true ? obj.drug_BF : 0;
    this.drug_GLU = !!obj.drug_GLU === true ? obj.drug_GLU : 0;
    this.drug_muscle = !!obj.drug_muscle === true ? obj.drug_muscle : 0;
    this.drug_oxi = !!obj.drug_oxi === true ? obj.drug_oxi : 0;
    this.drug_physi = !!obj.drug_physi === true ? obj.drug_physi : 0;
    this.drug_kidney = !!obj.drug_kidney === true ? obj.drug_kidney : 0;
    this.noting = !!obj.noting === true ? obj.noting : 0;
  }
  getData() {
    return this;
  }
  // 바이탈로그 등록을 위함
  setVitallogData(obj) {
    this.check_date = !!obj.check_date === true ? obj.check_date : new Date();
    this.drug_memory = !!obj.drug_memory === true ? obj.drug_memory : 0;
    this.drug_teeth = !!obj.drug_teeth === true ? obj.drug_teeth : 0;
    this.drug_eye = !!obj.drug_eye === true ? obj.drug_eye : 0;
    this.drug_nose = !!obj.drug_nose === true ? obj.drug_nose : 0;
    this.drug_stomach = !!obj.drug_stomach === true ? obj.drug_stomach : 0;
    this.drug_intestine =
      !!obj.drug_intestine === true ? obj.drug_intestine : 0;
    this.drug_BJ = !!obj.drug_bj === true ? obj.drug_bj : 0;
    this.drug_immune = !!obj.drug_immune === true ? obj.drug_immune : 0;
    this.drug_atopy = !!obj.drug_atopy === true ? obj.drug_atopy : 0;
    this.drug_tired = !!obj.drug_tired === true ? obj.drug_tired : 0;
    this.drug_sex_hor = !!obj.drug_sex_hor === true ? obj.drug_sex_hor : 0;
    this.drug_men = !!obj.drug_men === true ? obj.drug_men : 0;
    this.drug_woman = !!obj.drug_woman === true ? obj.drug_woman : 0;
    this.drug_tension = !!obj.drug_tension === true ? obj.drug_tension : 0;
    this.drug_sleep = !!obj.drug_sleep === true ? obj.drug_sleep : 0;
    this.drug_skin = !!obj.drug_skin === true ? obj.drug_skin : 0;
    this.drug_liver = !!obj.drug_liver === true ? obj.drug_liver : 0;
    this.drug_bodyfat = !!obj.drug_bodyfat === true ? obj.drug_bodyfat : 0;
    this.drug_TG = !!obj.drug_tg === true ? obj.drug_tg : 0;
    this.drug_TC = !!obj.drug_tc === true ? obj.drug_tc : 0;
    this.drug_BP = !!obj.drug_bp === true ? obj.drug_bp : 0;
    this.drug_BF = !!obj.drug_bf === true ? obj.drug_bf : 0;
    this.drug_GLU = !!obj.drug_glu === true ? obj.drug_glu : 0;
    this.drug_muscle = !!obj.drug_muscle === true ? obj.drug_muscle : 0;
    this.drug_oxi = !!obj.drug_oxi === true ? obj.drug_oxi : 0;
    this.drug_physi = !!obj.drug_physi === true ? obj.drug_physi : 0;
    this.drug_kidney = !!obj.drug_kidney === true ? obj.drug_kidney : 0;
    this.noting = !!obj.noting === true ? obj.noting : 0;
  }
  // 바이탈로그 등록을 위함
  getVitallogData() {
    return {
      check_date: dateToFormatString(new Date(), "yyyy-mm-dd"),
      drug_memory: this.drug_memory,
      drug_tension: this.drug_tension,
      drug_sleep: this.drug_sleep,
      drug_recog: this.drug_recog,
      drug_tired: this.drug_tired,
      drug_eye: this.drug_eye,
      drug_teeth: this.drug_teeth,
      drug_skin: this.drug_skin,
      drug_stomach: this.drug_stomach,
      drug_liver: this.drug_liver,
      drug_intestine: this.drug_intestine,
      drug_bodyfat: this.drug_bodyfat,
      drug_calcium: this.drug_calcium,
      drug_TG: this.drug_TG,
      drug_TC: this.drug_TC,
      drug_BP: this.drug_BP,
      drug_BF: this.drug_BF,
      drug_GLU: this.drug_GLU,
      drug_sex_hor: this.drug_sex_hor,
      drug_men: this.drug_men,
      drug_woman: this.drug_woman,
      drug_kidney: this.drug_kidney,
      drug_BJ: this.drug_BJ,
      drug_muscle: this.drug_muscle,
      drug_atopy: this.drug_atopy,
      drug_immune: this.drug_immune,
      drug_oxi: this.drug_oxi,
      drug_sperm: this.drug_sperm,
      drug_nose: this.drug_nose,
      drug_physi: this.drug_physi,
    };
  }
}

export default HealthDrug;
