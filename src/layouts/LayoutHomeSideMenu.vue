<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import BasePopup from '@/components/BasePopup.vue'
import BaseToast from '@/components/BaseToast.vue'
import PdfViewer from '@/components/PdfViewer.vue'
import message from '@/components/message'
import { useI18n } from 'vue-i18n'
import baseHttp from '@/utils/http/base'

const { t, locale } = useI18n()
const store = useStore()
const router = useRouter()

const emit = defineEmits(['closeSideMenu'])

const props = defineProps({
  isPc: { /* 231218 pc 인지? */
    type: Boolean,
    default: false
  },
  accountTypeCode: String,
  isLogin: {
    default: false
  }
})
const isInvitePop = ref(false) /* 231218 초대 팝업 오프너 */
const isKakao = ref(false) /* 231218 카카오 초대 화면 */
const toastMsg = ref('') /* 231218 url복사됬다는 토스트 메시지 */
const showPdfViewer = ref(false) /* PDF 뷰어 열기 */
const pdfUrl = ref('') /* PDF Blob URL */
const pdfLoading = ref(false) /* PDF 로딩 상태 */
const pdfError = ref('') /* PDF 에러 메시지 */
const selectedFileName = ref('') /* 선택된 파일명 */

function closeSideMenu () { /* 231218 사이드메뉴 닫기 */
  emit('closeSideMenu')
}
function openInvitePop () { /* 231218 초대 팝업 열기 */
  // 특정 customerID만 기능 사용 가능
  const user = store.getters.getUser
  const allowedCustomerIds = ['63584316', '116890034', '63584377', '63584274'] // 여기에 허용할 customerID 목록 추가
  
  if (user && allowedCustomerIds.includes(user.customerId)) {
    // 허용된 사용자는 원래 기능 사용
    isInvitePop.value = true
  } else {
    // 나머지는 준비 중 팝업 표시
    message.alert(t('LayoutHomeSideMenu.featureInPreparation'))
  }
}
function closeInvitePop () { /* 231218 초대 팝업 닫기 */
  isInvitePop.value = false
}
function openKakaoPop () { /* 231218 카카오 초대 화면 열기 */
  selectTarget()
  // isKakao.value = true;
}

