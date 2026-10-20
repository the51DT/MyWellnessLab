<script setup>
/**
 * 웰니스 분석 시 동의해야만 하는 개인정보 제3자 제공 동의 내용 콤포넌트
 */
</script>

<template>
  <div class="agree3">

    <!--    231228 약관 변경, 삭제-->
    <!-- 261020 약관 내용 변경 -->

    <div class="agree3--group">
      <p class="agree3--p">한국암웨이㈜는(이하 “회사”라 함) 서비스 제공을 위해 다음과 같이 회원님의 개인정보를 제3자 제공하고자 합니다.</p>
      <p class="agree3--underline">개인정보의 제3자 제공에 동의하지 않을 수 있으며, 다만 동의하지 않을 경우 마이웰니스 랩 서비스 이용이 제한됩니다.</p>
      <table class="table">
        <tbody>
          <tr>
            <th>{{ $t('basePersonal3.receiver') }}</th>
            <td>이용자가 선택하는 인증 사업자(카카오, 네이버, PASS 통신사, 토스)</td>
          </tr>
          <tr>
            <th>이용<br>목적</th>
            <td>이용자 식별 및 본인확인</td>
          </tr>
          <tr>
            <th>제공<br>항목</th>
            <td>성명, 휴대전화번호, 생년월일, (PASS 인증의 경우) 통신사</td>
          </tr>
          <tr>
            <th>보유<br>기간</th>
            <td>간편인증 완료 후 즉시 파기</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>

</template>

<style scoped>

</style>
