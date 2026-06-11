<script setup>
import { getCurrentInstance } from 'vue'
import BasePopup from '@/views/publishing/orderNpay/BasePopupOrder.vue'

const instance = getCurrentInstance()
function closePop () {
  instance.emit('closePop', 1)
}

</script>

<template>
  <base-popup>
    <template v-slot:title>
      개인정보 수집 · 이용 동의
    </template>
    <template v-slot:contents>
      <div class="layer-content shipping mpn_mypack popup--contents-pad--default">
        <h2 class="busTxt">개인정보 이용 목적과 항목</h2>
        <div class="business_tbData01">
          <table>
            <colgroup>
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th>항목</th>
                <th>목적</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>대금 결제 서비스</td>
                <td>
                  ABO 번호 또는 회원 ID, 이름, 신용카드 정보, 계좌정보, A 포인트 정보, 생년월일(결제 방식에 따른 정보 수집)
                </td>
              </tr>
              <tr>
                <td>상품 배송</td>
                <td>이름, 주소, 휴대폰번호, 전화번호(선택)</td>
              </tr>
              <tr>
                <td>현금 영수증 발급 (현금 영수증 발급 신청 시)</td>
                <td>휴대폰 번호</td>
              </tr>
            </tbody>
          </table>
        </div>
        <dl class="personal_comm">
          <dt>
            (공통) 이용·보유기간
          </dt>
          <dd>
            계약 또는 청약철회 등에 관한 기록 5년<br />
            대금결제 및 재화 등의 공급에 관한 기록 5년
            <span class="person_txt">
              * 개인정보 수집 및 이용에 대한 동의를 거부하실 수 있으나, 거부 시 상품의 구매, 대금 결제, 배송이 제한됩니다.
            </span>
          </dd>
        </dl>
        <h2 class="busTxt space--top-default">개인정보의 국외 이전에 대한 동의</h2>
        <table class="business_tbData">
          <colgroup>
            <col />
            <col />
          </colgroup>
          <tr>
            <th>이전목적</th>
            <td>시스템 운영/유지보수, 설문조사 및 글로벌 비즈니스 분석, 회원정보 관리</td>
          </tr>
          <tr>
            <th>이전국가 및 <br /> 이전받는 자</th>
            <td>
              미국, 말레이시아, 인도, 호주, 중국 Alticor, Christian Grill (DPO),<br />
              alticor_privacy@alticor.com<br />
              미국<br />
              Amazon Web Service, Stephen Schmit (CSO/CISO), +1-206-266-1000
            </td>
          </tr>
          <tr>
            <th>이전항목</th>
            <td>
              - 대금 결제 서비스관련 정보 : ABO 번호 또는 회원 ID, 이름, 신용카드 정보, 계좌정보, A 포인트 정보, 생년월일 (결제 방식에 따른 정보 수집)<br />
              - 상품 배송관련 정보 : 이름, 주소, 휴대폰번호, 전화번호(선택)<br />
              - 현금영수증 발행 관련 정보: 휴대폰 번호
            </td>
          </tr>
          <tr>
            <th>이전시점</th>
            <td>주문/결제 시</td>
          </tr>
          <tr>
            <th>이전방법</th>
            <td>온라인 전송</td>
          </tr>
          <tr>
            <th>보유기간</th>
            <td>
              - 계약 또는 청약철회 등에 관한 기록 5년<br />
              - 대금결제 및 재화 등의 공급에 관한 기록 5년
            </td>
          </tr>
        </table>
        <p class="person_txt01">
          * 서비스 제공 시스템이 국외에 위치하므로, 동의를 거부하실 경우 상품의 구매, 대금 결제, 배송이 제한됩니다.
        </p>
      </div>
    </template>
    <template v-slot:footer>
      <div class="popup--foot">
        <button @click="closePop" type="button" class="btn--pop-bottom navy">확인</button>
      </div>
    </template>
  </base-popup>
</template>

<style lang="scss" scoped>
@use "@/assets/css/ordernpay";
</style>
