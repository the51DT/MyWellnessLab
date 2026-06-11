<script setup>
import { ref, computed } from 'vue'
import {
  ImagePage,
  Page1,
  // Page5,
  // Page8,
  // Page12,
  // Page13,
  // Page14,
  // Page16,
  // Page17,
  // Page18,
  // Page19,
  // Page20,
  // Page21,
  // Page24,
  // Page26,
  // Page29
} from './src/pages'
import * as analysisApi from '@/apis/analysis'
import { jsPDF } from 'jspdf'
import { convertToPDF } from './util'

const props = defineProps({
  analyzeData: {
    type: Object,
    default: null
  },
  surveyData: {
    type: Object,
    default: null
  },
  isOneTime: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: null
  },
  hasPdfPassword: {
    type: Boolean,
    default: true
  },
  hidePrivacy: {
    type: Boolean,
    default: false
  },
  save: {
    type: Boolean,
    default: true
  },
  pdfScale: {
    type: Number,
    default: 4
  }
})

const emit = defineEmits(['progress', 'complete'])

const isGenerate = ref(false)

const renderPage = ref(1)

const page1 = ref()
const page2 = ref()
const page3 = ref()
const page4 = ref()
const page5 = ref()
const page6 = ref()
const page7 = ref()
const page8 = ref()
const page9 = ref()
const page10 = ref()
const page11 = ref()
const page12 = ref()
const page13 = ref()
const page14 = ref()
const page15 = ref()
const page16 = ref()
const page17 = ref()
const page18 = ref()
const page19 = ref()
const page20 = ref()
const page21 = ref()
const page22 = ref()
const page23 = ref()
const page24 = ref()
const page25 = ref()
const page26 = ref()
const prevABCDetail = ref(null)

const reportNo = computed(() => {
  return props.surveyData.commonInfo.aCode
})

const userInfo = computed(() => {
  let birthDate = props.user.dateOfBirth

  if (props.isOneTime) {
    birthDate = props.analyzeData.birthDate
  }

  return {
    name: props.isOneTime ? props.analyzeData.name : props.user.name,
    sex: props.analyzeData.sex,
    age: props.analyzeData.age,
    birth_date: birthDate,
    uid: props.surveyData.commonInfo.uid,
    scode: props.surveyData.commonInfo.scode
  }
})

const health = computed(() => {
  return {
    resultDto: {
      myHQ: props.analyzeData.hqData,
      refHQ: props.analyzeData.hqReference
    }
  }
})

const hcr = computed(() => {
  return {
    resultDto: {
      myHCR: props.analyzeData.hcrData,
      refHCR: props.analyzeData.hcrReference,
      examinationData: props.analyzeData.examinationData
    }
  }
})

const integratedAriStatus = computed(() => {
  // ariStatus, comphckData의 상태값을 통합
  const result = {}

  const data = {
    WC: 0,
    BMI: 0,
    SBP: 0,
    DBP: 0,
    GLU: 0,
    TC: 0,
    LDL: 0,
    HDL: 0,
    TG: 0,
    GOT: 0,
    GPT: 0,
    HB: 0,
    CREA: 0,
    EQ5D: 0,

    CK_MET: 0,
    CK_drink: 0,
    CK_sleep_time: 0,
    CK_water_amt: 0,
    CK_MH_stress: 0,
    CK_smok: 0,
    ...props.analyzeData.hriData
  }

  for (const key in data) {
    const status = {
      status: props.analyzeData.hriStatus[key],
      val: props.analyzeData.hriData[key]
    }

    if (!result[key]) {
      result[key] = {
        ...status
      }
    }
  }

  return result
})

const eatingHabit = computed(() => {
  return {
    resultDto: {
      myHQ: props.analyzeData.hqData
    }
  }
})

const recommendData = computed(() => {
  return {
    resultDto: {
      MHN_CL: props.analyzeData.clusterList,
      MHN_NL: props.analyzeData.nodeList,
      MHN_EL: props.analyzeData.edgeList,
      MHN_NCL: props.analyzeData.ncList
    }
  }
})

const valueOxiMet = computed(() => {
  const { MET, MET_MEAN, OXI, OXI_MEAN } = health.value.resultDto.myHQ

  return {
    Oxi: Number(OXI.toFixed(0)),
    Met: Number(MET.toFixed(0)),
    MET_MEAN,
    OXI_MEAN
  }
})

