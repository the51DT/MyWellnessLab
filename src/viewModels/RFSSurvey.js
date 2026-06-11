import { dateToFormatString } from '@/utils/common.js';

/** RFS Survey Data */
class RFSSurvey {
  
  constructor() {
    this.dq_date= null;
    this.rfs1=0;
    this.rfs2=0;
    this.rfs3=0;
    this.rfs4=0;
    this.rfs5=0;
    this.rfs6=0;
    this.rfs7=0;
    this.rfs8=0;
    this.rfs9=0;
    this.rfs10=0;
    this.rfs11=0;
    this.rfs12=0;
    this.rfs13=0;
    this.rfs14=0;
    this.rfs15=0;
    this.rfs16=0;
    this.rfs17=0;
    this.rfs18=0;
    this.rfs19=0;
    this.rfs20=0;
    this.rfs21=0;
    this.rfs22=0;
    this.rfs23=0;
    this.rfs24=0;
    this.rfs25=0;
    this.rfs26=0;
    this.rfs27=0;
    this.rfs28=0;
    this.rfs29=0;
    this.rfs30=0;
    this.rfs31=0;
    this.rfs32=0;
    this.rfs33=0;
    this.rfs34=0;
    this.rfs35=0;
    this.rfs36=0;
    this.rfs37=0;
    this.rfs38=0;
    this.rfs39=0;
    this.rfs40=0;
    this.rfs41=0;
    this.rfs42=0;
    this.rfs43=0;
    this.rfs44=0;
    this.rfs45=0;
    this.rfs46=0;
    this.rfs47=0;
    
  }
  setData(obj) {
    this.dq_date = (obj?.dq_date ?? '') !== '' ? obj.dq_date : dateToFormatString(new Date(), 'yyyy-mm-dd');
    this.rfs1 = obj.rfs1 ?? 0;
    this.rfs2 = obj.rfs2 ?? 0;
    this.rfs3 = obj.rfs3 ?? 0;
    this.rfs4 = obj.rfs4 ?? 0;
    this.rfs5 = obj.rfs5 ?? 0;
    this.rfs6 = obj.rfs6 ?? 0;
    this.rfs7 = obj.rfs7 ?? 0;
    this.rfs8 = obj.rfs8 ?? 0;
    this.rfs9 = obj.rfs9 ?? 0;
    this.rfs10 = obj.rfs10 ?? 0;
    this.rfs11 = obj.rfs11 ?? 0;
    this.rfs12 = obj.rfs12 ?? 0;
    this.rfs13 = obj.rfs13 ?? 0;
    this.rfs14 = obj.rfs14 ?? 0;
    this.rfs15 = obj.rfs15 ?? 0;
    this.rfs16 = obj.rfs16 ?? 0;
    this.rfs17 = obj.rfs17 ?? 0;
    this.rfs18 = obj.rfs18 ?? 0;
    this.rfs19 = obj.rfs19 ?? 0;
    this.rfs20 = obj.rfs20 ?? 0;
    this.rfs21 = obj.rfs21 ?? 0;
    this.rfs22 = obj.rfs22 ?? 0;
    this.rfs23 = obj.rfs23 ?? 0;
    this.rfs24 = obj.rfs24 ?? 0;
    this.rfs25 = obj.rfs25 ?? 0;
    this.rfs26 = obj.rfs26 ?? 0;
    this.rfs27 = obj.rfs27 ?? 0;
    this.rfs28 = obj.rfs28 ?? 0;
    this.rfs29 = obj.rfs29 ?? 0;
    this.rfs30 = obj.rfs30 ?? 0;
    this.rfs31 = obj.rfs31 ?? 0;
    this.rfs32 = obj.rfs32 ?? 0;
    this.rfs33 = obj.rfs33 ?? 0;
    this.rfs34 = obj.rfs34 ?? 0;
    this.rfs35 = obj.rfs35 ?? 0;
    this.rfs36 = obj.rfs36 ?? 0;
    this.rfs37 = obj.rfs37 ?? 0;
    this.rfs38 = obj.rfs38 ?? 0;
    this.rfs39 = obj.rfs39 ?? 0;
    this.rfs40 = obj.rfs40 ?? 0;
    this.rfs41 = obj.rfs41 ?? 0;
    this.rfs42 = obj.rfs42 ?? 0;
    this.rfs43 = obj.rfs43 ?? 0;
    this.rfs44 = obj.rfs44 ?? 0;
    this.rfs45 = obj.rfs45 ?? 0;
    this.rfs46 = obj.rfs46 ?? 0;
    this.rfs47 = obj.rfs47 ?? 0;
    
  }
  getData() {
    return this;
  }
  // for register Vitallog 흡연력
  getVitalLogData() {
    return  {
      DQ_date : dateToFormatString(new Date(), 'yyyy-mm-dd'),
      RFS_1 : this.rfs1,
      RFS_2 : this.rfs2,
      RFS_3 : this.rfs3,
      RFS_4 : this.rfs4,
      RFS_5 : this.rfs5,
      RFS_6 : this.rfs6,
      RFS_7 : this.rfs7,
      RFS_8 : this.rfs8,
      RFS_9 : this.rfs9,
      RFS_10 : this.rfs10,
      RFS_11 : this.rfs11,
      RFS_12 : this.rfs12,
      RFS_13 : this.rfs13,
      RFS_14 : this.rfs14,
      RFS_15 : this.rfs15,
      RFS_16 : this.rfs16,
      RFS_17 : this.rfs17,
      RFS_18 : this.rfs18,
      RFS_19 : this.rfs19,
      RFS_20 : this.rfs20,
      RFS_21 : this.rfs21,
      RFS_22 : this.rfs22,
      RFS_23 : this.rfs23,
      RFS_24 : this.rfs24,
      RFS_25 : this.rfs25,
      RFS_26 : this.rfs26,
      RFS_27 : this.rfs27,
      RFS_28 : this.rfs28,
      RFS_29 : this.rfs29,
      RFS_30 : this.rfs30,
      RFS_31 : this.rfs31,
      RFS_32 : this.rfs32,
      RFS_33 : this.rfs33,
      RFS_34 : this.rfs34,
      RFS_35 : this.rfs35,
      RFS_36 : this.rfs36,
      RFS_37 : this.rfs37,
      RFS_38 : this.rfs38,
      RFS_39 : this.rfs39,
      RFS_40 : this.rfs40,
      RFS_41 : this.rfs41,
      RFS_42 : this.rfs42,
      RFS_43 : this.rfs43,
      RFS_44 : this.rfs44,
      RFS_45 : this.rfs45,
      RFS_46 : this.rfs46,
      RFS_47 : this.rfs47,
    }
  }
 
}

export default RFSSurvey;