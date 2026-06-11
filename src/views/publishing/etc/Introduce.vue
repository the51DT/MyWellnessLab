<script setup>
const prefix = "Introduce"; /*231222 클래스 접두어*/
</script>

<template>
  <div :class="prefix">
    <div :class="prefix + '--con-t'">
      <p :class="prefix + '--tit'">생활습관 성형으로<br>건강한 시간이 길어지다</p>
      <div :class="prefix + '--desc0'">
        <p>전 생애 지속 가능한 건강을 위해서는 미리미리 건강한 생활습관을 쌓아가야 합니다</p>
        <p :class="prefix + '--desc-b'">건강 상태를 정확하게 알고, 위험요인을 집중 관리하면서, 생활습관을 더 건강하게 미래의 건강과 삶의 질이 달라지는 생활습관 성형, 마이웰니스 랩으로 시작하세요</p>
      </div>
      <hr class="dot">
    </div>
    <div :class="prefix + '--visual'">

      <div :class="prefix + '--group'">
        <div :class="prefix + '--txt'">
          <p :class="prefix + '--copy'">생활습관을 더 건강하게</p>
          <p :class="prefix + '--desc'">수면, 운동, 식습관 등 건강에 영향을 주는 생활습관을 개선할 수 있도록 도와줍니다</p>
        </div>
        <div :class="prefix + '--bg-wrap'"></div>
      </div>

      <div :class="prefix + '--group v2'">
        <div :class="prefix + '--txt v2'">
          <p :class="prefix + '--copy'">건강 상태를 점수로 세밀하게</p>
          <p :class="prefix + '--desc'">노화 & 만성질환 억제 분석 지수, 노화속도, 건강위험요인, 건강 위치, 건강 등급 변화 예측</p>
        </div>
        <div :class="prefix + '--bg-wrap v2'"></div>
        <div :class="prefix + '--bg-wrap v3'"></div>
      </div>

      <div :class="prefix + '--group v3'">
        <div :class="prefix + '--txt v3'">
          <p :class="prefix + '--copy'">별도의 검사없이 정밀하게</p>
          <p :class="prefix + '--desc'">간단한 검진 정보와 생활습관 정보를 입력하면 17억 빅데이터 기반 AI 알고리즘이 분석합니다</p>
        </div>
        <div :class="prefix + '--bg-wrap v4'"></div>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>