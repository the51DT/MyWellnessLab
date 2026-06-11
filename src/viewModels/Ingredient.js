
/** Ingredient Class */
class Ingredient {
  constructor() {  
    this.ingredient_id =0;  // INGREDIENT ID
    this.ingredient_name='';  // INGREDIENT 명칭
    this.food_type=''; // DISH 혹은 FOOD 
    this.synonym_name =''; // DISH 유의어 명칭
    this.synonym_id = ''; //  DISH 유의어 id
    this.image_path = ''; // 섭취량 이미지 이미지 경로
    this.input_status = ''; // 입력 상태 (ADD, DELETE, UPDATE) for Core API
    this.serving_size = 1; // 1인분 섭취량
    this.unit_info = { 
      water_including_gram: 0, // 수분포함 그램
      gram : 0, // 그램
      amount: 0,  //  양
      expression : '' // 표현
    }
    this.kcal = 0;
    this.manufacture = ''; // 제조사명
  }
  setData(item, input_status) {
    
    this.ingredient_id =  item.ingredient_id != undefined && item.ingredient_id != '' ?  item.ingredient_id : 0;
    this.ingredient_name = item.ingredient_name != undefined && item.ingredient_name != '' ?  item.ingredient_name : '';
    this.synonym_name = item.synonym_name != undefined && item.synonym_name != '' ?  item.synonym_name : '';
    this.synonym_id = item.synonym_id != undefined && item.synonym_id != '' ?  item.synonym_id : 0;
    this.food_type = item.food_type != undefined && item.food_type != '' ?  item.food_type : '';
    this.input_status = input_status; 
    if(item.unit_info) {
      this.unit_info.gram = item.unit_info.gram != undefined && item.unit_info.gram != '' ?  item.unit_info.gram : 0;
      this.unit_info.water_including_gram = item.unit_info.water_including_gram != undefined && item.unit_info.water_including_gram != '' ?  item.unit_info.water_including_gram : 0;
      this.unit_info.amount = item.unit_info.amount != undefined && item.unit_info.amount != '' ?  item.unit_info.amount : 0;
      this.unit_info.expression = item.unit_info.expression != undefined && item.unit_info.expression != '' ?  item.unit_info.expression : 0;
      this.serving_size = item.unit_info.amount != undefined && item.unit_info.amount != '' ?  item.unit_info.amount : 0;
    }
    if(item.nutrient) {
      this.kcal = item.nutrient.kcal != undefined && item.nutrient.kcal != '' ?  Math.round(item.nutrient.kcal) : 0
    }
    
    this.image_path = item.image_path != undefined && item.image_path != '' ?  item.image_path : 0;
    this.manufacture = item.manufacturer != undefined && item.manufacturer != '' ?  '('+item.manufacturer+')' : '';
  }
  getData() {
    return {
      ingredient_id : this.ingredient_id,
      ingredient_name : this.ingredient_name,
      synonym_id : this.synonym_id,
      food_type : this.food_type,
      synonym_name : this.synonym_name,
      amount:  this.unit_info.amount,
      gram : this.unit_info.gram,
      water_including_gram: this.unit_info.water_including_gram,
      expression : this.unit_info.expression,
      kcal: Math.round(this.kcal),
      serving_size: Number(this.serving_size).toFixed(1).replace(".0",""),
      manufacture: this.manufacture
    }
  }
  // for session
  setRequestData(obj) {
    this.serving_size = Number(obj.serving_size).toFixed(1).replace('.0','') ;
    // this.unit_info.water_including_gram = obj.water_including_gram;
    // this.unit_info.gram = obj.gram;

  }
  // for session to api
  getRequestData(){
    return {
      food_type : this.food_type,
      ingredient_id : this.ingredient_id,
      synonym_id : this.synonym_id,
      synonym_name: this.synonym_name,
      input_status: this.input_status,
      amount:  this.unit_info.amount,
      serving_size: this.serving_size,
      water_including_gram : this.unit_info.water_including_gram,
      expression : this.unit_info.expression,
      kcal: this.kcal,
      manufacture: this.manufacture
    }
  }
  
}

export default Ingredient;