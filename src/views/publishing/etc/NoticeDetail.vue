<script>

import { ref } from 'vue'

export default {
  name: 'NoticeDetail',
  data () {
    return {
      prefix: 'NoticeDetail', /* 231215 클래스 접두어 */ 
    }
  },
  methods: {   

  },
}

</script>

<template>
  <section :class="prefix">

    <div class="NoticeDetail--menu--cover">
      <div
        class="NoticeDetail--menu"
        @mousedown="dragStart"
        @mousemove="drag"
        @mouseup="dragEnd"
        ref="scrollContainer">
        <button
          v-for="(item, index) in menu"
          :key="index"
          @click="move($event, index)"
          type="button"
          class="NoticeDetail--menu-btn">{{item}}</button>
      </div>
    </div>

    <div :class="prefix + '--group'">
      <div :class="prefix + '--item'">
        테스트1
      </div>
      <div :class="prefix + '--item'">
        테스트2
      </div>

    </div>

  </section>

</template>

<style lang="scss">

</style>
