<script setup>
import { ref } from 'vue'
import PubList from '@/views/publishing/pub/PubList.vue'
import PubLibrary from '@/views/publishing/pub/PubLibrary.vue'

const tab = ref(0)

</script>

<template>
  <div class="wrap">

    <div class="tab-wrap">
      <button
        @click="tab = 0"
        type="button"
        class="tab"
        :class="tab === 0 ? 'active' : ''">리스트</button>
      <button
        @click="tab = 1"
        type="button"
        class="tab"
        :class="tab === 1 ? 'active' : ''">라이브러리</button>
    </div>

    <div v-if="tab === 0">
      <PubList />
    </div>

    <div v-else-if="tab === 1">
      <PubLibrary />
    </div>

  </div>
</template>

<style lang="scss">
  .wrap{
    margin: 3rem;
  }
  .tab-wrap{
    border-bottom: solid 1px black;
    margin-bottom: 2rem;
  }
  .tab{
    border-bottom: none;
    font-weight: bold;
    padding: 1rem;
    border-width: 1px;
    &.active{
      background-color: #0066b3;
      color: white;
    }
  }

</style>
