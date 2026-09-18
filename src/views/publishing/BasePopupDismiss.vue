<script>
import { bodyScroll } from '@/assets/js/common'

export default {
  name: "BasePopupDismiss",
  data() {
    return {
      popupThumbTop: 0,
      popupThumbHeight: 0,
      isPopupScrollable: false,
    }
  },
  methods: {
    close(){
      this.$emit("popupDismiss")
    },
    updatePopupScrollbar() {
      const el = this.$refs.popupScroll
      if (!el) return

      const scrollHeight = el.scrollHeight
      const clientHeight = el.clientHeight
      const scrollTop = el.scrollTop

      this.isPopupScrollable = scrollHeight > clientHeight

      if (!this.isPopupScrollable) {
        this.popupThumbTop = 0
        this.popupThumbHeight = 0
        return
      }

      const visibleRatio = clientHeight / scrollHeight
      const thumbHeight = Math.max(clientHeight * visibleRatio, 4)
      const maxScrollTop = scrollHeight - clientHeight
      const maxThumbTop = clientHeight - thumbHeight

      this.popupThumbHeight = thumbHeight
      this.popupThumbTop = maxScrollTop > 0
        ? (scrollTop / maxScrollTop) * maxThumbTop
        : 0
    },
  },
  mounted () {
    bodyScroll(false) /* 팝업 노출 시 body 스크롤 정지 */
    this.$nextTick(() => {
      this.updatePopupScrollbar()
      window.addEventListener('resize', this.updatePopupScrollbar)
    })
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updatePopupScrollbar)
  },
  unmounted () {
    bodyScroll(true) /* 팝업 삭제 시 body 스크롤 원복 */
  }
}
</script>

<template>
  <div class="popup dismissPopup">
    <div class="popup--wrap close">
      <div class="align--between popup--header">
        <div class="popup--tit-wrap">
          <!-- <span class="popup--tit"><slot name="title"></slot></span> -->
          <span class="popup--tit">Title</span> <!-- 퍼블 확인용 위쪽 주석으로 사용 필요 -->
        </div>
        <button @click="close" type="button" class="popup--close" aria-label="닫기"></button>
      </div>
      <div class="popup--space">
        <div class="popup--scroll" ref="popupScroll" @scroll="updatePopupScrollbar">
          <div class="popup--space-img">
            <img src="/img/img_daily_exam.png">
          </div>
          <div class="popup--space-text">
            <!-- <slot name="contents"></slot> -->
            <!-- Lorem 텍스트 퍼블 확인용 위쪽 주석으로 사용 필요 -->
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi consequatur, atque error id dolore quae fuga nesciunt est exercitationem distinctio, repellat architecto itaque? Beatae reprehenderit non libero magni ipsam provident.<br>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. In reprehenderit molestiae quia aliquid ut voluptatem blanditiis hic repellendus ab possimus, totam obcaecati sequi, repudiandae error sint, dolor dolore consectetur nemo!<br>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa saepe alias minus voluptate a perferendis aliquam cupiditate magni earum totam! Quaerat alias, vero architecto temporibus perspiciatis laboriosam nostrum officiis magnam?<br>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, delectus asperiores. Quo sed optio, in assumenda minima magnam voluptas veritatis nam doloribus ut vel pariatur obcaecati corporis quaerat magni a.<br>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae cumque dolore eligendi aut aliquam saepe iste mollitia accusamus. Neque porro saepe repellat. Totam suscipit excepturi dicta vitae animi ea tenetur.<br>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorum inventore totam veniam odit consequuntur facilis illo fugiat repellat quod quos distinctio rem, quia exercitationem natus sint. Tempora voluptatum unde omnis!<br>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, eaque dignissimos consequuntur et reiciendis saepe laboriosam doloremque magni commodi accusamus laborum necessitatibus, enim voluptatem quisquam magnam ut exercitationem similique maxime.
          </div>
        </div>
      </div>
      <div v-if="isPopupScrollable" class="popup--fake-scrollbar">
        <div class="popup--fake-thumb" :style="{height: popupThumbHeight + 'px', transform: `translateY(${popupThumbTop}px)`}"></div>
      </div>
      <div class="pop-btn-wrap">
        <div class="inputField--input--checkbox--wrap">
          <input type="checkbox" class="inputField--input inputField--input--checkbox" id="dismissToday" name="dismissToday"/>
          <label for="dismissToday" class="inputField--input--checkbox--label">
            <span>오늘 하루 열지 않기</span>
          </label>
        </div>
        <button type="button" @click="close" class="pop-btn pop-btn--green">닫기</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

</style>
