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
      <p class="intro--txt">개인맞춤 웰니스 관리 플랫폼</p>
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
      <p class="intro--copy-sub">별도의 검사없이</p>
      <p class="intro--copy">정밀하게</p>
      <p class="intro--desc">간단한 검진 정보와 생활습관 정보를 입력하면<br>17억 빅데이터 기반 AI 알고리즘이 분석합니다</p> <!--231227 반응형 적용, br추가-->
    </div>

    <div class="intro--unit unit2">
      <p class="intro--copy-sub">건강상태를 점수로</p>
      <p class="intro--copy">세밀하게</p>
      <p class="intro--desc">노화 & 만성질환 억제 분석 지수, 노화속도,<br>건강위험요인, 건강 위치, 건강 등급 변화 예측</p> <!--231227 반응형 적용, br추가-->
    </div>

    <div class="intro--unit unit3">
      <p class="intro--copy-sub">생활습관을</p>
      <p class="intro--copy">더 건강하게</p>
      <p class="intro--desc">수면, 운동, 식습관 등 건강에 영향을 주는<br>생활습관을 개선할 수 있도록 도와줍니다</p> <!--231227 반응형 적용, br 추가-->
    </div>

    <BtnTop />

  </section>
</template>

<style lang="scss"></style>
