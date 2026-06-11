<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import CheckupPrivacyAgreePopup from './CheckupPrivacyAgreePopup.vue'
import BasePopup from '@/components/BasePopup.vue'

const store = useStore()
const router = useRouter()

const analysisType = store.getters['checkup/getAnalysisType']
const healthDataType = store.getters['checkup/getHealthDataType']

const popupCertification = ref(false)

const toggleRule1 = ref(false)
const toggleRule2 = ref(false)
const checkRule1 = ref(false)
const refRule1 = ref(null)
const popMust = ref(false)

const popMustClose = () => {
  popMust.value = false
  if (refRule1.value) {
    refRule1.value.focus()
  }
}

const handleProceed = (value) => {
  if (value === 'Y') {
    if (!checkRule1.value) {
      popMust.value = true
      return
    }
    if (analysisType === 'normal' && healthDataType === 'formal') {
      popupCertification.value = true
    } else {
      router.push({ name: 'CheckupDateSelect' })
    }
  } else if (value === 'N') {
    router.push('/home')
  }
}

const handleClose = () => {
  popupCertification.value = false
}

const handleSuccess = () => {
  handleClose()

  router.push({ name: 'CheckupBasics' })
}

</script>

<template>
  <div>
    <div class="AnalyzePrivacyAgree">

      <div class="space--top-default">
        <label>
          <input
            v-model="checkRule1"
            ref="refRule1"
            type="checkbox"
            name="AnalyzePrivacyAgree-check"
            class="custom input-focus" />
          <span />
          민감정보 수집 이용동의 (필수)
        </label>
        <div class="txt--desc c222 AnalyzePrivacyAgree--info">
          한국 암웨이 ㈜ 는 (이하 “회사“ 라 함) 회원님의
          민감정보를 수집ㆍ처리하고자 합니다.
        </div>
        <div class="txt--desc c222 AnalyzePrivacyAgree--info2">
          개인정보의 수집ㆍ이용에 동의하지 않을 수 있으며,
          다만 동의하지 않을 경우 마이웰니스 랩 서비스를
          이용할 수 없습니다.
        </div>
        <div class="downUp4--wrap">
          <transition name="downUp4">
            <table v-if="toggleRule1" class="AnalyzePrivacyAgree--tb">
              <thead>
                <tr>
                  <th>항목</th>
                  <th>건강검진 결과 항목</th>
                  <th>설문</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>이용 목적</th>
                  <td>맞춤형 개인건강 분석 서비스 제공</td>
                  <td>개인별 건강 위험요인 및 건강 신호등 분석</td>
                </tr>
                <tr>
                  <th>수집 항목</th>
                  <td>
                    키, 체중, 허리둘레, 혈압(수축기혈압, 이완기혈압), 공복혈당, 지질대사 수치 (총 콜레스테롤, 고밀도 콜레스테롤(HDL), 저밀도 콜레스테롤(LDL), 중성지방), 혈색소(Hb), 혈청크레아티닌, 아스파테이트 전이효소(AST, SGOT), 알라닌 전이효소(ALT, SGPT)
                  </td>
                  <td>
                    건강설문(생활습관, 건강습관, 삶의 질, 건강에서의 불편함을 겪거나 향상시키고 싶은 건강 분야 관련 증상 등)
                  </td>
                </tr>
                <tr>
                  <th>보유 기간</th>
                  <td>회원탈퇴 5일 후
                    자동파기</td>
                  <td>회원탈퇴 5일 후
                    자동파기</td>
                </tr>
              </tbody>
            </table>
          </transition>
        </div>
        <div class="txt--center AnalyzePrivacyAgree--more">
          <button
            @click="toggleRule1 = !toggleRule1"
            type="button"
            class="btn--txt3"
            :class="toggleRule1 ? 'up' : ''">더보기</button>
        </div>
      </div>
      <hr />
      <div class="space--top-big">
        <label>
          <input type="checkbox" name="AnalyzePrivacyAgree-check" class="custom" />
          <span />
          민감정보(건강정보) 제3자 제공 동의 (선택)
        </label>
        <div class="txt--desc c222 AnalyzePrivacyAgree--info">
          한국 암웨이 ㈜ 는 (이하 “회사“ 라 함) 회원님의 민감정보를 수집ㆍ처리하고자  합니다.
        </div>
        <div class="txt--desc c222 AnalyzePrivacyAgree--info2">
          개인정보의 수집 · 이용에 동의하지 않을 수 있으며, 이에 동의하지 않을 경우에도 마이웰니스 랩 서비스를 이용하실 수 있습니다.
        </div>
        <div class="downUp4--wrap">
          <transition name="downUp4">
            <table v-if="toggleRule2" class="AnalyzePrivacyAgree--tb">
              <tbody>
                <tr>
                  <th>개인정보를 제공받는 자</th>
                  <td>㈜로그미</td>
                </tr>
                <tr>
                  <th>이용 목적</th>
                  <td>
                    <ul>
                      <li>개인식별정보 삭제 후 표본 축적을 통한 리포트 정확도 및 신뢰도 향상을 통한 서비스 개선</li>
                      <li>개인식별정보 삭제 후 표본 축적을 통해 서비스 확장 방향과 컨텐츠 개선</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <th>수집 항목</th>
                  <td>
                    <ul>
                      <li>나이, 성별</li>
                      <li>건강설문 (생활습관, 건강습관, 삶의 질, 관심건강분야 등)</li>
                      <li>건강검진 결과 항목 [키, 체중, 허리둘레, 혈압(수축기혈압, 이완기혈압), 공복혈당, 지질대사 수치 (총 콜레스테롤, 고밀도 콜레스테롤(HDL), 저밀도 콜레스테롤(LDL), 중성지방), 혈색소(Hb), 혈청크레아티닌, 아스파테이트 전이효소(AST, SGOT), 알라닌 전이효소(ALT, SGPT)]</li>
                      <li>웰니스 분석 결과 데이터</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <th>보유 기간</th>
                  <td>동의 철회 시 또는 회원 탈퇴 시 또는 개인정보 유효기간* 도래 시 또는 3년간</td>
                </tr>
              </tbody>
            </table>
          </transition>
        </div>
        <div class="txt--center AnalyzePrivacyAgree--more">
          <button
            @click="toggleRule2 = !toggleRule2"
            type="button"
            class="btn--txt3"
            :class="toggleRule2 ? 'up' : ''">더보기</button>
        </div>
      </div>

      <!--      <div class="AnalyzePrivacyAgree&#45;&#45;q">-->
      <!--        본인은 위 민감정보의 처리 위탁에 동의합니까?-->
      <!--      </div>-->
      <div class="align--between AnalyzePrivacyAgree--btm">
        <button type="button" @click="handleProceed('N')" class="AnalyzePrivacyAgree--btn-n">비동의</button>
        <button @click="handleProceed('Y')" type="button" class="AnalyzePrivacyAgree--btn-p">다음</button>
      </div>
    </div>

    <CheckupPrivacyAgreePopup v-if="popupCertification" @success="handleSuccess" @close="handleClose" />

    <base-popup v-if="popMust" class="base-pop">
      <template v-slot:contents>
        <p>민감정보 수집 이용동의는 필수입니다.</p>
        <p>서비스 이용을 위한 수집에 동의해주세요.</p>
        <div class="base-pop--footer">
          <button @click="popMustClose" class="btn-pop--green" type="button">확인</button>
        </div>
      </template>
    </base-popup>

  </div>
</template>
