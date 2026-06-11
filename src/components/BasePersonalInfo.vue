<script setup>
/**
 * 웰니스 분석 시 동의해야만 하는 개인정보수집이용동의 내용 콤포넌트
 */
</script>

<template>
  <div class="agree3">
    <div>
      <h2>{{ $t('basePersonalInfo.title') }}</h2>
      <table class="table">
        <tbody>
          <tr>
            <th>{{ $t('basePersonalInfo.collectPurpose') }}</th>
            <td class="light">{{ $t('basePersonalInfo.collectPurposeValue') }}</td>
          </tr>
          <tr>
            <th>{{ $t('basePersonalInfo.collectItems') }}</th>
            <td class="light">{{ $t('basePersonalInfo.collectItemsValue') }}</td>
          </tr>
          <tr>
            <th>{{ $t('basePersonalInfo.retentionPeriod') }}</th>
            <td>{{ $t('basePersonalInfo.retentionValue') }}</td>
          </tr>
        </tbody>
      </table>
      <p class="agree3--p">{{ $t('basePersonalInfo.notice') }}</p>
    </div>

  </div>

</template>

<style scoped>

</style>
