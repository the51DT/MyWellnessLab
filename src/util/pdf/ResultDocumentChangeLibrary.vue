<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <main id="main" :class="{ hidden: true }"><!-- 무조건 -->
    
    <section id="non-section" >
      <article v-if="!loading" id="non-article">
        <div
          id="mainpage"          
          class="mainpage"
          :class="save ? 'stretch-page2' : ''"
          ><!-- 24.01.03 텍스트들이 아래로 밀리는 이슈가 있어서 삭제 :class="save ? 'stretch-page2' : ''"  -->
          <template v-for="i in totalPage" :key="i">
            <div
              v-if="
                i === 1 &&
                (!test || (test && testPage === 1)) &&
                isProcessingPage(i)
              "
              class="page-wrapper"
              :id="'page' + i"
            >
              <Page1
                :id="'page-wrapper' + i"
                :save="save"
                :userInfo="userInfo"
                :date="comph.resultDto.myData.reg_date.substr(0, 10)"
                :reportNo="report_no"
              ></Page1>
            </div>
            <div
              v-if="
                i === 6 &&
                (!test || (test && testPage === 6)) &&
                isProcessingPage(i)
              "
              class="page-wrapper"
              :id="'page' + i"
            >
              <!-- <Page7
                :id="'page-wrapper' + i"
                :save="save"
                :health="health"
                :value="oxi_met_value()"
                :userInfo="userInfo"
                :check_date="check_date"
                :report_no="report_no"
                :comph="comph"
                :hcr="hcr"
                :pdfScale="pdfScale"
                :eatingHabit="eatingHabit"
                :meal="meal"
                :recommendData="recommendData"
              ></Page7> -->
            </div>
            <!-- 240109 출력신청인 경우 검진이력은 제외한다. -->
            <div
              v-if="
                i === 7 && reportType !== 'printReport' &&
                (!test || (test && testPage === 7)) &&
                isProcessingPage(i)
              "
              class="page-wrapper"
              :id="'page' + i"
            >
              <Page8
                :id="'page-wrapper' + i"
                :save="save"
                :userInfo="userInfo"
                :check_date="check_date"
                :comph="comph"
                :hcr="hcr"
                :report_no="report_no"
                :pdfScale="pdfScale"
                :reportType="reportType"
              ></Page8>
            </div>            
            <div
              v-if="
                false &&
                i === 9 &&
                (!test || (test && testPage === 9)) &&
                isProcessingPage(i)
              "
              class="page-wrapper"
              :id="'page' + i"
            >
              <Page10
                :id="'page-wrapper' + i"
                :save="save"
                :userInfo="userInfo"
                :check_date="check_date"
                :comph="comph"
                :hcr="hcr"
                :value="oxi_met_value()"
                :report_no="report_no"
                :health="health"
              ></Page10>
            </div>

            <div
              v-if="
                i === 11 &&
                (!test || (test && testPage === 11)) &&
                isProcessingPage(i)
              "
              class="page-wrapper"
              :id="'page' + i"
            >
              <Page12
                :id="'page-wrapper' + i"
                :save="save"
                :userInfo="userInfo"
                :check_date="check_date"
                :comph="comph"
                :hcr="hcr"
                :value="oxi_met_value()"
                :report_no="report_no"
                :health="health"
                :pdfScale="pdfScale"
              ></Page12>
            </div>

            <div
              v-if="
                i === 12 &&
                (!test || (test && testPage === 12)) &&
                isProcessingPage(i)
              "
              class="page-wrapper"
              :id="'page' + i"
            >
              <Page13
                :id="'page-wrapper' + i"
                :save="save"
                :userInfo="userInfo"
                :check_date="check_date"
                :comph="comph"
                :hcr="hcr"
                :value="oxi_met_value()"
                :health="health"
                :report_no="report_no"
                :pdfScale="pdfScale"
              ></Page13>
            </div>

            <div
              v-if="
                i === 13 &&
                (!test || (test && testPage === 13)) &&
                isProcessingPage(i)
              "
              class="page-wrapper"
              :id="'page' + i"
            >
              <Page14
                :id="'page-wrapper' + i"
                :save="save"
                :userInfo="userInfo"
                :check_date="check_date"
                :comph="comph"
                :hcr="hcr"
                :value="oxi_met_value()"
                :health="health"
                :report_no="report_no"
                :pdfScale="pdfScale"
              ></Page14>
            </div>

            <div
              v-if="
                i === 15 &&
                (!test || (test && testPage === 15)) &&
                isProcessingPage(i)
              "
              class="page-wrapper"
              :id="'page' + i"
            >
              <Page16
                :id="'page-wrapper' + i"
                :save="save"
                :userInfo="userInfo"
                :check_date="check_date"
                :comph="comph"
                :hcr="hcr"
                :value="oxi_met_value()"
                :health="health"
                :eatingHabit="eatingHabit"
                :report_no="report_no"
                :pdfScale="pdfScale"
              ></Page16>
            </div>

            <div
              v-if="
                i === 17 &&
                (!test || (test && testPage === 17)) &&
                isProcessingPage(i)
              "
              class="page-wrapper"
              :id="'page' + i"
            >
              <Page17
                :id="'page-wrapper' + i"
                :save="save"
                :userInfo="userInfo"
                :check_date="check_date"
                :comph="comph"
                :hcr="hcr"
                :value="oxi_met_value()"
                :health="health"
                :eatingHabit="eatingHabit"
                :report_no="report_no"
                :meal="meal"
              ></Page17>
            </div>

            <div
              v-if="
                i === 18 &&
                (!test || (test && testPage === 18)) &&
                isProcessingPage(i)
              "
              class="page-wrapper"
              :id="'page' + i"
            >
              <Page18
                :id="'page-wrapper' + i"
                :save="save"
                :userInfo="userInfo"
                :check_date="check_date"
                :comph="comph"
                :meal="meal"
                :hcr="hcr"
                :value="oxi_met_value()"
                :health="health"
                :eatingHabit="eatingHabit"
                :report_no="report_no"
              ></Page18>
            </div>

            <div
              v-if="
                i === 19 &&
                (!test || (test && testPage === 19)) &&
                isProcessingPage(i)
              "
              class="page-wrapper"
              :id="'page' + i"
            >
              <Page19
                :id="'page-wrapper' + i"
                :save="save"
                :userInfo="userInfo"
                :check_date="check_date"
                :comph="comph"
                :hcr="hcr"
                :value="oxi_met_value()"
                :health="health"
                :eatingHabit="eatingHabit"
                :report_no="report_no"
                :meal="meal"
              ></Page19>
            </div>

            <div
              v-if="
                i === 20 &&
                (!test || (test && testPage === 20)) &&
                isProcessingPage(i)
              "
              class="page-wrapper"
              :id="'page' + i"
            >
              <Page20
                :id="'page-wrapper' + i"
                :save="save"
                :userInfo="userInfo"
                :check_date="check_date"
                :comph="comph"
                :hcr="hcr"
                :value="oxi_met_value()"
                :health="health"
                :eatingHabit="eatingHabit"
                :report_no="report_no"
                :meal="meal"
              ></Page20>
            </div>

            <div
              v-if="
                i === 21 &&
                (!test || (test && testPage === 21)) &&
                isProcessingPage(i)
              "
              class="page-wrapper"
              :id="'page' + i"
            >
              <Page21
                :id="'page-wrapper' + i"
                :save="save"
                :userInfo="userInfo"
                :check_date="check_date"
                :comph="comph"
                :hcr="hcr"
                :value="oxi_met_value()"
                :health="health"
                :eatingHabit="eatingHabit"
                :report_no="report_no"
                :meal="meal"
              ></Page21>
            </div>

            <div
              v-if="
                i === 23 &&
                (!test || (test && testPage === 23)) &&
                isProcessingPage(i)
              "
              class="page-wrapper"
              :id="'page' + i"
            >
              <Page24
                :id="'page-wrapper' + i"
                :save="save"
                :userInfo="userInfo"
                :check_date="check_date"
                :comph="comph"
                :recommendData="recommendData"
                :hcr="hcr"
                :value="oxi_met_value()"
                :health="health"
                :eatingHabit="eatingHabit"
                :report_no="report_no"
                :pdfScale="pdfScale"
                :loadingFinished="loadingFinished"
              ></Page24>
            </div>

            <div
              v-if="
                i === 24 &&
                (!test || (test && testPage === 24)) &&
                isProcessingPage(i)
              "
              class="page-wrapper"
              :id="'page' + i"
            >
              <Page26
                :id="'page-wrapper' + i"
                :save="save"
                :userInfo="userInfo"
                :check_date="check_date"
                :comph="comph"
                :hcr="hcr"
                :value="oxi_met_value()"
                :health="health"
                :eatingHabit="eatingHabit"
                :report_no="report_no"
                :recommendData="recommendData"
              ></Page26>
            </div>

            <div
              v-if="
                i === 26 &&
                (!test || (test && testPage === 26)) &&
                isProcessingPage(i)
              "
              class="page-wrapper"
              :id="'page' + i"
            >
              <Page29
                :id="'page-wrapper' + i"
                :save="save"
                :userInfo="userInfo"
                :check_date="check_date"
                :comph="comph"
                :hcr="hcr"
                :value="oxi_met_value()"
                :health="health"
                :eatingHabit="eatingHabit"
                :report_no="report_no"
                :meal="meal"
                :loadingFinished="loadingFinishedPage"
              ></Page29>
            </div>

            <div
              v-if="!test && isStaticPage(i) && isProcessingPage(i)"
              class="page-wrapper"
              :id="'page' + i"
            >
              <PageStatic
                :id="'page-wrapper' + i"
                :save="save"
                :page="i"
              ></PageStatic>
            </div>
          </template>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import * as htmlToImage from "html-to-image";
