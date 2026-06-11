
/** HealthCheckup Data scrapping data */
class HealthCheckup {
  constructor() {
    this.report_id=0;
    this.sa_type=0;
    this.type=0; // manual or scrapping
    this.age=0;
    this.name='';
    this.check_date='';
    this.birth_date='';
    this.sex=0;
    this.ht = 0.0;
    this.wt = 0.0;
    this.wc = 0.0;
    this.sbp = 0.0;
    this.dbp = 0.0;
    this.glu = 0.0;
    this.got = 0.0;
    this.gpt = 0.0;
    this.hb = 0.0;
    this.crea = 0.0;
    this.tc = 0.0;
    this.hdl = 0.0;
    this.ldl = 0.0;
    this.tg = 0.0;
    this.bmi = 0.0;
      
  }
  setData(obj) {
    this.report_id = (obj?.report_id ?? '') !== '' ? obj.report_id : 0;
    this.check_date = !! obj.check_date === true ? obj.check_date : '';
    this.ht = !! obj.ht === true ? obj.ht : 0.0;
    this.wt = !! obj.wt === true ? obj.wt : 0.0;
    this.wc = !! obj.wc === true ? obj.wc : 0.0;
    this.sbp = !! obj.sbp === true ? obj.sbp : 0.0;
    this.dbp = !! obj.dbp === true ? obj.dbp : 0.0;
    this.glu = !! obj.glu === true ? obj.glu : 0.0;
    this.got = !! obj.got === true ? obj.got : 0.0;
    this.gpt = !! obj.gpt === true ? obj.gpt : 0.0;
    this.hb = !! obj.hb === true ? obj.hb : 0.0;
    this.crea = !! obj.crea === true ? obj.crea : 0.0;
    this.tc = !! obj.tc === true ? obj.tc : 0.0;
    this.hdl = !! obj.hdl === true ? obj.hdl : 0.0;
    this.ldl = !! obj.ldl === true ? obj.ldl : 0.0;
    this.tg = !! obj.tg === true ? obj.tg : 0.0;
    this.bmi = !! obj.bmi === true ? obj.bmi : 0.0;
  }
  getData() {
    return this;
  }
  // for get Vitallog --> 서비스 DB에서 쓰이는 컬럼명이 다르기 때문 
  setVitallogData(obj) {
    this.check_date = !! obj.check_date === true ? obj.check_date : '';
    this.ht = !! obj.HT === true ? obj.HT : 0.0;
    this.wt = !! obj.WT === true ? obj.WT : 0.0;
    this.wc = !! obj.WC === true ? obj.WC : 0.0;
    this.sbp = !! obj.SBP === true ? obj.SBP : 0.0;
    this.dbp = !! obj.DBP === true ? obj.DBP : 0.0;
    this.glu = !! obj.GLU === true ? obj.GLU : 0.0;
    this.got = !! obj.GOT === true ? obj.GOT : 0.0;
    this.gpt = !! obj.GPT === true ? obj.GPT : 0.0;
    this.hb = !! obj.HB === true ? obj.HB : 0.0;
    this.crea = !! obj.CREA === true ? obj.CREA : 0.0;
    this.tc = !! obj.TC === true ? obj.TC : 0.0;
    this.hdl = !! obj.HDL === true ? obj.HDL : 0.0;
    this.ldl = !! obj.LDL === true ? obj.LDL : 0.0;
    this.tg = !! obj.TG === true ? obj.TG : 0.0;
    this.bmi = !! obj.BMI === true ? obj.BMI : 0.0;
  }
  // for register Vitallog --> 서비스 DB 에서 가져온 key 를 Vitallog 에 맞게 변환
  getVitallogData() {
    return  {
      name : this.name,
      birth_date : this.birth_date,
      check_date : this.check_date,
      age : this.age,
      sex : this.sex,
      HT : this.ht,
      WT : this.wt,
      WC : this.wc,
      BMI : this.bmi,
      SBP : this.sbp,
      DBP : this.dbp,
      GLU : this.glu,
      GOT : this.got,
      GPT : this.gpt,
      HB : this.hb,
      CREA : this.crea,
      TC : this.tc,
      HDL : this.hdl,
      LDL : this.ldl,
      TG : this.tg,
    }
  }
}

export default HealthCheckup;