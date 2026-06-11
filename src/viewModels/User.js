

/** UserJoinData */
class User {
  constructor() {
    this.service_id = '';
    this.password = '';
    this.name = '';
    this.nickname = '';
    this.email = '';
    this.birth_date = '';
    this.birth_date_view = '';
    this.sex = 1; // 1: 남성, 2: 여성
    this.height = '';
    this.height_view = '';
    this.weight = '';
    this.weight_view = '';
    this.veganism_id = 0  // 채식주의자 여부
    this.allergy_ids = ""  // 알러지 여부
    this.physical_activity_id = 0  // 신체활동도
    this.status = 100 // 100 : 최초등록 , 200 : 추가 데이터 등록완료 , 999 : 회원탈퇴 , 910 : 회원 유효기간 만료
      
  }
  // set join data
  setData(obj) {
    // email undefined check
    this.service_id = !!obj.service_id === true ? obj.service_id : '';
    this.password = !!obj.password === true ? obj.password : '';
    this.email = !!obj.email === true ? obj.email : '';
    this.name = !!obj.name === true ? obj.name : '';
    this.birth_date = !!obj.birth_date === true ? obj.birth_date : '';
    this.sex = !!obj.sex === true ? obj.sex : '';
    this.height = !!obj.height === true ? obj.height : '';
    this.weight = !!obj.weight === true ? obj.weight : '';
    this.veganism_id = !!obj.veganism_id === true ? obj.veganism_id : '';
    this.allergy_ids = !!obj.allergy_ids === true ? obj.allergy_ids : '';
    this.physical_activity_id = !!obj.physical_activity_id === true ? obj.physical_activity_id : '';
    
  }
  getData() {
    var birthdate_year = !!this.birth_date === true ? this.birth_date.split('-')[0] : '';
    var birthdate_month = !!this.birth_date === true ? this.birth_date.split('-')[1] : '';
    var birthdate_day = !!this.birth_date === true ? this.birth_date.split('-')[2] : '';
    var birthdate = birthdate_year + '-' + birthdate_month + '-' + birthdate_day;
  
    this.birth_date_view = !!this.birth_date === true ? birthdate.replaceAll('-', '/') : '';

    
    return this;
  }
}

export default User;