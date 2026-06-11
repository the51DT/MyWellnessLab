<script setup>

import BasePopupTit from '@/views/publishing/BasePopupTit.vue'
import { getCurrentInstance, computed, onMounted, onUnmounted } from 'vue'
import { bodyScroll } from '@/assets/js/common'
import { useCommonForm  } from '@/utils/commonForm'
import _ from 'lodash'

const { ABC_FORM }= useCommonForm()
const props = defineProps({
  sendData: Object
})

const instance = getCurrentInstance()

const scoreData = computed(() => {
  const rtnObj = {
    grade: '',
    OXI: '',
    MET: ''
  }

  if (props.sendData.hqData !== undefined) {
    rtnObj.grade = props.sendData.hqData.Health_Type
    rtnObj.OXI = props.sendData.hqData.OXI
    rtnObj.MET = props.sendData.hqData.MET
  }

  return rtnObj
})

const dataList = computed(() => {
  const result = []
  const hriStatus = props.sendData.hriStatus

  for (const key in ABC_FORM) {
    result.push({
      key,
      name: ABC_FORM[key].labelUnit,
      score: hriStatus[key],
      grade: getScoreGrade(hriStatus[key]),
      index: Object.keys(ABC_FORM).indexOf(key)
    })
  }

  const res = _.orderBy(result.map(e => {
    return {
      ...e,
      score: e.score ? e.score : 0
    }
  }), ['score', 'index'], ['desc', 'asc'])
  return res
})

/**
 * scoreGrade을 변환한다.
 * @param {number} val - scoreGrade
 * @return {string} - 변환된 score Grade
 */
function getScoreGrade (val) {
  let rtnVal = ''
  switch (val) {
    case 1:
      rtnVal = 's3'
      break
    case 2:
      rtnVal = 's2'
      break
    case 3:
      rtnVal = 's1'
      break
  }
  return rtnVal
}

/**
 * 팝업 종료
 */
function popupClose () {
  instance.emit('popupClose')
}

onMounted(() => {
  bodyScroll(false)
})

onUnmounted(() => {
  bodyScroll(true)
})
</script>

<template>
  <base-popup-tit @popupClose="popupClose">
    <template v-slot:title>
      {{ $t('AnalyzeABCHealthGradeDetailPopup.text1') }}
    </template>
    <template v-slot:contents>

      <div class="AnalyzeABCHealthGradeDetail">
        <div class="AnalyzeABCHealthGradeDetail--grade-wrap">
          <div class="AnalyzeABCHealthGradeDetail--grade-tit">{{ $t('AnalyzeABCHealthGradeDetailPopup.text2') }}</div>
          <div class="AnalyzeABCHealthGradeDetail--grade" :class="scoreData.grade.toLowerCase()">{{ scoreData.grade }}
          </div> <!--231211 그래드 따라 클래스 처리 요망-->
          <div class="AnalyzeABCHealthGradeDetail--table-wrap"> <!--231211 감싸는 div 추가-->
            <table class="AnalyzeABCHealthGradeDetail--table">
              <tbody>
                <tr>
                  <th>{{ $t('AnalyzeABCHealthGradeDetailPopup.text3') }}</th>
                  <td>{{ scoreData.OXI }} {{ $t('Common.score') }}</td>
                </tr>
                <tr>
                  <th>{{ $t('AnalyzeABCHealthGradeDetailPopup.text5') }}</th>
                  <td>{{ scoreData.MET }} {{ $t('Common.score') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="AnalyzeABCHealthGradeDetail--list">
          <table class="AnalyzeABCHealthGradeDetail--list-table">
            <caption class="AnalyzeABCHealthGradeDetail--caption">
              <div class="txt--right AnalyzeCheckupDataRecord--label">
                <span class="AnalyzeCheckupDataRecord--label-wrap">
                  <span class="AnalyzeCheckupDataRecord--label-rect s1" /> {{ $t('Common.warning') }}
                </span>
                <span class="AnalyzeCheckupDataRecord--label-wrap">
                  <span class="AnalyzeCheckupDataRecord--label-rect s2" /> {{ $t('Common.manage') }}
                </span>
                <span class="AnalyzeCheckupDataRecord--label-wrap">
                  <span class="AnalyzeCheckupDataRecord--label-rect s3" /> {{ $t('Common.good') }}
                </span>
              </div>
            </caption>
            <tbody>
              <tr v-for="item in dataList" v-bind:key="item">
                <th>{{ item.name }}</th>
                <td class="AnalyzeABCHealthGradeDetail--chip">
                  <span class="AnalyzeCheckupDataRecord--label-rect" :class="item.grade" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </template>
  </base-popup-tit>
</template>

<style scoped></style>
