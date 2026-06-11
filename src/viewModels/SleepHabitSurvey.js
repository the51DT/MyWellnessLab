
/** SleepHabitSurvey Model */
class SleepHabitSurvey {
    
    constructor() {
      this.check_date = new Date();
      this.psqik_01 = 0;
      this.psqik_02 = 0;
      this.psqik_03 = 0;
      this.psqik_04 = 0;
      this.psqik_05 = 0;
      this.psqik_06 = 0;
      this.psqik_07 = 0;
      this.psqik_08 = 0;
      this.psqik_09 = 0;
      this.psqik_10 = 0;
      this.psqik_11 = 0;
      this.psqik_12 = 0;
      this.psqik_13 = 0;
      this.psqik_14 = 0;
      this.psqik_15 = 0;
      this.psqik_16 = 0;
    }

    setData(obj){
      this.check_date = !! obj.check_date === true ? obj.check_date : new Date();
      this.psqik_01 = !! obj.psqik_01 === true ? obj.psqik_01 : 0;
      this.psqik_02 = !! obj.psqik_02 === true ? obj.psqik_02 : 0;
      this.psqik_03 = !! obj.psqik_03 === true ? obj.psqik_03 : 0;
      this.psqik_04 = !! obj.psqik_04 === true ? obj.psqik_04 : 0;
      this.psqik_05 = !! obj.psqik_05 === true ? obj.psqik_05 : 0;
      this.psqik_06 = !! obj.psqik_06 === true ? obj.psqik_06 : 0;
      this.psqik_07 = !! obj.psqik_07 === true ? obj.psqik_07 : 0;
      this.psqik_08 = !! obj.psqik_08 === true ? obj.psqik_08 : 0;
      this.psqik_09 = !! obj.psqik_09 === true ? obj.psqik_09 : 0;
      this.psqik_10 = !! obj.psqik_10 === true ? obj.psqik_10 : 0;
      this.psqik_11 = !! obj.psqik_11 === true ? obj.psqik_11 : 0;
      this.psqik_12 = !! obj.psqik_12 === true ? obj.psqik_12 : 0;
      this.psqik_13 = !! obj.psqik_13 === true ? obj.psqik_13 : 0;
      this.psqik_14 = !! obj.psqik_14 === true ? obj.psqik_14 : 0;
      this.psqik_15 = !! obj.psqik_15 === true ? obj.psqik_15 : 0;
      this.psqik_16 = !! obj.psqik_16 === true ? obj.psqik_16 : 0;
    }
    getData() {
      return this;
    }
    // 바이탈로그 등록을 위함
    getVitallogData() {

      return {
        PSQIK_01  : Number(this.psqik_01),
        PSQIK_02  : Number(this.psqik_02),
        PSQIK_03  : Number(this.psqik_03),
        PSQIK_04  : Number(this.psqik_04),
        PSQIK_05  : Number(this.psqik_05),
        PSQIK_06  : Number(this.psqik_06),
        PSQIK_07  : Number(this.psqik_07),
        PSQIK_08  : Number(this.psqik_08),
        PSQIK_09  : Number(this.psqik_09),
        PSQIK_10  : Number(this.psqik_10),
        PSQIK_11  : Number(this.psqik_11),
        PSQIK_12  : Number(this.psqik_12),
        PSQIK_13  : Number(this.psqik_13),
        PSQIK_14  : Number(this.psqik_14),
        PSQIK_15  : Number(this.psqik_15),
        PSQIK_16  : Number(this.psqik_16)
      }
    }

}
  
  export default SleepHabitSurvey;