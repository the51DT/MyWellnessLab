<template>
  <div class="graph-wrapper" ref="wrapper">
    <div class="chart-wrap" ref="chartwrap">
      <div class="echart" ref="chart" id="ehChart" />
    </div>

    <div class="zoom-info" v-if="isZoomMode && recommendData">
      <div>
        {{ recommendData.MHN_CL[zoomIndex].Cluster_NAME }}
      </div>
      <img src="/img/pdf/res/icons/popup_close.png" @click="resetZoom()" />
    </div>

    <div class="cluster-list" v-if="recommendData && !isZoomMode">
      <div class="left-list">
        <!-- MHN_CL이름대로면 산소운반/혈액생성 -->
        <template v-for="(list, i) in clusterNameLeft" :key="i">
          <span
            :class="getClusterColor(list.index)"
            class="stretch-text">{{ list.name }}</span>
        </template>
      </div>
      <div class="right-list">
        <template v-for="(list, i) in clusterNameRight" :key="i">
          <span
            :class="getClusterColor(list.index)"
            class="stretch-text">{{ list.name }}</span>
        </template>
      </div>
      <div class="right-list" />
    </div>

    <div class="loading" v-if="!loading">
      <div class="loading-box">
        <p>{{ $t('GraphCartDocument.text1') }}</p>
        <div class="loading-icon">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

import { popup } from '@/assets/js/chart/popup'
import { convexHull } from '@/assets/js/chart/hull'
import {
  useClusterData
} from '@/assets/js/chart/graphData'
import { isMobile, centroid, getVector } from '@/assets/js/chart/util'
import { clustering } from '@/assets/js/chart/clustering'

// echarts.use([GridComponent]);