import html2canvas from "html2canvas";

import { jsPDF } from "jspdf";
import Page1 from "./DocumentPages/Page1.vue";
// import Page7 from "./DocumentPages/Page7.vue";
import Page8 from "./DocumentPages/Page8.vue";
import Page10 from "./DocumentPages/Page10.vue";
import Page12 from "./DocumentPages/Page12.vue";
import Page13 from "./DocumentPages/Page13.vue";
import Page14 from "./DocumentPages/Page14.vue";
import Page16 from "./DocumentPages/Page16.vue";
import Page17 from "./DocumentPages/Page17.vue";
import Page18 from "./DocumentPages/Page18.vue";
import Page19 from "./DocumentPages/Page19.vue";
import Page20 from "./DocumentPages/Page20.vue";
import Page21 from "./DocumentPages/Page21.vue";
import Page24 from "./DocumentPages/Page24.vue";
import Page26 from "./DocumentPages/Page26.vue";
import Page29 from "./DocumentPages/Page29.vue";
import PageStatic from "./DocumentPages/PageStatic.vue";

/* import {
  GetHCRList,
  comphReport,
  eatingHabitReport,
  healthReport,
  mealReport,
  recommendReport,
} from "@/api/restApi"; */
import { convertDateToYYYYMMDD, sleep } from "@/assets/js/chart/util";

