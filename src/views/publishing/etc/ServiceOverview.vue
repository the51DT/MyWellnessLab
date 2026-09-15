<script setup>
  const prefix = 'ServiceOverview' /* 클래스 접두어 */
</script>

<template>
  <section :class="prefix">
    <div :class="prefix + '--video-area'">
      <div :class="prefix + '--video-tit'">
        <strong>마이웰니스 랩 브랜드 영상</strong>
        <p>개인맞춤 건강수명 플랫폼<br>마이웰니스 랩, 영상으로 확인해 보세요.</p>
      </div>
      <div :class="prefix + '--video-wrap'">
        <iframe src="https://www.youtube-nocookie.com/embed/EQibcTZgfEs?rel=0" title="마이웰니스 랩 브랜드 영상" allowfullscreen="" allow="fullscreen; encrypted-media; picture-in-picture"></iframe>
      </div>
      <div :class="prefix + '--video-tit'">
        <strong>마이웰니스 랩 캠페인 영상</strong>
        <p>저속 노화의 시작, 뉴트리라이트 스토리를<br>영상으로 확인해 보세요.</p>
      </div>
      <div :class="prefix + '--video-wrap'">
        <iframe src="https://www.youtube-nocookie.com/embed/msYjA-bVIZ8?rel=0" title="마이웰니스 랩 캠페인 영상" allowfullscreen="" allow="fullscreen; encrypted-media; picture-in-picture"></iframe>
      </div>
      <div :class="prefix + '--video-text'">
        <strong>개인맞춤 건강 수명 플랫폼</strong>
        <img src="/img/logo.svg">
        <p>전 생애 지속 가능한 건강을 위해서는 노화속도를 비롯한 건강상태를 정확히 알고 위험 요인을 미리미리 집중 관리하는 생활습관 성형이 필요합니다. <br>생활습관 성형을 통한 건강수명의 여정, 마이웰니스 랩으로 시작하세요.</p>
      </div>
    </div>
    <div class="intro--unit">
      <p class="intro--copy-sub">{{ $t('Intro.copySub1') }}</p>
      <p class="intro--copy">{{ $t('Intro.copy1') }}</p>
      <p class="intro--desc">{{ $t('Intro.desc1') }}</p>
    </div>

    <div class="intro--unit unit2">
      <p class="intro--copy-sub">{{ $t('Intro.text6') }}</p>
      <p class="intro--copy">{{ $t('Intro.text7') }}</p>
      <p class="intro--desc" v-html="$t('Intro.desc2')"></p>
    </div>

    <div class="intro--unit unit3">
      <p class="intro--copy-sub">{{ $t('Intro.text9') }}</p>
      <p class="intro--copy" v-html="$t('Intro.text10')"></p> <!-- 202606 v-html로 변경 -->
      <p class="intro--desc" v-html="$t('Intro.desc3')"></p>
    </div>
  </section>
</template>

<style lang="scss"></style>
