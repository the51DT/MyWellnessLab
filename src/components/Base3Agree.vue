<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="agree3">
    <div>
      <h2>{{ $t('Base3Agree.title1') }}</h2>
      <table class="table">
        <tbody>
          <tr>
            <th>{{ $t('Base3Agree.collectPurpose') }}</th>
            <td>{{ $t('Base3Agree.collectPurposeValue') }}</td>
          </tr>
          <tr>
            <th>{{ $t('Base3Agree.collectItems') }}</th>
            <td>{{ $t('Base3Agree.collectItemsValue') }}</td>
          </tr>
          <tr>
            <th>{{ $t('Base3Agree.retentionPeriod') }}</th>
            <td>{{ $t('Base3Agree.retentionPeriodValue') }}</td>
          </tr>
        </tbody>
      </table>
      <p class="agree3--p">{{ $t('Base3Agree.notice1') }}</p>
    </div>

    <div class="agree3--group">
      <h2>{{ $t('Base3Agree.title2') }}</h2>
      <table class="table">
        <tbody>
          <tr>
            <th>{{ $t('Base3Agree.receiver') }}</th>
            <td>{{ $t('Base3Agree.receiverValue') }}</td>
          </tr>
          <tr>
            <th>{{ $t('Base3Agree.receiverPurpose') }}</th>
            <td>{{ $t('Base3Agree.receiverPurposeValue') }}</td>
          </tr>
          <tr>
            <th>{{ $t('Base3Agree.receiverItems') }}</th>
            <td>{{ $t('Base3Agree.receiverItemsValue') }}</td>
          </tr>
          <tr>
            <th>{{ $t('Base3Agree.receiverRetention') }}</th>
            <td>{{ $t('Base3Agree.receiverRetentionValue') }}</td>
          </tr>
        </tbody>
      </table>
      <p class="agree3--p">{{ $t('Base3Agree.notice2') }}</p>
    </div>

  </div>

</template>

<style scoped>

</style>