import router from "@/router";
import {useStore} from 'vuex';
import { ref, computed, onMounted, toRaw } from 'vue';

const store = useStore();

const props = defineProps({
  /* 24.01.03 props.save >> PDF 파일로 만드는 것 까지는 공통로직임으로 아래의 reportType 변수를 통해 저장할 것인지 파일로 할 것인지 분류. 
   * - 하위 컴퍼넌트에 save 변수를 참조하는 경우가 많아서 별도 변수로 다운로드/파일화 분류함
   */
  save: {
    type:Boolean,
    default:true,
  }, //저장 or 보기 여부 
  reportType : String,
  finish: Function,
  updateProgress: null,
  reportno: null,
  sub: null,
  reportData:Object
});


let pdfScale = 4;
let pdfProcessing = false;

//API 데이터
let health = null; //rstHQ_DiagRepMHI1
let eatingHabit = null; //rstHQ_DiagRepMHI1_R1
let hcr = null; //GetHCRList
let comph = null; //rstComphCkRep
let meal = null; //rstHE_DiagRep
let recommendData = null; //mhnPNSReport

let check_date = null;

const loading = ref(true);
let userInfo = null;

let isSub = false;
let totalPage = 27;
// totalPage = 1,
// 이미지로 처리하는 페이지 리스트
let staticPageList = [2, 4, 5, 8, 9, 10, 14, 16, 22, 25, 27];

