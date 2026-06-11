

/** Inbody Data scrapping data */
class Inbody {
  constructor() {
    this.check_date='';
    this.ht=null;
    this.wt=null;
    this.wbt_bf_mass=null;  //  체지방량
    this.wbt_bf_percent=null;  //  체지방량
    this.wbt_sm_mass=null;  //  골격근량
    this.ram_mass=null; //  우팔근량
    this.ram_percent=null; //  우팔근량
    this.lam_mass=null; //  좌팔근량
    this.lam_percent=null; //  좌팔근량
    this.trk_mass=null; //  몸통근량
    this.trk_percent=null; //  몸통근량
    this.rlm_mass=null; //  우다리근량
    this.rlm_percent=null; //  우다리근량
    this.llm_mass=null; //  좌다리근량
    this.llm_percent=null; //  좌다리근량
  }
  setData(obj) {
    
    this.check_date = obj.check_date == undefined || obj.check_date == null ? '' : obj.check_date;
    this.ht = obj.ht == undefined || obj.ht == null ? 0 : obj.ht;
    this.wt = obj.wt == undefined || obj.wt == null ? 0 : obj.wt;
    this.wbt_bf_mass = obj.wbt_bf_mass == undefined || obj.wbt_bf_mass == null ? 0 : obj.wbt_bf_mass;
    this.wbt_bf_percent = obj.wbt_bf_percent == undefined || obj.wbt_bf_percent == null ? 0 : obj.wbt_bf_percent;
    this.wbt_sm_mass = obj.wbt_sm_mass == undefined || obj.wbt_sm_mass == null ? 0 : obj.wbt_sm_mass;
    this.ram_mass = obj.ram_mass == undefined || obj.ram_mass == null ? 0 : obj.ram_mass;
    this.ram_percent = obj.ram_percent == undefined || obj.ram_percent == null ? 0 : obj.ram_percent;
    this.lam_mass = obj.lam_mass == undefined || obj.lam_mass == null ? 0 : obj.lam_mass;
    this.lam_percent = obj.lam_percent == undefined || obj.lam_percent == null ? 0 : obj.lam_percent;
    this.trk_mass = obj.trk_mass == undefined || obj.trk_mass == null ? 0 : obj.trk_mass;
    this.trk_percent = obj.trk_percent == undefined || obj.trk_percent == null ? 0 : obj.trk_percent;
    this.rlm_mass = obj.rlm_mass == undefined || obj.rlm_mass == null ? 0 : obj.rlm_mass;
    this.rlm_percent = obj.rlm_percent == undefined || obj.rlm_percent == null ? 0 : obj.rlm_percent;
    this.llm_mass = obj.llm_mass == undefined || obj.llm_mass == null ? 0 : obj.llm_mass;
    this.llm_percent = obj.llm_percent == undefined || obj.llm_percent == null ? 0 : obj.llm_percent;

  }
  getData() {
    return this;
  }
  getVitallogData() {
    return {
      check_date : this.check_date,
      HT : this.ht,
      WT : this.wt,
      WBT_BF_Mass : this.wbt_bf_mass,
      WBT_BF_Percent : this.wbt_bf_percent,
      WBT_SM_Mass : this.wbt_sm_mass,
      RAM_Mass : this.ram_mass,
      RAM_Percent : this.ram_percent,
      LAM_Mass : this.lam_mass,
      LAM_Percent : this.lam_percent,
      TRK_Mass : this.trk_mass,
      TRK_Percent : this.trk_percent,
      RLM_Mass : this.rlm_mass,
      RLM_Percent : this.rlm_percent,
      LLM_Mass : this.llm_mass,
      LLM_Percent : this.llm_percent

    }
  }
}

export default Inbody;