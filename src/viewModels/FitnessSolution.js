
/** 나의 부위별 근육량 Model */
class FitnessSolution {
    
    constructor() {
      
      this.RRM = {percent: 0, mass: 0, status: '', mean: 80, max: 120};  // 오른팔 근육량
      this.LRM = {percent: 0, mass: 0, status: '', mean: 80, max: 120}; // 왼팔 근육량
      this.TRK = {percent: 0, mass: 0, status: '', mean: 90, max: 135}; // 몸통 근육량
      this.RLG = {percent: 0, mass: 0, status: '', mean: 90, max: 135}; // 오른다리 근육량
      this.LLG = {percent: 0, mass: 0, status: '', mean: 90, max: 135}; // 왼다리 근육량

      this.rank = 0; // 나의 근육량 순위
      this.status = 0;  // 나의 근육량 판정 결과 (1: 높은, 2: 비슷한, 3: 낮은)
      this.status_msg = 0;  // 내 근육량에 대한 설명
    }

    setData(data){
      
      this.RRM.percent =  data.hqData.musMassPartRRMPercent;
      this.LRM.percent = data.hqData.musMassPartLRMPercent;
      this.TRK.percent = data.hqData.musMassPartTRKPercent;
      this.RLG.percent = data.hqData.musMassPartRLGPercent;
      this.LLG.percent = data.hqData.musMassPartLLGPercent;
      
      this.TRK.status = data.hqData.musMassPartTRKPercent_status;
      this.RRM.status = data.hqData.musMassPartRRMPercent_status;
      this.RLG.status = data.hqData.musMassPartRLGPercent_status;
      this.LRM.status = data.hqData.musMassPartLRMPercent_status;
      this.LLG.status = data.hqData.musMassPartLLGPercent_status;

      this.TRK.mass = data.hqData.musMassPartTRK;
      this.RRM.mass = data.hqData.musMassPartRRM;
      this.RLG.mass = data.hqData.musMassPartRLG;
      this.LRM.mass = data.hqData.musMassPartLRM;
      this.LLG.mass = data.hqData.musMassPartLLG;

      this.status = data.hqData.musMassPercent_StatusAge;
      this.status_msg = data.hqData.musMassPercent_MSG;
      this.rank = data.hqData.musMassPercent_PERC;

      return this
    }
    getData() {
      return this
    }
}
  
  export default FitnessSolution;