let report_no = -1;
const isLoading = ref(true);

let test = false;
let testPage = 23;
let pdfProcessingPage = -1;
let loadingGraph = false; //22페이지 로딩 중 여부
let loadingPage29 = false; //29페이지 로딩 중 여부
let enableDownload = computed(() => {
    let rtn = false;

    if(props.reportType !== undefined) {
        rtn = props.reportType === 'download' ? true :false;
    }
    return rtn;
});

let pdfFile = false; //kakao share 때문에..


// 데이터 로딩 완료 후
function loadingFinished() {
  window.addEventListener("resize", resize);

  //pdf 다운로드 일때
  if (/* props.save && */ pdfProcessing === false) {
    setTimeout(async () => {
      exportToPDF();
    }, 1);
  } else if (pdfProcessing /* && props.save */ ) {
    // 22페이지 로딩 완료시 호출
    loadingGraph = true;
  }
}

function loadingFinishedPage() {
  if (pdfProcessing /*  && props.save */ ) { //TODO 상관없이 바꾸도록
    //29페이지 로딩 완료
    loadingPage29 = true;
  }
}

function resize() {
  console.log("resize!!!!!!!!", pdfProcessing);

  for (var i = 1; i <= totalPage; i++) {
    const elementDOM = document.querySelector("#page-wrapper" + i);

    if (!elementDOM) continue;
    //const windowWidth = document.querySelector("#mainpage").offsetWidth;
    const windowWidth = document.querySelector(".popup--space>.padding").offsetWidth;
    let scale = windowWidth / 595 / pdfScale;

    // pdf 저장시에는 화면에 맞추지 않고 원래 사이즈대로 크게해서 저장해야한다.
    if (pdfProcessing === false) {
      elementDOM.style.transform = "scale(" + scale + ")";
      const wrapper = document.querySelector("#page" + i);
      wrapper.style.height = 842 * scale * pdfScale + "px";
      wrapper.style.width = 595 * scale * pdfScale + "px";
    }
    
    //pdf 보기일 경우 화면에 맞게 확대/축소
    else {
      scale = 1; //pdfScale;

      elementDOM.style.transform = "scale(" + scale + ")";
      const wrapper = document.querySelector("#page" + i);
      /* wrapper.style.height = 842 * scale * pdfScale + "px";
      wrapper.style.width = 595 * scale * pdfScale + "px"; */
      wrapper.style.height = 842 * scale * pdfScale + "px";
      wrapper.style.width = 595 * scale * pdfScale + "px";
      wrapper.overflow = "scroll";
    }
  }
  
  // pdf 다운로드일때 #mainpage 스타일 지정
  if (pdfProcessing === true) {
    const main = document.querySelector("#mainpage");
    const width = main.offsetWidth;
    const height = main.offsetHeight;
    const scale = 1; //0.25; //TODO CSS 수정 후 원복할 것 LYH 24.1.3
    //const scale = 0.3;
    main.style.transform = "scale(" + scale + ")";
    main.style.height = height * scale + "px";
    main.style.width = width * scale + "px";
  }
}

// 이미지로 된 페이지인지 여부
function isStaticPage(page) {
  return staticPageList.indexOf(page) >= 0;
}

function oxi_met_value() {
  const { MET, MET_MEAN, OXI, OXI_MEAN } = health.value.resultDto.myHQ;

  return {
    Oxi: Number(OXI.toFixed(0)),
    Met: Number(MET.toFixed(0)),
    MET_MEAN: MET_MEAN,
    OXI_MEAN: OXI_MEAN,
  };
}

