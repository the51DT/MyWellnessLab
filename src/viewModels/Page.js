class Page{
    constructor(page_number, page_size, total_page_count, max_page_size) {  
        this.page_number = page_number
        this.page_size = page_size
        this.total_page_count = total_page_count
        this.max_page_size = max_page_size
    }
    setData(page_number, page_size, total_page_count, max_page_size) {
        this.page_number = page_number
        this.page_size = page_size
        this.total_page_count = total_page_count
        this.max_page_size = max_page_size
    }
    // get required join data
    getData() {
        return this;
    }
}
export default Page;