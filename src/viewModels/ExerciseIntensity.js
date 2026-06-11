
/** 나의 부위별 근육량 Model */
class ExerciseIntensity {
    
    constructor() {
      
      this.met_score = 0; // 나의 운동강도 점수
      this.met_status = 0;  // 나의 운동강도 판정 결과 (1: 높은, 2: 비슷한, 3: 낮은)
      this.low_intensity_score = 0; // 저강도 운동 점수
      this.moderate_intensity_score = 0; // 중강도 운동 점수
      this.high_intensity_score = 0; // 고강도 운동 점수
      this.low_intensity_percent = 0; // 저강도 운동 비율
      this.moderate_intensity_percent = 0; // 중강도 운동 비율
      this.high_intensity_percent = 0; // 고강도 운동 비율
      this.met_msg = ""; // 나의 운동강도 메시지
      
    }

    setData(data){
      
      this.met_score = data.metData.met; // 나의 운동강도 점수
      this.met_status = data.metStatus;  // 나의 운동강도 판정 결과 (0~149 : 주의, 150 ~ 599 : 관리, 600 ~ : 좋음)
      this.low_intensity_score = data.metData.activ_walk_met; // 저강도 운동 점수
      this.moderate_intensity_score = data.metData.activ_mod_met; // 중강도 운동 점수
      this.high_intensity_score = data.metData.activ_ints_met; // 고강도 운동 점수
      this.low_intensity_percent = data.metPercent.activ_walk_met; // 저강도 운동 비율
      this.moderate_intensity_percent = data.metPercent.activ_mod_met; // 중강도 운동 비율
      this.high_intensity_percent = data.metPercent.activ_ints_met
      this.met_msg = data.metMsg.metMessage; // 나의 운동강도 메시지

      return this
    }
    getData() {
      return this
    }
}
  
  export default ExerciseIntensity;