//pdf 파일 이름 지정
function getFileName() {
  if (userInfo.partyId) {
    return (
      "마이웰니스 랩 리포트_" +
      userInfo.name +
      "_" +
      comph.value.resultDto.myData.reg_date.substr(0, 10) +
      ".pdf"
    );
  } else {
    return (
      "마이웰니스 랩 리포트_" +
      userInfo.name +
      "_" +
      comph.value.resultDto.myData.reg_date.substr(0, 10) +
      ".pdf"
    );
  }
  // return "로그미.pdf";
}

function needBlodDownload() {
  var browser = navigator.userAgent.toLowerCase();

  return (
    browser.indexOf("samsungbrowser") != -1 ||
    browser.indexOf("kakaotalk") != -1 ||
    browser.indexOf("naver") != -1
  );
}

// pdf로 저장
async function exportToPDF() {
  pdfProcessing = true;
  resize();

  await sleep(1);
  const page = document.querySelector("#mainpage");
  const windowWidth = page.offsetWidth;
  const targetWidth = 960;

  const main = document.querySelector("#main");


  let pixelRatio = window.devicePixelRatio * 2;
  //아이폰인 경우 메모리 제한이 있어서 기본 해상도로 설정
  if (/iPhone|iPod/i.test(navigator.userAgent)) {
    pixelRatio = window.devicePixelRatio;
  }

  // 해상도 낮을 경우 강제로 해상도 스케일업
  if (window.devicePixelRatio < 2) {
    pixelRatio = 4;
  }
  console.log("pixelRatio", pixelRatio);

  // 캔버스 내보내기 설정
  /****************************************************************************
   * 24.01.03 PDF 생성 시 사이즈 이슈가 있어서 scale을 pixcelRatio -> 1로 변경    
   *****************************************************************************/
  const canvasOptions = {
    allowTaint: true,
    useCORS: true,
    scale: pixelRatio,
    letterRendering: true,
    logging: false,
    skipAutoScale: true,
    skipFonts: false,
    removeContainer: true,
    foreignObjectRendering: false,
  };

  let pdfOpt = {
    orientation: "p",
    unit: "mm",
    format: [210, 297],

    
    encryption: {      
      userPermissions: ["print", "modify", "copy", "annot-forms"],
    }, 
  };

  if(props.reportType !== 'printReport'){
    // pdf 암호 설정 패스워드 생년월일로 설정 240109 출력신청 시에는 암호 없음
    pdfOpt.encryption.userPassword = userInfo.birth_date
        .replaceAll(". ", "")
        .substr(2, 6);

    pdfOpt.encryption.ownerPassword = userInfo.birth_date
      .replaceAll(". ", "")
      .substr(2, 6);
  }

  const pdf = new jsPDF(pdfOpt);
  
  for (let i = 0; i < totalPage; i++) {
    pdfProcessingPage = i + 1;

    //graphchart 로딩 여부 확인
    /* 24.01.03 그래프 차트 및 페이지 29 로딩 시 완료 함수를 호출하기 때문에 필요없음
    if (
      (!test && pdfProcessingPage === 23) ||
      (test && testPage === 23 && pdfProcessingPage === 23)
    ) {
      loadingGraph = false;

      while (!loadingGraph) {
        console.log("1");
        await sleep(1);
      }
    }

    // Page29.vue 페이지 로딩여부
    if (!loadingPage29 && 
        (!test && pdfProcessingPage === 26) ||
        (test && testPage === 26 && pdfProcessingPage === 26)
    ) {
        loadingPage29 = false;

        // 로딩까지 대기
        while (!loadingPage29) {
          await sleep(1);
        }
    }
    await sleep(1);
     */

    /////////////////////////// 부모에서 단순 스피너를 쓸 것이기에 제거
     if (props.updateProgress){
      let val = (i / totalPage) * 100;
      props.updateProgress(val); 
     }
    

    const elementDOM = document.querySelector("#page" + (i + 1));
    
    if (!elementDOM) continue;

    /******************************************************************
     * 24.01.03 PDF 생성 시 사이즈 이슈가 있어서 4 -> 1로 변경    
     *******************************************************************/
    canvasOptions.height = elementDOM.scrollHeight / 1;

    // 사파리 브라우저일경우 width값 설정 따로 해줘야한다.
    if (isSafari()) {
      canvasOptions.width = elementDOM.scrollWidth;
    } else {
      canvasOptions.width = elementDOM.scrollWidth / 1;
    }

    // pdf 화면을 4배 크게 만들어서 4배 축소시켜야한다. pdfScale
    canvasOptions.canvasHeight = elementDOM.scrollHeight / 1;
    canvasOptions.canvasWidth = elementDOM.scrollWidth / 1;

    // 이미지로 된 페이지 캔버스로 내보낸 후 이미지로 저장해서 pdf파일에 추가
    if (isStaticPage(i + 1)) {
      await html2canvas(elementDOM, canvasOptions)
        .then(async (canvas) => {
          const imgData = canvas.toDataURL("image/jpeg");

          // a4용지사이즈
          let imageWidth = 210;
          let imageHeight = 297;

          // 첫페이지 출력 (imgData,    확장자 ,  시작x,   시작y,  폭,     높이)
          // pdf.addPage();
          if (i !== 0) {
            pdf.addPage();
          }

          await pdf.addImage(
            imgData,
            "JPEG",
            0,
            0,
            imageWidth,
            imageHeight
          );

          // pdf 저장 후 캔버스 제거(메모리 이슈)
          canvas.width = 0;
          canvas.height = 0;
          canvas.remove();
          canvas = null;
          if (test && i === testPage) {
            document.body.appendChild(canvas);
          }
          await sleep(1);
        })
        .catch((error) => {
          console.log("error1", error);
        });
    }
    // 코딩처리한 페이지 처리하는 부분. 해당 페이지 동일하게 캔버스로 내보낸 후 이미지로 저장
    else {
      await html2canvas(elementDOM, canvasOptions)
        .then(async (canvas) => {
          // 이미지 변환
          const imgData = canvas.toDataURL("image/jpeg");

          let imageWidth = 210; //canvas.width / (canvas.width / 210);
          let imageHeight = 297;

          // 첫페이지 출력 (imgData,    확장자 ,  시작x,   시작y,  폭,     높이)
          // pdf.addPage();
          if (i !== 0) {
            pdf.addPage();
          }

          //pdf페이지에 이미지 저장
          await pdf.addImage(
            imgData,
            "JPEG",
            0,
            0,
            imageWidth,
            imageHeight
          );

          // pdf 저장 후 캔버스 초기화
          canvas.width = 0;
          canvas.height = 0;
          canvas.remove();
          canvas = null;

          if (test && i === testPage) {
            console.log("TestPage", testPage);
            document.body.appendChild(canvas);
          }

          await sleep(1);
        })
        .catch((error) => {
          console.log("error2", error);
        });
    }

    if (test && i == testPage - 1) break; //테스트 코드
  }
  
  if (enableDownload.value === true) {    
    let blob;
    let blobUrl;

    // 삼성 브라우저일 경우 자동 다운로드 안되고 유저가 다운로드 버튼을 클릭해야 다운로드 가능하다.
    if (needBlodDownload()) {
      blob = new Blob([pdf.output("blob")], {
        type: "application/pdf",
      });
      blobUrl = URL.createObjectURL(blob);
    }
    // 기타 모바일 브라우저 다운로드 코드
    else {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        blob = new Blob([pdf.output("blob")], {
          // type: "application/pdf",
        });
        blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        // a.download = name || Math.random();
        a.href = blobUrl;        
        a.setAttribute("download", getFileName());
        document.body.appendChild(a);
        setTimeout(() => {
          a.click();
          setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
          }, 1);
        }, 0);
      }
      // PC 브라우저 다운로드
      else {
        blob = new Blob([pdf.output("blob")], {
          // type: "application/pdf",
        });
        blobUrl = URL.createObjectURL(blob);

        const filename = getFileName();
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(pdf, filename);
        } else {
          const a = document.createElement("a");
          document.body.appendChild(a);
          const url = window.URL.createObjectURL(blob);
          a.href = url;
          a.download = filename;
          a.click();
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }, 0);
        }
      }
    }
    
    pdfProcessing = false;
    resize();
    main.style = "";
    props.finish();
  }else {
    let blob;
    let blobUrl;
    
    blob = new Blob([pdf.output("blob")], {
        type: "application/pdf",
    });
    blobUrl = URL.createObjectURL(blob);
    let file = new File([pdf.output('blob')], getFileName(), { type: "application/pdf" });
    if(props.reportType == 'kakao') {
      pdfFile = file;
    }
    props.finish(file, blobUrl);
    return;
  }
}

