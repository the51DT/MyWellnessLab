<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const externalLink = ref(false) /* 암웨이 이동 레이어 노출 */

function showLink (val) { /* 231208 암웨이 링크 레이어 추가 */
  externalLink.value = val
}

const moveAmway = () => {
  window.location.href = import.meta.env.VITE_AMWAY_URL
}
</script>

<template>
  <div class="layout--home construction">
    <header class="header">
      <div class="header--wrap">
        <div class="header--logo">
          <a href="javascript:void(0)" class="btn--home" :class="externalLink ? 'display--none' : ''">
            <img src="/img/logo.svg" :alt="$t('LayoutHome.alt.logo')" class="home--img" />
          </a>
          <button
            @click="showLink(true)"
            type="button"
            class="header--home"
            :class="externalLink ? 'display--none' : ''" /> <!--231208 이벤트 추가-->

          <div v-if="externalLink" class="select-home"> <!--231208 클래스 추가-->
            <div>
              <a href="javascript:void(0)" class="select-home--btn"> <!--231208 클래스 추가-->
                <img src="/img/logo.svg" :alt="$t('LayoutHome.alt.logo')" class="home--img" /> <!--231208 클래스 추가-->
              </a>
              <a href="javascript:void(0)" class="select-home--btn" @click="moveAmway"> <!--231208 클래스 추가-->
                <img src="/img/logo_amway.svg" :alt="$t('LayoutHome.alt.amway')" />
              </a>
            </div>
            <div>
              <button @click="showLink(false)" type="button" class="header--home" /> <!--231208 이벤트 추가-->
            </div>
          </div>
        </div>
      </div>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout--home.construction {
  min-height: 100vh;
  background: #f8f9fa;
  font-size: 12.5px;
}

.layout--home.construction .header {
  background: #f8f9fa;
}

.layout--home.construction .header--logo {
  padding-top: 0.8rem;
  position: relative;
  flex: 2;
}

.layout--home.construction .header--wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 0.8rem;
  padding-left: 2rem;
  margin-right: auto;
  margin-left: auto;
}

@media (min-width: 960px) {
  .layout--home.construction .header--wrap {
    max-width: 120rem;
  }
}

.layout--home.construction .btn--home {
  display: inline-block;
  vertical-align: middle;
}

.layout--home.construction .home--img {
  width: 13.2rem;
}

@media (min-width: 960px) {
  .layout--home.construction .home--img {
    width: 18rem;
  }
}

.layout--home.construction main {
  margin-right: auto;
  margin-left: auto;
  min-height: calc(100vh - 20rem);
}

/* select-home 스타일 */
.layout--home.construction .select-home {
  width: max-content;
  position: absolute;
  top: -1.4rem;
  left: -1rem;
  padding: 1rem;
  background-color: white;
  box-shadow: 0.2rem 0.3rem 1.2rem rgba(0, 0, 0, 0.1);
  border-radius: 1.2rem;
  display: flex;
}

@media (min-width: 960px) {
  .layout--home.construction .select-home {
    top: -1.9rem;
  }
}

.layout--home.construction .select-home--btn {
  display: block;
  margin-top: 0.5rem;
  text-align: center;
}

.layout--home.construction .select-home--btn:first-child {
  margin-top: 0;
}

.layout--home.construction .select-home .header--home {
  transform: rotate(180deg);
  margin-top: -0.1rem;
}

@media (min-width: 960px) {
  .layout--home.construction .select-home .header--home {
    margin-top: 0.3rem;
  }
}

/* display--none 클래스 */
.layout--home.construction .display--none {
  display: none !important;
}
</style>
