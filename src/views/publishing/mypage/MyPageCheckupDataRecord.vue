<script>

import router from "@/router";
import {go} from "@/assets/js/common";

export default {
  name: "MyPageCheckupDataRecord",
  data(){
    return{
      data: [
        {label: "국민건강보험공단", date: "2022. 09. 02"},
        {label: "직접입력", date: "2022. 09. 02"},
        {label: "국민건강보험공단", date: "20022. 09. 02"},
        {label: "직접입력", date: "2022. 09. 02"},
        {label: "국민건강보험공단", date: "20022. 09. 02"},
        {label: "직접입력", date: "2022. 09. 02"},
        {label: "국민건강보험공단", date: "20022. 09. 02"},
        {label: "직접입력", date: "2022. 09. 02"},
        {label: "국민건강보험공단", date: "20022. 09. 02"},
        {label: "직접입력", date: "2022. 09. 02"},
        {label: "국민건강보험공단", date: "20022. 09. 02"},
        {label: "직접입력", date: "2022. 09. 02"},
        {label: "국민건강보험공단", date: "20022. 09. 02"},
        {label: "직접입력", date: "2022. 09. 02"},
        {label: "국민건강보험공단", date: "20022. 09. 02"},
        {label: "직접입력", date: "2022. 09. 02"},
        {label: "국민건강보험공단", date: "20022. 09. 02"},
        {label: "직접입력", date: "2022. 09. 02"},
        {label: "국민건강보험공단", date: "20022. 09. 02"},
        {label: "직접입력", date: "2022. 09. 02"},
        {label: "국민건강보험공단", date: "2022. 09. 02"},
      ],
      paging: 10, /*한번에 페이징 개수*/
      isPc: false, /*가로가 920이상인지?*/
    }
  },
  methods: {
    go,
    router() {
      return router
    },
    more(){ /*페이징 버튼 액션*/
      this.paging += 10;
    },
    winWidth(){
      this.isPc = window.innerWidth > 920;
    }
  },
  mounted() {
    window.addEventListener("scroll", ()=>{ /*아래 스크롤하면 페이징 늘어나도록*/
      if(!this.isPc){
        if(window.scrollY + window.innerHeight >= document.body.offsetHeight) {
          this.more();
        }
      }
    })
    this.winWidth();
    window.addEventListener("resize", ()=>{
      this.winWidth();
    });
  }
}
</script>

<template>
  <div class="MyPageCheckupDataRecord">
    <ul class="bull--no">
      <li v-for="item in data.slice(0, paging)" class="MyPageCheckupDataRecord--li">
        <a @click="go('/pub-my-page-checkup-data-record-detail')" href="javascript: void(0);" class="align--between">
          <div class="MyPageCheckupDataRecord--txt">
            <span class="label" :class="item.label === '국민건강보험공단' ? 'red' : '직접입력' ? 'biolet' : ''">{{item.label}}</span>
            <dl class="align--dl">
              <dt class="MyPageCheckupDataRecord--dt">검진일 :</dt>
              <dd class="MyPageCheckupDataRecord--dd">{{ item.date }}</dd>
            </dl>
          </div>
          <div class="MyPageCheckupDataRecord--arrow-wrap">
            <div class="MyPageCheckupDataRecord--arrow"></div>
          </div>
        </a>
      </li>
    </ul>
    <div v-if="data.length > paging && isPc" class="txt--center MyPageCheckupDataRecord--btn">
      <button @click="more" type="button" class="btn--txt3">더보기</button>
    </div>
  </div>
</template>

<style lang="scss">

</style>