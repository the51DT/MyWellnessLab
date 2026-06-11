<script>
import { funcIsPc } from '@/assets/js/common'
import BtnTop from '@/views/publishing/BtnTop.vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'ServiceUseGuide',
  components: { BtnTop },
  setup() {
    const { t, locale } = useI18n()
    return { t, locale }
  },
  data () {
    return {
      prefix: 'ServiceUseGuide', /* 231214 클래스 접두어 */
      menu: [this.$t('ServiceUseGuide.text1'), this.$t('ServiceUseGuide.text2'), this.$t('ServiceUseGuide.text3'), this.$t('ServiceUseGuide.text4')], /* 231214 메뉴 */
      group: [], /* 231214 내용 노출, 비노출 변수 */

      // 상단 메뉴 드래그 관련
      isDragging: false,
      startX: 0,
      startScroll: 0,
      scrollY: 0,
      activeFab: false,
      sensorWidth: false
    }
  },
  methods: {

    // 상단 메뉴 드래그 관련
    dragStart (event) {
      this.isDragging = true
      this.startX = event.clientX
      this.startScroll = this.$refs.scrollContainer.scrollLeft
    },
    drag (event) {
      if (!this.isDragging) return
      const x = event.clientX
      const delta = (this.startX - x)
      this.$refs.scrollContainer.scrollLeft = this.startScroll + delta
    },
    dragEnd () {
      this.isDragging = false
    },
    move (event, tg) {
      const btns = document.querySelectorAll('.AnalyzeDetail--menu-btn')
      for (let i = 0; i < btns.length; i++) {
        btns[i].classList.remove('active')
      }
      event.target.classList.add('active')
      for (let i = 0; i < this.menu.length; i++) {
        this.group[i] = false
      }
      this.group[tg] = true
      window.scrollTo(0, 0)
    },
    handleScroll () {
      const currentScrollY = window.scrollY

      if (this.scrollY < currentScrollY) {
        this.activeFab = false
      } else {
        this.activeFab = true
      }

      this.scrollY = currentScrollY
    }
  },
  computed: {
    isPc () {
      if (this.sensorWidth) {
        return '_pc'
      } else {
        return ''
      }
    }
  },
  mounted () {
    this.group = Array.from({ length: this.menu.length }, () => false) /* 231214 메뉴 수 카테고리 빈 배열 생성 */

    // 231214 초기값 세팅
    document.querySelector('.AnalyzeDetail--menu-btn').classList.add('active')
    this.group[0] = true

    window.addEventListener('scroll', this.handleScroll)

    this.sensorWidth = funcIsPc()
    window.addEventListener('resize', () => {
      this.sensorWidth = funcIsPc()
    })
  },
  unmounted () {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', () => {
      this.sensorWidth = funcIsPc()
    })
  }
}

</script>

