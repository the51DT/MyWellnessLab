import { dateToFormatString } from '@/utils/common.js';

/** HealthInterest Model */
class HealthInterest {
    
    constructor() {
      this.report_id = 0;
      this.check_date = new Date();
      this.hth_memory = 0;  // 기억력
      this.hth_eye = 0; // 눈
      this.hth_nose = 0; // 코
      this.hth_stomach = 0; // 위장
      this.hth_intestine = 0; // 장
      this.hth_BJ = 0; //   뼈, 관절
      this.hth_immune = 0; //   면역
      this.hth_atopy = 0; //  과민피부상태
      this.hth_tired = 0; //  피로
      this.hth_sex_hor  = 0; //   갱년기 여성
      this.hth_men = 0; // 전립선
      this.hth_tension = 0; // 긴장완화
      this.hth_sleep = 0; // 수면
      this.hth_skin = 0; // 피부
      this.hth_liver = 0; // 간
      this.hth_bodyfat = 0; // 체지방
      this.hth_TG = 0; // 중성지방
      this.hth_TC = 0; // 콜레스테롤
      this.hth_BP = 0; // 혈압
      this.hth_BF = 0; // 혈행
      this.hth_GLU = 0; // 혈당
      this.hth_muscle = 0; // 근육
      this.hth_oxi = 0; // 항산화
      this.hth_physi = 0; // 운동수행능력/지구력
      this.noting = 0;  // 관심없음

    }

    setData(obj){
      this.report_id = obj.report_id === true ? obj.report_id : 0;
      this.check_date = !! obj.check_date === true ? obj.check_date : new Date();
      this.hth_memory = !! obj.hth_memory === true ? obj.hth_memory : 0;
      this.hth_eye = !! obj.hth_eye === true ? obj.hth_eye : 0;
      this.hth_nose = !! obj.hth_nose === true ? obj.hth_nose : 0;
      this.hth_stomach = !! obj.hth_stomach === true ? obj.hth_stomach : 0;
      this.hth_intestine = !! obj.hth_intestine === true ? obj.hth_intestine : 0;
      this.hth_BJ = !! obj.hth_BJ === true ? obj.hth_BJ : 0;
      this.hth_immune = !! obj.hth_immune === true ? obj.hth_immune : 0;
      this.hth_atopy = !! obj.hth_atopy === true ? obj.hth_atopy : 0;
      this.hth_tired = !! obj.hth_tired === true ? obj.hth_tired : 0;
      this.hth_sex_hor = !! obj.hth_sex_hor === true ? obj.hth_sex_hor : 0;
      this.hth_men = !! obj.hth_men === true ? obj.hth_men: 0;
      this.hth_tension = !! obj.hth_tension === true ? obj.hth_tension : 0;
      this.hth_sleep = !! obj.hth_sleep === true ? obj.hth_sleep : 0;
      this.hth_skin = !! obj.hth_skin === true ? obj.hth_skin : 0;
      this.hth_liver = !! obj.hth_liver === true ? obj.hth_liver : 0;
      this.hth_bodyfat = !! obj.hth_bodyfat === true ? obj.hth_bodyfat : 0;
      this.hth_TG = !! obj.hth_TG === true ? obj.hth_TG : 0;
      this.hth_TC = !! obj.hth_TC === true ? obj.hth_TC : 0;
      this.hth_BP = !! obj.hth_BP === true ? obj.hth_BP : 0;
      this.hth_BF = !! obj.hth_BF === true ? obj.hth_BF : 0;
      this.hth_GLU = !! obj.hth_GLU === true ? obj.hth_GLU : 0;
      this.hth_muscle = !! obj.hth_muscle === true ? obj.hth_muscle : 0;
      this.hth_oxi = !! obj.hth_oxi === true ? obj.hth_oxi : 0;
      this.hth_physi = !! obj.hth_physi === true ? obj.hth_physi : 0;
      this.noting = !! obj.noting === true ? obj.noting : 0;
    }
    getData() {
      return this;
    }
    // 바이탈로그 등록을 위함
    getVitallogData() {
      return {
        check_date : dateToFormatString(new Date(), 'yyyy-mm-dd'),
        hth_memory : this.hth_memory,
        hth_tension : this.hth_tension,
        hth_sleep : this.hth_sleep,
        hth_recog : this.hth_recog,
        hth_tired : this.hth_tired,
        hth_eye : this.hth_eye,
        hth_teeth : this.hth_teeth,
        hth_skin : this.hth_skin,
        hth_stomach : this.hth_stomach,
        hth_liver : this.hth_liver,
        hth_intestine : this.hth_intestine,
        hth_bodyfat : this.hth_bodyfat,
        hth_calcium : this.hth_calcium,
        hth_TG : this.hth_TG,
        hth_TC : this.hth_TC,
        hth_BP : this.hth_BP,
        hth_BF : this.hth_BF,
        hth_GLU : this.hth_GLU,
        hth_sex_hor : this.hth_sex_hor,
        hth_men : this.hth_men,
        hth_woman : this.hth_woman,
        hth_kidney : this.hth_kidney,
        hth_BJ : this.hth_BJ,
        hth_muscle : this.hth_muscle,
        hth_atopy : this.hth_atopy,
        hth_immune : this.hth_immune,
        hth_oxi : this.hth_oxi,
        hth_sperm : this.hth_sperm,
        hth_nose : this.hth_nose,
        hth_physi : this.hth_physi,

      }
    }

}
  
  export default HealthInterest;