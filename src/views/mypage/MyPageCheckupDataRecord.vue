<script setup>
import { go } from '@/assets/js/common'
import { onMounted, reactive, ref } from 'vue'
import * as mypageApi from '@/apis/mypage'

const isPc = ref(false)
const data = reactive({ target: [] })
const totalCount = ref(0)
const requestParam = ref({
  pageNo: 1,
  perPageNum: 10
})

/**
 * API를 통해 검사 데이터 목록을 가져오는 함수입니다.
 *
 * @async
 * @function getList
 *
 * 쿼리 파라미터에 따라 mypageApi에서 검사 데이터의 목록을 가져옵니다.
 * 만약 응답 데이터가 존재하고, 페이지 번호가 1이면, 검사 데이터를 응답 결과로 대체합니다.
 * 그렇지 않으면 응답 결과를 기존 검사 데이터에 추가합니다.
 *
 * totalCount는 응답의 totalCount로 업데이트 되며,
 * 예외 발생 시 콘솔에 로그를 출력합니다.
 */
const getList = async () => {
  try {
    const response = await mypageApi.getExaminationDataList(requestParam.value)

    if (response.data) {
      if (requestParam.value.pageNo === 1) {
        data.target = response.data.content.examinationDataList
      } else {
        for (const value of response.data.content.examinationDataList) {
          data.target.push(value)
        }
      }

      totalCount.value = response.data.totalCount
    }
  } catch (e) {
    console.error(e)
  }
}

// 페이징 버튼 액션
const more = () => {
  requestParam.value.pageNo++
  getList()
}

// pc인지 확인
const winWidth = () => {
  isPc.value = window.innerWidth > 920
}

onMounted(() => {
  getList()

  // 아래 스크롤하면 페이징 늘어나도록
  window.addEventListener('scroll', () => {
    if (!isPc.value) {
      if (window.scrollY + window.innerHeight >= document.body.offsetHeight) {
        more()
      }
    }
  })

  winWidth()

  window.addEventListener('resize', () => {
    winWidth()
  })
})
</script>

<template>
  <div class="MyPageCheckupDataRecord">
    <ul class="bull--no">
      <li v-for="item in data.target" class="MyPageCheckupDataRecord--li">
        <a
          @click="go('/my-page/checkup-detail/' + item.id + '/complete-type/' + item.completeType)"
          href="javascript: void(0);"
          class="align--between">
          <div class="MyPageCheckupDataRecord--txt">
            <div class="tag-wrap">
              <span
                class="tag"
                :class="item.healthDataType === 'formal' ? 'red' : 'direct' ? 'biolet' : ''">{{ item.healthDataType === 'formal' ? $t('AnalyzeCheckupData.formalInput') : item.healthDataType === 'direct' ? $t('AnalyzeCheckupData.directInput') : item.healthDataName }}</span>
            </div>
            <dl class="align--dl">
              <dt class="MyPageCheckupDataRecord--dt">{{ $t('MyPageCheckupDataRecord.text1') }}</dt>
              <dd class="MyPageCheckupDataRecord--dd">{{ item.checkDate }}</dd>
            </dl>
          </div>
          <div class="MyPageCheckupDataRecord--arrow-wrap">
            <div class="MyPageCheckupDataRecord--arrow" />
          </div>
        </a>
      </li>
    </ul>

    <div v-if="totalCount === 0" class="AnalyzeList--no-data">
      <span>{{ $t('MyPageCheckupDataRecord.text2') }}</span>
    </div>
    <div v-else-if="isPc && (data.target.length < totalCount)" class="txt--center MyPageCheckupDataRecord--btn">
      <button @click="more" type="button" class="btn--txt3">{{ $t('Common.more') }}</button>
    </div>
  </div>
</template>

<style lang="scss"></style>
