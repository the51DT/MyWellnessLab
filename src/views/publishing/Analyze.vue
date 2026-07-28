<script>

import BaseToast from "./BaseToast.vue";
import BasePopup from '@/components/BasePopup.vue' /* 202606 추가 */

export default {
  name: "AnalyzeList",
  components: {BaseToast,BasePopup}, /* 202606 추가 */
  data(){
    return{
      ingData: [ /*설문 진행 중*/
        {date: "2023.11.20", checkupDate: "2026.05.05", value: 0},
      ],
      completeData: [ /*분석 완료*/
        {date: "0021.12.26", checkupDate: "2023.01.12", value: 0},
        {date: "1021.02.12", checkupDate: "2023.04.13", value: 1},
        {date: "2021.06.19", checkupDate: "2023.06.23", value: 2},
        {date: "3021.06.19", checkupDate: "2023.06.23", value: 3},
        {date: "4021.06.19", checkupDate: "2023.06.23", value: 4},
        {date: "5021.06.19", checkupDate: "2023.06.23", value: 5},
        {date: "6021.06.19", checkupDate: "2023.06.23", value: 6},
        {date: "7021.06.19", checkupDate: "2023.06.23", value: 7},
        {date: "8021.06.19", checkupDate: "2023.06.23", value: 8},
        {date: "9021.06.19", checkupDate: "2023.06.23", value: 9},
        {date: "0021.12.26", checkupDate: "2023.01.12", value: 10},
        {date: "1021.02.12", checkupDate: "2023.04.13", value: 11},
        {date: "2021.06.19", checkupDate: "2023.06.23", value: 12},
        {date: "3021.06.19", checkupDate: "2023.06.23", value: 13},
        {date: "4021.06.19", checkupDate: "2023.06.23", value: 14},
        {date: "5021.06.19", checkupDate: "2023.06.23", value: 15},
        {date: "6021.06.19", checkupDate: "2023.06.23", value: 16},
        {date: "7021.06.19", checkupDate: "2023.06.23", value: 17},
        {date: "8021.06.19", checkupDate: "2023.06.23", value: 18},
        {date: "9021.06.19", checkupDate: "2023.06.23", value: 19},
        {date: "0021.12.26", checkupDate: "2023.01.12", value: 20},
        {date: "1021.02.12", checkupDate: "2023.04.13", value: 21},
        {date: "2021.06.19", checkupDate: "2023.06.23", value: 22},
        {date: "3021.06.19", checkupDate: "2023.06.23", value: 23},
        {date: "4021.06.19", checkupDate: "2023.06.23", value: 24},
      ],
      paging: 10, /*한번에 보여질 이력 개수*/
      toastMsg: "", /*설문 삭제됬다는 토스트 메시지*/
      isPc: false, /*가로가 920이상인지?, false: mobile*/
      ingDeletePopup: {
        pop: false,
        value: 0,
      }, /* 202606 진행중인 건강설문 삭제 팝업 */
    }
  },
  methods: {
    deleteRow(value){ /*이력 삭제*/
      // if(confirm("진행중인 건강설문을 삭제하시겠습니까?")){
        this.ingData = this.ingData.filter( item => item.value !== value );

        // 토스트 메시지 사용법, 메시지를 전달한 후 setTimeout으로 삭제 해줘야 함
        this.toastMsg = "진행중인 설문이 삭제되었습니다";
        setTimeout(()=>{
          this.toastMsg = ""
        }, 1500);

      // }
    },
    more(){ /*더보기 페이징*/
      this.paging += 10;
    },
    winWidth(){ /*브라우저 가로 사이즈 체크*/
      this.isPc = window.innerWidth > 960;
    }
  },
  mounted() {
    window.addEventListener("scroll", ()=>{ /*모바일 일 경우 아래 스크롤하면 페이징 늘어나도록*/
      if(!this.isPc){
        if(window.scrollY + window.innerHeight >= document.body.offsetHeight) {
          this.more();
        }
      }
    })
    this.winWidth();
    window.addEventListener("resize", ()=>{ /*브라우저 가로 사이즈 체크*/
      this.winWidth();
    });
  }
}
</script>

