<script>

import { ref } from 'vue'

export default {
  name: 'Faq',
  data () {
    return {
      prefix: 'Faq', /* 231215 클래스 접두어 */
      menu: ['회원', '건강분석', '리포트', '쿠폰'], /* 231215 메뉴 */

      // 상단 메뉴 드래그 관련
      isDragging: false,
      startX: 0,
      startScroll: 0,

      data: [
        {
          category: '회원',
          data: [
            {
              q: '회원가입은 어떻게 하나요?',
              a: '회원가입 버튼을 눌러서 진행합니다'
            },
            {
              q: '회원가입은 어떻게 하나요?',
              a: '회원가입 버튼을 눌러서 진행합니다회원가입 버튼을 눌러서 진행합니다회원가입 버튼을 눌러서 진행합니다회원가입 버튼을 눌러서 진행합니다회원가입 버튼을 눌러서 진행합니다회원가입 버튼을 눌러서 진행합니다회원가입 버튼을 눌러서 진행합니다회원가입 버튼을 눌러서 진행합니다회원가입 버튼을 눌러서 진행합니다회원가입 버튼을 눌러서 진행합니다회원가입 버튼을 눌러서 진행합니다'
            },
            {
              q: '회원가입은 어떻게 하나요?',
              a: '회원가입 버튼을 눌러서 진행합니다'
            }
          ]
        },
        {
          category: '건강분석',
          data: [
            {
              q: '건강분석은 어떻게 하나요?',
              a: '건강분석 버튼을 눌러서 진행합니다'
            },
            {
              q: '건강분석은 어떻게 하나요?',
              a: '건강분석 버튼을 눌러서 진행합니다'
            },
            {
              q: '건강분석은 어떻게 하나요?',
              a: '건강분석 버튼을 눌러서 진행합니다'
            },
            {
              q: '건강분석은 어떻게 하나요?',
              a: '건강분석 버튼을 눌러서 진행합니다'
            }
          ]
        },
        {
          category: '리포트',
          data: [
            {
              q: '리포트은 어떻게 하나요?',
              a: '건강분석 버튼을 눌러서 진행합니다'
            },
            {
              q: '리포트은 어떻게 하나요?',
              a: '건강분석 버튼을 눌러서 진행합니다'
            },
            {
              q: '리포트은 어떻게 하나요?',
              a: '건강분석 버튼을 눌러서 진행합니다'
            },
            {
              q: '리포트은 어떻게 하나요?',
              a: '건강분석 버튼을 눌러서 진행합니다'
            },
            {
              q: '리포트은 어떻게 하나요?',
              a: '건강분석 버튼을 눌러서 진행합니다'
            }
          ]
        },
        {
          category: '쿠폰',
          data: [
            {
              q: '쿠폰은 어떻게 하나요?',
              a: '건강분석 버튼을 눌러서 진행합니다'
            },
            {
              q: '쿠폰은 어떻게 하나요?',
              a: '건강분석 버튼을 눌러서 진행합니다'
            },
            {
              q: '쿠폰은 어떻게 하나요?',
              a: '건강분석 버튼을 눌러서 진행합니다'
            },
            {
              q: '쿠폰은 어떻게 하나요?',
              a: '건강분석 버튼을 눌러서 진행합니다'
            },
            {
              q: '쿠폰은 어떻게 하나요?',
              a: '건강분석 버튼을 눌러서 진행합니다'
            },
            {
              q: '쿠폰은 어떻게 하나요?',
              a: '건강분석 버튼을 눌러서 진행합니다'
            }
          ]
        }
      ],
      categoryNum: 0, /* 231215 보여지는 카테고리 번호 */
      isOpen: [], /* 231215 열린 질문 */
      prevIndex: null
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

      this.categoryNum = tg
    },

    allClose () { /* 231215 질문 수 오프너용 빈 배열 생성 */
      this.isOpen = Array.from({ length: this.data[this.categoryNum].data.length }, () => false)
    },

    // open(index){
    //   this.allClose();
    //   this.isOpen[index] = true;
    // }

    open (index) {
      if (this.prevIndex === index) {
        this.isOpen[index] = !this.isOpen[index]
      } else {
        this.allClose()
        this.isOpen[index] = true
      }
      this.prevIndex = index
    }

  },
  mounted () {
    this.allClose()
    // 231214 초기값 세팅
    document.querySelector('.AnalyzeDetail--menu-btn').classList.add('active')
  },
  watch: {
    categoryNum () {
      this.allClose()
    }
  }
}

</script>

<template>
  <section :class="prefix">

    <div
      class="AnalyzeDetail--menu"
      @mousedown="dragStart"
      @mousemove="drag"
      @mouseup="dragEnd"
      ref="scrollContainer">
      <button
        v-for="(item, index) in menu"
        @click="move($event, index)"
        type="button"
        class="AnalyzeDetail--menu-btn">{{item}}</button>
    </div>

    <div :class="prefix + '--group'">
      <h2 :class="prefix + '--tit'">{{data[categoryNum].category}}</h2>

      <div v-for="(item, index) in data[categoryNum].data" :class="[prefix + '--set', index === isOpen.indexOf(true) ? 'active' : '']">
        <div @click="open(index)" :class="prefix + '--dt'">
          <div :class="prefix + '--q'">
            <span>{{item.q}}</span>
          </div>
          <div :class="prefix + '--btn-wrap'">
            <button type="button" aria-label="열기닫기" :class="prefix + '--opener'" />
          </div>
        </div>
        <transition name="downUp2">
          <div v-show="isOpen[index]" :class="prefix + '--a'">
            <div>{{item.a}}</div>
          </div>
        </transition>
      </div>

    </div>

  </section>

</template>

<style lang="scss">

</style>
