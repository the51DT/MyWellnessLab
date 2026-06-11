<script>
import BasePopup from '../BasePopup.vue'
import router from '@/router'
import { ref } from 'vue'

export default {
  name: 'AnalyzeDownload',
  components: {
    BasePopup
  },
  data () {
    return {
      isOne: false, /* 일회성인지? */
      popupDown: false, /* 다운로드 팝업 */
      isIos: false, /* ios 인지? */
      isIosChrome: false, /* ios 중 크롬인지? */
      popupDelete: false, /* 삭제 클릭 시 팝업 오프너 */
      toastMsg: '', /* 삭제 토스트 메시지 핸들러 */
      isSharePopup: false /* 240108 파일 공유 레이어팝업 변수 */
    }
  },
  methods: {
    viewReport () {
      // psf 웹브라우저 보기
    },
    kakao () {
      // 카카오 연결
    },
    downCancel () {
      // 파일 다운 취소
    },
    iosSafari () {
      // ios 확인눌럿 파일 링크 연결
    },
    deleteReport () {
      if (!confirm('이전화면으로 이동 시, \n분석 결과 재 확인 및 리포트 파일 재 다운로드가 불가합니다\n\n그래도 이동하시겠습니까?')) {
      } else {
        this.toastMsg = '분석결과 내용이 삭제되었습니다'
        setTimeout(() => {
          this.toastMsg = null
        }, 1500)
        setTimeout(() => {
          router.push('/') // 홈으로 이동하도록 처리해주세요, 우선 퍼블리스트로 이동
        }, 2000)
      }
    },
    printReport () {
      // 인쇄 신청 화면 이동 처리
    },
    otherReport () {
      // 분석결과 이력 이동 처리
    }
  },
  mounted () {
    // ios 체크
    const userAgent = navigator.userAgent || window.opera
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      this.isIos = true
    }
    // else if (/android/i.test(userAgent)) {
    // }
    else {
      this.isIos = false
    }

    // ios 사파리 or 크롬 체크
    if (/CriOS/.test(userAgent)) {
      this.isIosChrome = true
    }
    // else if (/Safari/.test(userAgent)) {
    //   this.isIosChrome = false;
    // }
    else {
      this.isIosChrome = false
    }
  }
}

</script>

<template>
  <section class="AnalyzeDownload">
    <div class="AnalyzeDownload--btn-div"> <!--231205 클래스 삭제-->

      <div v-if="!isOne" class="AnalyzeDownload--report-kakao">
        <button @click="viewReport" type="button" class="AnalyzeDownload--view">리포트 파일 다운로드 및 보기</button>
        <button @click="kakao" type="button" class="AnalyzeDownload--kakao">리포트 파일 공유하기</button>
      </div>

      <div class="AnalyzeDownload--down-wrap">
        <p class="AnalyzeDownload--down-txt">* 파일 비밀번호는 생년월일 6자리 입니다</p>
      </div>

    </div>

    <div v-if="!isOne" class="AnalyzeDownload--print-wrap">
      <div class="AnalyzeDownload--print-wrap2">
        <button @click="printReport" type="button" class="AnalyzeDownload--print">리포트 인쇄 신청하기</button>
      </div>
      <div class="AnalyzeDownload--other-wrap">
        <button @click="otherReport" type="button" class="AnalyzeDownload--other">다른 분석 결과 보기</button>
      </div>
      <div class="AnalyzeDownload--delete-wrap">
        <button @click="deleteReport" type="button" class="AnalyzeDownload--delete">삭제</button>
      </div>
    </div>

  </section>

  <base-popup v-if="popupDown"> <!--aos, pc 파일다운로드 시 나타나는 팝업, 변경된 버전-->
    <template v-slot:contents>
      <div class="AnalyzeDownload--down-pop--aos"> <!--aos, pc-->
        <div class="AnalyzeDownload--down-pop--aos-txt">
          <p>파일 생성이 완료 되었습니다.</p>
          <p>하단의 공유 버튼을 클릭하여 주십시오.</p>
          <div class="AnalyzeDownload--down-pop--btn-wrap">
            <button type="button" @click="isSharePopup = false" class="btn-pop--gray">닫기</button>
            <button type="button" class="btn-pop--green">공유</button>
          </div>
        </div>
      </div>

    </template>
  </base-popup>

  <base-popup v-if="isSharePopup"> <!--aos, pc 파일다운로드 시 나타나는 팝업-->
    <template v-slot:contents>

      <div v-if="isIos" class="AnalyzeDownload--down-pop"> <!--ios-->
        <div class="AnalyzeDownload--down-pop--ios">
          브라우저 하단의

          <div v-if="isIosChrome" class="AnalyzeDownload--down-pop--chrome"> <!--크롬-->
            <img src="" alt="" class="AnalyzeDownload--down-pop--chrome-ico" /> 아이콘을 선택 후 <br />
            상단의 <img src="" alt="" class="AnalyzeDownload--down-pop--chrome-ico2" /> 버튼을 선택해주세요
          </div>

          <div v-else class="AnalyzeDownload--down-pop--safari"> <!--사파리-->
            <img
              src=""
              alt=""
              srcset=""
              class="AnalyzeDownload--down-pop--safari-ico" /> 아이콘을 선택 후 <br />
            [파일에 저장] 버튼을 선택해주세요
          </div>

        </div>
        <div class="AnalyzeDownload--down-pop--confirm">
          <button @click="iosSafari" type="button">확인</button>
        </div>
      </div>

      <div v-else class="AnalyzeDownload--down-pop--aos"> <!--aos, pc-->
        <div class="AnalyzeDownload--down-pop--aos-txt">
          다운로드 중입니다 <br />
          잠시만 기다려 주세요
          <div class="AnalyzeDownload--down-pop--load">로딩 이미지</div>
        </div>
        <div class="AnalyzeDownload--down-pop--cancel-wrap">
          <button @click="downCancel()" type="button" class="AnalyzeDownload--down-pop--cancel">취소</button>
        </div>
      </div>

    </template>
  </base-popup>

  <transition name="toastFade">
    <div v-if="toastMsg" class="toast">
      {{ toastMsg }}
    </div>
  </transition>

</template>

<style lang="scss">

</style>
