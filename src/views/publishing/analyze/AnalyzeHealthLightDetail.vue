<script setup>

import BasePopupFull from '@/views/publishing/BasePopupFull.vue'

import { useStore } from 'vuex'
import { ref, onMounted, onBeforeUnmount } from 'vue'

import { convexHull } from '@/assets/js/chart/hull'
import { clustering } from '@/assets/js/chart/clustering'
import { useClusterData } from '@/assets/js/chart/graphData'
import { isMobile, centroid, getVector } from '@/assets/js/chart/util'
import * as analysisApi from '@/apis/analysis'

// Echart
import * as echarts from 'echarts'
const { cluster_data : clusterData,
  cluster_name_left : clusterNameLeft,
  cluster_name_right : clusterNameRight } = useClusterData()
const store = useStore()
const pdfScale = ref(4)

// param
const detailId = 1016
const sendData = store.getters['analyze/getAnalysisSendData']

// ref var
const article = ref(null) /* 240102 전체 싸고 있는 div */
const chartWrap = ref(null) /* 240102 chart-wrap div */

// mainChart
const chart = ref(null) /* 240102 echart div */
const myChart = ref(null) /* 240102 차트 담는 변수 */
const option = ref({}) /* 240102 옵션 담는 변수 */

// chart reuseable var
const renderer = ref('canvas')

// UI var
const defScale = ref(1)
const scaleMax = ref(3)
const scaleMin = ref(1)
const x = ref(0)
const y = ref(0)
const isZoomMode = ref(false)
const zoomIndex = ref(1)
const resolution = ref(2)
const init = ref(0)

const selectedProductList = ref([])

const dangerCount = ref(0)
const warnCount = ref(0)
const interCount = ref(0)

// 실제 데이터
const analyzeData = ref({
  hqData: {}
})

const MHN_CL = ref(null)
const MHN_NL = ref(null)
const MHN_EL = ref(null)
const MHN_NCL = ref(null)

const linkList = ref(null)
const isPop = ref(false) /* 231211 모바일에서 확대보기 오프너 */

async function getDetailAnalyzeData (basicsId) {
  await analysisApi.getAnalysisHeathLightDetail(basicsId).then(res => {
    analyzeData.value = res.data.logmeCompleteAnalysisDetail

    MHN_CL.value = analyzeData.value.clusterList
    MHN_NL.value = analyzeData.value.nodeList
    MHN_EL.value = analyzeData.value.edgeList
    MHN_NCL.value = analyzeData.value.ncList
  }).catch(error => {
    console.log(error)
  })
}

function setMhnElList () {
  const convertedList = []

  MHN_EL.value.forEach((el) => {
    convertedList.push(el)
  })

  convertedList.forEach((el, index) => {
    el.index = index
  })

  linkList.value = convertedList
}

function setMhnNclList () {
  MHN_NCL.value = MHN_NCL.value.filter(
    (val, idx) => {
      return (
        MHN_NCL.value.findIndex((item) => item.Node_ID === val.Node_ID) === idx
      )
    }
  )
}

function setMhnNlList () {
  const rateX = getRateX()
  const rateY = getRateY()

  MHN_NL.value = MHN_NL.value.filter(
    (val, idx) => {
      return (
        MHN_NL.value.findIndex((item) => item.Node_ID === val.Node_ID) === idx
      )
    }
  )

  MHN_NL.value.forEach((el) => {
    MHN_NCL.value.forEach((el2, idx) => {
      if (el.Node_ID === el2.Node_ID) {
        el.clusterInfo = el2
        el.clusterIndex = idx
      }
    })
  })

  MHN_NL.value.forEach((el, idx) => {
    el.name = el.Node_Name
    el.id = el.Node_ID
    el.x = (el.X * rateX) / rateY
    el.y = el.Y
    el.index = idx

    switch (el.Node_State) {
      case 0:
      case 1:
        // 정상 노드 색상
        el.itemStyle = {
          animation: true,
          opacity: 0.3,
          color: '#717171'
        }

        break
      case 2:
        // 주의 노드 색상
        el.itemStyle = {
          animation: true,
          opacity: 1,
          color: '#FDC840'
        }
        break
      case 3:
        // 위험 노드 색상
        el.itemStyle = {
          animation: true,
          opacity: 1,
          color: '#C2373F'
        }

        break
      case 4:
        break
    }
  })
}

