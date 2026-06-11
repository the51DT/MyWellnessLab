<script>

export default {
  name: 'AnalyzeABCHealthGradeDetail',

  data () {
    return {
      grade: 'B', /* 내 등급 */
      score1: 87, /* 노화 억제 분석 지수 */
      score2: 76, /* 만성질환 억제 분석 지수 */
      data: [
        {
          name: '수축기 혈압',
          score: 'good'
        },
        {
          name: '이완기 혈압',
          score: 'bad'
        },
        {
          name: '공복혈당',
          score: 'normal'
        },
        {
          name: '고밀도 콜레스테롤',
          score: 'good'
        },
        {
          name: '중성지방',
          score: 'good'
        },
        {
          name: '혈청크레아티닌',
          score: 'good'
        },
        {
          name: '허리둘레',
          score: 'good'
        },
        {
          name: '체질량지수',
          score: 'good'
        },
        {
          name: '혈색소',
          score: 'good'
        },
        {
          name: '아스파테이트 아미노전이효소 (AST/SGOT)',
          score: 'good'
        },
        {
          name: '알라닌 아미노전이효소(AST/SGPT)',
          score: 'good'
        },
        {
          name: '총콜레스테롤',
          score: 'good'
        },
        {
          name: '저밀도콜레스테롤',
          score: 'good'
        }
      ]
    }
  }
}
</script>

<template>
  <div class="AnalyzeABCHealthGradeDetail">
    <div class="AnalyzeABCHealthGradeDetail--grade-wrap">
      <div class="AnalyzeABCHealthGradeDetail--grade-tit">나의 등급</div>
      <div class="AnalyzeABCHealthGradeDetail--grade" :class="grade === 'A' ? 'a' : grade === 'B' ? 'b' : grade === 'C' ? 'c' : ''">{{ grade }}</div> <!--231211 그래드 따라 클래스 처리 요망-->
      <div class="AnalyzeABCHealthGradeDetail--table-wrap"> <!--231211 감싸는 div 추가-->
        <table class="AnalyzeABCHealthGradeDetail--table">
          <tbody>
            <tr>
              <th>노화 억제 분석 지수</th>
              <td>{{score1}}점</td>
            </tr>
            <tr>
              <th>만성질환 억제 분석 지수</th>
              <td>{{score2}}점</td>
            </tr>
          </tbody>
        </table>
      </div> <!--231211 감싸는 div 추가-->
    </div>
    <div class="AnalyzeABCHealthGradeDetail--list">
      <table class="AnalyzeABCHealthGradeDetail--list-table">
        <caption class="AnalyzeABCHealthGradeDetail--caption">

          <!--          231211 설명 칩 수정-->
          <div class="txt--right AnalyzeCheckupDataRecord--label">
            <span class="AnalyzeCheckupDataRecord--label-wrap">
              <span class="AnalyzeCheckupDataRecord--label-rect s1" /> 주의
            </span>
            <span class="AnalyzeCheckupDataRecord--label-wrap">
              <span class="AnalyzeCheckupDataRecord--label-rect s2" /> 관리
            </span>
            <span class="AnalyzeCheckupDataRecord--label-wrap">
              <span class="AnalyzeCheckupDataRecord--label-rect s3" /> 좋음
            </span>
          </div>

        </caption>
        <tbody>
          <tr v-for="item in data">
            <th>{{item.name}}</th>

            <!--            231211 텍스트를 라벨로 변경-->
            <td class="AnalyzeABCHealthGradeDetail--chip">
              <span class="AnalyzeCheckupDataRecord--label-rect" :class="item.score === 'good' ? 's3' : item.score === 'normal' ? 's2' : item.score === 'bad' ? 's1' : ''" />
            </td>

          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>

</style>