export default {
  props: {
    recommendDataProps: null,
    userInfo: null,
    pdfScale: Number
  },
  data () {
    const { cluster_data, cluster_name_left, cluster_name_right } = useClusterData()
    return {
      popupList: popup,
      currentPop: null,
      echart: null,
      timeoutResize: null,
      scale: 1,
      scaleMax: 3,
      scaleMin: 1,
      dataList: null,
      linkList: null,
      x: 0,
      y: 0,
      recommendData: null,
      result: null,
      selectedProductList: [],
      testIndex: 24,
      testMode: false,
      clusterData :cluster_data ,
      loading: true,
      isZoomMode: false,
      zoomIndex: 1,
      showProductList: false,

      dangerCount: 0,
      warnCount: 0,
      interestCount: 0,

      // for test
      testCluster: false,
      testClusterIndex: 1,

      timer: null,
      delay: 1,
      renderer: 'svg',
      resolution: 1,
      init: 0,

      clusterNameLeft : cluster_name_left,
      clusterNameRight : cluster_name_right
    }
  },
  mounted () {
    this.exec()
  },
  methods: {
    /**
     * 마운트 시 실행
     */
    exec () {
      this.init = 0
      this.selectedProductList = []

      const result = this.recommendDataProps
      this.recommendData = result.resultDto

      const convertedLinks = []

      // 연결정보 리스트 데이터 설정
      result.resultDto.MHN_EL.forEach((element) => {
        convertedLinks.push({
          ...element
        })
      })
      this.dataList = result.resultDto.MHN_NL
      this.linkList = convertedLinks
      this.dataList.forEach((element, index) => {
        element.index = index
      })
      this.linkList.forEach((element, index) => {
        element.index = index
      })

      const echart = echarts.init(this.$refs.chart, null, {
        renderer: this.renderer
      })

      this.updateChart()

      window.onresize = echart.resize

      const updateFunc = this.updatePos

      updateFunc(0, 0)
      echart.on('graphroam', function (params) {
        updateFunc(params.dx, params.dy)
      })
      this.resizeChart()

      this.loading = true

      this.recommendData.MHN_CL.forEach((element, index) => {
        element.nodes = this.recommendData.MHN_NL.filter(
          (item) => item.clusterInfo[element.Cluster_ID.toUpperCase()] === 1
        )

        element.nodes.forEach((elem) => {
          elem.symbol = this.clusterData[index].symbol
          if (elem.Node_Category.includes('Core')) {
            elem.symbol = 'circle'
          }
        })
      })
      this.recommendData.MHN_CL = this.recommendData.MHN_CL.sort((a, b) => {
        return (
          Number(a.Cluster_ID.replace('CL_', '')) -
          Number(b.Cluster_ID.replace('CL_', ''))
        )
      })

      this.countClusterState()
    },
    /**
     * cluster의 상태를 계산
     */
    countClusterState () {
      this.dangerCount = 0
      this.warnCount = 0
      this.interestCount = 0
      this.recommendData.MHN_CL.forEach((element, index) => {
        let includeSex = true

        this.clusterNameLeft.forEach((element2) => {
          if (element2.index === index) {
            if (element2.sex && element2.sex !== this.userInfo.sex) {
              includeSex = false
            }
          }
        })
        this.clusterNameRight.forEach((element2) => {
          if (element2.index === index) {
            if (element2.sex && element2.sex !== this.userInfo.sex) {
              includeSex = false
            }
          }
        })

        // 성별에따라 카운트 해야하는 목록과 패스해야 하는 목록이 존재
        if (includeSex) {
          switch (element.Cluster_State) {
            case 0:
            case 1:
              break
            case 2:
              this.warnCount++
              break
            case 3:
              this.dangerCount++
              break
            case 4:
              this.interestCount++
              break
          }

          // 관심이랑 다른 상태 겹쳤을때
          if (element.Cluster_State > 40) {
            switch (element.Cluster_State - 40) {
              case 0:
              case 1:
                break
              case 2:
                this.warnCount++
                break
              case 3:
                this.dangerCount++
                break
              case 4:
                // this.interestCount++;
                break
            }
            this.interestCount++
          }
        }
      })
    },
    /**
     * 그래프의 위치를 업데이트
     * @param {*} dx
     * @param {*} dy
     */
    updatePos (dx, dy) {
      this.x += dx
      this.y += dy
    },
    /**
     * 그래프의 위치를 조정
     * @param {*} x
     * @param {*} y
     */
    updatePosDirect (x, y) {
      this.x += x
      this.y += y

      this.$refs.chartbg.style =
        'top:' +
        (this.y - 2) +
        'px;' +
        'left:' +
        this.x +
        'px;transform: scale(' +
        this.scale * 0.83 +
        ');'
    },
    /**
     * 차트 업데이트
     */
    async updateChart () {
      const redList = []

      // 차트에 사용하는 데이터 준비
      await this.prepareData()

      // 테스트코드
      if (this.testMode === true) {
        this.recommendData.MHN_CL[this.testIndex].nodes.forEach((element) => {
          redList.push(element.index)
        })
      }
      this.recommendData.MHN_NL.forEach((elem, index) => {
        if (this.testMode === false) {
          if (elem.Node_State === 3) {
            redList.push(index)
          }
        }
      })

      // 차트 옵션값 설정
      const option = this.getOption(this.scale)

      const echart = echarts.init(this.$refs.chart, null, {
        renderer: this.renderer
      })

      this.echart = option
      // 네트워크 그래프 차트
      echart.setOption(option)
    },
    /**
     * 화면 해상도 변경시 처리
     */
    resizeChart () {
      if (!this.$refs.chart) return
      this.resizeProcess()
    },
    /**
     * 차트 리사이즈
     */
    resizeProcess () {
      this.prepareData()

      const target = this.$refs.wrapper

      const option = this.getOption(this.scale)

      const echart = echarts.init(this.$refs.chart, null, {
        renderer: this.renderer
      })

      this.echart = option
      echart.setOption(option, { notMerge: true })
      const canvas = echart.getDom().children[0].children[0]

      const width =
        (target.clientWidth - (180 * this.getScale()) / 1.5) * this.resolution

      const headerHeight = 55 + 55

      const height = this.getHeight() * this.resolution
      echart.resize({
        width,
        height
      })

      const chartWrap = this.$refs.chartwrap

      let scale = 1 / this.resolution // height / window.innerHeight;

      const chartWidth =
        (target.clientWidth - (180 * this.getScale()) / 1.5) * this.resolution // this.$refs.chart.offsetWidth;

      let margin = (target.clientWidth - chartWidth * scale) / 2
      let top = 0 // headerHeight; //10 / scale + headerHeight * scale; //73.5 * scale; //25 / scale;

      let left = 0

      if (this.isZoomMode) {
        left = this.clusterData[this.zoomIndex].zoomLeft * this.getRateX()

        scale = scale * this.clusterData[this.zoomIndex].zoomScale
        top =
          (25 / scale +
            headerHeight * scale +
            this.clusterData[this.zoomIndex].zoomTop * scale) *
          this.getRateY()
        margin = (target.clientWidth - chartWidth * scale) / 2
      }

      let marginLeft = (margin * 1.7) / scale
      if (this.checkMobile()) {
        marginLeft = (margin * 1) / scale
      }

      chartWrap.style =
        'top:' +
        top +
        'px;left:' +
        left +
        'px;margin: 0 ' +
        margin +
        'px;margin-left:' +
        marginLeft +
        'px;transform: scale(' +
        scale +
        ');transform-origin:top left;'

      this.init++
    },
    /**
     * 모바일 여부 확인
     * @return {boolean}
     */
    checkMobile () {
      isMobile()
      // return isMobile();
      return false
    },
    /**
     * 차트 가로 길이 계산
     */
    getRateX () {
      const targetWidth = this.$refs.wrapper.clientWidth
      const baseWidth = 175

      const rateX = (targetWidth - 180) / baseWidth
      return rateX * this.resolution
    },
    /**
     * 차트 높이 계산
     */
    getHeight () {
      const headerHeight = 0
      const recommendListHeight = 0 // 85;
      const agileHeight = 0
      const windowHeight = document.documentElement.offsetHeight // window.innerHeight
      let height =
        windowHeight - recommendListHeight - headerHeight - agileHeight
      const target = this.$refs.wrapper

      height = target.clientHeight * this.resolution
      return height
    },
    /**
     * 차트 세로 길이 계산
     */
    getRateY () {
      const baseHeight = 732

      const rateY = this.getHeight() / baseHeight
      return rateY * this.resolution * 1.3
    },
    /**
     * 차트에서 사용할 데이터 속성 저장
     */
    async prepareData () {
      const rateX = this.getRateX()
      const rateY = this.getRateY()

      this.recommendData.MHN_NCL = this.recommendData.MHN_NCL.filter(
        (val, idx) => {
          return (
            this.recommendData.MHN_NCL.findIndex(
              (item) => item.Node_ID === val.Node_ID
            ) === idx
          ) // 값이 처음나오는 배열 인덱스와 현재 인덱스가 같으면 포함
        }
      )

      this.recommendData.MHN_NL = this.recommendData.MHN_NL.filter(
        (val, idx) => {
          return (
            this.recommendData.MHN_NL.findIndex(
              (item) => item.Node_ID === val.Node_ID
            ) === idx
          ) // 값이 처음나오는 배열 인덱스와 현재 인덱스가 같으면 포함
        }
      )
      this.recommendData.MHN_NL.forEach((element) => {
        this.recommendData.MHN_NCL.forEach((element2, index) => {
          if (element.Node_ID === element2.Node_ID) {
            // 노드정보에 클러스터 정보 매칭
            element.clusterInfo = element2
            element.clusterIndex = index
          }
        })
      })
      this.recommendData.MHN_NL.forEach((elem, index) => {
        elem.name = elem.Node_Name
        elem.id = elem.Node_ID
        elem.x = (elem.X * rateX) / rateY
        elem.y = elem.Y
        elem.index = index

        switch (elem.Node_State) {
          case 0:
          case 1:
            // 정상 노드 색상
            elem.itemStyle = {
              animation: true,

              opacity: 0.3,
              color: '#717171'
            }

            break
          case 2:
            // 주의 노드 색상
            elem.itemStyle = {
              animation: true,

              opacity: 1,
              color: '#FDC840'
            }
            break
          case 3:
            // 위험 노드 색상
            elem.itemStyle = {
              animation: true,

              opacity: 1,
              color: '#C2373F'
            }

            break
          case 4:
            break
        }
      })

      const convertedLinks = []

      this.recommendData.MHN_EL.forEach((elem) => {
        // 연결정보 데이터 세팅
        elem.name = elem.Edge_Name
        elem.id = elem.Edge_ID
        elem.source = elem.S_Node_ID
        elem.target = elem.E_Node_ID

        // 연결선 설정
        convertedLinks.push({
          ...elem,
          selected: {
            itemStyle: {
              opacity: 1,
              borderWidth: 5,
              color: 'red'
            }
          },
          emphasis: {
            lineStyle: {
              color: 'red',
              width: 10
            }
          },
          lineStyle: {
            color: '#000000',
            // opacity: 0.4,
            // opacity: 0.0,
            width: 0.5
          }
        })
      })

      this.linkList = convertedLinks

      this.recommendData.MHN_CL = this.recommendData.MHN_CL.filter(
        (val, idx) => {
          return (
            this.recommendData.MHN_CL.findIndex(
              (item) => item.Cluster_ID === val.Cluster_ID
            ) === idx
          ) // 값이 처음나오는 배열 인덱스와 현재 인덱스가 같으면 포함
        }
      )

      this.recommendData.MHN_CL.forEach((element, index) => {
        element.nodes = this.recommendData.MHN_NL.filter(
          (item) => item.clusterInfo[element.Cluster_ID.toUpperCase()] === 1
        )

        const textOption = {
          textBorderWidth: 0,
          textBorderColor: 'transparent',
          // distance: 0,
          // fontWeight: "lighter",
          // fontWeight: 300,
          fontFamily: 'Pretendard'
        }

        element.nodes.forEach((elem) => {
          elem.symbol = this.clusterData[index].symbol
          if (elem.Node_Category.includes('Core')) {
            elem.symbol = 'circle'
            elem.symbolSize = 18
          }
          elem.label = { show: false }

          const fontLarge = ((14 * this.getScale()) / 2) * this.resolution
          const fontSmall = ((10 * this.getScale()) / 2) * this.resolution

          // 노드명 폰트 사이즈 모바일/PC에 따라 조절. 특정 항목만 보이도록 설정
          if (
            elem.Node_Category.includes('Core') ||
            elem.Node_Category.includes('Core-life')
          ) {
            if (element.Cluster_State > 1) {
              if (this.checkMobile() === false) {
                elem.label = {
                  show: true,
                  fontSize: fontLarge,
                  ...textOption,
                  fontFamily: 'Pretendard'
                }
              } else {
                elem.label = {
                  show: true,
                  fontSize: fontSmall,
                  ...textOption,
                  fontFamily: 'Pretendard'
                }
              }
            } else {
              if (this.checkMobile() === false) {
                elem.label = {
                  show: true,
                  fontSize: fontLarge,
                  ...textOption,
                  fontFamily: 'Pretendard'
                }
              } else {
                elem.label = {
                  show: true,
                  fontSize: fontSmall,
                  ...textOption,
                  fontFamily: 'Pretendard'
                }
              }
            }
          } else {
            if (this.checkMobile() === false) {
              elem.label = {
                show: true,
                fontSize: fontSmall,
                ...textOption,
                fontFamily: 'Pretendard'
              }
            }
          }

          // 테스트 코드
          if (
            this.testMode &&
            this.testIndex === parseInt(element.Cluster_ID.replace('CL_0', ''))
          ) {
            elem.symbolSize = 60
            // elem.symbol = "circle";
            elem.label = {
              show: true,
              fontSize: 50,
              fontFamily: 'Pretendard'
            }

            elem.itemStyle = {
              color: 'orange'
            }
          } else {
            //
          }
        })
      })

      this.recommendData.MHN_CL = this.recommendData.MHN_CL.sort((a, b) => {
        return (
          Number(a.Cluster_ID.replace('CL_', '')) -
          Number(b.Cluster_ID.replace('CL_', ''))
        )
      })
    },
    /**
     * 클러스터별 상태값
     * @param {*} clusterIndex
     */
    getClusterStatus (clusterIndex) {
      if (this.testCluster) return 1
      if (this.recommendData) {
        const state = this.recommendData.MHN_CL[clusterIndex].Cluster_State
        if (state >= 40) {
          // 40이상이면 관심이면서 주의/위험
          return state - 40
        }
        return state
      }
      return 0
    },
    /**
     * 클러스터 상태값에 따른 색상값
     * @param {*} clusterIndex
     */
    getClusterColor (clusterIndex) {
      const status = this.getClusterStatus(clusterIndex)

      switch (status) {
        case 0: case 1:
          return 'safe'
        case 2: case 42:
          return 'warn'
        case 3: case 43:
          return 'danger'
        case 4:
          return 'interest'
        default:
          break
      }
    },
    /**
     * 차트 옵션 설정
     * @param {*} zoom
     */
    getOption (zoom = 1) {
      // zoom = 1.1;
      const targetNames = ['아스파테이트 아미노 전이효소', '수면-각성 프로파일', '혈관 내피세포 활성', '면역력 자가진단', '혈청 크레아티닌', '수분 섭취량', '혈당 조절 관련 호르몬/단백질', '노화억제 분석지수', '콜레스테롤 합성', '콜레스테롤 배설', '에너지 대사 조절', '간담도성 손상지표', '알라닌 아미노 전이효소', '혈청 크레아티닌', '근육 단백질 합성 증가']
      const convexHullData = this.getClusterData()
      const option = {
        tooltip: {},
        // dataZoom: {
        //   start: 80,
        //   type: "inside",
        // },
        legend: [],
        xAxis: { show: false },
        yAxis: { show: false },
        animation: false,
        graphic: {
          elements: convexHullData // 네트워크 영역 데이터. convexHull 알고리즘 사용
        },
        series: [
          {
            itemStyle: {
              // opacity: 0.75,
              color: '#59C370'
            },
            silent: true,

            type: 'graph',
            // layout: "none",
            data: this.recommendData.MHN_NL.map(e => {
              if (targetNames.includes(e.Node_Name)) {
                let targetIndex = e.Node_Name.indexOf(' ')
                const splittedString = e.Node_Name.split(' ')

                if (splittedString.length > 2 && splittedString[0].length < 5) {
                  targetIndex = e.Node_Name.indexOf(' ', targetIndex + 1)
                }

                const newString = e.Node_Name.substring(0, targetIndex + 1) + '\n' + e.Node_Name.substring(targetIndex + 1)
                e.name = newString
              }
              return e
            }), // 노드 리스트 세팅
            links: this.linkList, // 연결 정보 데이터 세팅

            label: {
              show: true,
              position: 'right',
              formatter: '{b}',
              opacity: 1,
              fontFamily: 'Pretendard'
              // fontSize: 10,
            },
            labelLayout: {
              hideOverlap: false
            },
            zoom,
            scaleLimit: {
              min: this.scaleMin,
              max: this.scaleMax
            },
            blur: {
              itemStyle: {
                opacity: 1
              },
              label: {
                opacity: 1
              }
            },
            lineStyle: {
              color: 'source',
              opacity: 0.25
              // curveness: 0.3,
            },
            select: {
              animation: false,
              lineStyle: {
                // color: "#fc4a6a",
                color: 'red',
                opacity: 1,
                width: 2
              },
              itemStyle: {
                opacity: 1,
                color: '#fc4a6a'
              },
              label: {
                show: true,
                opacity: 1,
                fontWeight: 'bold'
              }
            },
            selectedMode: 'multiple',

            emphasis: {
              animation: false,

              disabled: false,
              focus: 'adjacency',
              // scale: true,
              itemStyle: {
                opacity: 0.6,
                z: 100,
                color: '#C2373F'
              },
              lineStyle: {
                width: 10,
                color: '#ff0000',
                opacity: 1
              },

              label: {
                position: ['0%', '120%'], // "right",
                // offset: [0, 15],
                align: 'center',
                show: true,
                opacity: 1,
                // fontSize: this.isZoomMode ? 6 : 10,
                fontWeight: 'bold',
                fontFamily: 'Pretendard'
              }
            }
          }
        ]
      }

      return option
    },
    /**
     * ConvexHull알고리즘 클러스터 영역 그리기
     */
    getClusterData () {
      const optionData = []

      const selectIndex = []

      const rateX = this.getRateX() // / 1.3;
      const rateY = this.getRateY() / 3.5

      // pdfscale바뀔때마다 /2처럼 해주면 된다. 1.3=pdf-scale 이 8일때 기준
      const scale = 1.3 / 2 // 0.2115 * this.scale * rateY;
      const offset = 1 * scale
      let offsetX = -93 * rateX
      let offsetY = 125 * rateY
      // let clusterCount = 0;

      const radius = 120 * scale

      this.recommendData.MHN_CL.forEach((element, index) => {
        if (index + 1 !== this.testIndex && this.testMode === true) return

        let points = []

        // 클러스터에 해당하는 노드 위치값 추출
        element.nodes.forEach((el) => {
          points.push([el.x * scale, el.y * scale])
          selectIndex.push(el.index)
        })

        if (points.length === 0) {
          optionData.push({
            type: 'polygon',
            shape: {
              points,
              smooth: 1
            },
            left: this.x, // points[0][0],
            top: this.y, // points[0][1],

            focus: 'none',
            silent: true,
            style: {
              fill: 'green',
              opacity: 0.1,
              lineWidth: 10
            }
          })

          return
        }
        while (points.length <= 2) {
          points.push([points[0][0] + offset, points[0][1] - offset])
          points.push([points[0][0] - offset, points[0][1] - offset])
          points.push([points[0][0] + offset, points[0][1] + offset])
          points.push([points[0][0] - offset, points[0][1] + offset])

          points.push([points[1][0] + offset, points[1][1] - offset])
          points.push([points[1][0] - offset, points[1][1] - offset])
          points.push([points[1][0] + offset, points[1][1] + offset])
          points.push([points[1][0] - offset, points[1][1] + offset])
        }

        let left = 0
        let top = 0
        let right = 0
        let bottom = 0
        points.forEach((elem, index) => {
          if (index === 0) {
            left = elem[0]
            top = elem[1]
            right = elem[0]
            bottom = elem[1]
          } else {
            if (left > elem[0]) left = elem[0]
            if (top > elem[1]) top = elem[1]
            if (right < elem[0]) right = elem[0]
            if (bottom < elem[1]) bottom = elem[1]
          }
        })

        // 일정범위 넘어가는 포인트들은 각각의 그룹으로 분리
        const clusters = clustering(points, 400 * rateY)

        // eslint-disable-next-line no-unreachable
        clusters.forEach((clElement) => {
          // convexHull알고리즘으로 포인트 추출
          points = convexHull(clElement)

          while (points.length <= 2) {
            points.push([
              points[0][0] + offset * rateX,
              points[0][1] - offset * rateY
            ])
            points.push([
              points[0][0] - offset * rateX,
              points[0][1] - offset * rateY
            ])
            points.push([
              points[0][0] + offset * rateX,
              points[0][1] + offset * rateY
            ])
            points.push([points[0][0] - offset, points[0][1] + offset * rateY])

            points.push([
              points[1][0] + offset * rateX,
              points[1][1] - offset * rateY
            ])
            points.push([
              points[1][0] - offset * rateX,
              points[1][1] - offset * rateY
            ])
            points.push([
              points[1][0] + offset * rateX,
              points[1][1] + offset * rateY
            ])
            points.push([
              points[1][0] - offset * rateX,
              points[1][1] + offset * rateY
            ])
          }

          // 중심값 계산
          const centerPoints = centroid(points)

          // 각 클러스터별 좌표값 오차가 있어 수동으로 설정해줌
          if (index + 1 === 3) {
            points.push([centerPoints[0], top - radius * 0.1])
          }
          if (index + 1 === 5) {
            offsetX = -95 * rateX
            offsetY = 115 * rateY
          }

          if (index + 1 === 7 && clElement.length > 2) {
            offsetX = -95 * rateX
            offsetY = 120 * rateY
          }
          if (index + 1 === 8) {
            points.push([left, centerPoints[1] + radius * rateY * 0.1])
            points.push([right, centerPoints[1] + radius * rateY * 0.1])
            offsetX = -95 * rateX
            offsetY = 105 * rateY
          }
          if (index + 1 === 9 && clElement.length > 2) {
            offsetY = 105 * rateY
          }

          if (index + 1 === 11 && clElement.length > 2) {
            //
          }

          if (index + 1 === 12) {
            points.push([centerPoints[0], top - radius * 0.1])
            points.push([left, top + radius * 2])
          }
          if (index + 1 === 13 && clElement.length > 2) {
            points.push([
              left - radius * 0.05,
              centerPoints[1] - radius * rateY * 0.1
            ])
            points.push([
              left - radius * 0.5,
              centerPoints[1] + radius * rateY * 0.15
            ])
            offsetY = 117 * rateY
          }
          if (index + 1 === 14) {
            points.push([centerPoints[0], top - radius * 0.1])
            offsetY = 130 * rateY
          }
          if (index + 1 === 15) {
            offsetY = 115 * rateY
          }
          if (index + 1 === 16 && clElement.length > 2) {
            offsetY = 112 * rateY
          }

          if (index + 1 === 17 && clElement.length > 2) {
            offsetY = 118 * rateY
          }

          if (index + 1 === 18 && clElement.length > 2) {
            offsetX = -95 * rateX
            offsetY = 114 * rateY
          }

          if (index + 1 === 19 && clElement.length > 2) {
            offsetY = 114 * rateY
          }
          if (index + 1 === 20 && clElement.length > 2) {
            offsetY = 114 * rateY
          }
          if (index + 1 === 21) {
            points.push([centerPoints[0], top - radius * 0.5])
            points.push([left - radius * 0.5, centerPoints[1]])
            offsetY = 116 * rateY
          }
          if (index + 1 === 22) {
            points.push([centerPoints[0], top - radius * 0.1])
            offsetY = 116 * rateY
          }
          if (index + 1 === 23) {
            offsetX = -95 * rateX
            offsetY = 116 * rateY
          }
          if (index + 1 === 24) {
            offsetX = -97 * rateX
            offsetY = 113 * rateY
          }

          points.forEach((elem, index) => {
            const vector = getVector(elem, centerPoints)
            elem[0] += vector[0] * radius
            elem[1] += vector[1] * radius
          })

          // 각 포지션 radius값만큼 넓힌후 재계산
          points = convexHull(points)
          points.forEach((elem, index) => {
            if (index === 0) {
              left = elem[0]
              top = elem[1]
              right = elem[0]
              bottom = elem[1]
            } else {
              if (left > elem[0]) left = elem[0]
              if (top > elem[1]) top = elem[1]
              if (right < elem[0]) right = elem[0]
              if (bottom < elem[1]) bottom = elem[1]
            }
          })

          let color = 'green'

          let existInterestBorder = false
          if (element.Cluster_State >= 40) {
            existInterestBorder = true
          }

          let includeSex = true
          this.clusterNameLeft.forEach((element2) => {
            if (element2.index === index) {
              if (element2.sex && element2.sex !== this.userInfo.sex) { includeSex = false }
            }
          })
          this.clusterNameRight.forEach((element2) => {
            if (element2.index === index) {
              if (element2.sex && element2.sex !== this.userInfo.sex) { includeSex = false }
            }
          })

          // 해당 성별에서 보여야하는 리스트인지 판단 후 맞는 경우 상태값에 따라 배경색 설정
          if (includeSex) {
            switch (element.Cluster_State) {
              case 0:
                color = '#7171711A'
                break
              case 1:
                color = '#7171711A'

                break
              case 2:
                color = '#F8B50026'
                break
              case 3:
                color = '#E953714D'
                break
              case 4:
                color = '#00AFEC66'
                break
              default:
                break
            }

            switch (element.Cluster_State - 40) {
              case 0:
                color = '#7171711A'
                break
              case 1:
                color = '#7171711A'

                break
              case 2:
                color = '#F8B50026'
                break
              case 3:
                color = '#E953714D'
                break
              case 4:
                color = '#00AFEC66'
                break
              default:
                break
            }
          } else {
            color = '#7171711A'
          }

          optionData.push({
            type: 'polygon',
            shape: {
              points,
              // smooth: 0.5,
              smooth: 0.5
            },
            left: this.x + left + offsetX, // points[0][0],
            top: this.y + top + offsetY, // points[0][1],
            focus: 'none',
            silent: true,

            style: {
              fill: color, // "green",
              opacity: 1,
              lineWidth: 3 * this.pdfScale,
              stroke: existInterestBorder ? '#55C3F1' : 'transparent'
            }
          })
        })
      })

      return optionData
    },
    /**
     * @return {number} - pdfScale
     */
    getScale () {
      return this.pdfScale
    }
  }
}
</script>

<style lang="scss" scoped>
@use "@/assets/css/pdf/charDocument.scss";
</style>
