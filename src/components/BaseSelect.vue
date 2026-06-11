<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: null
  },
  options: {
    type: Array,
    default: () => [] // [{ label, value }]
  },
  placeholder: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const { t } = useI18n()
const isOpen = ref(false)
const selected = ref(props.modelValue)
const dropUp = ref(false)

const emit = defineEmits(['update:modelValue', 'change'])

watch(() => props.modelValue, (v) => {
  selected.value = v
})

const containerRef = ref(null)
const menuRef = ref(null)

const recomputePlacement = () => {
  const root = containerRef.value
  const menu = menuRef.value
  if (!root) return
  const rect = root.getBoundingClientRect()
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight
  const spaceBelow = viewportHeight - rect.bottom
  const estimatedMenuHeight = Math.min((menu?.offsetHeight || 280), 280)
  dropUp.value = spaceBelow < estimatedMenuHeight + 8
}

const toggle = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) recomputePlacement()
}

const close = () => { isOpen.value = false }

const handleSelect = (option) => {
  selected.value = option.value
  emit('update:modelValue', option.value)
  emit('change', option.value)
  close()
}

const onClickOutside = (e) => {
  const root = containerRef.value
  if (!root) return
  if (!root.contains(e.target)) close()
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  window.addEventListener('resize', recomputePlacement)
  window.addEventListener('scroll', recomputePlacement, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
  window.removeEventListener('resize', recomputePlacement)
  window.removeEventListener('scroll', recomputePlacement, true)
})
</script>

<template>
  <div ref="containerRef" class="BaseSelect" :class="{ disabled, 'drop-up': dropUp }">
    <button
      type="button"
      class="BaseSelect--control"
      :name="name"
      :aria-expanded="isOpen"
      @click="toggle">
      <span class="BaseSelect--value" :class="{ placeholder: selected === null || selected === '' }">
        {{ (options.find(o => o.value === selected)?.label) ?? (placeholder || t('BaseSelect.defaultPlaceholder')) }}
      </span>
      <span class="BaseSelect--arrow" />
    </button>

    <transition name="fade">
      <ul v-show="isOpen" ref="menuRef" class="BaseSelect--menu" role="listbox">
        <li
          v-for="(opt, idx) in options"
          :key="idx"
          class="BaseSelect--option"
          :class="{ selected: opt.value === selected }"
          @click="handleSelect(opt)"
          role="option"
        >
          <span class="BaseSelect--label">{{ opt.label }}</span>
          <span class="BaseSelect--check" aria-hidden="true" />
        </li>
      </ul>
    </transition>
  </div>
  
</template>


