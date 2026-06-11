<template>
  <div class="pdf-viewer-overlay" @click="closeViewer">
    <div class="pdf-viewer-container" @click.stop>
      <div class="pdf-viewer-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="closeViewer">&times;</button>
      </div>
      <div class="pdf-viewer-content" @contextmenu.prevent>
        <VuePdfApp
          :pdf="pdfUrl"
          :title="true"
          :config="pdfConfig"
          class="pdf-viewer"
          @contextmenu.prevent
        />
      </div>
    </div>
  </div>
</template>

<script>
import VuePdfApp from 'vue3-pdf-app'
import 'vue3-pdf-app/dist/icons/main.css'

export default {
  name: 'PdfViewer',
  components: {
    VuePdfApp
  },
  props: {
    pdfUrl: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: 'PDF 뷰어'
    }
  },
  data() {
    return {
      pdfConfig: {
        toolbar: {
          toolbarViewerRight: {
            openFile: false,
            print: false,
            download: false
          }
        }
      },
      originalTitle: '',
      titleObserver: null,
      titleCheckInterval: null
    }
  },
  methods: {
    closeViewer() {
      this.$emit('close')
    }
  },
  mounted() {
    // 원래 제목 저장
    this.originalTitle = document.title
    
    // document.title 변경 감지 및 복원
    this.titleObserver = new MutationObserver(() => {
      if (document.title !== this.originalTitle) {
        document.title = this.originalTitle
      }
    })
    
    // document.title 변경 감지 시작
    this.titleObserver.observe(document.querySelector('title') || document.head, {
      childList: true,
      subtree: true,
      characterData: true
    })
    // 오른쪽 클릭 방지
    document.addEventListener('contextmenu', (e) => {
      if (e.target.closest('.pdf-viewer-overlay')) {
        e.preventDefault()
        return false
      }
    })
    
    // 키보드 단축키 방지
    document.addEventListener('keydown', (e) => {
      if (e.target.closest('.pdf-viewer-overlay')) {
        if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p' || e.key === 'c')) {
          e.preventDefault()
          return false
        }
      }
    })
  },
  beforeUnmount() {
    document.removeEventListener('contextmenu', this.preventDefault)
    document.removeEventListener('keydown', this.preventDefault)
  }
}
</script>

<style scoped>
.pdf-viewer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  user-select: none;
}

.pdf-viewer-container {
  background: white;
  border-radius: 8px;
  width: 90%;
  height: 90%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.pdf-viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.pdf-viewer-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #e0e0e0;
  color: #333;
}

.pdf-viewer-content {
  flex: 1;
  overflow: hidden;
}

.pdf-viewer {
  width: 100%;
  height: 100%;
}

/* 오른쪽 클릭 방지 */
.pdf-viewer-overlay * {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* PC와 모바일 모두에서 더보기 메뉴 숨기기 */
.pdf-viewer :deep(#secondaryToolbarToggle) {
  display: none !important;
}

.pdf-viewer :deep(#secondaryToolbar) {
  display: none !important;
}

.pdf-viewer :deep(#toolbarViewerRight .secondaryToolbarButton) {
  display: none !important;
}

/* 모바일에서만 더보기 메뉴 숨기기 */
@media (max-width: 768px) {
  
  /* 페이지 번호 사이즈 조정 */
  .pdf-viewer :deep(#pageNumber) {
    min-width: 40px !important;
    width: 40px !important;
    font-size: 12px !important;
    text-align: center !important;
    padding: 2px 4px !important;
    border: 1px solid #ccc !important;
    border-radius: 3px !important;
    color: black;
  }
  
  .pdf-viewer :deep(#numPages) {
    font-size: 12px !important;
    margin-left: 4px !important;
  }
  
  .pdf-viewer :deep(.toolbarViewerMiddle) {
    display: flex !important;
    align-items: center !important;
    gap: 4px !important;
  }
  
  .pdf-viewer :deep(.toolbarViewerMiddle > div) {
    display: flex !important;
    align-items: center !important;
  }
  
  .pdf-viewer :deep(.toolbarField) {
    min-width: 40px !important;
    width: 40px !important;
    font-size: 12px !important;
    text-align: center !important;
    padding: 2px 4px !important;
    border: 1px solid #ccc !important;
    border-radius: 3px !important;
    background: white !important;
    color: black;
  }
  
  .pdf-viewer :deep(.toolbarField:focus) {
    outline: none !important;
    border-color: #007bff !important;
    box-shadow: 0 0 0 1px rgba(0, 123, 255, 0.25) !important;
  }
}

/* PC에서도 동일한 toolbarField 스타일 적용 */
.pdf-viewer :deep(.toolbarField) {
  background: white !important;
  color: black !important;
  box-sizing: border-box !important;
  max-width: 100% !important;
  overflow: hidden !important;
}

.pdf-viewer :deep(.toolbarField:focus) {
  outline: none !important;
  border-color: #007bff !important;
  box-shadow: 0 0 0 1px rgba(0, 123, 255, 0.25) !important;
}

/* input 요소가 컨테이너를 벗어나지 않도록 제어 */
.pdf-viewer :deep(input) {
  box-sizing: border-box !important;
  max-width: 100% !important;
  overflow: hidden !important;
  width: 35px !important;
  height: 24px !important;
  font-size: 12px !important;
  padding: 2px 4px !important;
}

.pdf-viewer :deep(.splitToolbarButton input) {
  width: 35px !important;
  min-width: 35px !important;
  max-width: 35px !important;
  height: 24px !important;
  font-size: 12px !important;
  padding: 2px 4px !important;
}

/* 페이지 번호 input 특별 처리 */
.pdf-viewer :deep(#pageNumber) {
  width: 35px !important;
  min-width: 35px !important;
  max-width: 35px !important;
  height: 24px !important;
  font-size: 12px !important;
  padding: 2px 4px !important;
}
</style>