const regDate = computed(() => {
  return props.analyzeData.regDate
})

/**
 * 리포트 생성
 */
const generatePdf = async () => {
  try {
    if (!props.isOneTime) {
      prevABCDetail.value = await getPrevABCDetail()
    }
  } catch (e) {
    console.error(e)
  }
  isGenerate.value = true
  renderPage.value = 1

  const pageList = [
    page1,
    page2,
    page3,
    page4,
    // page5,
    // page6,
    // page7,
    // page8,
    // page9,
    // page10,
    // page11,
    // page12,
    // page13,
    // page14,
    // page15,
    // page16,
    // page17,
    // page18,
    // page19,
    // page20,
    // page21,
    // page22,
    // page23,
    // page24,
    // page25,
    // page26
  ]

  let pdfOpt = {
    orientation: 'p',
    unit: 'mm',
    format: [210, 297],
    encryption: {
      userPermissions: ['print', 'modify', 'copy', 'annot-forms']
    }
  }

  if (props.hasPdfPassword) {
    const password = userInfo.value.birth_date.replaceAll(' ', '').replaceAll('.', '').substr(2, 6)

    pdfOpt = {
      ...pdfOpt,
      encryption: {
        ...pdfOpt.encryption,
        userPassword: password,
        ownerPassword: password
      }
    }
  }

  const pdf = new jsPDF(pdfOpt)

  // console.time()

  for await (const page of pageList) {
    const el = page.value.$el
    const wrapperEl = el.parentElement

    if (wrapperEl) {
      const scale = 1

      wrapperEl.style.height = 842 * scale * props.pdfScale + 'px'
      wrapperEl.style.width = 595 * scale * props.pdfScale + 'px'
      wrapperEl.overflow = 'scroll'
    }

    const imgData = await convertToPDF(el, renderPage.value, (index) => {
      emit('progress', index)
      renderPage.value = index
    })

    const imageWidth = 210
    const imageHeight = 297

    if (renderPage.value > 2) {
      pdf.addPage()
    }

    pdf.addImage(
      imgData,
      'JPEG',
      0,
      0,
      imageWidth,
      imageHeight
    )
  }

  emit('complete', pdf.output('blob'))
  // console.timeEnd()

  isGenerate.value = false
}

/**
 * 리포트 생성 함수 wrap
 */
const generate = () => {
  generatePdf()
}

defineExpose({
  generate
})

/**
 * 이전 abc 건강등급 상세데이터 조회
 */
const getPrevABCDetail = async () => {
  const id = props.analyzeData.id
  const response = await analysisApi.getPrevABCDetail(id)

  return response.data
}
</script>

