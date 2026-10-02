<script>
import { funcIsPc } from '@/assets/js/common'
import BtnTop from '@/views/publishing/BtnTop.vue'
import { useI18n } from 'vue-i18n'
import TabRound from '@/components/TabRound.vue'

export default {
  name: 'ServiceUseGuide',
  components: { 
    BtnTop,
    TabRound,
  },
  setup() {
    const { t, locale } = useI18n()
    return { t, locale }
  },
  data () {
    return {
      prefix: 'ServiceUseGuide', /* 231214 클래스 접두어 */
      activeGuideTab: 0,
      activeMenuIndex: {
        0: 0,
        1: 0
      },
      menu1: [
        this.$t('ServiceUseGuide.text1'),
        this.$t('ServiceUseGuide.text2'),
        this.$t('ServiceUseGuide.text3'),
        this.$t('ServiceUseGuide.text4'),
      ],
      menu2: ['미션 선택 하기', '마이웰니스 랩 인증방법', '팀 만들기&팀원 초대', '팀원인증현황보기', '나의 활동 안내', '바로가기 만들기',],
      group: [],

      // 상단 메뉴 드래그 관련
      isDragging: false,
      dragTarget: null,
      startX: 0,
      startScroll: 0,
      scrollY: 0,
      activeFab: false,
      sensorWidth: false,
      resizeHandler: null
    }
  },
  methods: {

    // 상단 메뉴 드래그 관련
    dragStart (event) {
      this.isDragging = true
      this.dragTarget = event.currentTarget
      this.startX = event.clientX
      this.startScroll = this.dragTarget.scrollLeft
    },
    drag (event) {
      if (!this.isDragging || !this.dragTarget) return
      const x = event.clientX
      const delta = this.startX - x
      this.dragTarget.scrollLeft = this.startScroll + delta
    },
    dragEnd () {
      this.isDragging = false
      this.dragTarget = null
    },
    setGroupByTab (tabIndex, menuIndex) {
      const globalIndex = tabIndex === 0
        ? menuIndex
        : this.menu1.length + menuIndex
      const group = Array.from(
        { length: this.menu1.length + this.menu2.length },
        () => false
      )
      group[globalIndex] = true
      this.group = group
    },
    move (index, tabIndex) {
      this.activeMenuIndex[tabIndex] = index
      this.setGroupByTab(tabIndex, index)
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
  watch: {
    activeGuideTab (value) {
      const menuIndex = 0
      this.activeMenuIndex[value] = menuIndex
      this.$nextTick(() => {
        this.setGroupByTab(value, menuIndex)
        window.scrollTo(0, 0)
      })
    }
  },
  mounted () {
    this.group = Array.from({ length: this.menu1.length + this.menu2.length },() => false) /* 231214 메뉴 수 카테고리 빈 배열 생성 */

    // 231214 초기값 세팅
    this.setGroupByTab(0, 0)

    window.addEventListener('scroll', this.handleScroll)

    this.sensorWidth = funcIsPc()
    this.resizeHandler = () => {
      this.sensorWidth = funcIsPc()
    }
    window.addEventListener('resize', this.resizeHandler)
  },
  unmounted () {
    window.removeEventListener('scroll', this.handleScroll)
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler)
    }
  }
}

</script>

