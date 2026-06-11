<script setup>
import { computed } from 'vue'
import { funcIsPc } from '@/assets/js/common'

const prefix = 'ServiceUseGuide' /* 231214 클래스 접두어 */

const isPc = computed(() => {
  if (funcIsPc()) {
    return '_pc'
  } else {
    return ''
  }
})
</script>

<template>
  <div>
    <p :class="prefix + '--txt3'">건강분석 결과를 통해 나의 건강을 자세히 확인하고 지속적으로 관리해보세요 </p>
    <div :class="prefix + '--shadowbox'">

      <div>
        <h3 :class="prefix + '--tit2'">건강위치</h3>
        <p :class="prefix + '--txt2'">나의 건강 위치는 실제 빅데이터 분포도와 나의 위치를 통해 건강을 얼마나 잘 지킬 수 있는 지를 이차원 상 위치로 표현한 것입니다</p>
        <div :class="prefix + '--img mt i13'">
          <img src="/img/img_guide13.png" alt="" />
        </div>
        <p :class="prefix + '--caution right'">* 피트니스 지수가 없는경우 그래프의 형태가 달라질 수 있습니다.</p>
      </div>

    </div>

    <div :class="prefix + '--shadowbox'">
      <div>
        <h3 :class="prefix + '--tit2'">노화 억제 분석 지수</h3>
        <p :class="prefix + '--txt2'">노화 억제 분석 지수는 산화 스트레스로부터 보호하는 능력을 100점 척도로 평가한 점수입니다</p>
        <div :class="prefix + '--img mt i14'">
          <img src="/img/img_guide14.png" alt="" />
        </div>
      </div>
    </div>

    <div :class="prefix + '--shadowbox'">
      <div>
        <h3 :class="prefix + '--tit2'">만성질환 억제 분석 지수</h3>
        <p :class="prefix + '--txt2'">만성질환 억제 분석 지수는 신진대사 능력을 100점 척도로 평가한 점수입니다</p>
        <div :class="prefix + '--img mt i14'">
          <img src="/img/img_guide15.png" alt="" />
        </div>
      </div>
    </div>

    <div :class="prefix + '--shadowbox'">
      <div :class="prefix + '--fit'">
        <h3 :class="prefix + '--tit2'">피트니스 지수</h3>
        <p :class="prefix + '--txt2'">피트니스 지수는 나의 심폐 지구력, 즉 일상에서의 활동 또는 신체 운동을 장시간 지속적으로 수행할 수 있는 능력을 100점 척도로 평가한 점수입니다.</p>
        <div :class="prefix + '--img mt i14'">
          <img src="/img/img_guide1502.png" alt="" />
        </div>
        <hr class="dot" />
        <p :class="prefix + '--txt5 mt right'">* 나의 부위별 근육량도 자세히 확인해보세요</p>
        <div :class="prefix + '--img mt i16'">
          <img src="/img/img_guide16.png?240205" alt="" />
        </div>
        <table :class="prefix + '--tb mts'">
          <tr>
            <th>신체 부위</th>
            <th>몸통</th>
            <th>왼팔</th>
            <th>오른팔</th>
            <th>왼다리</th>
            <th>오른다리</th>
          </tr>
          <tbody>
            <tr class="color">
              <th>근육량<br />판정</th>
              <td class="normal">표준</td>
              <td class="normal">표준</td>
              <td class="normal">표준</td>
              <td class="danger">부족</td>
              <td class="danger">부족</td>
            </tr>
            <tr>
              <th>근육량%<br />(kg)</th>
              <td>90.8<br />(18.0)</td>
              <td>85.1<br />(1.86)</td>
              <td>85.3<br />(1.87)</td>
              <td>90.8<br />(18.0)</td>
              <td>90.8<br />(18.0)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div :class="prefix + '--shadowbox'">
      <div>
        <h3 :class="prefix + '--tit2'">노화 속도</h3>
        <p :class="prefix + '--txt2'">노화 속도와  그 속도에 영향을 미친 요인을 자세히 확인하실 수 있습니다</p>
        <div :class="prefix + '--img mt'">
          <img :src="'/img/img_guide17' + isPc + '.png'" alt="" class="img17" />
        </div>
      </div>
    </div>

    <div :class="prefix + '--shadowbox'">
      <div>
        <h3 :class="prefix + '--tit2'">건강 신호등</h3>
        <p :class="prefix + '--txt2'">건강 점수와 건강 위험 요인 결과를 바탕으로 인체 생리 네트워크에서 나의 건강 신호등을 알려드립니다</p>
        <div :class="prefix + '--img mt'">
          <img :src="'/img/img_guide18' + isPc + '.png'" alt="" class="img18" />
        </div>
      </div>
    </div>

    <div :class="prefix + '--shadowbox'">
      <div>
        <h3 :class="prefix + '--tit2'">주요 건강 위험 요인</h3>
        <p :class="prefix + '--txt2'">건강데이터를 바탕으로 건강 위험 요인을 알려드립니다</p>
        <div :class="prefix + '--img mt'">
          <img :src="'/img/img_guide19' + isPc + '.png'" alt="" class="img19" />
        </div>
      </div>
    </div>

    <div :class="prefix + '--shadowbox'">
      <div>
        <h3 :class="prefix + '--tit2'">ABC 건강 등급</h3>
        <p :class="prefix + '--txt2'">ABC 건강 등급은 노화 억제 분석 지수와 만성질환 억제 분석지수를 바탕으로 등급 유형이 나뉘어집니다</p>
        <div :class="prefix + '--img mt'">
          <img :src="'/img/img_guide20' + isPc + '.png'" alt="" class="img20" />
        </div>
      </div>
    </div>

    <div :class="prefix + '--shadowbox'">
      <div :class="prefix + '--21'">
        <h3 :class="prefix + '--tit2'">그 외 다양한 기능들을 활용해 보세요</h3>
        <p :class="prefix + '--txt2'">건강분석 결과는 리포트 보기 또는 파일 다운로드를 통해서도 확인하실 수 있어요</p>
        <div :class="prefix + '--img mt'">
          <img :src="'/img/img_guide21' + isPc + '.png'" alt="" class="img21" />
        </div>
        <hr :class="prefix + '--hr dot'" />
        <p :class="prefix + '--txt2'">리포트 인쇄 신청을 통해, 출력된 리포트도 함께 받아보세요</p>
        <div :class="prefix + '--img mt'">
          <img :src="'/img/img_guide22' + isPc + '.png'" alt="" class="img22" />
        </div>
      </div>
    </div>

  </div>

</template>

<style scoped lang="scss">
.img17{
  width: 100%; max-width: 31rem;
  @media (min-width: 960px) {
    max-width: 100%;
  }
}
.img18{
  width: 100%; max-width: 31rem;
  @media (min-width: 960px) {
    max-width: 100%;
  }
}
.img19{
  width: 100%; max-width: 31rem;
  @media (min-width: 960px) {
    max-width: 100%;
  }
}
.img20{
  width: 100%; max-width: 30rem;
  @media (min-width: 960px) {
    max-width: 52rem;
  }
}
.img21{
  width: 100%; max-width: 33rem;
  @media (min-width: 960px) {
    max-width: 52rem;
  }
}
.img22{
  width: 100%; max-width: 33rem;
  @media (min-width: 960px) {
    max-width: 52rem;
  }
}
</style>
