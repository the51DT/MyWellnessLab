<script>
import AnalyzeCheckupDataRecordChart from '@/views/analyze/components/AnalyzeCheckupDataRecordChart.vue'
import { funcIsPc } from '@/assets/js/common'
import { useCommonForm } from '@/utils/commonForm'
import { sendData } from '@/views/publishing/tempData'

const { EXAMINATION_FORM } = useCommonForm()

export default {
  name: 'AnalyzeCheckupDataRecord',
  components: { AnalyzeCheckupDataRecordChart },
  data () {
    return {
      ariDefine: ({
        HB: {
          name: '혈색소',
          unit: '(IU/L)',
          idx: 13
        },
        TC: {
          name: '총 콜레스테롤',
          unit: '(mg/dL)',
          idx: 5
        },
        TG: {
          name: '중성지방',
          unit: '(mg/dL)',
          idx: 4
        },
        WC: {
          name: '허리둘레',
          unit: '(cm)',
          idx: 9
        },
        BMI: {
          name: '체질량지수',
          unit: '(kg/m2)',
          idx: 8
        },
        DBP: {
          name: '이완기혈압',
          unit: '(mmHg)',
          idx: 2
        },
        GLU: {
          name: '공복혈당',
          unit: '(mg/dL)',
          idx: 3
        },
        GOT: {
          name: '아스파테이트 아미노전이효소',
          unit: '(IU/L)',
          idx: 10
        },
        GPT: {
          name: '알라닌 아미노전이효소',
          unit: '(g/dL)',
          idx: 11
        },
        HDL: {
          name: '고밀도 콜레스테롤',
          unit: '(mg/dL)',
          idx: 6
        },
        LDL: {
          name: '저밀도 콜레스테롤',
          unit: '(mg/dL)',
          idx: 7
        },
        MET: {
          name: '운동량 측정값',
          unit: ''
        },
        SBP: {
          name: '수축기혈압',
          unit: '(mmHg)',
          idx: 1
        },
        CREA: {
          name: '혈청크레아티닌',
          unit: '(mg/dL)',
          idx: 12
        },
        EQ5D: {
          name: '삶의 질 측정값',
          unit: ''
        },
        smok_dur: {
          name: '흡연기간',
          unit: ''
        },
        drink_amt: {
          name: '알코올 섭취량',
          unit: ''
        },
        pack_year: {
          name: '흡연량',
          unit: ''
        },
        sleep_time: {
          name: '수면시간',
          unit: ''
        }
      }),
      isPc: false /* 231228 pc인지? */
    }
  },
  computed: {
    hcrData () { // 240109 hcrData -> examinationData 로 변경
      let arr = []
      if (sendData.examinationData !== undefined) {
        arr = sendData.examinationData
      }

      return arr
    },
    hcrRefData () {
      let arr = []
      if (sendData.hcrReference !== undefined) {
        arr = sendData.hcrReference
      }
      return arr
    },
    dataList () {
      const arr = []
      let valueArr = []
      let dateArr = []

      // 순서를 보장하는 폼
      for (const key in EXAMINATION_FORM) {
        // 순서를 보장하는 폼의 Key 값으로 데이터를 찾아온다
        for (const item of this.hcrRefData) {
          const variable = item.variable.replace('HE_', '').toUpperCase()

          if (variable === key) {
            item.name = EXAMINATION_FORM[key].label
            item.unit = EXAMINATION_FORM[key].unit
            valueArr = []
            dateArr = []

            if (this.hcrData.value) {
              this.hcrData.value.forEach((item) => {
                valueArr.push(item[key.toLowerCase()])
                dateArr.push(item.checkDate)
              })
            }

            item.tempData = valueArr.join(', ')
            item.valueList = valueArr
            item.dateList = dateArr
            arr.push(item)

            break
          }
        }
      }

      return arr
    }
  },
  mounted () {
    this.isPc = funcIsPc()
    window.addEventListener('resize', () => {
      this.isPc = funcIsPc()
    })
  }
}
</script>

<template>
  <div :class="this.$options.name">
    <p :class="this.$options.name + '--info'">최근 5회의 검진데이터 수치변화를 한 눈에 확인하여<br v-if="isPc" /> 건강 상태 변화를 쉽게 비교해볼 수 있습니다
      <span>각 지표의 막대가 초록색영역 안에 위치한다면 해당 지표는 정상범위에 있는 것이며,<br v-if="isPc" /> 초록색 영역 바깥에 위치한다면, 주의 또는 위험 수치이니 개선하기 위한 노력이
        필요합니다<br v-if="isPc" />(관리: 노랑, 주의: 빨강)</span>
    </p>

    <div class="analyze-box short">
      <div class="txt--right AnalyzeCheckupDataRecord--label">
        <span :class="this.$options.name + '--label-wrap'">
          <span :class="this.$options.name + '--label-rect r1'" /> 주의
        </span>
        <span :class="this.$options.name + '--label-wrap'">
          <span :class="this.$options.name + '--label-rect r2'" /> 관리
        </span>
        <span :class="this.$options.name + '--label-wrap'">
          <span :class="this.$options.name + '--label-rect r3'" /> 관심
        </span>
      </div>
      <div :class="this.$options.name + '--graph-wrap'">

        <div v-for="(item) in dataList" class="AnalyzeCheckupDataRecord--graph-unit" v-bind:key="item">
          <h2 class="AnalyzeCheckupDataRecord--graph-tit">{{ item.name }} {{ item.unit }}<!-- 수축기혈압 (mmHg) --></h2>
          <div class="AnalyzeCheckupDataRecord--graph">
            <!-- 그래프 컴퍼넌트 추가 -->
            <AnalyzeCheckupDataRecordChart :chartData="item" />
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped></style>
