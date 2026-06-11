<script setup>
import {funcIsPc} from "@/assets/js/common";
import {computed} from "vue";
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
    <h2 class="tooltip--tit AnalyzeHealthLocation--tit">가입</h2>
    <p :class="prefix + '--txt'">
      암웨이 ABO, Member, RC의 경우 간단한 회원가입을 통해 마이웰니스 랩 서비스를 이용하실 수 있어요
    </p>
    <div :class="prefix + '--shadowbox'">

      <div>
        <h3 :class="prefix + '--step'">STEP 1</h3>
        <p :class="prefix + '--txt2'">서비스 진입 후, 로그인 버튼을 통해 암웨이 회원 로그인을 해주세요</p>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide01' + isPc + '.png'" alt="" class="img01">
        </div>
      </div>

      <div :class="prefix + '--mt'">
        <h3 :class="prefix + '--step'">STEP 2</h3>
        <p :class="prefix + '--txt2'">서비스 약관동의 및 공동 사업자의 경우 프로필 선택 후 현재 사용하시는 휴대폰을 인증해주세요</p>
        <p :class="prefix + '--caution'">* 휴대폰 번호 인증은, 민감정보 보호를 위한 것으로, 암웨이 홈페이지 회원정보의 휴대폰 번호는 함께 변경되지 않습니다.</p>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide02' + isPc + '.png'" alt="" class="img02">
        </div>
      </div>

      <div :class="prefix + '--mt'">
        <h3 :class="prefix + '--step'">STEP 3</h3>
        <p :class="prefix + '--txt2'">사용하실 PIN번호 4자리를 등록한 뒤 서비스 가입을 완료해주세요</p>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide03' + isPc + '.png'" alt="" class="img03">
        </div>
      </div>

    </div>
  </div>

  <div :class="prefix + '--invite'"> <!--231214 초대-->
    <h2 class="tooltip--tit AnalyzeHealthLocation--tit">초대</h2>
    <p :class="prefix + '--txt'">
      아직 암웨이에 가입하지 않은 비회원을 빠르고 쉽게 초대하실 수 있어요
    </p>
    <div :class="prefix + '--shadowbox'">

      <div>
        <h3 :class="prefix + '--step'">STEP 1</h3>
        <p :class="prefix + '--txt2'">홈화면 우상단의 아이콘을 통해 메뉴를 열고 ‘비회원 고객 초대‘ 를 선택해주세요</p>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide04' + isPc + '.png'" alt="" class="img04">
        </div>
      </div>

      <div :class="prefix + '--mt'">
        <h3 :class="prefix + '--step'">STEP 2</h3>
        <p :class="prefix + '--txt2'">URL복사와 카카오 공유 중 원하시는 방법을
          통해 비회원을 초대해주세요</p>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide05' + isPc + '.png'" alt="" class="img05">
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
.img01{
  width: 100%; max-width: 32.7rem;
  @media (min-width: 960px) {
    max-width: none;
  }
}
.img02{
  width: 100%; max-width: 35rem;
  @media (min-width: 960px) {
    max-width: none;
  }
}
.img03{
  width: 100%; max-width: 33rem;
  @media (min-width: 960px) {
    max-width: none;
  }
}
.img04{
  width: 100%; max-width: 34rem;
  @media (min-width: 960px) {
    max-width: none;
    margin-right: -4rem;
    width: 105%;
  }
}
.img05{
  width: 100%; max-width: 27rem;
  @media (min-width: 960px) {
    max-width: none;
    max-height: 28rem;
    width: auto;
  }
}
</style>