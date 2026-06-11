<script setup>
import {computed} from "vue";
import {funcIsPc} from "@/assets/js/common";

const prefix = "ServiceUseGuide"; /*231214 클래스 접두어*/
const isPc = computed(() => {
  if(funcIsPc()){
    return "_pc";
  }else {
    return "";
  }
});
</script>

<template>
  <div> <!--231214 가입-->
    <p :class="prefix + '--txt3'">건강데이터와 다양한 설문을 통해 보다 정확히 건강을 분석해보세요</p>
    <div :class="prefix + '--shadowbox'">

      <div>
        <h3 :class="prefix + '--step'">STEP 1</h3>
        <p :class="prefix + '--txt2'">홈화면의  ‘나의 건강분석 시작하기’를 통해 건강분석을 위한 설문을 시작해주세요</p>
        <div :class="prefix + '--img mt i06'">
          <p :class="prefix + '--txt4'">* 분석 이력이 없는 경우</p>
          <img :src="'/img/img_guide06' + isPc + '.png'" alt="">
        </div>
        <div :class="prefix + '--img mt i07'">
          <p :class="prefix + '--txt4'">* 이전 분석 이력이 있는 경우</p>
          <img :src="'/img/img_guide07' + isPc + '.png'" alt="">
        </div>
      </div>

      <div :class="prefix + '--mt'">
        <h3 :class="prefix + '--step'">STEP 2</h3>
        <p :class="prefix + '--txt2'">국민건강 보험 공단의 검진데이터 불러오기 또는 직접입력 버튼 선택을 통해 건강데이터 등록방법을 선택 해주세요</p>
        <p :class="prefix + '--caution'">* 국민건강보험공단 데이터의 경우 검진센터의 사정에 따라 등록되지 않거나 늦게 등록될 수 있으니, 이 경우 직접입력을 해주세요</p>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide08' + isPc + '.png'" alt="" class="img08">
        </div>
      </div>

      <div :class="prefix + '--mt'">
        <h3 :class="prefix + '--step'">STEP 3</h3>
        <p :class="prefix + '--txt2'">건강검진 불러오기를 선택하신 경우, 간편인증을 통해 국민건강보험공단의 검진 데이터를 불러올 수 있어요</p>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide09' + isPc + '.png'" alt="" class="img09">
        </div>
      </div>

      <div :class="prefix + '--mt'">
        <h3 :class="prefix + '--step'">STEP 4</h3>
        <p :class="prefix + '--txt2'">정확한 건강분석을 위해 다양한 건강 설문을 진행 해주세요.</p>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide10' + isPc + '.png'" alt="" class="img10">
        </div>
      </div>

      <div :class="prefix + '--mt'">
        <h3 :class="prefix + '--step'">STEP 5</h3>
        <p :class="prefix + '--txt2'">건강설문을 모두 입력하고 사용 가능한 마이웰니스 랩 쿠폰을 선택해주시면 자세한 건강분석 결과를 확인하고 지속적으로 관리할 수 있어요</p>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide11' + isPc + '.png'" alt="" class="img11"><br>
          <img :src="'/img/img_guide12' + isPc + '.png'" alt="" class="img12">
        </div>
      </div>

    </div>
  </div>

</template>

<style scoped lang="scss">
.img08{
  width: 100%; max-width: 30.8rem; margin-right: -1rem;
  @media (min-width: 960px) {
    max-width: none;
    margin-right: 0;
  }
}
.img09{
  width: 100%; max-width: 32rem;
  @media (min-width: 960px) {
    max-width: none;
  }
}
.img10{
  width: 100%; max-width: 35rem;
  @media (min-width: 960px) {
    max-width: none;
  }
}
.img11{
  width: 100%; max-width: 32.5rem; margin-right: -3.5rem;
  @media (min-width: 960px) {
    max-width: none;
    margin-right: 0;
  }
}
.img12{
  width: 100%; max-width: 29.2rem;
  @media (min-width: 960px) {
    max-width: none;
  }
}
</style>