<template>
  <section class="container AnalyzeList">

    <div class="AnalyzeList--ing">
      <h2 class="AnalyzeList--ing-tit">설문 진행 중</h2>
      <div class="AnalyzeList--ing-con">

        <div v-for="item in ingData" :key="item.value" class="AnalyzeList--ing-for">
          <div class="AnalyzeList--ing-date-wrap">
            <strong class="AnalyzeList--ing-date">{{ item.date }}</strong>
            <span class="AnalyzeList--ing-checkup">검진일
              <span class="AnalyzeList--ing-checkup-date">{{ item.checkupDate }}</span>
            </span>  <!-- 202606 텍스트 수정 -->
          </div>
          <div class="align--between AnalyzeList--ing-btn-wrap">
            <div class="AnalyzeList--ing-continue">
              <button type="button" class="AnalyzeList--ing-continue-btn">이어서 하기</button>
            </div>
            <div class="AnalyzeList--ing-delete">
              <button @click="ingDeletePopup.pop = true, ingDeletePopup.value = item.value" type="button" aria-label="삭제" class="AnalyzeList--ing-delete-btn">삭제</button> <!-- 202606 퍼블 팝업 확인용 click 수정 -->
            </div>
          </div>
        </div>

        <div v-if="ingData.length === 0" class="AnalyzeList--no-data">진행 중인 설문이 없습니다</div>

      </div>
    </div>

    <div class="AnalyzeList--complete">
      <h2 class="AnalyzeList--complete-tit">분석 완료</h2>
      <p v-if="completeData.length > 0" class="AnalyzeList--complete-total"> <!-- 202606 v-if 추가 -->
        총
        <strong class="AnalyzeList--complete-number">{{completeData.length}}</strong>개의 분석 결과 이력이 있습니다
      </p>
      <div class="AnalyzeList--complete-con">

        <div v-for="(item, index) in completeData.slice(0, paging)" :key="index" class="AnalyzeList--complete-for">
          <div class="AnalyzeList--complete-date-wrap">
            <strong class="AnalyzeList--complete-date">{{ item.date }}</strong>
            <span class="AnalyzeList--complete-checkup">검진일
              <span class="AnalyzeList--complete-checkup-date">{{ item.checkupDate }}</span>
            </span> <!-- 202606 텍스트 수정 -->
          </div>
          <div class="AnalyzeList--complete-btn-wrap">
            <button @click="$router.push('../analyze/analyze-detail')" type="button" class="AnalyzeList--complete-btn">결과 보기</button> <!-- 202606 퍼블 확인용 링크 수정 -->
          </div>
        </div>

        <div v-if="completeData.length > paging && isPc" class="AnalyzeList--more">
          <button @click="more" type="button" class="AnalyzeList--more-btn">더 보기</button>
        </div>

        <div v-if="completeData.length === 0" class="AnalyzeList--no-data">분석 완료된 설문이 없습니다</div>

      </div>
    </div>

    <BaseToast ref="toast" :msg="toastMsg" class="toast-green"/> <!-- 202606 클래스 변경 -->

    <!-- 진행중인 건강설문 삭제 팝업 -->
    <BasePopup v-if="ingDeletePopup.pop"> 
      <template v-slot:contents>
        <p class="pop-text-light">진행중인 건강설문을 삭제하시겠습니까?</p>
        <div class="pop-btn-wrap">
          <button type="button" @click="ingDeletePopup.pop = false" class="pop-btn pop-btn--gray">닫기</button>
        <button type="button" @click="ingDeletePopup.pop = false, deleteRow(ingDeletePopup.value)" class="pop-btn pop-btn--green">확인</button> <!-- 퍼블 확인을 위해 팝업 임의 노출 -->
        </div>
      </template>
    </BasePopup>


  </section>
</template>

<style lang="scss">

</style>