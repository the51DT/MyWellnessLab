<script setup>
import { inject, onBeforeMount, ref } from 'vue'
import { useStore } from 'vuex'
import * as etcApi from '@/apis/etc'
import BaseEditorViewer from '@/components/BaseEditorViewer.vue'

const axios = inject('$axios')
const store = useStore()

const prefix = ref('Faq')
const isDragging = ref(false)
const startX = ref(0)
const startScroll = ref(0)
const categoryNum = ref(0) /* 231215 보여지는 카테고리 번호 */
const isOpen = ref([]) /* 231215 열린 질문 */
const categoryList = ref([])
const faqList = ref([])
const scrollContainer = ref(null)

onBeforeMount(async () => {
  // 카테고리 조회
  await getFaqCategory()

  // 순번이 제일 앞인 카테고리 FAQ 조회
  if (categoryList.value.length > 0) {
    const firstButton = document.querySelector('.AnalyzeDetail--menu-btn')
    firstButton.dispatchEvent(new Event('click'))
  }
})

const getFaqCategory = async () => {
  try {
    const response = await etcApi.getFaqCategory()

    categoryList.value = response.data
  } catch (e) {
    throw e
  }
}

const getFaqList = async (code) => {
  try {
    const response = await etcApi.getFaqList(code)

    faqList.value = response.data
  } catch (e) {
    throw e
  }
}

const dragStart = (event) => {
  isDragging.value = true
  startX.value = event.clientX
  startScroll.value = scrollContainer.value.scrollLeft
}

const drag = (event) => {
  if (!isDragging.value) return
  const x = event.clientX
  const delta = (startX.value - x)
  scrollContainer.value.scrollLeft = startScroll.value + delta
}

const dragEnd = () => {
  isDragging.value = false
}

const move = async (event, tg, code) => {
  allClose()
  await getFaqList(code)

  const btns = document.querySelectorAll('.AnalyzeDetail--menu-btn')
  const title = document.querySelector('.' + prefix.value + '--tit')

  for (let i = 0; i < btns.length; i++) {
    btns[i].classList.remove('active')
  }

  event.target.classList.add('active')
  categoryNum.value = tg
  title.textContent = categoryList.value[categoryNum.value].faqCategoryName
}

const allClose = () => { /* 231215 질문 수 오프너용 빈 배열 생성 */
  isOpen.value = Array.from({ length: faqList.value.length }, () => false)
}

const prevIndex = ref(null)
const open = (index) => {
  if (prevIndex.value === index) {
    isOpen.value[index] = !isOpen.value[index]
  } else {
    allClose()
    isOpen.value[index] = true
  }
  prevIndex.value = index
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
          v-for="(item, index) in categoryList"
          :key="index"
          @click="move($event, index, item.faqCategoryCode)"
          type="button"
          class="AnalyzeDetail--menu-btn">{{item.faqCategoryName}}</button>
      </div>
    </div>

    <div :class="prefix + '&#45;&#45;group'">
      <h2 :class="prefix + '&#45;&#45;tit'" />

      <div v-for="(item, index) in faqList" :key="item.id" :class="[prefix + '&#45;&#45;set', index === isOpen.indexOf(true) ? 'active' : '']">
        <div @click="open(index)" :class="prefix + '&#45;&#45;dt'">
          <div :class="prefix + '&#45;&#45;q'">
            <span v-text="item.faqSubject" />
          </div>
          <div :class="prefix + '&#45;&#45;btn-wrap'">
            <button type="button" :aria-label="$t('Faq.text1')" :class="prefix + '&#45;&#45;opener'" />
          </div>
        </div>
        <transition name="downUp2">
          <div v-show="isOpen[index]" :class="prefix + '&#45;&#45;a'">
            <div>
              <BaseEditorViewer v-if="item.faqContent" v-model="item.faqContent" />
            </div>
          </div>
        </transition>
      </div>

    </div>
  </section>

</template>

<style lang="scss">

</style>