function setMhnClList () {
  MHN_CL.value.forEach((element, index) => {
    element.nodes = MHN_NL.value.filter(
      (item) => item.clusterInfo[element.Cluster_ID.toUpperCase()] === 1
    )

    element.nodes.forEach((elem) => {
      elem.symbol = clusterData[index].symbol
      if (elem.Node_Category.includes('Core')) {
        elem.symbol = 'circle'
      }
    })
  })
  MHN_CL.value = MHN_CL.value.sort((a, b) => {
    return (
      Number(a.Cluster_ID.replace('CL_', '')) -
        Number(b.Cluster_ID.replace('CL_', ''))
    )
  })
}

function countClusterState () {
  dangerCount.value = 0
  warnCount.value = 0
  interCount.value = 0

  MHN_CL.value.forEach((el, index) => {
    let includeSex = true
    clusterNameLeft.forEach((el2) => {
      if (el2.index === index) {
        if (el2.sex && el2.sex !== sendData.basics.sex) {
          includeSex = false
        }
      }
    })

    clusterNameRight.forEach((el2) => {
      if (el2.index === index) {
        if (el2.sex && el2.sex !== sendData.basics.sex) {
          includeSex = false
        }
      }
    })

    if (includeSex) {
      switch (el.Cluster_State) {
        case 0:
        case 1:
          break
        case 2:
          warnCount.value++
          break
        case 3:
          dangerCount.value++
          break
        case 4:
          interCount.value++
          break
      }

      // 관심이랑 다른 상태 겹쳤을때
      if (el.Cluster_State > 40) {
        switch (el.Cluster_State - 40) {
          case 0:
          case 1:
            break
          case 2:
            warnCount.value++
            break
          case 3:
            dangerCount.value++
            break
          case 4:
            // this.interCount++;
            break
        }
        interCount.value++
      }
    }
  })
}

const digit = ref(120) /* 240102 공통적으로 나오는 180을 변수로 뺌 */

function getRateX () {
  const targetWidth = article.value.clientWidth
  const baseWidth = 175

  // let rateX = (targetWidth - 180) / baseWidth;
  const rateX = (targetWidth - digit.value) / baseWidth /* 240102 180을 변수로 변경 */
  return rateX * resolution.value
}

function getHeight () {
  const headerHeight = 55 + 30
  const recommendListHeight = 0 // 85;
  // const agileHeight = 25;
  const agileHeight = 80 /* 240102 차트가 그려질 때 윈도우 높이를 체크해서 비례해서 커지길래 그보다 작게 하기 위해 값을 높였음 */
  const windowHeight = document.documentElement.offsetHeight // window.innerHeight
  const height = windowHeight - recommendListHeight - headerHeight - agileHeight

  return height
}

function getRateY () {
  const baseHeight = 732

  const rateY = getHeight() / baseHeight

  return rateY * resolution.value
}

async function prepareData (needUpdateData = true) {
  // const rateX = getRateX()
  // const rateY = getRateY()

  setMhnNclList()
  setMhnNlList()
  setMhnClList()

  const convertedLinks = []

  MHN_EL.value.forEach((el) => {
    el.name = el.Edge_Name
    el.id = el.Edge_ID
    el.source = el.S_Node_ID
    el.target = el.E_Node_ID

    convertedLinks.push({
      ...el,
      lineStyle: {
        color: '#000000',
        width: 0.5
      }
    })
  })

  linkList.value = convertedLinks

  MHN_CL.value = MHN_CL.value.filter((val, idx) => {
    return (
      MHN_CL.value.findIndex(
        (item) => item.Cluster_ID === val.Cluster_ID
      ) === idx
    ) // 값이 처음나오는 배열 인덱스와 현재 인덱스가 같으면 포함
  })

  MHN_CL.value.forEach((element, index) => {
    element.nodes = MHN_NL.value.filter(
      (item) => item.clusterInfo[element.Cluster_ID.toUpperCase()] === 1
    )

    const textOption = {
      textBorderWidth: 0,
      textBorderColor: 'transparent',
      fontFamily: 'Pretendard',
      width: 105,
      // 폰트 크기 이슈가 있어서 수정
      overflow: isMobile() ? 'break' : 'nowrap'
    }

    element.nodes.forEach((elem) => {
      elem.symbol = clusterData[index].symbol
      // console.log(toRaw(elem))
      if (elem.Node_Category.includes('Core')) {
        elem.symbol = 'circle'
        elem.symbolSize = 18
      }
      elem.label = { show: false }

      const fontLarge = 16 * resolution.value /* pc 폰트 */
      const fontSmall = 12 * resolution.value /* mo 폰트 */
      // 노드명 폰트 사이즈 모바일/PC에 따라 조절. 특정 항목만 보이도록 설정
      // console.log(element.Cluster_state + ' / ' + isMobile());

      if (
        elem.Node_Category.includes('Core') ||
          elem.Node_Category.includes('Core-life')
      ) {
        if (element.Cluster_State > 1) {
          if (isMobile() === false) {
            elem.label = {
              show: true,
              fontSize: fontLarge,
              ...textOption
            }
          } else {
            elem.label = {
              show: true,
              fontSize: fontSmall,
              ...textOption
            }
          }
        } else {
          if (isMobile() === false) {
            elem.label = {
              show: true,
              fontSize: fontLarge,
              ...textOption
            }
          } else {
            elem.label = {
              show: true,
              fontSize: fontSmall,
              ...textOption
            }
          }
        }
      } else {
        if (isMobile() === false) {
          elem.label = {
            show: true,
            fontSize: fontSmall,
            ...textOption
          }
        }
      }
    })

    MHN_CL.value = MHN_CL.value.sort((a, b) => {
      return (
        Number(a.Cluster_ID.replace('CL_', '')) -
          Number(b.Cluster_ID.replace('CL_', ''))
      )
    })
  })
}

