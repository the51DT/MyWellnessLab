<script>

import {go} from "@/assets/js/common";

export default {
  name: "MyPageReportPrintRecord",
  data(){
    return{
      prefix: "MyPageReportPrintRecord", /*231212 클래스 접두어*/
      data: [
        {printDate: "2023.09.23", checkupDate: "2022. 09. 02"},
        {printDate: "2023.09.23", checkupDate: "2022. 09. 02"},
        {printDate: "2023.09.23", checkupDate: "2022. 09. 02"},
        {printDate: "2023.09.23", checkupDate: "2022. 09. 02"},
        {printDate: "2023.09.23", checkupDate: "2022. 09. 02"},
        {printDate: "2023.09.23", checkupDate: "2022. 09. 02"},
        {printDate: "2023.09.23", checkupDate: "2022. 09. 02"},
        {printDate: "2023.09.23", checkupDate: "2022. 09. 02"},
        {printDate: "2023.09.23", checkupDate: "2022. 09. 02"},
        {printDate: "2023.09.23", checkupDate: "2022. 09. 02"},
        {printDate: "2023.09.23", checkupDate: "2022. 09. 02"},
        {printDate: "2023.09.23", checkupDate: "2022. 09. 02"},
        {printDate: "2023.09.23", checkupDate: "2022. 09. 02"},
        {printDate: "2023.09.23", checkupDate: "2022. 09. 02"},
        {printDate: "2023.09.23", checkupDate: "2022. 09. 02"},
        {printDate: "2023.09.23", checkupDate: "2022. 09. 02"},
      ],
      paging: 10, /*한번에 페이징 개수*/
      isPc: false, /*가로가 920이상인지?*/
      isCancel: false, /*240116 취소건일 경우 버튼 비활성처리 용 변수, 변경해도 됨, true: 취소*/
    }
  },
  methods: {
    go,
    more(){ /*페이징 버튼 액션*/
      this.paging += 10;
    },
    winWidth(){
      this.isPc = window.innerWidth > 920;
    },
    ready(){
      alert("현재 배송 준비중입니다.");
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
  <div :class="prefix + '--wrap'">
    <ul v-if="data.length > 0" class="bull--no">
      <li v-for="item in data.slice(0, paging)" class="MyPageCheckupDataRecord--li">
        <div :class="prefix + '--group'">
          <div class="MyPageCheckupDataRecord--txt">
            <dl class="align--dl">
              <dt class="MyPageCheckupDataRecord--dt" :class="prefix">인쇄신청일</dt>
              <dd class="MyPageCheckupDataRecord--dd" :class="prefix">{{ item.printDate }}</dd>
              <dt class="MyPageCheckupDataRecord--dt" :class="prefix">건강 분석일</dt>
              <dd class="MyPageCheckupDataRecord--dd" :class="prefix">{{ item.checkupDate }}</dd>
            </dl>
          </div>
          <div class="MyPageCheckupDataRecord--arrow-wrap">
            <button @click="ready" :disabled="isCancel" type="button" :class="prefix + '--btn'">배송정보보기</button>
          </div>
          <div class="MyPageCheckupDataRecord--go">
            <button @click="ready(item.transactionCode)" :disabled="isCancel" type="button" aria-label="주문정보보기" class="MyPageCheckupDataRecord--go-order"></button>
          </div>
        </div>
        <p v-if="isCancel" class="txt--danger">결제 취소된 이력입니다.</p>
      </li>
    </ul>
    <div v-else :class="prefix + '--no-data'">
      리포트 인쇄신청한 이력이 없습니다
    </div>
    <div v-if="data.length > paging && isPc" class="txt--center MyPageCheckupDataRecord--btn">
      <button @click="more" type="button" class="btn--txt3">더보기</button>
    </div>
  </div>
</template>

<style lang="scss">

</style>