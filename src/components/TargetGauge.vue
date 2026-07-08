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
      default: '#EB608E'
    }
  },
  data () {
    return {
      observer: null
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
    
    this.posValue(document.querySelectorAll(".target-gauge--target"));
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
    posValue(list) {
      list.forEach((el) => {
        if (this.targetPer >= 75) {
          el.classList.add("ty02")
        } else {
          el.classList.remove("ty02");
        }
      });
    }
  }
}
</script>

<template>
  <div ref="targetGauge" class="target-gauge">
    <div class="target-gauge--wrap">
      <div ref="gauge" class="target-gauge--gauge" :style="{backgroundColor: bgColor}">
      </div>
    </div>
    <div class="target-gauge--comp" :style="{ width: 100 - compPer + '%' }">성공!</div>
    <div class="target-gauge--target" :style="{ left: targetPer + '%' }">목표치</div>
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
  }
  &--target{
    position: absolute;
    top: -1.6rem;
    display: flex;
    align-items: center;
    gap: .3rem;
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
      transform: translateX(-100%);
    }
    @media (min-width: 960px) {
      top: -1.9rem;
      font-size: 1.3rem;
      &::before{
        border-left: 0.75rem solid transparent;
        border-right: 0.75rem solid transparent;
        border-top: 1rem solid #666;
      }
    }
  }
}
</style>