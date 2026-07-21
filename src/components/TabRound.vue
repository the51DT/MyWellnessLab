<script>
export default {
  name: "TabRound",
  emits: ["update:modelValue"],
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      innerActiveTab: 0
    }
  },
  computed: {
    activeTab: {
      get () {
        return this.modelValue !== null ? this.modelValue : this.innerActiveTab
      },
      set (value) {
        if (this.modelValue !== null) {
          this.$emit("update:modelValue", value)
        } else {
          this.innerActiveTab = value
        }
      }
    }
  }
}
</script>

<template>
  <div class="tab-round--wrap">
    <button v-for="(item, index) in tabs" :key="index"
      class="tab-round" type="button"
      @click="activeTab = index"
      :class="{ active: activeTab === index }"
    >
      <span class="tab-round--title">{{ item.title }}</span>
      <span v-if="item.count !== undefined" class="tab-round--count">{{ item.count }}</span>
      <span v-if="item.new" class="tab-round--new">N</span>
    </button>
  </div>

  <div class="tab-round--content">
    <slot :name="`tab-${activeTab}`"></slot>
  </div>
</template>

<style lang="scss">
.tab-round{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: .75rem 0;
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.5;
  color: #808080;
  text-align: center;
  border-radius: 9rem;
  border: none;
  background-color: transparent;
  background-position: center;
  background-repeat: no-repeat;
  @media (min-width: 960px) {
    font-size: 1.6rem;
    padding: 1rem 0;
  }
  &.active{
    font-weight: 600;
    color: #fff;
    background-color: #1DB196;
    .tab-round--count {
      background: #fff;
      color: #1DB196;
    }
  }
  &--wrap{
    display: flex;
    width: 100%;
    padding: .4rem;
    border: .1rem solid #e5e5e5;
    background: #fff;
    border-radius: 9rem;
    @media (min-width: 960px) {
      padding: .6rem;
    }
  }
  &--content{
    margin-top: 1.2rem;
  }
  &--title{
    &:has(+ *){
      margin-right: .4rem;
    }
  }
  &--count{
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    min-width: 2rem;
    height: 2rem;
    padding: .1rem .4rem;
    border-radius: 2rem;
    background: #1DB196;
    font-size: 1.2rem;
    font-weight: 700;
    color: #fff;
    &:has(+ *){
      margin-right: .2rem;
    }
    @media (min-width: 960px) {
      font-size: 1.3rem;
    }
  }
  &--new{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 2rem;
    height: 2rem;
    padding: .1rem .4rem;
    border-radius: 2rem;
    background: #FF4646E5;
    font-size: 1.2rem;
    font-weight: 700;
    color: #fff;
    &:has(+ *){
      margin-right: .2rem;
    }
    @media (min-width: 960px) {
      font-size: 1.3rem;
    }
  }
}
</style>