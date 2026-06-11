import { dateToFormatString } from '@/utils/common.js';

/** HealthInterestQuestionSurvey Model */
class HealthInterestQuestionSurvey {
    
    constructor() {
      this.check_date = new Date();
      this.smcq01 = 0; 
      this.smcq02 = 0;
      this.smcq03 = 0;
      this.smcq04 = 0;
      this.smcq05 = 0;
      this.smcq06 = 0;
      this.smcq07 = 0;
      this.smcq08 = 0;
      this.smcq09 = 0;
      this.smcq10 = 0;
      this.smcq11 = 0;
      this.smcq12 = 0;
      this.smcq13 = 0;
      this.smcq14 = 0;
      this.esq01 = 0;
      this.esq02 = 0;
      this.esq03 = 0;
      this.esq04 = 0;
      this.esq05 = 0;
      this.esq06 = 0;
      this.esq07 = 0;
      this.esq08 = 0;
      this.esq09 = 0;
      this.esq10 = 0;
      this.nt01 = 0;
      this.nt02 = 0;
      this.nt03 = 0;
      this.nt04 = 0;
      this.nt05 = 0;
      this.nt06 = 0;
      this.nt07 = 0;
      this.nt08 = 0;
      this.nt09 = 0;
      this.nt10 = 0;
      this.gis01 = 0;
      this.gis02 = 0;
      this.gis03 = 0;
      this.gis04 = 0;
      this.gis05 = 0;
      this.gis06 = 0;
      this.gis07 = 0;
      this.gis08 = 0;
      this.gis09 = 0;
      this.gis10 = 0;
      this.rome01 = 0;
      this.rome02 = 0;
      this.rome03 = 0;
      this.rome04 = 0;
      this.rome05 = 0;
      this.rome06 = 0;
      this.rome07 = 0;
      this.rome08 = 0;
      this.womac01 = 0;
      this.womac02 = 0;
      this.womac03 = 0;
      this.womac04 = 0;
      this.womac05 = 0;
      this.womac06 = 0;
      this.womac07 = 0;
      this.womac08 = 0;
      this.womac09 = 0;
      this.womac10 = 0;
      this.womac11 = 0;
      this.womac12 = 0;
      this.womac13 = 0;
      this.womac14 = 0;
      this.womac15 = 0;
      this.womac16 = 0;
      this.womac17 = 0;
      this.womac18 = 0;
      this.womac19 = 0;
      this.womac20 = 0;
      this.womac21 = 0;
      this.womac22 = 0;
      this.womac23 = 0;
      this.womac24 = 0;
      this.it01 = 0;
      this.it02 = 0;
      this.it03 = 0;
      this.it04 = 0;
      this.it05 = 0;
      this.it06 = 0;
      this.it07 = 0;
      this.it08 = 0;
      this.it09 = 0;
      this.it10 = 0;
      this.ki01 = 0;
      this.ki02 = 0;
      this.ki03 = 0;
      this.ki04 = 0;
      this.ki05 = 0;
      this.ki06 = 0;
      this.ki07 = 0;
      this.ki08 = 0;
      this.ki09 = 0;
      this.ki10 = 0;
      this.ki11 = 0;
      this.ki12 = 0;
      this.ipss01 = 0;
      this.ipss02 = 0;
      this.ipss03 = 0;
      this.ipss04 = 0;
      this.ipss05 = 0;
      this.ipss06 = 0;
      this.ipss07 = 0;
      this.lw_ms = 0;
      this.noting = 0;

    }

