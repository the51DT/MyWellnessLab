
/** vegiterian */
class Vegetarian {
  constructor() {
    this.veganism_id = '';
    this.veganism_name = '';
    this.description = '';
  }
  // set join data
  setData(item) {
    this.veganism_id = item.id;
    this.veganism_name = item.name;
    this.description = item.description;
    
  }
  // get required join data
  getData() {
    return this;
  }
}

export default Vegetarian;