async function updateChart () {
  // 차트에 사용하는 데이터 준비
  await prepareData(false)

  // 차트 옵션값 설정
  const opt = getOption(defScale.value)

  /* myChart.value = echarts.init(chart.value, null, {
    renderer: renderer.value,
  }); */

  option.value = opt // 옵션 저장
  // 네트워크 그래프 차트
  // console.log(420, toRaw(option.value))
  myChart.value.setOption(option.value)
}

function getClusterData () {
  const optionData = []

  const selectIndex = []

  const rateX = getRateX()
  const rateY = getRateY()

  const scale = 0.2115 * defScale.value * rateY

  const offset = 3 * scale
  let offsetX = -126 * rateX
  let offsetY = 43.5 * rateY
  let clusterCount = 0

  const radius = 50 * scale

  MHN_CL.value.forEach((element, index) => {
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
        left: x.value, // points[0][0],
        top: y.value, // points[0][1],

        focus: 'none',
        silent: true,
        style: {
          fill: 'green',
          opacity: 0.1,
          lineWidth: 8
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
    const clusters = clustering(points, 160 * rateY)

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

      offsetX = -126 * rateX
      offsetY = 43.5 * rateY

      // 각 클러스터별 좌표값 오차가 있어 수동으로 설정해줌
      if (index + 1 === 3) {
        points.push([centerPoints[0], top - radius * 0.1])
      }
      if (index + 1 === 7 && clElement.length > 2) {
        offsetY = 50 * rateY
      }
      if (index + 1 === 8) {
        points.push([left, centerPoints[1] + radius * rateY * 0.5])
        points.push([right, centerPoints[1] + radius * rateY])
        offsetY = 35 * rateY
      }
      if (index + 1 === 9 && clElement.length > 2) {
        offsetY = 37 * rateY
      }

      if (index + 1 === 11 && clElement.length > 2) {
        points.push([centerPoints[0], bottom + radius * 7 * rateY])
      }

      if (index + 1 === 12) {
        points.push([centerPoints[0], top - radius * 0.1])
        points.push([left, top + radius * 2])
      }
      if (index + 1 === 13 && clElement.length > 2) {
        points.push([
          left - radius * 0.5,
          centerPoints[1] - radius * rateY
        ])
        points.push([
          left - radius * 0.5,
          centerPoints[1] + radius * rateY * 0.25
        ])
      }
      if (index + 1 === 14) {
        points.push([centerPoints[0], top - radius * 0.1])
      }
      if (index + 1 === 16 && clElement.length > 2) {
        points.push([
          centerPoints[0],
          centerPoints[1] - radius * 1.7 * rateY
        ])
      }
      if (index + 1 === 19 && clElement.length > 2) {
        offsetX = -129 * rateX
      }
      if (index + 1 === 21) {
        points.push([centerPoints[0], top - radius * 0.5])
        points.push([left - radius * 0.5, centerPoints[1]])
      }
      if (index + 1 === 22) {
        points.push([centerPoints[0], top - radius * 0.1])
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
      clusterNameLeft.forEach((element2) => {
        if (element2.index === index) {
          if (element2.sex && element2.sex !== sendData.basics.sex) { includeSex = false }
        }
      })
      clusterNameRight.forEach((element2) => {
        if (element2.index === index) {
          if (element2.sex && element2.sex !== sendData.basics.sex) { includeSex = false }
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
            color = '#F8B50026' /* 주의 */
            break
          case 3:
            color = '#E953714D' /* 위험 */
            break
          case 4:
            color = '#00AFEC66' /* 관심 */
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

      // 클러스터 하나씩 켜지는 애니메이션
      let keyframeAnimation = []

      if (init.value <= 1) {
        keyframeAnimation = [
          {
            delay: 100 + 100 * parseInt(clusterCount++ / 3),
            duration: 1.25,
            loop: false,
            keyframes: [
              {
                percent: 0,
                style: { opacity: 0 }
              },
              {
                percent: 1,
                style: {
                  opacity:
                      element.Cluster_State === 0 ||
                      element.Cluster_State === 1
                        ? 0.1
                        : 0.5
                }
              }
            ]
          }
        ]
      }

      optionData.push({
        type: 'polygon',
        shape: {
          points,
          smooth: 0.5
        },
        keyframeAnimation,
        left: x.value + left + offsetX, // points[0][0],
        top: y.value + top + offsetY, // points[0][1],
        focus: 'none',
        silent: true,

        style: {
          fill: color, // "green",
          opacity: 1,
          lineWidth: 3 * pdfScale.value,
          stroke: existInterestBorder ? '#55C3F1' : 'transparent'
        }
      })
    })
  })

  return optionData
}

function getClusterStatus (clusterIndex) {
  if (MHN_CL.value) {
    const state = MHN_CL.value[clusterIndex].Cluster_State
    if (state >= 40) {
      // 40이상이면 관심이면서 주의/위험
      return state - 40
    }
    return state
  }
  return 0
}

function getOption (zoom = 1) {
  // zoom = 1.1;
  const targetNames = ['아스파테이트 아미노 전이효소', '수면-각성 프로파일', '혈관 내피세포 활성', '면역력 자가진단', '혈청 크레아티닌', '수분 섭취량', '혈당 조절 관련 호르몬/단백질', '노화억제 분석지수', '콜레스테롤 합성', '콜레스테롤 배설', '에너지 대사 조절', '간담도성 손상지표', '알라닌 아미노 전이효소', '혈청 크레아티닌', '근육 단백질 합성 증가']
  const convexHullData = getClusterData()
  // console.log("convexHullData", convexHullData);
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
        data: MHN_NL.value.map(e => {
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
        links: linkList.value, // 연결 정보 데이터 세팅

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
          min: scaleMin.value,
          max: scaleMax.value
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
}

function updatePos (dx, dy) {
  x.value += dx
  y.value += dy
}

// 확대 화면 취소
function resetZoom () {
  const echart = echarts.getInstanceByDom(chart.value)

  isZoomMode.value = false
  echart.clear()
  updateChart()
  updatePos(-x.value, -y.value)

  if (oldStyleOpt.value !== '') {
    isExpand.value = false
    chartWrap.value.style = oldStyleOpt.value
  }

  resizeChart()

  // 240116 pc에 있던 맵 좌우에 있는 명칭을 모바일에서 확대 시 그대로 보여달라는 요청으로 확대시에 관련 명칭 dom을 맵 div 안에 넣었다가 축소 시 다시 원래 위치로 이동 시키기 위해 코드 추가
  const cList = document.querySelector('.cluster-list')
  document.querySelector('.AnalyzeHealthLightDetail--m-parent').appendChild(cList)
}

function resizeChart () {
  const target = article.value

  const option = getOption(defScale.value)

  /* myChart.value = echarts.init(chart.value, null, {
    renderer: renderer.value
  }); */

  myChart.value.setOption(option)

  // const width = (target.clientWidth - 180) * resolution.value;
  const width = (target.clientWidth - digit.value) * resolution.value /* 240102 180을 변수로 변경 */

  const headerHeight = 45 + 51 + 30 // 231213 TODO LYH 수정필요

  const height = getHeight() * resolution.value

  myChart.value.resize({
    width,
    height
  })

  const refChart = chartWrap.value

  // let scale = 1 / resolution.value; //height / window.innerHeight;
  const scaleValue = isMobile() ? 0.95 : 0.85
  let scale = scaleValue / resolution.value // TODO 이걸로 차트의 그림 스케일을 조절 합니다. 24.01.06 LYH

  // const chartWidth = (target.clientWidth - 180) * resolution.value; //this.$refs.chart.offsetWidth;
  const chartWidth = (target.clientWidth - digit.value) * resolution.value + 100// this.$refs.chart.offsetWidth; 240102 180을 변수로 변경

  let margin = (target.clientWidth - chartWidth * scale) / 2
  let top = headerHeight // 10 / scale + headerHeight * scale; //73.5 * scale; //25 / scale;

  let left = (isMobile()) ? 7 : -3// 0 - 42; //TODO 이걸로 left 위치를 조절 합니다. 24.01.06 LYH

  if (isZoomMode.value) {
    const zoomTop = (!isExpand.value) ? clusterData[zoomIndex.value].zoomTop : 0
    const zoomLeft = (!isExpand.value) ? clusterData[zoomIndex.value].zoomLeft : 0
    const zoomScale = (!isExpand.value) ? clusterData[zoomIndex.value].zoomScale : 1

    left = zoomLeft * getRateX()
    scale = scale * zoomScale
    top = (
      (((25 / scale +
                headerHeight) * scale +
            zoomTop) * scale) *
        getRateY()
    )
    margin = (target.clientWidth - chartWidth * scale) / 2
  }

  let marginLeft = (margin * 0.3) / scale
  if (isMobile()) {
    marginLeft = (margin * 0.425) / scale
    if (isZoomMode.value) {
      left += 40
    }
  }
  refChart.style =
      'top:' +
      top +
      // 0 +
      'px;left:' +
      left + (isZoomMode.value ? 'px;' : '%;') +
      'margin: 0 ' +
      margin +
      'px;margin-left:' +
      marginLeft +
      // 0 +
      'px;transform: scale(' +
      // scale +
      scale +
      ');transform-origin:top left;'

  init.value++
}

function openPop (val) {
  isPop.value = val
}

const isExpand = ref(false) /* 240102 모바일에서 확대보기 오프너, 작업 중 */
const oldStyleOpt = ref('')
function expandMap () { /* 240102 확대보기 작업 중 */
  // pc에 있던 맵 좌우에 있는 명칭을 모바일에서 확대 시 그대로 보여달라는 요청으로 확대시에 관련 명칭 dom을 맵 div 안에 넣어 주는 코드
  const cList = document.querySelector('.cluster-list')
  document.querySelector('.chart-wrap').appendChild(cList)

  if (!isZoomMode.value) {
    isExpand.value = !isExpand.value
    isZoomMode.value = !isZoomMode.value
    // defScale.value = isZoomMode.value ? 2 : 1;

    if (isExpand.value) {
      oldStyleOpt.value = chartWrap.value.style

      chartWrap.value.style =
          'top:40%;' +
          'left:40%;' + // 240116 pc에 있던 맵 좌우에 있는 명칭을 모바일에서 확대 시 그대로 보여달라는 요청으로 확대시에 관련 명칭 dom의 스타일 수정
          'transform: scale(1);' +
          'transform-origin:top left;'/* 240109 확대 시 위치 및 스케일 조절은 여기서 스타일 먹일 것 */

      myChart.value.setOption(getOption())
    } else {
      isPop.value = false
      chartWrap.value.style = oldStyleOpt.value
      resetZoom()
    }
  }
}
// PinchZoom
function listener (event) {
  if (event.touches.length > 1) { event.preventDefault() }
}

onMounted(async () => {
  init.value = 0
  selectedProductList.value = []

  await getDetailAnalyzeData(detailId.value)

  setMhnElList()

  myChart.value = echarts.init(chart.value, null, {
    renderer: renderer.value
  })

  updateChart()

  window.onresize = myChart.value.resize
  window.addEventListener('resize', resizeChart, { passive: false })

  const updateFunc = updatePos

  updateFunc(0, 0)

  myChart.value.on('graphroam', function (params) {
    updateFunc(params.dx, params.dy)
  })
  resizeChart()

  // resizeChart();
  setMhnClList()
  countClusterState()

  // console.log(echarts)
  // console.log('@@@echartDOM', echarts.getInstanceByDom(chart.value))

  document.addEventListener('touchmove', listener, { passive: false })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  document.removeEventListener('touchmove', listener)
})

</script>

<template>
  <div class="AnalyzeHealthLightDetail" ref="article">
    <p class="AnalyzeHealthLightDetail--p">* {{ date }} 검진 데이터 기준</p>
    <div class="AnalyzeHealthLightDetail--div"> <!--데이터 이미지 노출-->
      <div class="AnalyzeHealthLightDetail--m-parent">

        <!--      231208 색상 안내 추가   -->
        <div class="txt--right AnalyzeCheckupDataRecord--label">
          <span class="AnalyzeCheckupDataRecord--label-wrap">
            <span class="AnalyzeCheckupDataRecord--label-rect l1" /> 주의
          </span>
          <span class="AnalyzeCheckupDataRecord--label-wrap">
            <span class="AnalyzeCheckupDataRecord--label-rect l2" /> 관리
          </span>
          <span class="AnalyzeCheckupDataRecord--label-wrap">
            <span class="AnalyzeCheckupDataRecord--label-rect l3" /> 관심
          </span>
        </div>

        <div class="AnalyzeCheckupDataRecord--map" :class="isExpand ? 'expand' : ''">
          <div class="chart-wrap" ref="chartWrap">
            <div class="echart graphChart" ref="chart" />
          </div>
          <div class="cluster-list">
            <div class="left-list">
              <template v-for="(list, i) in clusterNameLeft" :key="i">
                <span
                  :class="[
                    { danger: getClusterStatus(list.index) === 3 },
                    {
                      safe:
                        getClusterStatus(list.index) === 0 ||
                        getClusterStatus(list.index) === 1,
                    },
                    { warn: getClusterStatus(list.index) === 2 },
                    { interest: getClusterStatus(list.index) === 4 },
                  ]">
                  {{ list.name }}</span>
              </template>
            </div>
            <div class="right-list">
              <template v-for="(list, i) in clusterNameRight" :key="i">
                <span
                  :class="[
                    { danger: getClusterStatus(list.index) === 3 },
                    {
                      safe:
                        getClusterStatus(list.index) === 0 ||
                        getClusterStatus(list.index) === 1,
                    },
                    { warn: getClusterStatus(list.index) === 2 },
                    { interest: getClusterStatus(list.index) === 4 },
                  ]">
                  {{ list.name }}</span>
              </template>
            </div>
            <div class="right-list" />
          </div>
          <div class="AnalyzeHealthLightDetail--expand-wrap" :class="[isZoomMode ? 'hide' : '', isExpand ? 'top' : '']">
            <button
              v-if="!isExpand"
              @click="expandMap"
              type="button"
              aria-label="확대"
              class="AnalyzeHealthLightDetail--expand" /> <!--240103 확대보기 함수 변경-->
          </div>
          <div class="description acdr--txt">
            *본 건강 신호등은 식품의약품안전처 건강기능식품 평가 가이드, 한국식품연구원 건강기능식품 플랫폼, 세계적으로 공인된 설문지 등의
            과학적인 근거 자료를 바탕으로 설계되었습니다. 이 중 11가지 건강분야(기억력 개선, 눈 건강, 코 과민 반응, 위 건강, 장 건강, 관절/뼈 건강,
            면역 기능, 과민피부상태 개선, 피로개선, 갱년기 여성건강, 전립선 건강)는 자가진단 설문을 바탕으로 개인의 주관에 따라 판정됩니다.
          </div>
        </div>
        <div class="zoom-info" :class="isExpand ? 'top' : ''" v-if="isZoomMode">
          <img src="/img/ico_x.svg" @click="resetZoom()" />
        </div>
      </div>

    </div>

    <!--    <div class="AnalyzeHealthLightDetail&#45;&#45;expand-wrap">-->
    <!--      <button-->
    <!--        @click="openPop(true)"-->
    <!--        type="button"-->
    <!--        aria-label="확대"-->
    <!--        class="AnalyzeHealthLightDetail&#45;&#45;expand" />-->
    <!--    </div>-->

    <base-popup-full v-if="isPop">
      <template v-slot:contents>

        확대된 지도 여기에

        <div class="AnalyzeHealthLightDetail--close-wrap">
          <button
            @click="openPop(false)"
            type="button"
            aria-label="닫기"
            class="AnalyzeHealthLightDetail--close" />
        </div>
      </template>
    </base-popup-full>

  </div>
</template>

<style scoped lang="scss">
@use "@/assets/css/analyze/analyzeHealthLightDetail";
</style>