// 사파리 브라우저 체크
function isSafari() {
  console.log("issafari ", navigator.userAgent);
  var is_safari =
    navigator.userAgent.indexOf("Safari") > -1 &&
    navigator.userAgent.indexOf("Chrome") <= -1 &&
    navigator.maxTouchPoints !== 1;
  return is_safari;
}

function isProcessingPage(page) {
  if (pdfProcessing === false) return true;
  if (pdfProcessingPage === page) return true;
  return false;
  // page;
  // return true;
}

const nameObj = {
  WC    : {name : '허리둘레', idx : 1},
  BMI   : {name : '체질량지수', idx : 2},
  SBP   : {name : '수축기 혈압', idx : 3},
  DBP   : {name : '이완기 혈압', idx : 4},
  GLU   : {name : '공복혈당', idx : 5},
  TC    : {name : '총 콜레스테롤', idx : 6},
  LDL   : {name : '저밀도 콜레스테롤', idx : 7},
  HDL   : {name : '고밀도 콜레스테롤', idx : 8},
  TG    : {name : '중성지방', idx : 9},
  GOT   : {name : '아스파테이트 아미노전이효소', idx : 10},
  GPT   : {name : '알라닌 아미노 전이효소', idx : 11},
  HB    : {name : '혈색소', idx : 12},
  CREA  : {name : '혈청크레아티닌', idx : 13},
  smok_dur      : {name : '흡연기간', idx : 14},
  pack_year     : {name : '담배 소비량', idx : 15},
  sleep_time    : {name : '수면시간', idx : 16},
  MET           : {name : '활동량', idx : 17},
  drink_amt     : {name : '음주량', idx : 18},
  EQ5D          : {name : '삶의 질', idx : 19},
}

