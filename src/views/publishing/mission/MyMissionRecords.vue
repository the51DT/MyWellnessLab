<script>

export default {
  name: 'MyMissionRecords',
  data () {
    return {
      selectedPeriodIndex: 0, /* 퍼블 확인용 선택된 기간 */
      /*
        healthIcon 타입 / ico-{} 이중클래스에 따라 이미지 다름
        기본: 'default',
        수면건강: 'sleep',
        눈건강: 'eye',
        간건강: 'liver',
        항산화: 'antioxidant',
        위건강: 'stomach',
        장건강: 'intestine',
        관절/뼈 건강: 'bone',
        기억력개선: 'memory',
        혈행개선: 'blood-flow',
        혈압조절: 'blood-pressure',
        혈중지질 개선: 'lipid',
        체지방 조절: 'body-fat',
        혈당조절: 'blood-sugar',
        근육(근력)근건강: 'muscle',
        전립선건강: 'prostate',
        갱년기 여성건강: 'menopause',
      */
      missionPeriodList: [ /* 퍼블 확인용 데이터 */
        {
          label: '2026년 9월 ~ 2027년 8월',
          missionList: [
            {
              categoryTag: '생활습관',
              healthTag: '눈건강',
              healthIcon: 'eye',
              count: '3',
              title: '눈 스트레칭하기 (좌우, 대각선으로 눈동자 크게 돌리기)'
            },
            {
              categoryTag: '영양',
              healthTag: '간건강',
              healthIcon: 'liver',
              count: '10',
              title: '간 건강 제품(밀크씨슬) 챙겨먹기'
            },
            {
              categoryTag: '영양',
              healthTag: '관절/뼈 건강',
              healthIcon: 'bone',
              count: '20',
              title: '관절/뼈 건강 제품(칼슘/비타민 D, 글루코사민, MSM, 비타민 C, 오미자추출물) 챙겨먹기'
            },
            {
              categoryTag: '생활습관',
              healthTag: '눈건강',
              healthIcon: 'eye',
              count: '3',
              title: '눈 스트레칭하기 (좌우, 대각선으로 눈동자 크게 돌리기)'
            },
            {
              categoryTag: '영양',
              healthTag: '간건강',
              healthIcon: 'liver',
              count: '10',
              title: '간 건강 제품(밀크씨슬) 챙겨먹기'
            },
            {
              categoryTag: '영양',
              healthTag: '관절/뼈 건강',
              healthIcon: 'bone',
              count: '20',
              title: '관절/뼈 건강 제품(칼슘/비타민 D, 글루코사민, MSM, 비타민 C, 오미자추출물) 챙겨먹기'
            },
            {
              categoryTag: '생활습관',
              healthTag: '눈건강',
              healthIcon: 'eye',
              count: '3',
              title: '눈 스트레칭하기 (좌우, 대각선으로 눈동자 크게 돌리기)'
            },
            {
              categoryTag: '영양',
              healthTag: '간건강',
              healthIcon: 'liver',
              count: '10',
              title: '간 건강 제품(밀크씨슬) 챙겨먹기'
            },
            {
              categoryTag: '영양',
              healthTag: '관절/뼈 건강',
              healthIcon: 'bone',
              count: '20',
              title: '관절/뼈 건강 제품(칼슘/비타민 D, 글루코사민, MSM, 비타민 C, 오미자추출물) 챙겨먹기'
            },
          ]
        },
        {
          label: '2025년 9월 ~ 2026년 8월',
          missionList: [
            {
              categoryTag: '영양',
              healthTag: '간건강',
              healthIcon: 'liver',
              count: '1',
              title: '간 건강 제품(밀크씨슬) 챙겨먹기'
            },
            {
              categoryTag: '생활습관',
              healthTag: '눈건강',
              healthIcon: 'eye',
              count: '3',
              title: '눈 스트레칭하기 (좌우, 대각선으로 눈동자 크게 돌리기)'
            },
          ]
        }
      ],
      paging: 3, /* 페이징 개수 */
    }
  },
  computed: {
    selectedMissionPeriod () {
      return this.missionPeriodList[this.selectedPeriodIndex]
    },

    selectedMissionList () {
      return this.selectedMissionPeriod ? this.selectedMissionPeriod.missionList : []
    }
  },
  watch: {
    selectedPeriodIndex () {
      this.paging = 3
    }
  },
  methods: {
    more () { /* 페이징 버튼 액션 */
      this.paging += 3
    },
  },
}
</script>

<template>
  <section class="mission-records">

    <div class="mission-records--select">
      <select class="circle" name="PF_period" v-model.number="selectedPeriodIndex">
        <option v-for="(period, index) in missionPeriodList" :key="index" :value="index">{{ period.label }}</option>
      </select>
    </div>

    <div class="mission-records--list">
      <div v-for="mission in selectedMissionList.slice(0, paging)" :key="mission.title" class="mission-records--card">
        <div class="mission-records--tag-wrap">
          <span class="mission-records--tag orange">{{ mission.categoryTag }}</span>

          <span class="mission-records--tag green">
            <i :class="`ico-${mission.healthIcon}`"></i>
            {{ mission.healthTag }}
          </span>

          <span class="mission-records--tag">{{ mission.count }}회</span>
        </div>

        <p class="mission-records--title">{{ mission.title }}</p>
      </div>
    </div>
    
    <div v-if="selectedMissionList.length > paging" class="txt--center MyPageCheckupDataRecord--btn">
      <button @click="more" type="button" class="btn--txt3">더보기</button>
    </div>

  </section>

</template>

<style lang="scss">

</style>