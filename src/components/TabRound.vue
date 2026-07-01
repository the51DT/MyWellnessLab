<script>
export default {
  name: "TabRound",
  props: {
    tabs: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      activeTab: 0
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
    >{{ item }}</button>
  </div>

  <div class="tab-round--content">
    <slot :name="`tab-${activeTab}`"></slot>
  </div>
</template>

<style lang="scss">
.tab-round{
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
  &.active{
    font-weight: 600;
    color: #fff;
    background-color: #1DB196;
  }
  &--wrap{
    display: flex;
    width: 100%;
    padding: .4rem;
    border: .1rem solid #e5e5e5;
    background: #fff;
    border-radius: 9rem;
  }
  &--content{
    margin-top: 1.2rem;
  }
}
</style>