<template>
  <main v-if="isGenerate" id="main" :class="{ hidden: true }">
    <section id="non-section">
      <article id="non-article">
        <div id="element-to-print" class="mainpage" :class="save ? 'stretch-page2' : ''">
          <div v-if="renderPage === 1" class="page-wrapper">
            <Page1
              ref="page1"
              :userInfo="userInfo"
              :date="regDate"
              :reportNo="reportNo" />
          </div>

          <div v-if="renderPage === 2" class="page-wrapper">
            <ImagePage ref="page2" :save="save" :page="2" />
          </div>

          <div v-if="renderPage === 3" class="page-wrapper">
            <ImagePage ref="page3" :save="save" :page="3" />
          </div>

          <div v-if="renderPage === 4" class="page-wrapper">
            <ImagePage ref="page4" :save="save" :page="4" />
          </div>

          <!-- <div v-if="renderPage === 5" class="page-wrapper">
            <Page5
              ref="page5"
              :save="save"
              :health="health"
              :value="valueOxiMet"
              :userInfo="userInfo"
              :integratedAriStatus="integratedAriStatus"
              :hcr="hcr"
              :pdfScale="pdfScale"
              :eatingHabit="eatingHabit"
              :recommendData="recommendData" />
          </div> -->

          <!-- <div class="page-wrapper">
            <Page8
              ref="page6"
              :save="save"
              :userInfo="userInfo"
              :hcr="hcr"
              :pdfScale="pdfScale"
              :hidePrivacy="hidePrivacy" />
          </div> -->

          <!-- <div v-if="renderPage === 7" class="page-wrapper">
            <ImagePage ref="page7" :save="save" :page="7" />
          </div> -->

          <!-- <div v-if="renderPage === 8" class="page-wrapper">
            <ImagePage ref="page8" :save="save" :page="9" />
          </div> -->

          <!-- <div v-if="renderPage === 9" class="page-wrapper">
            <ImagePage ref="page9" :save="save" :page="10" />
          </div> -->

          <!-- <div v-if="renderPage === 10" class="page-wrapper">
            <Page12
              ref="page10"
              :save="save"
              :userInfo="userInfo"
              :value="valueOxiMet"
              :health="health"
              :pdfScale="pdfScale" />
          </div> -->

          <!-- <div v-if="renderPage === 11" class="page-wrapper">
            <Page13
              ref="page11"
              :save="save"
              :userInfo="userInfo"
              :value="valueOxiMet"
              :health="health"
              :pdfScale="pdfScale" />
          </div> -->

          <!-- <div v-if="renderPage === 12" class="page-wrapper">
            <Page14
              ref="page12"
              :save="save"
              :userInfo="userInfo"
              :value="valueOxiMet"
              :health="health"
              :pdfScale="pdfScale" />
          </div> -->

          <!-- <div v-if="renderPage === 13" class="page-wrapper">
            <ImagePage ref="page13" :save="save" :page="14" />
          </div> -->

          <!-- <div v-if="renderPage === 14" class="page-wrapper">
            <Page16
              ref="page14"
              :save="save"
              :userInfo="userInfo"
              :value="valueOxiMet"
              :health="health"
              :eatingHabit="eatingHabit"
              :pdfScale="pdfScale" />
          </div> -->

          <!-- <div v-if="renderPage === 15" class="page-wrapper">
            <ImagePage ref="page15" :save="save" :page="16" />
          </div> -->

          <!-- <div v-if="renderPage === 16" class="page-wrapper">
            <Page17
              ref="page16"
              :save="save"
              :userInfo="userInfo"
              :analyzeData="analyzeData" />
          </div> -->

          <!-- <div v-if="renderPage === 17" class="page-wrapper">
            <Page18
              ref="page17"
              :save="save"
              :integratedAriStatus="integratedAriStatus"
              :value="valueOxiMet" />
          </div> -->

          <!-- <div v-if="renderPage === 18" class="page-wrapper">
            <Page19
              ref="page18"
              :save="save"
              :integratedAriStatus="integratedAriStatus"
              :value="valueOxiMet" />
          </div> -->

          <!-- <div v-if="renderPage === 19" class="page-wrapper">
            <Page20
              ref="page19"
              :save="save"
              :userInfo="userInfo"
              :integratedAriStatus="integratedAriStatus"
              :value="valueOxiMet" />
          </div> -->

          <!-- <div v-if="renderPage === 20" class="page-wrapper">
            <Page21
              ref="page20"
              :save="save"
              :userInfo="userInfo"
              :integratedAriStatus="integratedAriStatus"
              :value="valueOxiMet" />
          </div> -->

          <!-- <div v-if="renderPage === 21" class="page-wrapper">
            <ImagePage ref="page21" :save="save" :page="22" />
          </div> -->

          <!-- <div v-if="renderPage === 22" class="page-wrapper">
            <Page24
              ref="page22"
              :save="save"
              :userInfo="userInfo"
              :recommendData="recommendData"
              :value="valueOxiMet"
              :pdfScale="pdfScale" />
          </div> -->

          <!-- <div v-if="renderPage === 23" class="page-wrapper">
            <Page26
              ref="page23"
              :save="save"
              :userInfo="userInfo"
              :recommendData="recommendData" />
          </div> -->

          <!-- <div v-if="renderPage === 24" class="page-wrapper">
            <ImagePage ref="page24" :save="save" :page="25" />
          </div> -->

          <!-- <div v-if="renderPage === 25" class="page-wrapper">
            <Page29
              ref="page25"
              :save="save"
              :userInfo="userInfo"
              :regDate="regDate"
              :analyzeDetail="props.analyzeData"
              :prevABCDetail="prevABCDetail" />
          </div> -->

          <!-- <div v-if="renderPage === 26" class="page-wrapper">
            <ImagePage ref="page26" :save="save" :page="27" />
          </div> -->
        </div>
      </article>
    </section>
  </main>
</template>

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
