<script setup>
/**
 * 약관, 개인정보방침, faq 등에서 에디터로 작성된 내용을 보여주는 콤포넌트
 */
import { onMounted, ref } from 'vue'
import EditorViewer from '@toast-ui/editor/dist/toastui-editor-viewer'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const editorViewer = ref()

onMounted(() => {
  // 텍스트를 편집하는 도구 초기화, 에디터 생성
  new EditorViewer({
    el: editorViewer.value,
    height: 'auto',
    initialEditType: 'wysiwyg',
    initialValue: props.modelValue
  })
})
</script>

<template>
  <div ref="editorViewer" />
</template>