    setData(obj){
      this.check_date = !! obj.check_date === true ? obj.check_date : new Date();
      this.smcq01 = !! obj.smcq01 === true ? obj.smcq01 : 0;
      this.smcq02 = !! obj.smcq02 === true ? obj.smcq02 : 0;
      this.smcq03 = !! obj.smcq03 === true ? obj.smcq03 : 0;
      this.smcq04 = !! obj.smcq04 === true ? obj.smcq04 : 0;
      this.smcq05 = !! obj.smcq05 === true ? obj.smcq05 : 0;
      this.smcq06 = !! obj.smcq06 === true ? obj.smcq06 : 0;
      this.smcq07 = !! obj.smcq07 === true ? obj.smcq07 : 0;
      this.smcq08 = !! obj.smcq08 === true ? obj.smcq08 : 0;
      this.smcq09 = !! obj.smcq09 === true ? obj.smcq09 : 0;
      this.smcq10 = !! obj.smcq10 === true ? obj.smcq10 : 0;
      this.smcq11 = !! obj.smcq11 === true ? obj.smcq11 : 0;
      this.smcq12 = !! obj.smcq12 === true ? obj.smcq12 : 0;
      this.smcq13 = !! obj.smcq13 === true ? obj.smcq13 : 0;
      this.smcq14 = !! obj.smcq14 === true ? obj.smcq14 : 0;
      this.esq01 = !! obj.esq01 === true ? obj.esq01 : 0;
      this.esq02 = !! obj.esq02 === true ? obj.esq02 : 0;
      this.esq03 = !! obj.esq03 === true ? obj.esq03 : 0;
      this.esq04 = !! obj.esq04 === true ? obj.esq04 : 0;
      this.esq05 = !! obj.esq05 === true ? obj.esq05 : 0;
      this.esq06 = !! obj.esq06 === true ? obj.esq06 : 0;
      this.esq07 = !! obj.esq07 === true ? obj.esq07 : 0;
      this.esq08 = !! obj.esq08 === true ? obj.esq08 : 0;
      this.esq09 = !! obj.esq09 === true ? obj.esq09 : 0;
      this.esq10 = !! obj.esq10 === true ? obj.esq10 : 0;
      this.nt01 = !! obj.nt01 === true ? obj.nt01 : 0;
      this.nt02 = !! obj.nt02 === true ? obj.nt02 : 0;
      this.nt03 = !! obj.nt03 === true ? obj.nt03 : 0;
      this.nt04 = !! obj.nt04 === true ? obj.nt04 : 0;
      this.nt05 = !! obj.nt05 === true ? obj.nt05 : 0;
      this.nt06 = !! obj.nt06 === true ? obj.nt06 : 0;
      this.nt07 = !! obj.nt07 === true ? obj.nt07 : 0;
      this.nt08 = !! obj.nt08 === true ? obj.nt08 : 0;
      this.nt09 = !! obj.nt09 === true ? obj.nt09 : 0;
      this.nt10 = !! obj.nt10 === true ? obj.nt10 : 0;
      this.gis01 = !! obj.gis01 === true ? obj.gis01 : 0;
      this.gis02 = !! obj.gis02 === true ? obj.gis02 : 0;
      this.gis03 = !! obj.gis03 === true ? obj.gis03 : 0;
      this.gis04 = !! obj.gis04 === true ? obj.gis04 : 0;
      this.gis05 = !! obj.gis05 === true ? obj.gis05 : 0;
      this.gis06 = !! obj.gis06 === true ? obj.gis06 : 0;
      this.gis07 = !! obj.gis07 === true ? obj.gis07 : 0;
      this.gis08 = !! obj.gis08 === true ? obj.gis08 : 0;
      this.gis09 = !! obj.gis09 === true ? obj.gis09 : 0;
      this.gis10 = !! obj.gis10 === true ? obj.gis10 : 0;
      this.rome01 = !! obj.rome01 === true ? obj.rome01 : 0;
      this.rome02 = !! obj.rome02 === true ? obj.rome02 : 0;
      this.rome03 = !! obj.rome03 === true ? obj.rome03 : 0;
      this.rome04 = !! obj.rome04 === true ? obj.rome04 : 0;
      this.rome05 = !! obj.rome05 === true ? obj.rome05 : 0;
      this.rome06 = !! obj.rome06 === true ? obj.rome06 : 0;
      this.rome07 = !! obj.rome07 === true ? obj.rome07 : 0;
      this.rome08 = !! obj.rome08 === true ? obj.rome08 : 0;
      this.womac01 = !! obj.womac01 === true ? obj.womac01 : 0;
      this.womac02 = !! obj.womac02 === true ? obj.womac02 : 0;
      this.womac03 = !! obj.womac03 === true ? obj.womac03 : 0;
      this.womac04 = !! obj.womac04 === true ? obj.womac04 : 0;
      this.womac05 = !! obj.womac05 === true ? obj.womac05 : 0;
      this.womac06 = !! obj.womac06 === true ? obj.womac06 : 0;
      this.womac07 = !! obj.womac07 === true ? obj.womac07 : 0;
      this.womac08 = !! obj.womac08 === true ? obj.womac08 : 0;
      this.womac09 = !! obj.womac09 === true ? obj.womac09 : 0;
      this.womac10 = !! obj.womac10 === true ? obj.womac10 : 0;
      this.womac11 = !! obj.womac11 === true ? obj.womac11 : 0;
      this.womac12 = !! obj.womac12 === true ? obj.womac12 : 0;
      this.womac13 = !! obj.womac13 === true ? obj.womac13 : 0;
      this.womac14 = !! obj.womac14 === true ? obj.womac14 : 0;
      this.womac15 = !! obj.womac15 === true ? obj.womac15 : 0;
      this.womac16 = !! obj.womac16 === true ? obj.womac16 : 0;
      this.womac17 = !! obj.womac17 === true ? obj.womac17 : 0;
      this.womac18 = !! obj.womac18 === true ? obj.womac18 : 0;
      this.womac19 = !! obj.womac19 === true ? obj.womac19 : 0;
      this.womac20 = !! obj.womac20 === true ? obj.womac20 : 0;
      this.womac21 = !! obj.womac21 === true ? obj.womac21 : 0;
      this.womac22 = !! obj.womac22 === true ? obj.womac22 : 0;
      this.womac23 = !! obj.womac23 === true ? obj.womac23 : 0;
      this.womac24 = !! obj.womac24 === true ? obj.womac24 : 0;
      this.it01 = !! obj.it01 === true ? obj.it01 : 0;
      this.it02 = !! obj.it02 === true ? obj.it02 : 0;
      this.it03 = !! obj.it03 === true ? obj.it03 : 0;
      this.it04 = !! obj.it04 === true ? obj.it04 : 0;
      this.it05 = !! obj.it05 === true ? obj.it05 : 0;
      this.it06 = !! obj.it06 === true ? obj.it06 : 0;
      this.it07 = !! obj.it07 === true ? obj.it07 : 0;
      this.it08 = !! obj.it08 === true ? obj.it08 : 0;
      this.it09 = !! obj.it09 === true ? obj.it09 : 0;
      this.it10 = !! obj.it10 === true ? obj.it10 : 0;
      this.ki01 = !! obj.ki01 === true ? obj.ki01 : 0;
      this.ki02 = !! obj.ki02 === true ? obj.ki02 : 0;
      this.ki03 = !! obj.ki03 === true ? obj.ki03 : 0;
      this.ki04 = !! obj.ki04 === true ? obj.ki04 : 0;
      this.ki05 = !! obj.ki05 === true ? obj.ki05 : 0;
      this.ki06 = !! obj.ki06 === true ? obj.ki06 : 0;
      this.ki07 = !! obj.ki07 === true ? obj.ki07 : 0;
      this.ki08 = !! obj.ki08 === true ? obj.ki08 : 0;
      this.ki09 = !! obj.ki09 === true ? obj.ki09 : 0;
      this.ki10 = !! obj.ki10 === true ? obj.ki10 : 0;
      this.ki11 = !! obj.ki11 === true ? obj.ki11 : 0;
      this.ki12 = !! obj.ki12 === true ? obj.ki12 : 0;
      this.ipss01 = !! obj.ipss01 === true ? obj.ipss01 : 0;
      this.ipss02 = !! obj.ipss02 === true ? obj.ipss02 : 0;
      this.ipss03 = !! obj.ipss03 === true ? obj.ipss03 : 0;
      this.ipss04 = !! obj.ipss04 === true ? obj.ipss04 : 0;
      this.ipss05 = !! obj.ipss05 === true ? obj.ipss05 : 0;
      this.ipss06 = !! obj.ipss06 === true ? obj.ipss06 : 0;
      this.ipss07 = !! obj.ipss07 === true ? obj.ipss07 : 0;
      this.lw_ms = !! obj.lw_ms === true ? obj.lw_ms : 0;
      this.noting = !! obj.noting === true ? obj.noting : 0;
    }
    getData() {
      return this;
    }
    // 월경
    getVitallogMS() {
      return {
        check_date: dateToFormatString(new Date(), 'yyyy-mm-dd'),
        LW_ms: Number(this.lw_ms)
      }
    }
    // 기억 감퇴
    getVitallogSmcq() {
      return {
        SMCQ_01: Number(this.smcq01),
        SMCQ_02: Number(this.smcq02),
        SMCQ_03: Number(this.smcq03),
        SMCQ_04: Number(this.smcq04),
        SMCQ_05: Number(this.smcq05),
        SMCQ_06: Number(this.smcq06),
        SMCQ_07: Number(this.smcq07),
        SMCQ_08: Number(this.smcq08),
        SMCQ_09: Number(this.smcq09),
        SMCQ_10: Number(this.smcq10),
        SMCQ_11: Number(this.smcq11),
        SMCQ_12: Number(this.smcq12),
        SMCQ_13: Number(this.smcq13),
        SMCQ_14: Number(this.smcq14)
      }
    }
    // 눈 피로토 
    getVitallogEsq() {
      return {
        ESQ_01: Number(this.esq01),
        ESQ_02: Number(this.esq02),
        ESQ_03: Number(this.esq03),
        ESQ_04: Number(this.esq04),
        ESQ_05: Number(this.esq05),
        ESQ_06: Number(this.esq06),
        ESQ_07: Number(this.esq07),
        ESQ_08: Number(this.esq08),
        ESQ_09: Number(this.esq09),
        ESQ_10: Number(this.esq10)
      }
    }
    // 비염
    getVitallogNt() {
      return {
        NT_01: Number(this.nt01),
        NT_02: Number(this.nt02),
        NT_03: Number(this.nt03),
        NT_04: Number(this.nt04),
        NT_05: Number(this.nt05),
        NT_06: Number(this.nt06),
        NT_07: Number(this.nt07),
        NT_08: Number(this.nt08),
        NT_09: Number(this.nt09),
        NT_10: Number(this.nt10)
      }
    }
    // 소화불량
    getVitallogGis() {
      return {
        GIS_01: Number(this.gis01),
        GIS_02: Number(this.gis02),
        GIS_03: Number(this.gis03),
        GIS_04: Number(this.gis04),
        GIS_05: Number(this.gis05),
        GIS_06: Number(this.gis06),
        GIS_07: Number(this.gis07),
        GIS_08: Number(this.gis08),
        GIS_09: Number(this.gis09),
        GIS_10: Number(this.gis10)
      }
    }
    // 장건강
    getVitallogRome() {
      return {
        ROME_01: Number(this.rome01),
        ROME_02: Number(this.rome02),
        ROME_03: Number(this.rome03),
        ROME_04: Number(this.rome04),
        ROME_05: Number(this.rome05),
        ROME_06: Number(this.rome06),
        ROME_07: Number(this.rome07),
        ROME_08: Number(this.rome08)

      }
    }
    // 관절 건강
    getVitallogWomac() {
      return {
        WOMAC_01: Number(this.womac01),
        WOMAC_02: Number(this.womac02),
        WOMAC_03: Number(this.womac03),
        WOMAC_04: Number(this.womac04),
        WOMAC_05: Number(this.womac05),
        WOMAC_06: Number(this.womac06),
        WOMAC_07: Number(this.womac07),
        WOMAC_08: Number(this.womac08),
        WOMAC_09: Number(this.womac09),
        WOMAC_10: Number(this.womac10),
        WOMAC_11: Number(this.womac11),
        WOMAC_12: Number(this.womac12),
        WOMAC_13: Number(this.womac13),
        WOMAC_14: Number(this.womac14),
        WOMAC_15: Number(this.womac15),
        WOMAC_16: Number(this.womac16),
        WOMAC_17: Number(this.womac17),
        WOMAC_18: Number(this.womac18),
        WOMAC_19: Number(this.womac19),
        WOMAC_20: Number(this.womac20),
        WOMAC_21: Number(this.womac21),
        WOMAC_22: Number(this.womac22),
        WOMAC_23: Number(this.womac23),
        WOMAC_24: Number(this.womac24)
      }
    }
    // 면역력
    getVitallogIt() {
      return {
        IT_01: Number(this.it01),
        IT_02: Number(this.it02),
        IT_03: Number(this.it03),
        IT_04: Number(this.it04),
        IT_05: Number(this.it05),
        IT_06: Number(this.it06),
        IT_07: Number(this.it07),
        IT_08: Number(this.it08),
        IT_09: Number(this.it09),
        IT_10: Number(this.it10)
      }
    }
    // 갱년기
    getVitallogKi() {
      return {
        KI_01: Number(this.ki01),
        KI_02: Number(this.ki02),
        KI_03: Number(this.ki03),
        KI_04: Number(this.ki04),
        KI_05: Number(this.ki05),
        KI_06: Number(this.ki06),
        KI_07: Number(this.ki07),
        KI_08: Number(this.ki08),
        KI_09: Number(this.ki09),
        KI_10: Number(this.ki10),
        KI_11: Number(this.ki11),
        KI_12: Number(this.ki12)
      }
    }
    // 전립선
    getVitallogIpss() {
      return {
        IPSS_01: Number(this.ipss01),
        IPSS_02: Number(this.ipss02),
        IPSS_03: Number(this.ipss03),
        IPSS_04: Number(this.ipss04),
        IPSS_05: Number(this.ipss05),
        IPSS_06: Number(this.ipss06),
        IPSS_07: Number(this.ipss07)
      }
    }
}
  
  export default HealthInterestQuestionSurvey;