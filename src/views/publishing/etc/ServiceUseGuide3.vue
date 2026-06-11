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
  <div>
    <p :class="prefix + '--txt3'">마이웰니스 랩 건강분석을 위해서는 전용쿠폰이 필요해요 </p>

    <div :class="prefix + '--shadowbox'">
      <div>
        <p :class="prefix + '--txt2'">보유중인 마이웰니스 랩 쿠폰은 홈화면 상단의 메뉴 아이콘을 통해서 확인하실 수 있어요</p>
        <div :class="prefix + '--img mt i15'">
          <img :src="'/img/img_guide23' + isPc + '.png'" alt="" class="img23">
        </div>
        <hr :class="prefix + '--3hr dot'">
        <p :class="prefix + '--txt2'">마이웰니스 랩 쿠폰은 암웨이 홈페이지(www.amway.co.kr)에서 직접 구매 또는 프로모션을 통해 발급됩니다</p>
        <div :class="prefix + '--img mt i16'">
          <img src="/img/img_guide24.png" alt="" class="img24">
        </div>
      </div>
    </div>

  </div>

</template>

<style scoped lang="scss">
.img23{
  width: 100%; max-width: 33rem;
  @media (min-width: 960px) {
    max-width: 100%;
  }
}
.img24{
  width: 100%; max-width: 27rem;
  @media (min-width: 960px) {
    max-width: 36rem;
  }
}
.ServiceUseGuide--img.i16 img{
  &.img24{
    max-width: 38rem;
  }
}
</style>