
/** Dish Class */
class Dish {
  constructor() {  
    this.dish_id =0;  // DISH ID
    this.dish_name='';  // DISH 명칭
    this.food_type=''; // DISH 혹은 FOOD
    this.synonym_name = ''; // DISH 유의어 명칭
    this.synonym_id = ''; //  DISH 유의어 id
    this.input_status = ""; // 입력 상태 (ADD, DELETE, UPDATE) for Core API
    this.unit_info = {
      water_including_gram: 0, // 수분포함 중량
      gram : 0, // 그램
      amount: 0,  //  섭취량
      expression : '인분', // 단위 표현
      unit: ''  // unit 단위표현
    }
    this.origin_water_including_gram = 0; // 수분포함 중량
    this.serving_size = 1;  // 1인분 섭취량
    this.kcal = 0;  // 칼로리
    this.create_date = 0;
    this.update_date = 0;
    this.manufacture = ''; // 제조사명 
  }
  // set join data
  setData(item, input_status) {
    this.dish_id =  item.dish_id != undefined && item.dish_id != '' ?  item.dish_id : 0;
    this.dish_name = item.dish_name != undefined && item.dish_name != '' ?  item.dish_name : '';
    if(this.dish_name == '') {
      this.dish_name = item.food_name != undefined && item.food_name != '' ?  item.food_name : '';
    }
    this.synonym_name = item.synonym_name != undefined && item.synonym_name != '' ?  item.synonym_name : '';
    this.synonym_id = item.synonym_id != undefined && item.synonym_id != '' ?  item.synonym_id : 0;
    this.food_type = item.food_type != undefined && item.food_type != '' ?  item.food_type : '';
    this.input_status = input_status; 
    if(item.unit_info) {
      this.unit_info.gram = item.unit_info.gram != undefined && item.unit_info.gram != '' ?  item.unit_info.gram : 0;
      this.unit_info.water_including_gram = item.unit_info.water_including_gram != undefined && item.unit_info.water_including_gram != '' ?  item.unit_info.water_including_gram : 0;
      this.unit_info.amount = item.unit_info.amount != undefined && item.unit_info.amount != '' ?  item.unit_info.amount : 0;
      this.unit_info.expression = item.unit_info.expression != undefined && item.unit_info.expression != '' ?  item.unit_info.expression : 0;
      this.unit_info.unit = item.unit_info.unit != undefined && item.unit_info.unit != '' ?  item.unit_info.unit : 0;
      this.serving_size = item.unit_info.serving_size != undefined && item.unit_info.serving_size != '' ?  item.unit_info.serving_size : 0;
    }
    if(item.nutrient) {
      this.kcal = item.nutrient.kcal != undefined && item.nutrient.kcal != '' ?  Math.round(item.nutrient.kcal) : 0
    }
    this.manufacture = item.manufacturer != undefined && item.manufacturer != '' ?  '(' + item.manufacturer + ')' : '';
  }
  setOriginData(item) {
    this.origin_water_including_gram =  item.unit_info.water_including_gram != undefined && item.unit_info.water_including_gram != '' ?  item.unit_info.water_including_gram : 0;
  }
  getData() {
    // get kcal
    return {
      dish_id : this.dish_id,
      food_name : this.dish_name,
      synonym_name : this.synonym_name,
      synonym_id : this.synonym_id,
      food_type: this.food_type,
      kcal : Math.round(this.kcal),
      amount: this.unit_info.amount,
      water_including_gram: this.unit_info.water_including_gram,
      gram : this.unit_info.gram,
      unit: this.unit_info.unit,
      expression : this.unit_info.expression,
      input_status: this.input_status,
      serving_size: Number(this.serving_size).toFixed(1).replace(".0",""),
      manufacture: this.manufacture
    }
  }
  
  // for session's serving_size
  setRequestData(obj) {
    this.serving_size = Number(obj.serving_size).toFixed(1).replace('.0','') ;
    // this.unit_info.water_including_gram = this.unit_info.water_including_gram;
    // this.unit_info.gram = obj.gram;
  }
  getRequestData(){
    return {
      dish_id : this.dish_id,
      origin_water_including_gram : this.origin_water_including_gram,
      food_name: this.dish_name,
      synonym_name : this.synonym_name,
      synonym_id : this.synonym_id,
      food_type: this.food_type,
      input_status: this.input_status,
      amount: this.unit_info.amount,
      gram : this.unit_info.gram,
      water_including_gram: this.unit_info.water_including_gram,
      kcal : this.kcal,
      serving_size: this.serving_size,
      expression : this.unit_info.expression,
      manufacture: this.manufacture
    }
  }
  
}

export default Dish;
