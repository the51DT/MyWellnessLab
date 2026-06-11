<script setup>

import router from '@/router'
</script>

<template>
  <div class="analyze">
    <div class="txt--center analyze--info">
      <span class="analyze--info-txt gray">웰니스 분석을 위한</span> <br />
      건강데이터 등록 방법을 선택하세요
    </div>
    <div class="txt--center analyze--btn-wrap">
      <a
        href="javascript:void(0);"
        @click="router.push('/checkup-privacy-agree')"
        type="button"
        class="btn--big4">
        <span class="align--between btn--big4--txt">
          <span class="btn--big4--ico">
            <img src="/img/ico_nhis.svg" alt="건강검진 불러오기" />
          </span>
          <span class="checkup--import">
            건강검진 불러오기
            <span class="btn--big4--desc">(국민건강보험공단)</span>
          </span>
        </span>
      </a>
      <!--      231213 br 삭제-->
      <a
        href="javascript:void(0);"
        @click="router.push('/checkup-privacy-agree')"
        type="button"
        class="btn--big4">
        <span class="align--between btn--big4--txt">
          <span class="btn--big4--ico">
            <img src="/img/ico_direct_input.svg" alt="직접 입력" class="analyze--direct" /> <!--231204 아이콘 위치 변경 위해 클래스 추가-->
          </span>
          <span class="checkup--direct">
            직접 입력
          </span>
        </span>
      </a>
    </div>
    <div class="analyze--txt">
      <ul class="bull--billiards analyze--ul">
        <li class="analyze--li">
          <span> <!--231204 빨간 글시가 바뀌어 span 삭제-->
            검진 기록이 없는 경우 가까운 보건소에서 건강 검진을
            받은 후 등록해 주셔야 하며, <span class="txt--red">검진센터의 사정에 따라
              국민건강보험공단에 등록되지 않거나 늦게 등록</span>될 수
            있습니다.
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">

</style>
