<script setup>

import BtnTop from '@/views/publishing/BtnTop.vue'
// import router from "@/router";
// import { useStore } from 'vuex';
// import { ref, inject, onBeforeMount, onMounted, } from 'vue';
//
// const axios = inject('$axios');
// const store = useStore();

// const isSSOLogined = ref(false);
// const isLogined = ref(false);

// const userData = ref(null);//TODO LYH, 추후 pinia 적용 시 변경 필요
// const token = ref(null);;

/* export default {
  name: "Intro",
  components: {BtnTop},
} */

// async function ssoAndLoginCheck () {
//     let api = import.meta.env.VITE_HYBRIS_DOMAIN_URL + "/api/v2/amwaykorea/sso/authorizeEvent";
//
//     await axios.get(api, {
//         withCredentials: true
//     })
//     .then(res => {
//         let isAuth = res.data.customerUid ? true : false;
//
//         if(isAuth){
//           isSSOLogined.value = true;
//           isLogined.value = ( store.getters.getUser.name !== undefined) ? true : false;
//
//           if(isLogined.value) {
//             userData.value = store.getters.getUser
//             token.value = store.getters.getToken
//             header.value = {
//                 Authorization: token,
//             };
//           }else{
//             goLogin();
//           }
//         }
//     })
//     .catch(error => {
//         console.log(error);
//     });
// };

// function goLogin () {
//     if(isSSOLogined.value){
//         router.push('/login')
//     }else {
//         window.location.href = import.meta.env.VITE_HYBRIS_LOGIN_URL;
//     }
// };

// onBeforeMount(async () => {
//     ssoAndLoginCheck();
// })

</script>

<template>
  <section class="intro">

    <div class="intro--main">
      <p class="intro--txt">개인맞춤 건강 수명 플랫폼</p>
      <div class="intro--logo">
        <img src="/img/logo.svg" alt="myWellness LAB">
      </div>
      <div class="intro--btn">
        <!--        <a href="javascript: void(0);" class="intro&#45;&#45;login" @click="goLogin">-->
        <a href="javascript: void(0);" class="intro--login">
          <span>Amway 회원 로그인<span>(ABO, Member, Customer)</span></span>
        </a>
      </div>
    </div>

    <div class="intro--unit">
      <p class="intro--copy-sub">복잡한 검사 없이도</p>
      <p class="intro--copy">정밀하게</p>
      <p class="intro--desc">주요 검진 정보와 생활습관 정보를 바탕으로<br>빅데이터 기반 AI 알고리즘이 분석합니다.</p> <!--231227 반응형 적용, br추가-->
    </div>

    <div class="intro--unit unit2">
      <p class="intro--copy-sub">건강상태를 점수로</p>
      <p class="intro--copy">세밀하게</p>
      <p class="intro--desc">만성질환, 노화, 근육 관련 지수를 기준으로<br>나의 건강 위치,노화 속도는 물론 건상 상태에<br>영향을 준 요인까지 알 수 있습니다.</p> <!--231227 반응형 적용, br추가-->
    </div>

    <div class="intro--unit unit3">
      <p class="intro--copy-sub">추천 솔루션을 통해</p>
      <p class="intro--copy">생활습관을<br>더 건강하게</p>
      <p class="intro--desc">추천 솔루션을 통해<br>수면, 운동, 식습관 등 건강에 영향을 주는<br>생활습관 전반을 개선할 수 있도록 도와줍니다.</p> <!--231227 반응형 적용, br 추가-->
    </div>

    <BtnTop />

  </section>
</template>

<style lang="scss"></style>