const openPdfViewer = async () => { /* PDF 뷰어 열기 */
  try {
    pdfLoading.value = true
    pdfError.value = ''
    
    const fileTypeCode = 'aboGuide' // ABO 가이드
    
    // PDF 바이너리 데이터를 가져와서 Blob URL 생성
    const response = await baseHttp.get(`/v1/api/user/mypage/guideDownload/${fileTypeCode}`, {
      responseType: 'arraybuffer'
    })
    
    // response.data가 undefined인 경우 response 자체를 사용
    const pdfData = response.data || response
    
    // PDF 바이너리 데이터를 Blob으로 변환
    const blob = new Blob([pdfData], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    
    pdfUrl.value = url
    showPdfViewer.value = true
  } catch (error) {
    console.error('PDF 뷰어 열기 오류:', error)
    
    if (error.response?.status === 404) {
      pdfError.value = 'PDF를 찾을 수 없습니다.'
      message.alert('PDF를 찾을 수 없습니다.')
    } else {
      pdfError.value = error.response?.data?.message || 'PDF를 불러오는 중 오류가 발생했습니다.'
      message.alert(pdfError.value)
    }
  } finally {
    pdfLoading.value = false
  }
}

const closePdfViewer = () => { /* PDF 뷰어 닫기 */
  showPdfViewer.value = false
  
  // Blob URL 메모리 해제
  if (pdfUrl.value && pdfUrl.value.startsWith('blob:')) {
    window.URL.revokeObjectURL(pdfUrl.value)
  }
  
  pdfUrl.value = ''
  pdfError.value = ''
  selectedFileName.value = ''
}
function selectTarget () {
  // isKakao.value = false;
  window.location.href = import.meta.env.VITE_AMWAY_URL + '/logme?openKakaoPopup=Y&uiel=Mobile'
}

const doCall = () => {
  window.location.href = 'tel:1588-0080'
}

const doLogout = () => {
  store.dispatch('doLogout')
  window.location.href = import.meta.env.VITE_AMWAY_URL
}

const goExternalUrl = () => {
  window.open('https://booking.codehive.co.kr/reserve/logme', '_blank')
  // message.alert(t('LayoutHomeSideMenu.featureInPreparation'))
}

const moveAmwayLoginPage = () => {
  window.location.href = import.meta.env.VITE_HYBRIS_LOGIN_URL
}

watch(isKakao, () => { /* 231214 사이드바가 나오면 사이드메뉴 스크롤 정지 */
  const dom = document.querySelector('.side-bar--con')
  if (isKakao.value) {
    dom.classList.add('no-scroll')
  } else {
    dom.classList.remove('no-scroll')
  }
})
</script>

<template>
  <div class="side-bar--con-wrap">

    <div class="side-bar--contents">

      <div class="side-bar--top">

        <div v-if="isLogin" class="side-bar--wrap">
          <div>
            <button @click="router.push('/my-page/detail')" type="button" class="side-bar--big-btn mypage">
              <span v-html="$t('LayoutHomeSideMenu.btn1').replace(/\n/g, '<br>')"></span>
            </button>
          </div>
          <div>
            <button type="button" @click="router.push('/analyze/list');" class="side-bar--big-btn result">
              <span v-html="$t('LayoutHomeSideMenu.btn2').replace(/\n/g, '<br>')"></span>
            </button>
          </div>
          <div v-if="!isPc && props.accountTypeCode === 'AMWAYBUSINESSNATURE_1'">
            <button @click="openInvitePop" type="button" class="side-bar--big-btn invite">
            <!-- 비활성화 -->
            <!-- <button type="button" class="side-bar--big-btn invite dimed"> -->
              <span v-html="$t('LayoutHomeSideMenu.btn3').replace(/\n/g, '<br>')"></span>
            </button>
          </div>
          <div v-if="props.accountTypeCode === 'AMWAYBUSINESSNATURE_1'">
            <button @click="openPdfViewer" type="button" class="side-bar--big-btn abo"><span v-html="$t('LayoutHomeSideMenu.btn4').replace(/\n/g, '<br>')"></span></button>
          </div>
        </div>
        <div v-else class="side-bar--login">
          <button @click="moveAmwayLoginPage" class="side-bar--login-btn">{{ $t('LayoutHomeSideMenu.btn5')}}</button>
        </div>

        <hr class="dot2" />
        <div class="side-bar--btn-wrap">
          <router-link to="/info/guide" class="side-bar--btn">
            <span>{{ $t('LayoutHomeSideMenu.link1')}}</span>
          </router-link>
          <router-link to="/info/introduce" class="side-bar--btn">
            <span>{{ $t('LayoutHomeSideMenu.link2')}}</span>
          </router-link>
          <router-link to="/info/faq" class="side-bar--btn">
            <span>FAQ</span>
          </router-link>
        </div>
      </div>

      <div class="side-bar--info-wrap">
        <dl class="side-bar--info">
          <dt class="side-bar--dt">
            {{ $t('LayoutHomeSideMenu.info1')}}
            <span v-if="!isPc" class="side-bar--tell-txt">1588-0080</span>
            <span class="side-bar--sub-desc">{{ $t('LayoutHomeSideMenu.info2')}}</span>
          </dt>
          <dd class="side-bar--tell">
            <span v-if="isPc" class="side-bar--tell-txt">1588-0080</span>
            <button
              v-if="!isPc"
              @click="doCall"
              type="button"
              aria-label="전화걸기"
              class="side-bar--call" />
          </dd>
          <dt class="side-bar--reservation">
            <div>
              {{ $t('LayoutHomeSideMenu.info3')}}
              <span class="side-bar--sub-desc">{{ $t('LayoutHomeSideMenu.info4')}}</span>
            </div>
          </dt>
          <dd class="side-bar--time">
            <button
              type="button"
              @click="goExternalUrl"
              aria-label="달력"
              class="side-bar--call calendar" />
          </dd>
        </dl>
        <button type="button" class="side-bar--out" @click="doLogout">{{ $t('LayoutHomeSideMenu.logout')}}</button>
      </div>

    </div>

    <div class="header--close txt--right side-bar--close">
      <button @click="closeSideMenu" type="button" />
    </div>

    <transition name="fade">
      <base-popup v-if="isInvitePop">
        <template v-slot:contents>
          <div class="invite-pop">
            <p class="invite-pop--txt" v-html="$t('LayoutHomeSideMenu.invite1').replace(/\n/g, '<br>')"></p>
            <div class="invite-pop--btn-wrap">
              <!--              <div class="invite-pop&#45;&#45;btn-in"> 240110 기능 제공이 안되어 삭제 요청-->
              <!--                <button @click="copyUrl" type="button" aria-label="URL복사" class="invite-pop&#45;&#45;btn"></button>-->
              <!--                <span class="invite-pop&#45;&#45;btn-txt">URL 복사</span>-->
              <!--              </div>-->
              <div v-if="!isPc" class="invite-pop--btn-in">
                <button
                  @click="openKakaoPop"
                  type="button"
                  aria-label="카카오톡 공유"
                  class="invite-pop--btn kakao" />
                <span class="invite-pop--btn-txt">{{ $t('LayoutHomeSideMenu.invite2')}}</span>
              </div>
            </div>
            <div class="invite-pop--close">
              <button @click="closeInvitePop" type="button" class="invite-pop--close-btn">{{ $t('Common.close')}}</button>
            </div>
          </div>
        </template>
      </base-popup>
    </transition>

    <!--    <transition name="downUp3">-->
    <!--      <div v-if="isKakao" class="kakaoInvite">-->
    <!--        <div class="kakaoInvite&#45;&#45;con">-->
    <!--          <p class="kakaoInvite&#45;&#45;tit">로그미 서비스를<br>카카오톡 친구에게 추천합니다.</p>-->
    <!--          <p class="kakaoInvite&#45;&#45;txt">아직 로그미 서비스를 이용하시지 않는<br>지인에게 추천 메시지를 보내세요.<br>공유 대상으로 선택한 친구에게 서비스 구매 링크가 전송됩니다.</p>-->
    <!--        </div>-->
    <!--        <div class="kakaoInvite&#45;&#45;logo-wrap">-->
    <!--          <p class="kakaoInvite&#45;&#45;logo-txt">개인맞춤 웰니스 관리 플랫폼</p>-->
    <!--          <img src="/img/logo.svg" alt="" class="kakaoInvite&#45;&#45;logo">-->
    <!--        </div>-->
    <!--        <div class="kakaoInvite&#45;&#45;footer">-->
    <!--          <button @click="closeKakaoPop" type="button" class="kakaoInvite&#45;&#45;close">닫기</button>-->
    <!--          <button @click="selectTarget" type="button" class="kakaoInvite&#45;&#45;select">공유대상 선택</button>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </transition>-->

    <BaseToast ref="toast" :msg="toastMsg" class="AnalyzeList--toast" /> <!--231218 URL 복사 완료 토스트 메시지-->

    <!-- PDF 로딩 팝업 -->
    <base-popup v-if="pdfLoading" class="openPopContinue">
      <template v-slot:contents>
        <p class="pop-text-bold">로딩중입니다..</p>
        <div class="text-center">
          <div class="lds-ellipsis">
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      </template>
    </base-popup>

    <!-- PDF 뷰어 -->
    <PdfViewer
      v-if="showPdfViewer && pdfUrl"
      :pdf-url="pdfUrl"
      :title="'마이웰니스 랩 가이드북'"
      @close="closePdfViewer"
    />

  </div>
</template>

<style scoped>
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #fff;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
  background-color: #7ED47C;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
  background-color: #F6746F;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
  background-color: #F6AE5A;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
  background-color: #7ED47C;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}
</style>