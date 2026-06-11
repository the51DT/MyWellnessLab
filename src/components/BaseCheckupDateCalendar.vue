<script setup>
import { ref, computed, watch } from 'vue'

const selectDate = ref(new Date())

const emit = defineEmits(['update:modelValue', 'date-change'])

const attributes = ref({
  highlight: { fillMode: 'solid' }
})

const config = ref({
  type: 'string',
  masks: 'YYYY-MM-DD'
})

const mask = ref({
  L: 'YYYY-MM-DD',
  data: ['L', 'YYYY-MM-DD', 'YYYY-MM-DD']
})

// 날짜가 변경될 때마다 부모 컴포넌트에 이벤트 발생
watch(selectDate, (newDate) => {
  if (newDate) {
    const fullYear = newDate.getFullYear()
    let month = newDate.getMonth() + 1
    month = (month < 10) ? '0' + month : month
    const date = (newDate.getDate() < 10) ? '0' + newDate.getDate() : newDate.getDate()
    
    const formattedDate = fullYear + '.' + month + '.' + date
    emit('date-change', formattedDate)
  }
})
</script>

<template>
  <div class="BaseCheckupDate">
    <VDatePicker
      v-model="selectDate"
      mode="date"
      :isToday="true"
      :attributes="attributes"
      :model-config="config"
      :masks="mask"
      is-required />
  </div>
</template>