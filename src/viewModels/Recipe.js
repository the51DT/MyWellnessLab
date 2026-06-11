
/** Receipe Class */
class Recipe {
  constructor() {  
    this.dish_id = 0;
    this.dish_name = '';
    this.nutrient = [
      {id: 'kcal', label: '칼로리', data: 100},
      {id: 'nf_cho', label: '탄수화물', data: 100},
      {id: 'nf_prot', label: '단백질', data: 100},
      {id: 'nf_fat', label: '지방', data: 100},
      {id: 'nf_mn', label: '망간', data: 100},
      {id: 'nf_phos', label: '인', data: 100},
      {id: 'nf_cu', label: '구리', data: 100},
      {id: 'nf_ca', label: '칼슘', data: 100},
      {id: 'nf_fe', label: '철', data: 100},
    ];
  }
  // set join data
  setData(item) {
    this.dish_id = item.dish_id;
    this.dish_name = item.dish_name;

    /** matching nutrient and item with for loop */
    for (let i = 0; i < this.nutrient.length; i++) {
      for(let key in item) {
        if(this.nutrient[i].id === key) {
          this.nutrient[i].data = item[key];
          break;
        }
      }
    }
  }
  // get required join data
  getData() {
    return this;
  }
}

export default Recipe;