<template>
  <section :class="prefix">
    <div class="AnalyzeDetail--menu--cover">
      <TabRound v-model="activeGuideTab" :tabs="[{title:'가입 및 분석'}, {title:'미션 및 챌린지'}]">
        <template #tab-0>
          <div
            class="AnalyzeDetail--menu"
            @mousedown="dragStart"
            @mousemove="drag"
            @mouseup="dragEnd"
            @mouseleave="dragEnd"
          >
            <button
              v-for="(item, index) in menu1"
              :key="index"
              @click="move(index, 0)"
              type="button"
              class="AnalyzeDetail--menu-btn"
              :class="{ active: activeGuideTab === 0 && activeMenuIndex[0] === index }"
            >
              {{ item }}
            </button>
          </div>
        </template>
        <template #tab-1>
          <div
            class="AnalyzeDetail--menu"
            @mousedown="dragStart"
            @mousemove="drag"
            @mouseup="dragEnd"
            @mouseleave="dragEnd"
          >
            <button
              v-for="(item, index) in menu2"
              :key="index"
              @click="move(index, 1)"
              type="button"
              class="AnalyzeDetail--menu-btn"
              :class="{
                active: activeGuideTab === 1 && activeMenuIndex[1] === index,
                'mo-only': index === menu2.length - 1
              }"
            >
              {{ item }}
            </button>
          </div>
        </template>
      </TabRound>
    </div>
    <div :class="prefix + '--category'" v-if="group[0]" class="c0"> <!--231214 카테고리-->
      <div> <!--231214 가입-->
        <div :class="prefix + '--tit-box'">
          <h2 :class="prefix + '--tit'">{{ $t('ServiceUseGuide.text5') }}</h2>
          <p :class="prefix + '--txt'" v-html="$t('ServiceUseGuide.text6')" />
        </div>

        <div :class="prefix + '--step-wrap'">
          <h3 :class="prefix + '--step'">STEP<span>1</span></h3>
          <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text7')" />
        </div>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide01_n' + isPc + '.png'" alt="" class="img01" />
        </div>

        <div :class="prefix + '--step-wrap'">
          <h3 :class="prefix + '--step'">STEP<span>2</span></h3>
          <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text8')" />
          <p :class="prefix + '--caution'">{{ $t('ServiceUseGuide.text9') }}</p>
        </div>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide02_n' + isPc + '.png'" alt="" class="img02" />
        </div>

        <div :class="prefix + '--step-wrap'">
          <h3 :class="prefix + '--step'">STEP<span>3</span></h3>
          <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text10')" />
          <p :class="prefix + '--caution'">{{ $t('ServiceUseGuide.text59') }}</p>
        </div>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide03_n' + isPc + '.png'" alt="" class="img03" />
        </div>
      </div>

      <!-- <div :class="prefix + '--invite'" v-if="!isPc">  -->
      <div :class="prefix + '--invite'">
        <div :class="prefix + '--tit-box'">
          <h2 :class="prefix + '--tit'">{{ $t('ServiceUseGuide.text11') }}</h2>
          <p :class="prefix + '--txt'" v-html="$t('ServiceUseGuide.text12')" />
        </div>

        <div :class="prefix + '--step-wrap'">
          <h3 :class="prefix + '--step'">STEP<span>1</span></h3>
          <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text13')" />
        </div>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide04_n' + isPc + '.png'" alt="" class="img04" />
        </div>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide04-2_n' + isPc + '.png'" alt="" class="img04" />
        </div>

        <div :class="prefix + '--step-wrap'">
          <h3 :class="prefix + '--step'">STEP<span>2</span></h3>
          <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text14')" />
        </div>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide05_n' + isPc + '.png'" alt="" class="img05" />
        </div>

        <div :class="prefix + '--step-wrap'">
          <h3 :class="prefix + '--step'">STEP<span>3</span></h3>
          <p :class="prefix + '--txt2'">초대 받은 비회원 고객은 '지금 가입하기' 버튼을 눌러<br>마이웰니스 랩 가입 및 분석권을 구매하실 수 있습니다.</p>
          <p :class="prefix + '--txt2'">마이웰니스 랩 가입 및 분석권 구매 후 '분석 시작하기' 버튼을 눌러​<br class="pc-br">바로 마이웰니스 랩 분석을 진행하실 수 있도록 안내해 주세요.​​</p>
        </div>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide05-2_n' + isPc + '.png'" alt="" class="img05" />
        </div>
      </div>
    </div>

    <div :class="prefix + '--category'" v-else-if="group[1]" class="c1"> <!--231214 카테고리-->
      <div> <!--231214 가입-->
        <div :class="prefix + '--tit-box'">
          <p :class="prefix + '--txt'" v-html="$t('ServiceUseGuide.text15')" />
        </div>

        <div :class="prefix + '--step-wrap'">
          <h3 :class="prefix + '--step'">STEP<span>1</span></h3>
          <p :class="prefix + '--txt2'">{{ $t('ServiceUseGuide.text16') }}</p>
        </div>
        <div :class="prefix + '--img i06'">
          <p :class="prefix + '--txt4'">{{ $t('ServiceUseGuide.text17') }}</p>
          <img :src="'/img/img_guide06_n' + isPc + '.png'" alt="" class="img06" />
        </div>
        <div :class="prefix + '--img i07'">
          <p :class="prefix + '--txt4'">{{ $t('ServiceUseGuide.text18') }}</p>
          <img :src="'/img/img_guide07_n' + isPc + '.png'" alt="" class="img07" />
        </div>
        <div :class="prefix + '--img i08'">
          <p :class="prefix + '--txt4'">{{ $t('ServiceUseGuide.text19') }}</p>
          <img :src="'/img/img_guide08_n' + isPc + '.png'" alt="" class="img08" />
        </div>

        <div :class="prefix + '--step-wrap'">
          <h3 :class="prefix + '--step'">STEP<span>2</span></h3>
          <p :class="prefix + '--txt2'">{{ $t('ServiceUseGuide.text20') }}</p>
          <p :class="prefix + '--caution'">{{ $t('ServiceUseGuide.text21') }}</p>
        </div>
        <div :class="prefix + '--img mt'">
          <div :class="prefix + '--img'">
            <img :src="'/img/img_guide09_n' + isPc + '.png'" alt="" class="img09" />
          </div>
        </div>

        <div :class="prefix + '--step-wrap'">
          <h3 :class="prefix + '--step'">STEP<span>3</span></h3>
          <p :class="prefix + '--txt2'">{{ $t('ServiceUseGuide.text22') }}</p>
        </div>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide10_n' + isPc + '.png'" alt="" class="img10" />
        </div>

        <div :class="prefix + '--step-wrap'">
          <h3 :class="prefix + '--step'">STEP<span>4</span></h3>
          <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text23')" />
          <p :class="prefix + '--caution'">{{ $t('ServiceUseGuide.text61') }}</p>
          <p :class="prefix + '--caution'">{{ $t('ServiceUseGuide.text62') }}</p>
        </div>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide11_n' + isPc + '.png'" alt="" class="img11" />
        </div>
        <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text24')" />
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide12_n' + isPc + '.png'" alt="" class="img12" />
        </div>
        <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text25')" />
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide13_n' + isPc + '.png'" alt="" class="img13" />
        </div>
        <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text26')" />
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide14_n' + isPc + '.png'" alt="" class="img14" />
        </div>

        <div :class="prefix + '--step-wrap'">
          <h3 :class="prefix + '--step'">STEP<span>5</span></h3>
          <p :class="prefix + '--txt2'">{{ $t('ServiceUseGuide.text27') }}</p>
        </div>
        <div :class="prefix + '--img'">
          <p :class="prefix + '--txt4'">{{ $t('ServiceUseGuide.text28') }}</p>
          <img :src="'/img/img_guide16_n' + isPc + '.png'" alt="" class="img16" />
        </div>
        <div :class="prefix + '--img'">
          <p :class="prefix + '--txt4'">{{ $t('ServiceUseGuide.text29') }}</p>
          <img :src="'/img/img_guide17_n' + isPc + '.png'" alt="" class="img17" />
        </div>

        <div :class="prefix + '--step-wrap'">
          <h3 :class="prefix + '--step'">STEP<span>6</span></h3>
          <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text30')" />
        </div>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide18_n' + isPc + '.png'" alt="" class="img18" />
        </div>
      </div>
    </div>

    <div :class="prefix + '--category'" v-else-if="group[2]" class="c2"> <!--231214 카테고리-->
      <div>
        <div :class="prefix + '--tit-box'">
          <p :class="prefix + '--txt'" v-html="$t('ServiceUseGuide.text31')" />
        </div>

        <div :class="prefix + '--step-wrap'">
          <h3 :class="prefix + '--step'"><span>1</span>{{ $t('ServiceUseGuide.text32') }}</h3>
          <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text33')" />
        </div>
        <div :class="prefix + '--img i19'">
          <img :src="'/img/img_guide19_n' + isPc + '.png'" alt="" class="img19" />
        </div>
        <!--            <p :class="prefix + '&#45;&#45;caution right'">* 피트니스 지수가 없는경우 그래프의 형태가 달라질 수 있습니다.</p>-->

        <div :class="prefix + '--step-wrap'">
          <h3 :class="prefix + '--step'"><span>2</span>{{ $t('ServiceUseGuide.text34') }}</h3>
          <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text35')" />
        </div>
        <div :class="prefix + '--img i20'">
          <img :src="'/img/img_guide20_n' + isPc + '.png'" alt="" class="img20" />
        </div>

        <div :class="prefix + '--step-wrap'">
          <h3 :class="prefix + '--step'"><span>3</span>{{ $t('ServiceUseGuide.text36') }}</h3>
          <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text37')" />
        </div>
        <div :class="prefix + '--img i21'">
          <img :src="'/img/img_guide21_n' + isPc + '.png'" alt="" class="img21" />
        </div>
        <div :class="prefix + '--img i21'">
          <img :src="'/img/img_guide21-1_n' + isPc + '.png'" alt="" class="img21" />
        </div>
        <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text38')" />
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide22_n' + isPc + '.png'" alt="" class="img22" />
        </div>
        <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text39')" />
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide23_n' + isPc + '.png'" alt="" class="img23" />
        </div>

        <div :class="prefix + '--step-wrap'">
          <h3 :class="prefix + '--step'"><span>4</span>{{ $t('ServiceUseGuide.text40') }}</h3>
          <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text41')" />
        </div>
        <div :class="prefix + '--img'">
          <p :class="prefix + '--txt4'" v-html="$t('ServiceUseGuide.text42')" />
          <img :src="'/img/img_guide24_n' + isPc + '.png'" alt="" class="img24" />
        </div>
        <div :class="prefix + '--img'">
          <p :class="prefix + '--txt4'" v-html="$t('ServiceUseGuide.text43')" />
          <p :class="prefix + '--caution'" v-html="$t('ServiceUseGuide.text44')" />
          <img :src="'/img/img_guide25_n' + isPc + '.png'" alt="" class="img25" />
        </div>

        <div :class="prefix + '--step-wrap'">
          <h3 :class="prefix + '--step'"><span>5</span>{{ $t('ServiceUseGuide.text45') }}</h3>
          <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text46')" />
        </div>
        <div :class="prefix + '--img i26'">
          <img :src="'/img/img_guide26_n' + isPc + '.png'" alt="" class="img26" />
        </div>
        <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text47')" />
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide27_n' + isPc + '.png'" alt="" class="img27" />
        </div>
        <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text48')" />
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide28_n' + isPc + '.png'" alt="" class="img28" />
        </div>

        <div :class="prefix + '--step-wrap'">
          <h3 :class="prefix + '--step'"><span>6</span>{{ $t('ServiceUseGuide.text49') }}</h3>
          <p :class="prefix + '--txt2'">{{ $t('ServiceUseGuide.text50') }}</p>
        </div>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide29_n' + isPc + '.png'" alt="" class="img29" />
        </div>
        <p :class="prefix + '--txt2'">{{ $t('ServiceUseGuide.text51') }}</p>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide30_n' + isPc + '.png'" alt="" class="img30" />
        </div>
        <p :class="prefix + '--txt2'">{{ $t('ServiceUseGuide.text52') }}</p>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide31_n' + isPc + '.png'" alt="" class="img31" />
        </div>
        <p :class="prefix + '--txt2'">{{ $t('ServiceUseGuide.text53') }}</p>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide32_n' + isPc + '.png'" alt="" class="img32" />
        </div>

        <div :class="prefix + '--step-wrap'">
          <h3 :class="prefix + '--step'"><span>7</span>{{ $t('ServiceUseGuide.text54') }}</h3>
          <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text55')" />
        </div>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide33_n' + isPc + '.png'" alt="" class="img33" />
        </div>
      </div>
    </div>

    <div :class="prefix + '--category'" v-else-if="group[3]" class="c3"> <!--231214 카테고리-->
      <div>
        <div :class="prefix + '--tit-box'">
          <p :class="prefix + '--txt'" v-html="$t('ServiceUseGuide.text56')" />
        </div>

        <p :class="prefix + '--txt2'" v-html="$t('ServiceUseGuide.text57')" />
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide34_n' + isPc + '.png'" alt="" class="img34" />
        </div>
        <p :class="prefix + '--txt2'">
          분석권은 <a href="https://www.amway.co.kr/shop/nutrition/p/321226">암웨이 홈페이지(www.amway.co.kr)</a>에서 <br class="pc-br" />직접 구매 또는 프로모션을 통해 발급됩니다.
        </p>
        <p :class="prefix + '--txt5'">*본 분석권은 구매일로부터 3개월이 지난 달의 말일 23:00까지 사용 가능하며, <br class="mo-br" />유효기간은 연장되지 않습니다.<br />유효기간 내 사용하지 않은 분석권은 만료일  <br class="mo-br" />23:00 ~ 24:00 사이 <br class="pc-br" />구매 금액이 자동으로 <br class="mo-br" />전액 환불되며, PV 및 BV도 함께 차감됩니다.</p>
        <div :class="prefix + '--img'">
          <img :src="'/img/img_guide35_n' + isPc + '.png'" alt="" class="img35" />
        </div>
      </div>
    </div>

    <div :class="prefix + '--category'" v-if="group[4]" class="c4"> <!-- 미션 선택하기 -->
      <!-- 분석 결과가 없을 때 -->
      <div :class="prefix + '--tit-box'">
        <h2 :class="prefix + '--tit'">분석 결과가 <span>없을 때</span></h2>
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>1</span>기본 미션으로 시작하기 <em>버튼 선택</em></h3>
        <p :class="prefix + '--txt2'">홈 화면의 상단 기본 미션으로 시작하기 버튼을 선택하세요.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide36_n' + isPc + '.png'" alt="" class="img36" />
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>2</span>기본 미션으로<em>선택</em></h3>
        <p :class="prefix + '--txt2'">마이웰니스 랩 분석결과가 없더라도 영양, 운동, 수면의 기본 미션으로<br>생활습관성형을 시작할 수 있습니다.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide37_n' + isPc + '.png'" alt="" class="img37" />
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>3</span>전체 미션<em>리스트 확인</em></h3>
        <p :class="prefix + '--txt2'">또는 전체 미션 리스트의 영양, 운동, 수면, 생활습관 카테고리에서<br>관리하고 싶은 건강영역을 선택할 수 있습니다.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide38_n' + isPc + '.png'" alt="" class="img38" />
      </div>

      <!-- 분석 결과가 있을 때-->
      <div :class="prefix + '--tit-box'">
        <h2 :class="prefix + '--tit'">분석 결과가 <span>있을 때</span></h2>
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>1</span>나의 맞춤 미션 선택하기 <em>버튼 선택</em></h3>
        <p :class="prefix + '--txt2'">홈 화면 분석 결과 하단의 나의 맞춤 미션으로 시작하기 버튼을 선택하세요.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide39_n' + isPc + '.png'" alt="" class="img39" />
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>2</span>추천 미션<em>선택</em></h3>
        <p :class="prefix + '--txt2'">마이웰니스 랩 리포트의 나의 인체생리 네트워크 결과 기반 <br class="pc-br">주의, 관리 영역을 한눈에 보고 맞춤 미션을 확인할 수 있습니다.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide40_n' + isPc + '.png'" alt="" class="img40" />
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>3</span>전체 미션<em>리스트 확인</em></h3>
        <p :class="prefix + '--txt2'">또는 전체 미션 리스트의 영양, 운동, 수면, 생활습관 카테고리에서<br>관리하고 싶은 건강영역을 선택할 수 있습니다.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide41_n' + isPc + '.png'" alt="" class="img41" />
      </div>

      <!-- 챌린지 참여할 때-->
      <div :class="prefix + '--tit-box'">
        <h2 :class="prefix + '--tit'">챌린지 <span>참여할 때</span></h2>
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>1</span>챌린지 팀 초대 수락 <em>버튼 선택</em></h3>
        <p :class="prefix + '--txt2'">챌린지 팀 초대에 수락하고 챌린지에 참여하면</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide42_n' + isPc + '.png'" alt="" class="img42" />
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>2</span>참여하기<em>버튼 선택</em></h3>
        <p :class="prefix + '--txt2'">챌린지 지정미션으로 미션이 변경됩니다.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide43_n' + isPc + '.png'" alt="" class="img43" />
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>3</span>미션 변경 불가 안내</h3>
        <p :class="prefix + '--txt2'">챌린지 기간 중에는 미션을 변경할 수 없습니다.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide44_n' + isPc + '.png'" alt="" class="img44" />
      </div>
    </div>

    <div :class="prefix + '--category'" v-if="group[5]" class="c5"> <!-- 마이웰니스 랩 인증방법 -->
      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>1</span>미션 인증하기 <em>버튼 선택</em></h3>
        <p :class="prefix + '--txt2'">마이웰니스 랩 홈 화면 내 미션 인증하기 영역을 선택 하세요.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide45_n' + isPc + '.png'" alt="" class="img45" />
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>2</span><em>인증 사진 업로드</em></h3>
        <p :class="prefix + '--txt2'">사진을 촬영하거나 모바일 또는 PC에 저장되어 있는<br>모든 사진을 불러오기 할 수 있습니다.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide46_n' + isPc + '.png'" alt="" class="img46" />
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>3</span><em>인증 내역 확인 및 공유</em></h3>
        <p :class="prefix + '--txt2'">나의 인증 내역을 이미지로 저장하거나, 카카오톡으로 공유해보세요.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide47_n' + isPc + '.png'" alt="" class="img47" />
      </div>
    </div>

    <div :class="prefix + '--category'" v-if="group[6]" class="c6"> <!-- 팀 만들기&팀원 초대 -->
      <!-- 챌린지 팀 만들기 -->
      <div :class="prefix + '--tit-box'">
        <h2 :class="prefix + '--tit'"><span>챌린지 팀 </span>만들기</h2>
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>1</span>팀 만들기<em>버튼 선택</em></h3>
        <p :class="prefix + '--txt2'">나의 팀 목록 오른쪽 하단의 <br class="mo-br">팀 만들기 버튼을 선택하세요.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide48_n' + isPc + '.png'" alt="" class="img48" />
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>2</span>챌린지 팀 만들기</h3>
        <p :class="prefix + '--txt2'">ABO만 팀장이 되어 <br class="mo-br">챌린지 팀을 만들 수 있습니다.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide49_n' + isPc + '.png'" alt="" class="img49" />
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>3</span><em>팀 만들기 완료</em></h3>
        <p :class="prefix + '--txt2'">팀 만들기를 완료하시면 <br class="mo-br">나의 팀 목록화면으로 이동되며,<br>생성된 챌린지팀 정보를 확인할 수 있습니다.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide50_n' + isPc + '.png'" alt="" class="img50" />
      </div>

      <!-- 상시 팀 만들기 -->
      <div :class="prefix + '--tit-box'">
        <h2 :class="prefix + '--tit'"><span>상시 팀 </span>만들기</h2>
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>1</span>팀 만들기<em>버튼 선택</em></h3>
        <p :class="prefix + '--txt2'">나의 팀 목록 오른쪽 하단의 <br class="mo-br">팀 만들기 버튼을 선택하세요.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide51_n' + isPc + '.png'" alt="" class="img51" />
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>2</span>상시 팀 만들기</h3>
        <p :class="prefix + '--txt2'">ABO/Member/일반회원 모두 <br class="mo-br">상시팀을 만들 수 있습니다.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide52_n' + isPc + '.png'" alt="" class="img52" />
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>3</span><em>팀 만들기 완료</em></h3>
        <p :class="prefix + '--txt2'">팀 만들기를 완료하시면 <br class="mo-br">나의 팀 목록화면으로 이동되며,<br>생성된 상시팀 정보를 확인할 수 있습니다.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide53_n' + isPc + '.png'" alt="" class="img53" />
      </div>

      <!-- 팀원 초대하기 -->
      <div :class="prefix + '--tit-box'">
        <h2 :class="prefix + '--tit'">팀원 <span>초대하기</span></h2>
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>1</span>팀원 초대하기<em>버튼 선택</em></h3>
        <p :class="prefix + '--txt2'">팀 정보 오른쪽 상단의 <br class="mo-br">팀원 초대하기 버튼을 선택하세요.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide54_n' + isPc + '.png'" alt="" class="img54" />
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>2</span><em>팀 초대하기 팝업</em></h3>
        <p :class="prefix + '--txt2'">카카오톡으로 초대하기 또는 <br class="mo-br">초대링크 복사하기를 통해 초대 링크를 전송하거나<br>이전 팀의 팀원을 초대할 수 있습니다.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide55_n' + isPc + '.png'" alt="" class="img55" />
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>3</span><em>이전 팀 팀원 초대</em></h3>
        <p :class="prefix + '--txt2'">이전 팀의 팀장이었을 경우, <br class="mo-br">이전 팀원 모두에게 <br class="mo-br">초대 메시지를 전송할 수 있습니다.</p>
        <p :class="prefix + '--txt5'">*초대 메시지는 팀원을 선택할 수 없으며 <br class="mo-br">이전 팀원 모두에게 일괄 발송됩니다</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide56_n' + isPc + '.png'" alt="" class="img56" />
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>4</span><em>초대 수락 및 가입 여부 확인</em></h3>
        <p :class="prefix + '--txt2'">팀장은 ‘팀 정보’ 화면 하단에서 <br class="mo-br">‘초대한 팀원 보기’ 버튼을 통해<br>팀원 가입 여부를 확인할 수 있으며,</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide57_n' + isPc + '.png'" alt="" class="img57" />
      </div>
      <p :class="prefix + '--txt2'">초대 받은 팀원의 경우, ‘나의 팀’ 메뉴 내 <br class="mo-br">‘팀 초대’ 탭에서 <br class="pc-br">가입/거절이 가능합니다.</p>
      <p :class="prefix + '--txt5'">*카카오톡으로 초대하기와 <br class="mo-br">초대링크 복사하기로 초대한 경우 <br class="mo-br">초대받은 팀 목록에 표시되지 않습니다.</p>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide58_n' + isPc + '.png'" alt="" class="img58" />
      </div>
    </div>

    <div :class="prefix + '--category'" v-if="group[7]" class="c7"> <!-- 팀원인증현황보기 -->
      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>1</span><em>효율적인 팀원 관리</em></h3>
        <p :class="prefix + '--txt2'">팀원 리스트를 필터로 분류해서 보고,<br>즐겨찾기로 자주 보는 팀원을 <br class="mo-br">더 쉽게 확인합니다.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide59_n' + isPc + '.png'" alt="" class="img59" />
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>2</span><em>리스트 뷰 보기</em></h3>
        <p :class="prefix + '--txt2'">팀원 인증 현황 및 <br class="mo-br">진행 미션, 제품 구매 여부를 <br class="mo-br">간략하게 확인하실 수 있습니다.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide60_n' + isPc + '.png'" alt="" class="img60" />
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>3</span><em>팀원 상세 보기</em></h3>
        <p :class="prefix + '--txt2'">팀원 간 상세 정보 확인이 가능하며, <br class="mo-br">팀장의 경우 팀원의 추가정보<br>(이름/진행미션/제품 구매 여부)를 <br class="mo-br">확인하실 수 있습니다.</p>
        <p :class="prefix + '--txt5'">*제품 구매 여부는 챌린지 팀에만 노출됩니다.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide61_n' + isPc + '.png'" alt="" class="img61" />
      </div>
    </div>

    <div :class="prefix + '--category'" v-if="group[8]" class="c8"> <!-- 나의 활동 안내 -->
      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>1</span><em>나의 미션활동 기록 확인</em></h3>
        <p :class="prefix + '--txt2'">홈 화면 우측 상단 또는 <br class="mo-br">마이 메뉴의 [나의 미션 활동]에서<br>마이웰니스 랩 핀과 나의 현재 미션 현황, <br class="mo-br">배지 획득 현황을 확인할 수 있습니다.</p>
        <p :class="prefix + '--txt5'">*마이웰니스 랩 핀, 미션 현황, 배지는 회계연도(매년 9월 시작) 기반으로 누적 횟수가 인정됩니다.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide62_n' + isPc + '.png'" alt="" class="img62" />
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>2</span><em>마이웰니스 랩 핀</em></h3>
        <p :class="prefix + '--txt2'">인증 횟수가 쌓일수록 핀이 올라갑니다.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide63_n' + isPc + '.png'" alt="" class="img63" />
      </div>

      <div :class="prefix + '--step-wrap'">
        <h3 :class="prefix + '--step'"><span>3</span><em>배지 활동</em></h3>
        <p :class="prefix + '--txt2'">연속 인증부터 팀장 활동, 이벤트 배지까지<br>다양한 참여를 통해 배지를 획득할 수 있으며, <br class="mo-br">원하는 배지를 대표로 설정 가능합니다.</p>
      </div>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide64_n' + isPc + '.png'" alt="" class="img64" />
      </div>
    </div>

    <div :class="prefix + '--category'" v-if="group[9]" class="c9"> <!-- 바로가기 만들기 -->
      <!-- 삼성(갤럭시)폰에서 -->
      <div :class="prefix + '--tit-box'">
        <p :class="prefix + '--tit'"><span>삼성(갤럭시)폰</span>에서</p>
      </div>

      <p :class="prefix + '--txt2'">삼성(갤럭시)폰의 경우, 기본 브라우저에서 <br>아래와 같이 홈 화면에 바로가기를 추가하실 수 있습니다.</p>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide65_n.png'" alt="" class="img65" />
      </div>

      <!-- 아이폰에서 -->
      <div :class="prefix + '--tit-box'">
        <p :class="prefix + '--tit'"><span>아이폰</span>에서</p>
      </div>

      <p :class="prefix + '--txt2'">아이폰의 경우, 기본 브라우저(사파리)에서 <br>아래와 같이 홈 화면에 바로가기를 추가하실 수 있습니다.</p>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide66_n.png'" alt="" class="img66" />
      </div>

      <!-- 크롬(Chrome)앱에서 -->
      <div :class="prefix + '--tit-box'">
        <p :class="prefix + '--tit'"><span>크롬(Chrome)</span>앱에서</p>
      </div>

      <p :class="prefix + '--txt2'">안드로이드 폰의 경우, 크롬(Chrome) 앱 사용 시 <br>아래와 같이 홈 화면에 바로가기를 추가하실 수 있습니다.</p>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide67_n.png'" alt="" class="img67" />
      </div>

      <!-- 네이버앱에서 -->
      <div :class="prefix + '--tit-box'">
        <p :class="prefix + '--tit'"><span>네이버</span>앱에서</p>
      </div>

      <p :class="prefix + '--txt2'">안드로이드 폰의 경우, 네이버 앱 사용 시 <br>아래와 같이 홈 화면에 바로가기를 추가하실 수 있습니다.</p>
      <p :class="prefix + '--txt5'">*아이폰의 경우 네이버 앱에서 홈 화면에 바로가기 기능을 지원하지 않습니다.</p>
      <div :class="prefix + '--img'">
        <img :src="'/img/img_guide68_n.png'" alt="" class="img68" />
      </div>
    </div>

    <BtnTop v-show="activeFab" style="position: fixed;" />
  </section>
</template>