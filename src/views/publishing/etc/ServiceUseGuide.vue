<script>

import ServiceUseGuide0 from '@/views/publishing/etc/ServiceUseGuide0.vue'
import ServiceUseGuide1 from '@/views/publishing/etc/ServiceUseGuide1.vue'
import ServiceUseGuide2 from '@/views/publishing/etc/ServiceUseGuide2.vue'
import ServiceUseGuide3 from '@/views/publishing/etc/ServiceUseGuide3.vue'

export default {
  name: 'ServiceUseGuide',
  components: {
    ServiceUseGuide3,
    ServiceUseGuide2,
    ServiceUseGuide1,
    ServiceUseGuide0
  },
  data () {
    return {
      prefix: 'ServiceUseGuide', /* 231214 클래스 접두어 */
      menu: ['가입 및 초대', '건강분석', '건강 분석 결과', '쿠폰'], /* 231214 메뉴 */
      group: [], /* 231214 내용 노출, 비노출 변수 */

      // 상단 메뉴 드래그 관련
      isDragging: false,
      startX: 0,
      startScroll: 0

    }
  },
  methods: {

    // 상단 메뉴 드래그 관련
    dragStart (event) {
      this.isDragging = true
      this.startX = event.clientX
      this.startScroll = this.$refs.scrollContainer.scrollLeft
    },
    drag (event) {
      if (!this.isDragging) return
      const x = event.clientX
      const delta = (this.startX - x)
      this.$refs.scrollContainer.scrollLeft = this.startScroll + delta
    },
    dragEnd () {
      this.isDragging = false
    },
    move (event, tg) {
      const btns = document.querySelectorAll('.AnalyzeDetail--menu-btn')
      for (let i = 0; i < btns.length; i++) {
        btns[i].classList.remove('active')
      }
      event.target.classList.add('active')
      for (let i = 0; i < this.menu.length; i++) {
        this.group[i] = false
      }
      this.group[tg] = true
    }

  },
  mounted () {
    this.group = Array.from({ length: this.menu.length }, () => false) /* 231214 메뉴 수 카테고리 빈 배열 생성 */

    // 231214 초기값 세팅
    document.querySelector('.AnalyzeDetail--menu-btn').classList.add('active')
    this.group[0] = true
  }
}

</script>

<template>
  <section :class="prefix">
    <div class="AnalyzeDetail--menu--cover">
      <div
        class="AnalyzeDetail--menu"
        @mousedown="dragStart"
        @mousemove="drag"
        @mouseup="dragEnd"
        ref="scrollContainer">
        <button
          v-for="(item, index) in menu"
          :key="index"
          @click="move($event, index)"
          type="button"
          class="AnalyzeDetail--menu-btn">{{ item }}</button>
      </div>
    </div>
    <div :class="prefix + '--category'" v-if="group[0]"> <!--231214 카테고리-->
      <ServiceUseGuide0 />
    </div>

    <div :class="prefix + '--category'" v-else-if="group[1]"> <!--231214 카테고리-->
      <ServiceUseGuide1 />
    </div>

    <div :class="prefix + '--category'" v-else-if="group[2]"> <!--231214 카테고리-->
      <ServiceUseGuide2 />
    </div>

    <div :class="prefix + '--category'" v-else-if="group[3]"> <!--231214 카테고리-->
      <ServiceUseGuide3 />
    </div>

  </section>
</template>

<style lang="scss"></style>