function getBarType(key) {
  let rtn = '';

  switch(key) {
    case 'SBP' :
    case 'DBP' :
    case 'GLU' :
    case 'TG' :
    case 'TC' : 
    case 'LDL' :
    case 'GOT' :
    case 'GPT' :
    case 'WC' :
    case 'drink_amt' :
    case 'smok_dur' :    
      rtn = 'normal'; 
      break;
    case 'MET' :
    case 'HDL' :
      rtn = 'normal-reverse';
      break;    
    case 'EQ5D' :
    case 'sleep_time' :
      rtn = 'half';
      break;
    case 'pack_year' :
      rtn = 'half2';
      break;
    case 'BMI' :
    case 'HB' :
    case 'CREA' :
      rtn = 'reverse';
      break;        
  }

  return rtn;
}

onMounted(async() => {
  /************************************************************************************************************************************
   * 24.01.03 본 파일 및 하위 컴퍼넌트 모두 CompositionAPI 로 변경했으나 기존 로직은 대부분 유지함.
   * 단 로그미 / 암웨이 간에 서로 다른 API를 사용하는 경우 등이 있어서 아예 새로 만든 (Page17, 18의 TrackingChartDocumentNew) 경우가 있음.
   ************************************************************************************************************************************/
  const oriData = computed(() => {
    let data = null;

    data = props.reportData
    console.log('@@repData', data)
    return data;
  });

  const analyzeData = computed(() => {
    return toRaw(oriData.value.analyzeData);
  });

  const surveyData = computed(() => {
    return toRaw(oriData.value.surveyData);
  });

  //각 컴퍼넌트에서 쓰기 위한 데이터 가공
  report_no = surveyData.value.commonInfo.scode;

  check_date = convertDateToYYYYMMDD(
    surveyData.value.basics.checkDate,
    "."
  );

  userInfo = {
    name: analyzeData.value.name,
    sex:  analyzeData.value.sex,
    age:  analyzeData.value.age,
    birth_date: analyzeData.value.birthDate,
    uid: surveyData.value.commonInfo.uid,
    scode: surveyData.value.commonInfo.scode,
  };

  health = computed(() => {
    return {
      resultDto: {
        myHQ: analyzeData.value.hqData,
        refHQ: analyzeData.value.hqReference
      }
    }
  });

  hcr = computed(() => {
    return {
      resultDto: {
        myHCR: analyzeData.value.hcrData,
        refHCR:analyzeData.value.hcrReference,
        examinationData: analyzeData.value.examinationData
      }
    }
  });
  
  comph = computed(() => {//eg. myDataList[0]['HB']
    let arr = [];
    let comDataList = []; //Page17,, TrackingChart에서 사용. 로그미와는 다른 기준으로 수정된 API 를 사용(hcrData, hcrRef -> ariData, ariMean, ariMax)
    let comDataObj = {};
    let comData;

    for(let key in analyzeData.value.heStatus){
      arr[key] = analyzeData.value.heStatus[key];
    }

    for(let key in analyzeData.value.comphckData){
      arr[key] = analyzeData.value.comphckData[key];
    }
    
    for(let key in analyzeData.value.ariData){
      comData = {
          key: key,
          name : nameObj[key].name,
          idx :  nameObj[key].idx,
          val : analyzeData.value.ariData[key],
          status : analyzeData.value.ariStatus[key],
          max : analyzeData.value.ariMax[key],
          mean : analyzeData.value.ariMean[key],
      };

      comData['myPer'] = (Number(comData.val) / Number(comData.max) * 100).toFixed(0) ;
      comData['meanPer'] = (Number(comData.mean) / Number(comData.max) * 100)

      comData['barType'] = getBarType(key);

      comDataObj[key] = comData;
      comDataList.push(comData);
    }

    //건강위험요인(P.18~P.21)에서 사용하기 위한 추가데이터 (ariData/ariStatus에는 데이터가 없는 항목, waterAmt, smok)
    comDataObj['water_amt'] = {
      name : '수분',
      status : analyzeData.value.comphckData['CK_water_amt']
    };
    comDataObj['smok'] = {
      name : '흡연',
      status : analyzeData.value.comphckData['CK_smok']
    }

    comDataList.sort((a, b) => a.idx - b.idx);;
    
    return {
      resultDto: {
        myDataList:[arr],
        myMsgList: null,
        myData: {
          reg_date : analyzeData.value.analysedDate
        },
        //comData : analyzeData.value.ariMean,
        comData : comDataObj,
        comDataList: comDataList,
      }
    }
  })

  eatingHabit = computed(() => {
    return {
      resultDto: {
        myHQ: analyzeData.value.hqData,
      }
    };
  })

  meal = computed(() => {
    return {
      resultDto: {
        myDataList:[analyzeData.value.heStatus],
        comData:[]
      }
    }
  })

  recommendData = computed(() => {
    return {      
      resultDto: {
        MHN_CL: analyzeData.value.clusterList,
        MHN_NL: analyzeData.value.nodeList,
        MHN_EL: analyzeData.value.edgeList,
        MHN_NCL: analyzeData.value.ncList,
      }
    }
  })

  
  loading.value = false;
  
  /* setTimeout(() => {
    resize();
    
    loadingFinished();
  }, 1); */
  //TODO LYH End
  /////////////////////
})
</script>

<style lang="scss" scoped>
@import "@/assets/css/pdf/_variables.scss";
@import "@/assets/css/pdf/document.scss";
@import "@/assets/css/pdf/_font.scss";

section {
  background: #eef4f4;
  min-height: calc($vh);
  padding: 30px 28px 0;
  padding-top: calc(30px + $header);

  article {
    min-height: calc($vh - $header - 30px);
    max-width: $target-width;
    margin: 0 auto;

    position: relative;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    background: #eef4f4;
    overflow: hidden;
  }
}
.hidden {
  position: absolute;

  right: 999999999px;
  /* position: absolute; */
  /* left: 0;
  top: 0;
  overflow: scroll; */
}
.mainpage {
  font-size: 0;
  padding: 0;
  margin: 0;
  border: 0;
  outline: 0;
  transform-origin: top left;
}
</style>