<template>
  <section :class="prefix">
    <div class="AnalyzeDetail--menu--cover">
      <div
        class="AnalyzeDetail--menu"
        @mousedown="dragStart"
        @mousemove="drag"
        @mouseup="dragEnd"
        ref="scrollContainer">
        <button
          v-for="(item, index) in menu"
          :key="index"
          @click="move($event, index)"
          type="button"
          class="AnalyzeDetail--menu-btn">{{
            item }}</button>
      </div>
    </div>
    <div :class="prefix + '--category'" v-if="group[0]" class="c0"> <!--231214 카테고리-->
      <div> <!--231214 가입-->
        <h2 class="tooltip--tit AnalyzeHealthLocation--tit">{{ $t('ServiceUseGuide.text5') }}</h2>
        <p :class="prefix + '--txt'" v-html="$t('ServiceUseGuide.text6')" />
        <div :class="prefix + '--shadowbox'">

          <div>
            <h3 :class="prefix + '--step'">STEP 1</h3>
            <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text7')" />
            <div :class="prefix + '--img'">
              <img :src="'/img/img_guide01_n' + isPc + '.png'" alt="" class="img01" />
            </div>
          </div>

          <div :class="prefix + '--mt'">
            <h3 :class="prefix + '--step'">STEP 2</h3>
            <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text8')" />
            <p :class="prefix + '--caution'">{{ $t('ServiceUseGuide.text9') }}</p>
            <div :class="prefix + '--img'">
              <img :src="'/img/img_guide02_n' + isPc + '.png'" alt="" class="img02" />
            </div>
          </div>

          <div :class="prefix + '--mt'">
            <h3 :class="prefix + '--step'">STEP 3</h3>
            <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text10')" />
            <p :class="prefix + '--caution'">{{ $t('ServiceUseGuide.text59') }}</p>
            <div :class="prefix + '--img'">
              <img :src="'/img/img_guide03_n' + isPc + '.png'" alt="" class="img03" />
            </div>
          </div>

        </div>
      </div>

      <!-- <div :class="prefix + '--invite'" v-if="!isPc">  -->
      <div :class="prefix + '--invite'">
        <h2 class="tooltip--tit AnalyzeHealthLocation--tit">{{ $t('ServiceUseGuide.text11') }}</h2>
        <p :class="prefix + '--txt'" v-html="$t('ServiceUseGuide.text12')" />
        <p :class="prefix + '--caution'">{{ $t('ServiceUseGuide.text60') }}</p>
        
        <div :class="prefix + '--shadowbox'">

          <div>
            <h3 :class="prefix + '--step'">STEP 1</h3>
            <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text13')" />
            <div :class="prefix + '--img'">
              <img :src="'/img/img_guide04_n' + isPc + '.png'" alt="" class="img04" />
            </div>
          </div>

          <div :class="prefix + '--mt'">
            <h3 :class="prefix + '--step'">STEP 2</h3>
            <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text14')" />
            <div :class="prefix + '--img'">
              <img :src="'/img/img_guide05_n' + isPc + '.png'" alt="" class="img05" />
            </div>
          </div>

        </div>
      </div>
    </div>

    <div :class="prefix + '--category'" v-else-if="group[1]" class="c1"> <!--231214 카테고리-->
      <div> <!--231214 가입-->
        <p :class="prefix + '--txt3'" v-html="$t('ServiceUseGuide.text15')" />
        <div :class="prefix + '--shadowbox'">

          <div>
            <h3 :class="prefix + '--step'">STEP 1</h3>
            <p :class="prefix + '--txt2'">{{ $t('ServiceUseGuide.text16') }}</p>
            <div :class="prefix + '--img mt i06'">
              <p :class="prefix + '--txt4'">{{ $t('ServiceUseGuide.text17') }}</p>
              <div :class="prefix + '--img'">
                <img :src="'/img/img_guide06_n' + isPc + '.png'" alt="" class="img06" />
              </div>
            </div>
            <div :class="prefix + '--img mt i07'">
              <p :class="prefix + '--txt4'">{{ $t('ServiceUseGuide.text18') }}</p>
              <div :class="prefix + '--img'">
                <img :src="'/img/img_guide07_n' + isPc + '.png'" alt="" class="img07" />
              </div>
            </div>
            <div :class="prefix + '--img mt i08'">
              <p :class="prefix + '--txt4'">{{ $t('ServiceUseGuide.text19') }}</p>
              <div :class="prefix + '--img'">
                <img :src="'/img/img_guide08_n' + isPc + '.png'" alt="" class="img08" />
              </div>
            </div>
          </div>

          <div :class="prefix + '--mt'">
            <h3 :class="prefix + '--step'">STEP 2</h3>
            <p :class="prefix + '--txt2'">{{ $t('ServiceUseGuide.text20') }}</p>
            <p :class="prefix + '--caution'">{{ $t('ServiceUseGuide.text21') }}</p>
            <div :class="prefix + '--img mt'">
              <div :class="prefix + '--img'">
                <img :src="'/img/img_guide09_n' + isPc + '.png'" alt="" class="img09" />
              </div>
            </div>
          </div>

          <div :class="prefix + '--mt'">
            <h3 :class="prefix + '--step'">STEP 3</h3>
            <p :class="prefix + '--txt2'">{{ $t('ServiceUseGuide.text22') }}</p>
            <div :class="prefix + '--img'">
              <img :src="'/img/img_guide10_n' + isPc + '.png'" alt="" class="img10" />
            </div>
          </div>

          <div :class="prefix + '--mt'">
            <h3 :class="prefix + '--step'">STEP 4</h3>
            <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text23')" />
            <p :class="prefix + '--caution'">{{ $t('ServiceUseGuide.text61') }}</p>
            <p :class="prefix + '--caution'">{{ $t('ServiceUseGuide.text62') }}</p>
            <div :class="prefix + '--img'">
              <img :src="'/img/img_guide11_n' + isPc + '.png'" alt="" class="img11" />
            </div>
            <p :class="prefix + '--txt2 mt4'" v-html="$t('ServiceUseGuide.text24')" />
            <div :class="prefix + '--img'">
              <img :src="'/img/img_guide12_n' + isPc + '.png'" alt="" class="img12" />
            </div>
            <p :class="prefix + '--txt2 mt4'" v-html="$t('ServiceUseGuide.text25')" />
            <div :class="prefix + '--img'">
              <img :src="'/img/img_guide13_n' + isPc + '.png'" alt="" class="img13" />
            </div>
            <p :class="prefix + '--txt2 mt4'" v-html="$t('ServiceUseGuide.text26')" />
            <div :class="prefix + '--img'">
              <img :src="'/img/img_guide14_n' + isPc + '.png'" alt="" class="img14" />
            </div>
          </div>

          <div :class="prefix + '--mt'">
            <h3 :class="prefix + '--step'">STEP 5</h3>
            <p :class="prefix + '--txt2'">{{ $t('ServiceUseGuide.text27') }}</p>
            <div :class="prefix + '--img mt'">
              <p :class="prefix + '--txt4'">{{ $t('ServiceUseGuide.text28') }}</p>
              <img :src="'/img/img_guide16_n' + isPc + '.png'" alt="" class="img16" />
            </div>
            <div :class="prefix + '--img mt'">
              <p :class="prefix + '--txt4'">{{ $t('ServiceUseGuide.text29') }}</p>
              <img :src="'/img/img_guide17_n' + isPc + '.png'" alt="" class="img17" />
            </div>
          </div>

          <div :class="prefix + '--mt'">
            <h3 :class="prefix + '--step'">STEP 6</h3>
            <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text30')" />
            <div :class="prefix + '--img'">
              <img :src="'/img/img_guide18_n' + isPc + '.png'" alt="" class="img18" />
            </div>
          </div>

        </div>
      </div>
    </div>

    <div :class="prefix + '--category'" v-else-if="group[2]" class="c2"> <!--231214 카테고리-->
      <div>
        <p :class="prefix + '--txt3'" v-html="$t('ServiceUseGuide.text31')" />
        <div :class="prefix + '--shadowbox'">

          <div>
            <h3 :class="prefix + '--step'" v-html="$t('ServiceUseGuide.text32')" />
            <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text33')" />
            <div :class="prefix + '--img mt i19'">
              <img :src="'/img/img_guide19_n' + isPc + '.png'" alt="" class="img19" />
            </div>
            <!--            <p :class="prefix + '&#45;&#45;caution right'">* 피트니스 지수가 없는경우 그래프의 형태가 달라질 수 있습니다.</p>-->
          </div>

          <div :class="prefix + '--mt'">
            <h3 :class="prefix + '--step'" v-html="$t('ServiceUseGuide.text34')" />
            <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text35')" />
            <div :class="prefix + '--img mt i20'">
              <img :src="'/img/img_guide20_n' + isPc + '.png'" alt="" class="img20" />
            </div>
          </div>

          <div :class="prefix + '--mt'">
            <h3 :class="prefix + '--step'" v-html="$t('ServiceUseGuide.text36')" />
            <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text37')" />
            <div :class="prefix + '--img mt i21'">
              <img :src="'/img/img_guide21_n' + isPc + '.png'" alt="" class="img21" />
            </div>
            <p :class="prefix + '--txt2 mt4'" v-html="$t('ServiceUseGuide.text38')" />
            <div :class="prefix + '--img mt'">
              <img :src="'/img/img_guide22_n' + isPc + '.png'" alt="" class="img22" />
            </div>
            <p :class="prefix + '--txt2 mt4'" v-html="$t('ServiceUseGuide.text39')" />
            <div :class="prefix + '--img mt'">
              <img :src="'/img/img_guide23_n' + isPc + '.png'" alt="" class="img23" />
            </div>
          </div>

          <div :class="prefix + '--mt'">
            <h3 :class="prefix + '--step'" v-html="$t('ServiceUseGuide.text40')" />
            <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text41')" />
            <p :class="prefix + '--txt4 mt'" v-html="$t('ServiceUseGuide.text42')" />
            <div :class="prefix + '--img'">
              <img :src="'/img/img_guide24_n' + isPc + '.png'" alt="" class="img24" />
            </div>
            <p :class="prefix + '--txt4 mt'" v-html="$t('ServiceUseGuide.text43')" />
            <p :class="prefix + '--caution'">{{ $t('ServiceUseGuide.text44') }}</p>
            <div :class="prefix + '--img'">
              <img :src="'/img/img_guide25_n' + isPc + '.png'" alt="" class="img25" />
            </div>
          </div>

          <div :class="prefix + '--mt'">
            <h3 :class="prefix + '--step'" v-html="$t('ServiceUseGuide.text45')" />
            <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text46')" />
            <div :class="prefix + '--img mt i26'">
              <img :src="'/img/img_guide26_n' + isPc + '.png'" alt="" class="img26" />
            </div>
            <p :class="prefix + '--txt2 mt4'" v-html="$t('ServiceUseGuide.text47')" />
            <div :class="prefix + '--img'">
              <img :src="'/img/img_guide27_n' + isPc + '.png'" alt="" class="img27" />
            </div>
            <p :class="prefix + '--txt2 mt4'" v-html="$t('ServiceUseGuide.text48')" />
            <div :class="prefix + '--img'">
              <img :src="'/img/img_guide28_n' + isPc + '.png'" alt="" class="img28" />
            </div>
          </div>

          <div :class="prefix + '--mt'">
            <h3 :class="prefix + '--step'">{{ $t('ServiceUseGuide.text49') }}</h3>
            <p :class="prefix + '--txt2'">{{ $t('ServiceUseGuide.text50') }}</p>
            <div :class="prefix + '--img'">
              <img :src="'/img/img_guide29_n' + isPc + '.png'" alt="" class="img29" />
            </div>
            <p :class="prefix + '--txt2 mt4'">{{ $t('ServiceUseGuide.text51') }}</p>
            <div :class="prefix + '--img'">
              <img :src="'/img/img_guide30_n' + isPc + '.png'" alt="" class="img30" />
            </div>
            <p :class="prefix + '--txt2 mt4'">{{ $t('ServiceUseGuide.text52') }}</p>
            <div :class="prefix + '--img'">
              <img :src="'/img/img_guide31_n' + isPc + '.png'" alt="" class="img31" />
            </div>
            <p :class="prefix + '--txt2 mt4'">{{ $t('ServiceUseGuide.text53') }}</p>
            <div :class="prefix + '--img'">
              <img :src="'/img/img_guide32_n' + isPc + '.png'" alt="" class="img32" />
            </div>
          </div>

          <div :class="prefix + '--mt'">
            <h3 :class="prefix + '--step'">{{ $t('ServiceUseGuide.text54') }}</h3>
            <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text55')" />
            <div :class="prefix + '--img'">
              <img :src="'/img/img_guide33_n' + isPc + '.png'" alt="" class="img33" />
            </div>
          </div>
        </div>

      </div>
    </div>

    <div :class="prefix + '--category'" v-else-if="group[3]" class="c3"> <!--231214 카테고리-->
      <div>
        <p :class="prefix + '--txt3'" v-html="$t('ServiceUseGuide.text56')" />

        <div :class="prefix + '--shadowbox'">
          <div>
            <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text57')" />
            <div :class="prefix + '--img mt'">
              <img :src="'/img/img_guide34_n' + isPc + '.png'" alt="" class="img34" />
            </div>
          </div>
          <div :class="prefix + '--mt'">
            <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text58')" />
            <div :class="prefix + '--img'">
              <img :src="'/img/img_guide35_n' + isPc + '.png'" alt="" class="img35" />
            </div>
          </div>
        </div>
      </div>

    </div>
    <BtnTop v-show="activeFab" style="position: fixed; bottom:4rem;" />
  </section>
</template>