import { dateToFormatString } from '@/utils/common.js';

/** LifeStyle Data */
class LifeStyleSurvey {
  
  constructor() {
    this.report_id=0;
    this.lifestyle_id=0;
    this.mh_stress=-1;
    this.lq_1eql=-1;
    this.lq_2eql=-1;
    this.lq_3eql=-1;
    this.lq_4eql=-1;
    this.lq_5eql=-1;
    this.activ_ints=-1;
    this.activ_ints_time=0;
    this.activ_mod=-1;
    this.activ_mod_time=0;
    this.activ_walk=-1;
    this.activ_walk_time=0;
    this.drink=-1;
    this.drink_freq_type=1;
    this.drink_freq=0;
    this.drink_vol_type=1;
    this.drink_vol=0;
    this.smok=-1;
    this.smok_dur_year=0;
    this.smok_amt=0;
    this.sleep_hr=0;
    this.sleep_min=0;
    this.water_amt=0;
  }
  setData(obj) {
    this.report_id = (obj?.report_id ?? '') !== '' ? obj.report_id : 0;
    this.lifestyle_id = (obj?.lifestyle_id ?? '') !== '' ? obj.lifestyle_id : 0;
    this.mh_stress = (obj?.mh_stress ?? '') !== '' ? obj.mh_stress : 0;
    this.lq_1eql = (obj?.lq_1eql ?? '') !== '' ? obj.lq_1eql : 0;
    this.lq_2eql = (obj?.lq_2eql ?? '') !== '' ? obj.lq_2eql : 0;
    this.lq_3eql = (obj?.lq_3eql ?? '') !== '' ? obj.lq_3eql : 0;
    this.lq_4eql = (obj?.lq_4eql ?? '') !== '' ? obj.lq_4eql : 0;
    this.lq_5eql = (obj?.lq_5eql ?? '') !== '' ? obj.lq_5eql : 0;
    this.activ_ints = (obj?.activ_ints ?? '') !== '' ? obj.activ_ints : 0;
    this.activ_ints_time = (obj?.activ_ints_time ?? '') !== '' ? obj.activ_ints_time : 0;
    this.activ_mod = (obj?.activ_mod ?? '') !== '' ? obj.activ_mod : 0;
    this.activ_mod_time = (obj?.activ_mod_time ?? '') !== '' ? obj.activ_mod_time : 0;
    this.activ_walk = (obj?.activ_walk ?? '') !== '' ? obj.activ_walk : 0;
    this.activ_walk_time = (obj?.activ_walk_time ?? '') !== '' ? obj.activ_walk_time : 0;
    this.drink = (obj?.drink ?? '') !== '' ? obj.drink : 0;
    this.drink_freq_type = (obj?.drink_freq_type ?? '') !== '' ? obj.drink_freq_type : 0;
    this.drink_freq = (obj?.drink_freq ?? '') !== '' ? obj.drink_freq : 0;
    this.drink_vol_type = (obj?.drink_vol_type ?? '') !== '' ? obj.drink_vol_type : 0;
    this.drink_vol = (obj?.drink_vol ?? '') !== '' ? obj.drink_vol : 0;
    this.smok = (obj?.smok ?? '') !== '' ? obj.smok : 0;
    this.smok_dur_year = (obj?.smok_dur_year ?? '') !== '' ? obj.smok_dur_year : 0;
    this.smok_amt = (obj?.smok_amt ?? '') !== '' ? obj.smok_amt : 0;
    this.sleep_hr = (obj?.sleep_hr ?? '') !== '' ? obj.sleep_hr : 0;
    this.sleep_min = (obj?.sleep_min ?? '') !== '' ? obj.sleep_min : 0;
    this.water_amt = (obj?.water_amt ?? '') !== '' ? obj.water_amt : 0;
  
  }
  getData() {
    return this;
  }
  // for register Vitallog 흡연력
  getVitallogSmokeData() {
    return  {
      smok_date : dateToFormatString(new Date(), 'yyyy-mm-dd'),
      smok : this.smok,
      smok_dur_year  : this.smok_dur_year,
      smok_amt : this.smok_amt,
    }
  }
  // for register Vitallog 음주력
  getVitallogDrinkData() {
    return  {
      drink_date : dateToFormatString(new Date(), 'yyyy-mm-dd'),
      drink : this.drink,
      drink_freqType  : this.drink_freq_type,
      drink_freq : this.drink_freq,
      drink_volType : this.drink_vol_type,
      drink_vol : this.drink_vol,
    }
  }
  // for register Vitallog 수면력
  getVitallogSleepData() {
    return  {
      sleep_date : dateToFormatString(new Date(), 'yyyy-mm-dd'),
      sleep_hr : this.sleep_hr,
      sleep_min  : this.sleep_min,
    }
  }
  // for register Vitallog 수분섭취량
  getVitallogWaterData() {
    return  {
      water_date  : dateToFormatString(new Date(), 'yyyy-mm-dd'),
      water_amt : this.water_amt
    }
  }
  // for register Vitallog 신체활동
  getVitallogActivieyData() {
    return  {
      activ_date:  dateToFormatString(new Date(), 'yyyy-mm-dd'),
      activ_ints: this.activ_ints,
      activ_ints_time: this.activ_ints_time,
      activ_mod: this.activ_mod,
      activ_mod_time: this.activ_mod_time,
      activ_walk: this.activ_walk,
      activ_walk_time: this.activ_walk_time
    }
  }
  // for register Vitallog 스트레스 인지(삶의질)
  getVitallogPerceivedStressData() {
    return  {
     svyDate : dateToFormatString(new Date(), 'yyyy-mm-dd'),
     MH_stress : this.mh_stress,
    }
  }
  // for register Vitallog Eq5D(삶의질)
  getVitallogEq5DData() {
    return  {
      svyDate : dateToFormatString(new Date(), 'yyyy-mm-dd'),
      LQ_1EQL : this.lq_1eql,
      LQ_2EQL : this.lq_2eql,
      LQ_3EQL : this.lq_3eql,
      LQ_4EQL : this.lq_4eql,
      LQ_5EQL : this.lq_5eql,
    }
  }
}

export default LifeStyleSurvey;