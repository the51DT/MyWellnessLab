<script setup>
/**
 * 웰니스 분석 시 동의해야만 하는 개인정보 제3자 제공 동의 내용 콤포넌트
 */
</script>

<template>
  <div class="agree3">

    <!--    231228 약관 변경, 삭제-->

    <div class="agree3--group">
      <h2>{{ $t('basePersonal3.title') }}</h2>
      <table class="table">
        <tbody>
          <tr>
            <th>{{ $t('basePersonal3.receiver') }}</th>
            <td>{{ $t('basePersonal3.receiverValue') }}</td>
          </tr>
          <tr>
            <th>{{ $t('basePersonal3.receiverPurpose') }}</th>
            <td>{{ $t('basePersonal3.receiverPurposeValue') }}</td>
          </tr>
          <tr>
            <th>{{ $t('basePersonal3.receiverItems') }}</th>
            <td class="light">{{ $t('basePersonal3.receiverItemsValue') }}</td>
          </tr>
          <tr>
            <th>{{ $t('basePersonal3.receiverRetention') }}</th>
            <td>{{ $t('basePersonal3.receiverRetentionValue') }}</td>
          </tr>
        </tbody>
      </table>
      <p class="agree3--p">{{ $t('basePersonal3.notice') }}</p>
    </div>

  </div>

</template>

<style scoped>

</style>
