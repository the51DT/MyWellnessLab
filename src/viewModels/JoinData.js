

/** UserJoinData */
class JoinData {
  constructor() {
    this.service_id = '';
    this.user_id = '';
    this.name = '';
    this.nickname = '';
    this.email = '';
    this.password = '';
    this.birth_date = '';
    this.age = 0; // 만나이
    this.sex = 1; // 1: 남성, 2: 여성
    this.height = '';
    this.weight = '';
    this.physical_activity_id = 0 // 에너지 대사량
    this.veganism_id = 1  // 채식주의자 여부
    this.allergy_ids = "0"  // 알러지 여부
    this.allergy_etc = '[]' // 알러지 기타
    this.intro_page_flag = false
    this.status = 100 // 100 : 최초등록 , 200 : 추가 데이터 등록완료 , 999 : 회원탈퇴 , 910 : 회원 유효기간 만료
      
  }
  // set join data
  setData(email, password, name, birth_date, age, sex, height, weight, physical_activity_id, veganism_id, allergy_ids,allergy_etc,  intro_page_flag) {
    // email undefined check
    this.service_id = !!email === true ? email : '';// 현재 우선 이메일로 등록한 2024.04.03
    this.email = !!email === true ? email : '';
    this.password = !!password === true ? password : '';
    this.name = !!name === true ? name : '';
    this.birth_date = !!birth_date === true ? birth_date : '';
    this.age = !!age === true ? age : 0;
    this.sex = !!sex === true ? sex : 1;
    this.height = !!height === true ? height : 0;
    this.weight = !!weight === true ? weight : 0;
    this.physical_activity_id = !!physical_activity_id === true ? physical_activity_id : 0;
    this.veganism_id = !!veganism_id === true ? veganism_id : 0;
    this.allergy_ids = !!allergy_ids === true ? allergy_ids : '';
    this.allergy_etc = !!allergy_etc === true ? allergy_etc : [];
    this.intro_page_flag = !!intro_page_flag === true ? intro_page_flag : '';
    
  }
  // get required join data
  getRequiredJoinData() {
    return {
      service_id: this.service_id,
      password: this.password,
      name: this.name
    }
  }
  // get join data
  getJoinAddData() {
    return {
      name: this.name,
      birth_date: this.birth_date,
      sex: this.sex,
      height: this.height,
      weight: this.weight,
      physical_activity_id: this.physical_activity_id,
      veganism_id: this.veganism_id,
      allergy_etc: this.allergy_etc,
      allergy_ids: this.allergy_ids,
      intro_page_flag: this.intro_page_flag
   
    }
  }
}

export default JoinData;