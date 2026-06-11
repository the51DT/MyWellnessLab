
/** Allergy */
class Allergy {
  constructor() {
    this.allergy_id = '';
    this.allergy_name = '';
    this.description = '';
  }
  // set join data
  setData(item) {
    this.allergy_id = item.id;
    this.allergy_name = item.name;
    this.description = item.description;
    
  }
  // get required join data
  getData() {
    return this;
  }
}

export default Allergy;