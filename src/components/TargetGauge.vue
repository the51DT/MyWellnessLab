<script>
export default {
  name: "TargetGauge",
  props: {
    gaugePer: {
      type: Number,
      default: 0
    },
    targetPer: {
      type: Number,
      default: 0
    },
    compPer: {
      type: Number,
      default: 0
    },
    bgColor: {
      type: String,
      default: 'pink'
    }
  },
  data () {
    return {
      observer: null,
      colorObj: this.bgColor === 'pink' /* 색상 더 생기면 조건 변경 필요 */
        ? {
            bg: '#EB608E',
            gradient1: '#F395B5',
            gradient2: '#DD366E',
          }
        : {
            bg: '#146B5B',
            gradient1: '#4BDAC0',
            gradient2: '#199982',
          }
    }
  },
  mounted () {
    const gauge = this.$refs.gauge
    const target = this.$refs.targetGauge

    if (!gauge || !target) return

    gauge.style.width = '0%'

    const animateGauge = () => {
      gauge.style.transition = 'none'
      gauge.style.width = '0%'
      gauge.offsetHeight

      requestAnimationFrame(() => {
        gauge.style.transition = 'width 1.3s ease-in-out'
        gauge.style.width = this.gaugePer + '%'
      })
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateGauge()
          this.observer.disconnect()
        }
      })
    }, {
      threshold: 0.3
    })

    this.observer.observe(target)
  },
  beforeUnmount () {
    document.removeEventListener("scroll", this.scrollEvents, true)

    if (this.observer) {
      this.observer.disconnect()
    }
  },
  methods: {
    scrollEvents () {
      const scrollY = window.scrollY
      const stickyCardBox = document.querySelector(".home-sticky")
      const stickyArea = document.querySelector(".home--bot-section")
      const stickyTarget = document.querySelector(".home-sticky-target")

      if (!stickyCardBox || !stickyArea || !stickyTarget) return

      const stickyAreaY = stickyArea.offsetTop
      const winHeight = window.innerHeight

      if (scrollY + winHeight / 2 >= stickyAreaY) {
        stickyCardBox.classList.remove("sticky")
        stickyTarget.style.display = "flex"
      } else {
        stickyCardBox.classList.add("sticky")
        stickyTarget.style.display = "none"
      }
    },
  }
}
</script>

<template>
  <div ref="targetGauge" class="target-gauge">
    <div class="target-gauge--wrap">
      <div v-if="gaugePer < 100" ref="gauge" class="target-gauge--gauge" :style="{backgroundColor: colorObj.bg, width: gaugePer + '%' }">
      </div>
      <div v-else class="target-gauge--gauge full" :style="`background: linear-gradient(90deg, ${colorObj.gradient1} 0%, ${colorObj.gradient2} 100%);`">100% 달성 완료</div>
    </div>
    <div v-if="compPer && gaugePer < 100" class="target-gauge--comp" :style="{ width: 100 - compPer + '%' }" :class="gaugePer >= compPer ? 'comp' : ''">성공!</div>
    <div ref="target" v-if="targetPer" class="target-gauge--target" :class="{ ty02: targetPer >= 80 }" :style="{ left: targetPer + '%' }">목표치</div>
  </div>
</template>

<style lang="scss">
.target-gauge{
  position: relative;
  flex: 1 1 auto;
  width: 100%;
  height: 4rem;
  background-color: #E5E5E5;
  border-radius: 99rem;
  @media (min-width: 960px) {
    height: 4.8rem;
  }
  &--wrap{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 99rem;
    overflow: hidden;
  }
  &--gauge{
    width: 0%;
    height: 100%;
    border-radius: 99rem;
    will-change: width;
    &.full{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      font-size: 2rem;
      line-height: 1.5;
      font-weight: 600;
      color: #fff;
      @media (min-width: 960px) {
        font-size: 2.2rem;
      }
    }
  }
  &--comp{
    position: absolute;
    top: 50%;
    right: .6rem;
    transform: translateY(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 6.4rem;
    height: calc(100% - 1rem);
    border-radius: 2rem 2rem 2rem 0;
    background-color: #666;
    font-size: 1.5rem;
    font-family: "RixSinHead_ExtraBold", sans-serif;
    line-height: 1.6;
    color: #fff;
    @media (min-width: 960px) {
      height: calc(100% - 1.2rem);
      font-size: 1.8rem;
    }
    &.comp{
      background-color: #1DB196;
    }
  }
  &--target{
    position: absolute;
    top: -1.6rem;
    display: flex;
    align-items: center;
    gap: .3rem;
    margin-left: -0.6rem;
    font-size: 1.1rem;
    line-height: 1.5;
    color: #666;
    &::before{
      content: '';
      display: block;
      width: 0;
      height: 0;
      margin: 0 auto;
      border-left: 0.6rem solid transparent;
      border-right: 0.6rem solid transparent;
      border-top: 0.8rem solid #666;
    }
    &.ty02 {
      flex-direction: row-reverse;
      transform: translateX(calc(-100%));
      margin-inline: 0.6rem;
    }
    @media (min-width: 960px) {
      top: -1.9rem;
      font-size: 1.3rem;
      margin-left: -0.75rem;
      &::before{
        border-left: 0.75rem solid transparent;
        border-right: 0.75rem solid transparent;
        border-top: 1rem solid #666;
      }
      &.ty02 {
        margin-inline: 0.75rem;
      }
    }
  }
}
</style>