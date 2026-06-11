<script setup>

import BaseTooltip from '../BaseTooltip.vue'
import { ref } from 'vue'

const tooltip = ref(false)

function tooltipClose () {
  tooltip.value = false
}
</script>

<template>
  <div>

    퍼블리싱 가이드

    <h1>library</h1>

    <div>
      <h2>tooltip</h2>
      <div>
        <div class="tooltip">
          <h2 class="tooltip--tit">건강 위치</h2>
          <button
            @click="tooltip = !tooltip"
            class="btn--tooltip"
            type="button"
            title="도움말" />

          <base-tooltip v-if="tooltip" @tooltipClose="tooltipClose">
            <template v-slot:contents>
              <ul>
                <li>나의 건강 위치는 만 19세 이상 한국인 3만명의 실제 빅데이터 분포 중 노화와 만성질환으로부터 나의 건강을 얼마나 잘 지킬 수 있는 지를 분석하여 이차원 상 위치로 표현한 것입니다</li>
                <li>나의 건강 위치가 초록색 영역에 있다면 건강이 좋은 편에 속하고 빨간색 영역에 있다면 건강에 더 주의해야 한다는 것을 의미합니다</li>
                <li>현재의 건강 상태와 건강 위치 변화를 주기적으로 확인하여 건강 관리 습관을 갖는 것이 중요합니다</li>
              </ul>
            </template>
          </base-tooltip>

        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">

</style>
