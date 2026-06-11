<template>
  <div class="graph-wrapper" ref="wrapper">
    <div class="chart-wrap" ref="chartwrap">
      <div
        v-if="useConvexHull"
        class="echart2"
        ref="chart2"
        id="ehChart2"
      ></div>

      <div class="echart" ref="chart" id="ehChart"></div>
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
        <template v-for="(list, i) in cluster_name_left" :key="i">
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
            ]"
            class="stretch-text"
            >{{ list.name }}</span
          >
        </template>
      </div>
      <div class="right-list">
        <template v-for="(list, i) in cluster_name_right" :key="i">
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
            ]"
            class="stretch-text"
            >{{ list.name }}</span
          >
        </template>
      </div>
      <div class="right-list"></div>
    </div>

    <div class="loading" v-if="!loading">
      <div class="loading-box">
        <p>로딩중입니다.</p>
        <div class="loading-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";

import { popup } from "@/assets/js/chart/popup";
import { convexHull } from "@/assets/js/chart/hull";
import {
  useClusterData
} from "@/assets/js/chart/graphData";
import { isMobile, centroid, getVector } from "@/assets/js/chart/util";
import { clustering } from "@/assets/js/chart/clustering";

// echarts.use([GridComponent]);



export default {
  setup() {
    const { cluster_data, cluster_name_left, cluster_name_right } = useClusterData()
    
    return {
      cluster_data,
      cluster_name_left,
      cluster_name_right
    }
  },
  props: {
    comph: null,
    recommendDataProps: null,
    userInfo: null,
    pdfScale: Number,
    loadingFinished: null,
    report_no: null,
  },
  data() {
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
      useConvexHull: false,
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
      renderer: "svg",
      resolution: 1,
      init: 0,

      cluster_name_left: cluster_name_left,
      cluster_name_right: cluster_name_right,
    };
  },
  unmounted() {},
  activated() {
    console.log("graph chart activated");
  },
  async mounted() {
    setTimeout(this.exec(), 10);
  },
  methods: {
    exec() {

      console.log("graph chart mounted");
      this.init = 0;
      this.selectedProductList = [];
      /* let solution_req = await {
        op_code: 2,
        report_no: parseInt(this.report_no),
        uid: this.userInfo.uid,
        name: this.userInfo.name,
      };

      let result = await recommendReport(solution_req); */
      let result = this.recommendDataProps;
      console.log('recomph', this.comph);
      console.log("recomrep", result);
      this.recommendData = result.resultDto;

      let convertedLinks = [];

      // 연결정보 리스트 데이터 설정
      result.resultDto.MHN_EL.forEach((element) => {
        convertedLinks.push({
          ...element,
        });
      });
      this.dataList = result.resultDto.MHN_NL;
      this.linkList = convertedLinks;
      // console.log("linklist", this.linkList);
      this.dataList.forEach((element, index) => {
        element.index = index;
      });
      this.linkList.forEach((element, index) => {
        element.index = index;
      });

      const echart = echarts.init(this.$refs.chart, null, {
        renderer: this.renderer,
      });

      let echart2;
      if (this.useConvexHull)
        echart2 = echarts.init(this.$refs.chart2, null, {
          renderer: this.renderer,
        });

      this.updateChart();

      window.onresize = echart.resize;

      const optionFunc = this.getOption2;

      const updateFunc = this.updatePos;

      updateFunc(0, 0);
      echart.on("graphroam", function (params) {
        const option = optionFunc();
        updateFunc(params.dx, params.dy);
        if (this.useConvexHull) echart2.setOption(option, { lazyUpdate: false });
      });
      this.resizeChart();

      this.loading = true;

      this.recommendData.MHN_CL.forEach((element, index) => {
        element.nodes = this.recommendData.MHN_NL.filter(
          (item) => item.clusterInfo[element.Cluster_ID.toUpperCase()] === 1
        );

        element.nodes.forEach((elem) => {
          elem.symbol = this.cluster_data[index].symbol;
          if (elem.Node_Category.includes("Core")) {
            elem.symbol = "circle";
          }
        });
      });
      this.recommendData.MHN_CL = this.recommendData.MHN_CL.sort((a, b) => {
        return (
          Number(a.Cluster_ID.replace("CL_", "")) -
          Number(b.Cluster_ID.replace("CL_", ""))
        );
      });

      this.countClusterState();

      setTimeout(() => {
        console.log("loadingfinish", this.loadingFinished);
        this.loadingFinished();
      }, 1);
    },
    countClusterState() {
      this.dangerCount = 0;
      this.warnCount = 0;
      this.interestCount = 0;
      this.recommendData.MHN_CL.forEach((element, index) => {
        let includeSex = true;

        cluster_name_left.forEach((element2) => {
          console.log("element2", element2.sex);
          if (element2.index === index) {
            if (element2.sex && element2.sex !== this.userInfo.sex) {
              console.log("include false");
              includeSex = false;
            }
          }
        });
        cluster_name_right.forEach((element2) => {
          console.log("element2", element2.sex);

          if (element2.index === index) {
            if (element2.sex && element2.sex !== this.userInfo.sex) {
              console.log("include false", element2);
              includeSex = false;
            }
          }
        });

        // 성별에따라 카운트 해야하는 목록과 패스해야 하는 목록이 존재
        if (includeSex) {
          switch (element.Cluster_State) {
            case 0:
            case 1:
              break;
            case 2:
              this.warnCount++;
              break;
            case 3:
              this.dangerCount++;
              break;
            case 4:
              this.interestCount++;
              break;
          }

          // 관심이랑 다른 상태 겹쳤을때
          if (element.Cluster_State > 40) {
            switch (element.Cluster_State - 40) {
              case 0:
              case 1:
                break;
              case 2:
                this.warnCount++;
                break;
              case 3:
                this.dangerCount++;
                break;
              case 4:
                // this.interestCount++;
                break;
            }
            this.interestCount++;
          }
        }
      });
    },
    updatePos(dx, dy) {
      this.x += dx;
      this.y += dy;
      if (!this.useConvexHull && this.$refs.chartbg) {
        this.$refs.chartbg.style =
          "top:" +
          (this.y - 2) +
          "px;" +
          "left:" +
          this.x +
          "px;transform: scale(" +
          this.scale * 0.83 +
          ");";
      }
    },
    updatePosDirect(x, y) {
      this.x += x;
      this.y += y;

      this.$refs.chartbg.style =
        "top:" +
        (this.y - 2) +
        "px;" +
        "left:" +
        this.x +
        "px;transform: scale(" +
        this.scale * 0.83 +
        ");";
    },
    async updateChart() {
      console.log("updateChart============================================");
      const redList = [];

      // 차트에 사용하는 데이터 준비
      await this.prepareData(false);

      // 테스트코드
      if (this.testMode === true) {
        this.recommendData.MHN_CL[this.testIndex].nodes.forEach((element) => {
          redList.push(element.index);
        });
      }
      this.recommendData.MHN_NL.forEach((elem, index) => {
        if (this.testMode === false) {
          if (elem.Node_State === 3) {
            redList.push(index);
          }
        }
      });

      // 차트 옵션값 설정
      const option = this.getOption(this.scale);

      const echart = echarts.init(this.$refs.chart, null, {
        renderer: this.renderer,
      });

      this.echart = option;
      // 네트워크 그래프 차트
      echart.setOption(option);

      if (this.useConvexHull) {
        // 클러스터 영역 그리는 차트(ConvexHull 알고리즘)
        const echart2 = echarts.init(this.$refs.chart2, null, {
          renderer: this.renderer,
        });
        echart2.setOption(this.getOption2());
      }
    },
    // 화면 해상도 변경시 처리
    resizeChart() {
      console.log("graph resize chart");
      if (!this.$refs.chart) return;
      this.resizeProcess();
    },
    resizeProcess() {
      this.prepareData(false);

      console.log(
        "resizeChart========================================================",
        this.$refs.article,
        window.innerHeight,
        document.documentElement.clientHeight,
        window.outerHeight,
        document.documentElement.offsetHeight
      );
      const target = this.$refs.wrapper;

      const option = this.getOption(this.scale);

      const echart = echarts.init(this.$refs.chart, null, {
        renderer: this.renderer,
      });

      this.echart = option;
      echart.setOption(option, { notMerge: true });
      console.log(echart.getDom().children[0].children[0]);
      const canvas = echart.getDom().children[0].children[0];

      const width =
        (target.clientWidth - (180 * this.getScale()) / 1.5) * this.resolution;

      const headerHeight = 55 + 55;

      const height = this.getHeight() * this.resolution;
      echart.resize({
        width: width,
        height: height,
      });
      console.log("canvas", canvas.style.width);
      console.log("canvas", canvas.style.height);

      let chartWrap = this.$refs.chartwrap;

      let scale = 1 / this.resolution; //height / window.innerHeight;

      const chartWidth =
        (target.clientWidth - (180 * this.getScale()) / 1.5) * this.resolution; //this.$refs.chart.offsetWidth;
      console.log("chartwidth", chartWidth);

      let margin = (target.clientWidth - chartWidth * scale) / 2;
      let top = 0; // headerHeight; //10 / scale + headerHeight * scale; //73.5 * scale; //25 / scale;

      let left = 0;

      if (this.isZoomMode) {
        left = cluster_data[this.zoomIndex].zoomLeft * this.getRateX();

        scale = scale * cluster_data[this.zoomIndex].zoomScale;
        top =
          (25 / scale +
            headerHeight * scale +
            cluster_data[this.zoomIndex].zoomTop * scale) *
          this.getRateY();
        margin = (target.clientWidth - chartWidth * scale) / 2;
      }
      console.log("margin", margin, scale);

      let marginLeft = (margin * 1.7) / scale;
      if (this.checkMobile()) {
        marginLeft = (margin * 1) / scale;
      }

      chartWrap.style =
        "top:" +
        top +
        "px;left:" +
        left +
        "px;margin: 0 " +
        margin +
        "px;margin-left:" +
        marginLeft +
        "px;transform: scale(" +
        scale +
        ");transform-origin:top left;";

      console.log("init======================================================");
      this.init++;
    },

    checkMobile() {
      isMobile();
      // return isMobile();
      return false;
    },

    getRateX() {
      console.log("domwidth", this.$refs.chart.offsetWidth);
      const targetWidth = this.$refs.wrapper.clientWidth;
      const baseWidth = 175;

      let rateX = (targetWidth - 180) / baseWidth;
      console.log("rateX", rateX);
      return rateX * this.resolution;
    },
    getHeight() {
      const headerHeight = 0;
      const recommendListHeight = 0; //85;
      const agileHeight = 0;
      const windowHeight = document.documentElement.offsetHeight; //window.innerHeight
      let height =
        windowHeight - recommendListHeight - headerHeight - agileHeight;
      console.log("height", height);
      const target = this.$refs.wrapper;

      height = target.clientHeight * this.resolution;
      return height;
    },
    getRateY() {
      const baseHeight = 732;

      let rateY = this.getHeight() / baseHeight;
      return rateY * this.resolution * 1.3;
    },
    async prepareData(needUpdateData = true) {
      console.log("========================================================");

      const rateX = this.getRateX();
      const rateY = this.getRateY();

      if (needUpdateData === true) {
        let req = await {
          op_code: 1,
          uid: this.userInfo.uid,
          name: this.userInfo.name,
        };

        const result = await recommendReport(req);
        this.recommendData = result.resultDto;
      }

      this.recommendData.MHN_NCL = this.recommendData.MHN_NCL.filter(
        (val, idx) => {
          return (
            this.recommendData.MHN_NCL.findIndex(
              (item) => item.Node_ID === val.Node_ID
            ) === idx
          ); //값이 처음나오는 배열 인덱스와 현재 인덱스가 같으면 포함
        }
      );

      this.recommendData.MHN_NL = this.recommendData.MHN_NL.filter(
        (val, idx) => {
          return (
            this.recommendData.MHN_NL.findIndex(
              (item) => item.Node_ID === val.Node_ID
            ) === idx
          ); //값이 처음나오는 배열 인덱스와 현재 인덱스가 같으면 포함
        }
      );
      this.recommendData.MHN_NL.forEach((element) => {
        this.recommendData.MHN_NCL.forEach((element2, index) => {
          if (element.Node_ID === element2.Node_ID) {
            // 노드정보에 클러스터 정보 매칭
            element.clusterInfo = element2;
            element.clusterIndex = index;
          }
        });
      });
      this.recommendData.MHN_NL.forEach((elem, index) => {
        elem.name = elem.Node_Name;
        elem.id = elem.Node_ID;
        elem.x = (elem.X * rateX) / rateY;
        elem.y = elem.Y;
        elem.index = index;

        switch (elem.Node_State) {
          case 0:
          case 1:
            // 정상 노드 색상
            elem.itemStyle = {
              animation: true,

              opacity: 0.3,
              color: "#717171",
            };

            break;
          case 2:
            // 주의 노드 색상
            elem.itemStyle = {
              animation: true,

              opacity: 1,
              color: "#FDC840",
            };
            break;
          case 3:
            // 위험 노드 색상
            elem.itemStyle = {
              animation: true,

              opacity: 1,
              color: "#C2373F",
            };

            break;
          case 4:
            break;
        }
      });

      let convertedLinks = [];

      this.recommendData.MHN_EL.forEach((elem) => {
        // 연결정보 데이터 세팅
        elem.name = elem.Edge_Name;
        elem.id = elem.Edge_ID;
        elem.source = elem.S_Node_ID;
        elem.target = elem.E_Node_ID;

        // 연결선 설정
        convertedLinks.push({
          ...elem,
          selected: { itemStyle: { opacity: 1, borderWidth: 5, color: "red" } },
          emphasis: { lineStyle: { color: "red", width: 10 } },
          lineStyle: {
            color: "#000000",
            // opacity: 0.4,
            // opacity: 0.0,
            width: 0.5,
          },
        });
      });

      this.linkList = convertedLinks;

      this.recommendData.MHN_CL = this.recommendData.MHN_CL.filter(
        (val, idx) => {
          return (
            this.recommendData.MHN_CL.findIndex(
              (item) => item.Cluster_ID === val.Cluster_ID
            ) === idx
          ); //값이 처음나오는 배열 인덱스와 현재 인덱스가 같으면 포함
        }
      );

      this.recommendData.MHN_CL.forEach((element, index) => {
        element.nodes = this.recommendData.MHN_NL.filter(
          (item) => item.clusterInfo[element.Cluster_ID.toUpperCase()] === 1
        );
        // console.log("cl nodes", element.nodes);

        const textOption = {
          textBorderWidth: 0,
          textBorderColor: "transparent",
          // distance: 0,
          // fontWeight: "lighter",
          // fontWeight: 300,
          fontFamily: "Pretendard",
        };

        element.nodes.forEach((elem) => {
          elem.symbol = cluster_data[index].symbol;
          if (elem.Node_Category.includes("Core")) {
            elem.symbol = "circle";
            elem.symbolSize = 18;
          }
          elem.label = { show: false };

          const fontLarge = ((14 * this.getScale()) / 2) * this.resolution;
          const fontSmall = ((10 * this.getScale()) / 2) * this.resolution;

          // 노드명 폰트 사이즈 모바일/PC에 따라 조절. 특정 항목만 보이도록 설정
          if (
            elem.Node_Category.includes("Core") ||
            elem.Node_Category.includes("Core-life")
          ) {
            // console.log("ct", elem.Node_Category);
            if (element.Cluster_State > 1) {
              if (this.checkMobile() === false) {
                elem.label = {
                  show: true,
                  fontSize: fontLarge, 
                  ...textOption,
                  fontFamily: "Pretendard",
                };
              } else {
                elem.label = {
                  show: true,
                  fontSize: fontSmall,
                  ...textOption,
                  fontFamily: "Pretendard",
                };
              }
            } else {
              if (this.checkMobile() === false) {
                elem.label = {
                  show: true,
                  fontSize: fontLarge,
                  ...textOption,
                  fontFamily: "Pretendard",
                };
              } else {
                elem.label = {
                  show: true,
                  fontSize: fontSmall,
                  ...textOption,
                  fontFamily: "Pretendard",
                };
              }
            }
          } else {
            if (this.checkMobile() === false) {
              elem.label = {
                show: true,
                fontSize: fontSmall,
                ...textOption,
                fontFamily: "Pretendard",
              };
            }
          }

          // 테스트 코드
          if (
            this.testMode &&
            this.testIndex === parseInt(element.Cluster_ID.replace("CL_0", ""))
          ) {
            elem.symbolSize = 60;
            // elem.symbol = "circle";
            elem.label = { show: true, fontSize: 50, fontFamily: "Pretendard" };

            elem.itemStyle = {
              color: "orange",
            };
            console.log("in", elem.Node_Name);
          } else {
            //
          }
        });
      });

      this.recommendData.MHN_CL = this.recommendData.MHN_CL.sort((a, b) => {
        return (
          Number(a.Cluster_ID.replace("CL_", "")) -
          Number(b.Cluster_ID.replace("CL_", ""))
        );
      });
    },
    // 클러스터별 상태값
    getClusterStatus(clusterIndex) {
      if (this.testCluster) return 1;
      if (this.recommendData) {
        // console.log(
        //   "clusterstate",
        //   clusterIndex,
        //   this.recommendData.MHN_CL[clusterIndex].Cluster_State
        // );

        let state = this.recommendData.MHN_CL[clusterIndex].Cluster_State;
        if (state >= 40) {
          //40이상이면 관심이면서 주의/위험
          return state - 40;
        }
        return state;
      }
      return 0;
    },
    async onSelectProduct(data) {
      await this.prepareData();

      const exist = this.selectedProductList.findIndex(
        (item) => item.ITEM_CODE === data.ITEM_CODE
      );

      if (exist === -1) {
        await this.selectedProductList.push(data);
      } else {
        await this.selectedProductList.splice(exist, 1);
      }

      let req = await {
        op_code: 4,
        uid: this.userInfo.uid,
        name: this.userInfo.name,
        param: this.selectedProductList,
      };

      if (this.selectedProductList.length !== 0) {
        console.log("select product");
      } else {
        req.op_code = 1;
      }

      const result = await recommendReport(req);

      if (result.resultDto.MHN_NL) {
        result.resultDto.MHN_NL = result.resultDto.MHN_NL.filter((val, idx) => {
          return (
            result.resultDto.MHN_NL.findIndex(
              (item) => item.Node_ID === val.Node_ID
            ) === idx
          );
        });

        this.recommendData.MHN_CL = this.recommendData.MHN_CL.filter(
          (val, idx) => {
            return (
              this.recommendData.MHN_CL.findIndex(
                (item) => item.Cluster_ID === val.Cluster_ID
              ) === idx
            );
          }
        );

        this.recommendData.MHN_NL.forEach((element, index) => {
          if (
            (element.Node_State === 3 || element.Node_State === 2) &&
            (result.resultDto.MHN_NL[index].Node_State === 0 ||
              result.resultDto.MHN_NL[index].Node_State === 1)
          ) {
            result.resultDto.MHN_NL[index].Node_State = 5;
            result.resultDto.MHN_NL[index].itemStyle = {
              animation: true,

              opacity: 1,
              color: "#50cc1a",
            };
            result.resultDto.MHN_NL[index].emphasis = {
              animation: true,

              itemStyle: {
                color: "#50cc1a",
              },
            };
          } else {
            // result.resultDto.MHN_NL[index].Node_State.emphasis = {};
          }
        });

        result.resultDto.MHN_CL = result.resultDto.MHN_CL.sort((a, b) => {
          return (
            Number(a.Cluster_ID.replace("CL_", "")) -
            Number(b.Cluster_ID.replace("CL_", ""))
          );
        });

        this.recommendData.MHN_CL.forEach((element, index) => {
          if (
            element.Cluster_State === 1 &&
            result.resultDto.MHN_CL[index].Cluster_State === 0
          ) {
            result.resultDto.MHN_CL[index].Cluster_State = 2;
          }
        });
        this.recommendData.MHN_CL = this.recommendData.MHN_CL.sort((a, b) => {
          return (
            Number(a.Cluster_ID.replace("CL_", "")) -
            Number(b.Cluster_ID.replace("CL_", ""))
          );
        });

        this.recommendData.MHN_NL = result.resultDto.MHN_NL;
        this.recommendData.MHN_CL = result.resultDto.MHN_CL;

        this.updateChart();
      }
    },
    // 차트 옵션 설정
    getOption(zoom = 1) {
      // zoom = 1.1;

      let convexHullData = this.getClusterData();
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
          elements: convexHullData, //네트워크 영역 데이터. convexHull 알고리즘 사용
        },
        series: [
          {
            itemStyle: {
              // opacity: 0.75,
              color: "#59C370",
            },
            silent: true,

            type: "graph",
            // layout: "none",
            data: this.recommendData.MHN_NL, //노드 리스트 세팅
            links: this.linkList, //연결 정보 데이터 세팅

            label: {
              show: true,
              position: "right",
              formatter: "{b}",
              opacity: 1,
              fontFamily: "Pretendard",
              // fontSize: 10,
            },
            labelLayout: {
              hideOverlap: false,
            },
            zoom: zoom,
            scaleLimit: {
              min: this.scaleMin,
              max: this.scaleMax,
            },
            blur: {
              itemStyle: {
                opacity: 1,
              },
              label: {
                opacity: 1,
              },
            },
            lineStyle: {
              color: "source",
              opacity: 0.25,
              // curveness: 0.3,
            },
            select: {
              animation: false,
              lineStyle: {
                // color: "#fc4a6a",
                color: "red",
                opacity: 1,
                width: 2,
              },
              itemStyle: {
                opacity: 1,
                color: "#fc4a6a",
              },
              label: {
                show: true,
                opacity: 1,
                fontWeight: "bold",
              },
            },
            selectedMode: "multiple",

            emphasis: {
              animation: false,

              disabled: false,
              focus: "adjacency",
              // scale: true,
              itemStyle: {
                opacity: 0.6,
                z: 100,
                color: "#C2373F",
              },
              lineStyle: {
                width: 10,
                color: "#ff0000",
                opacity: 1,
              },

              label: {
                position: ["0%", "120%"], //"right",
                // offset: [0, 15],
                align: "center",
                show: true,
                opacity: 1,
                // fontSize: this.isZoomMode ? 6 : 10,
                fontWeight: "bold",
                fontFamily: "Pretendard",
              },
            },
          },
          convexHullData,
        ],
      };

      return option;
    },
    groupBy(data, key) {
      return data.reduce(function (carry, el) {
        var group = el[key];
        if (carry[group] === undefined) {
          carry[group] = [];
        }
        carry[group].push(el);
        return carry;
      }, {});
    },
    getOption2(zoom = 1) {
      zoom;

      let optionData = this.getClusterData();

      return optionData;
    },
    // ConvexHull알고리즘 클러스터 영역 그리기
    getClusterData() {
      console.log("getclusterdata", this.x, this.y);
      let optionData = [];

      let selectIndex = [];

      const rateX = this.getRateX(); // / 1.3;
      const rateY = this.getRateY() / 3.5;

      // pdfscale바뀔때마다 /2처럼 해주면 된다. 1.3=pdf-scale 이 8일때 기준
      let scale = 1.3 / 2; //0.2115 * this.scale * rateY;
      const offset = 1 * scale;
      let offsetX = -93 * rateX;
      let offsetY = 125 * rateY;
      // let clusterCount = 0;

      const radius = 120 * scale;

      this.recommendData.MHN_CL.forEach((element, index) => {
        if (index + 1 !== this.testIndex && this.testMode === true) return;

        let points = [];

        // 클러스터에 해당하는 노드 위치값 추출
        element.nodes.forEach((el) => {
          points.push([el.x * scale, el.y * scale]);
          selectIndex.push(el.index);
        });

        if (points.length === 0) {
          optionData.push({
            type: "polygon",
            shape: {
              points: points,
              smooth: 1,
            },
            left: this.x, //points[0][0],
            top: this.y, //points[0][1],

            focus: "none",
            silent: true,
            style: {
              fill: "green",
              opacity: 0.1,
              lineWidth: 10,
            },
          });

          return;
        }
        while (points.length <= 2) {
          points.push([points[0][0] + offset, points[0][1] - offset]);
          points.push([points[0][0] - offset, points[0][1] - offset]);
          points.push([points[0][0] + offset, points[0][1] + offset]);
          points.push([points[0][0] - offset, points[0][1] + offset]);

          points.push([points[1][0] + offset, points[1][1] - offset]);
          points.push([points[1][0] - offset, points[1][1] - offset]);
          points.push([points[1][0] + offset, points[1][1] + offset]);
          points.push([points[1][0] - offset, points[1][1] + offset]);
        }

        let left = 0;
        let top = 0;
        let right = 0;
        let bottom = 0;
        // console.log("bef", points);
        points.forEach((elem, index) => {
          if (index === 0) {
            left = elem[0];
            top = elem[1];
            right = elem[0];
            bottom = elem[1];
          } else {
            if (left > elem[0]) left = elem[0];
            if (top > elem[1]) top = elem[1];
            if (right < elem[0]) right = elem[0];
            if (bottom < elem[1]) bottom = elem[1];
          }
        });

        // 일정범위 넘어가는 포인트들은 각각의 그룹으로 분리
        const clusters = clustering(points, 400 * rateY);
        // console.log("clusters", clusters);

        // eslint-disable-next-line no-unreachable
        clusters.forEach((cl_element) => {
          // convexHull알고리즘으로 포인트 추출
          points = convexHull(cl_element);

          while (points.length <= 2) {
            points.push([
              points[0][0] + offset * rateX,
              points[0][1] - offset * rateY,
            ]);
            points.push([
              points[0][0] - offset * rateX,
              points[0][1] - offset * rateY,
            ]);
            points.push([
              points[0][0] + offset * rateX,
              points[0][1] + offset * rateY,
            ]);
            points.push([points[0][0] - offset, points[0][1] + offset * rateY]);

            points.push([
              points[1][0] + offset * rateX,
              points[1][1] - offset * rateY,
            ]);
            points.push([
              points[1][0] - offset * rateX,
              points[1][1] - offset * rateY,
            ]);
            points.push([
              points[1][0] + offset * rateX,
              points[1][1] + offset * rateY,
            ]);
            points.push([
              points[1][0] - offset * rateX,
              points[1][1] + offset * rateY,
            ]);
          }

          // 중심값 계산
          let centerPoints = centroid(points);

          // 각 클러스터별 좌표값 오차가 있어 수동으로 설정해줌
          if (index + 1 === 3) {
            points.push([centerPoints[0], top - radius * 0.1]);
          }
          if (index + 1 === 5) {
            offsetX = -95 * rateX;
            offsetY = 115 * rateY;
          }

          if (index + 1 === 7 && cl_element.length > 2) {
            offsetX = -95 * rateX;
            offsetY = 120 * rateY;
          }
          if (index + 1 === 8) {
            points.push([left, centerPoints[1] + radius * rateY * 0.1]);
            points.push([right, centerPoints[1] + radius * rateY * 0.1]);
            offsetX = -95 * rateX;
            offsetY = 105 * rateY;
          }
          if (index + 1 === 9 && cl_element.length > 2) {
            offsetY = 105 * rateY;
          }

          if (index + 1 === 11 && cl_element.length > 2) {
            //
          }

          if (index + 1 === 12) {
            points.push([centerPoints[0], top - radius * 0.1]);
            points.push([left, top + radius * 2]);
          }
          if (index + 1 === 13 && cl_element.length > 2) {
            points.push([
              left - radius * 0.05,
              centerPoints[1] - radius * rateY * 0.1,
            ]);
            points.push([
              left - radius * 0.5,
              centerPoints[1] + radius * rateY * 0.15,
            ]);
            offsetY = 117 * rateY;
          }
          if (index + 1 === 14) {
            points.push([centerPoints[0], top - radius * 0.1]);
            offsetY = 130 * rateY;
          }
          if (index + 1 === 15) {
            offsetY = 115 * rateY;
          }
          if (index + 1 === 16 && cl_element.length > 2) {
            offsetY = 112 * rateY;
          }

          if (index + 1 === 17 && cl_element.length > 2) {
            offsetY = 118 * rateY;
          }

          if (index + 1 === 18 && cl_element.length > 2) {
            offsetX = -95 * rateX;
            offsetY = 114 * rateY;
          }

          if (index + 1 === 19 && cl_element.length > 2) {
            offsetY = 114 * rateY;
          }
          if (index + 1 === 20 && cl_element.length > 2) {
            offsetY = 114 * rateY;
          }
          if (index + 1 === 21) {
            points.push([centerPoints[0], top - radius * 0.5]);
            points.push([left - radius * 0.5, centerPoints[1]]);
            offsetY = 116 * rateY;
          }
          if (index + 1 === 22) {
            points.push([centerPoints[0], top - radius * 0.1]);
            offsetY = 116 * rateY;
          }
          if (index + 1 === 23) {
            offsetX = -95 * rateX;
            offsetY = 116 * rateY;
          }
          if (index + 1 === 24) {
            offsetX = -97 * rateX;
            offsetY = 113 * rateY;
          }

          points.forEach((elem, index) => {
            index;
            const vector = getVector(elem, centerPoints);
            elem[0] += vector[0] * radius;
            elem[1] += vector[1] * radius;
          });

          //각 포지션 radius값만큼 넓힌후 재계산
          points = convexHull(points);
          points.forEach((elem, index) => {
            if (index === 0) {
              left = elem[0];
              top = elem[1];
              right = elem[0];
              bottom = elem[1];
            } else {
              if (left > elem[0]) left = elem[0];
              if (top > elem[1]) top = elem[1];
              if (right < elem[0]) right = elem[0];
              if (bottom < elem[1]) bottom = elem[1];
            }
          });

          console.log("CL", element.Cluster_State);
          let color = "green";

          let existInterestBorder = false;
          if (element.Cluster_State >= 40) {
            existInterestBorder = true;
          }

          let includeSex = true;
          cluster_name_left.forEach((element2) => {
            if (element2.index === index) {
              if (element2.sex && element2.sex !== this.userInfo.sex)
                includeSex = false;
            }
          });
          cluster_name_right.forEach((element2) => {
            if (element2.index === index) {
              if (element2.sex && element2.sex !== this.userInfo.sex)
                includeSex = false;
            }
          });

          // 해당 성별에서 보여야하는 리스트인지 판단 후 맞는 경우 상태값에 따라 배경색 설정
          if (includeSex) {
            switch (element.Cluster_State) {
              case 0:
              color = "#7171711A";
                break;
              case 1:
                color = "#7171711A";

                break;
              case 2:
                color = "#F8B50026";
                break;
              case 3:
                color = "#E953714D";
                break;
              case 4:
                color = "#00AFEC66";
                break;
              default:
                break;
            }

            switch (element.Cluster_State - 40) {
              case 0:
              color = "#7171711A";
                break;
              case 1:
                color = "#7171711A";

                break;
              case 2:
                color = "#F8B50026";
                break;
              case 3:
                color = "#E953714D";
                break;
              case 4:
                color = "#00AFEC66";
                break;
              default:
                break;
            }
          } else {
            color = "#7171711A";
          }

          optionData.push({
            type: "polygon",
            shape: {
              points: points,
              // smooth: 0.5,
              smooth: 0.5,
            },
            left: this.x + left + offsetX, //points[0][0],
            top: this.y + top + offsetY, //points[0][1],
            focus: "none",
            silent: true,

            style: {
              fill: color, //"green",
              opacity: 1,
              // element.Cluster_State === 0 || element.Cluster_State === 1
              //   ? 0.1
              //   : !includeSex
              //   ? 0.1
              //   : 0.5,

              lineWidth: 3 * this.pdfScale,
              stroke: existInterestBorder ? "#55C3F1" : "transparent",
            },
          });
        });
      });

      return optionData;
    },
    getDateStr(dateStr) {
      var yyyyMMdd = String(dateStr);
      var sYear = yyyyMMdd.substring(0, 4);
      var sMonth = yyyyMMdd.substring(4, 6);
      var sDate = yyyyMMdd.substring(6, 8);

      // var date = new Date(Number(sYear), Number(sMonth) - 1, Number(sDate));

      // return sYear + "-" + sMonth + "-" + sDate;

      // var week = ["일", "월", "화", "수", "목", "금", "토"];
      return sYear + "년 " + sMonth + "월 " + sDate + "일";
    },
    getScale() {
      return this.pdfScale;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/pdf/_variables.scss";
@import "@/assets/css/pdf/result.scss";
@import "@/assets/css/pdf/document.scss";

article {
  position: relative;
  overflow: hidden;
  height: calc(100vh);
  max-width: $max-width;
  padding-top: $header !important;
}
.chart-wrap {
  position: absolute;
  transform-origin: left top;
  overflow: visible;
  /* width: 500px; */
  width: 100%;
  /* max-width: $max-width; */
  /* height: 732px; */
  /* height: calc(100vh - 73.5px); */
  /* height: 100vh; */
  height: 100%;
  /* margin: 0 60px !important; */
  /* margin: 0 auto; */
  // margin-bottom: -73.5px;
}

.echart-bg {
  position: absolute;

  /* width: 500px; */
  width: 100%;
  max-width: $max-width;
  /* height: 732px; */

  /* margin: 0 auto; */
  // margin-bottom: -50px;
  top: 0px;
  left: 0px;
  transform-origin: center center;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  overflow: hidden;
  z-index: 0;

  img {
    position: absolute;
    object-fit: contain;
    transition: opacity 0.5s;
    opacity: 0.5;
  }

  .interest {
    opacity: 0.5;
    z-index: 1;
  }
  .warn {
    opacity: 0.3;
    z-index: 2;
    // opacity: 0.9;
    // filter: invert(11%) sepia(64%) saturate(6689%) hue-rotate(357deg)
    //   brightness(127%) contrast(117%);

    // filter: invert(166%) sepia(105%) saturate(2819%) hue-rotate(339deg)
    //   brightness(92%) contrast(332%);
  }
  .danger {
    opacity: 0.4;
    z-index: 3;
    // filter: invert(29%) sepia(100%) saturate(7498%) hue-rotate(356deg)
    //   brightness(89%) contrast(129%);
    // filter: invert(20%) sepia(43%) saturate(5731%) hue-rotate(344deg)
    //   brightness(90%) contrast(73%);
  }

  .safe {
    opacity: 0.1;
    z-index: 0;
    // filter: invert(58%) sepia(89%) saturate(1227%) hue-rotate(60deg)
    //   brightness(104%) contrast(83%);
  }
}

.echart {
  position: absolute;
  /* width: 500px; */
  width: 100%;
  height: 100%;
  /* height: 732px; */

  margin: 0 auto;
  // margin-bottom: -50px;
  top: 0;
  left: 0px;

  text {
    color: red !important;
  }
}
.echart2 {
  position: absolute;
  width: 100%;
  max-width: $max-width;
  height: 100%; //calc(100vh - $header); //600px;
  /* min-height: 300px; */

  margin: 0 auto;
  margin-bottom: -50px;
  top: 0px;
  left: 0px;
  transform-origin: left center;
}

.info {
  //@include flex(center, center);
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: space-between;
  height: 33px;
  /* margin-top: $header; */

  .info-list {
    //@include flex(flex-start, center);
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .info-recommend {
    margin-top: 13px;
    background: #d9d9d9;
    border-radius: 7px;
    padding: 4px 10px;
    margin-right: 31px;
  }
  .info-item {
    margin-top: 13px;
    font-weight: 600;
    font-size: 12px;
    line-height: 14px;
    display: flex;
    align-items: center;

    color: rgba(65, 64, 66, 0.8);
  }
  .info-danger {
    margin-left: 28px;
    margin-right: 4px;
    width: 20px;
    height: 20px;
    background: #e95371;
    border-radius: 6px;

    //@include flex(center, center);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .info-warn {
    margin-left: 7px;
    margin-right: 4px;
    width: 20px;
    height: 20px;
    background: #f8b500;
    border-radius: 6px;

    //@include flex(center, center);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .info-interest {
    margin-left: 7px;
    margin-right: 4px;
    width: 20px;
    height: 20px;
    background: #00afec;
    border-radius: 6px;

    //@include flex(center, center);
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.label {
  position: absolute;
  display: flex;
  width: 100%;
  justify-content: flex-end;
  gap: 10px;
  bottom: 65px;
}

.label-safe {
  display: inline-block;
  text-align: right;
  font-size: 8px;

  span {
    vertical-align: baseline;
    display: inline-block;
    margin-right: 3px;
    width: 8px;
    height: 8px;
    background: #50cc1a; //#feae70;
  }
}

.label-danger {
  display: inline-block;
  text-align: right;
  font-size: 8px;
  span {
    vertical-align: baseline;
    display: inline-block;
    margin-right: 3px;
    width: 8px;
    height: 8px;
    background: #fc4a6a; //#feae70;
  }
}

.control {
  position: absolute;
  bottom: 50px;
  left: 5%;
  display: flex;
  gap: 10px;

  div {
    width: 30px;
    height: 30px;
    font-size: 20px;
    background-color: white;
    box-shadow: 3px 10px 30px #00000053;
    gap: 10px;
    flex-direction: column;
    border-radius: 25%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.zoom-info {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  width: 100%;
  top: $header;
  /* margin-top: $header; */

  background-color: #f3f3f3;

  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  /* identical to box height */

  letter-spacing: 0.0703846px;
  text-decoration-line: underline;

  padding: 0 28px;

  color: #414042;

  img {
    width: 22px;
    height: 22px;
  }
}

article {
  padding: 0;
}

.cluster-list {
  color: rgba(65, 64, 66, 0.6);
  text-align: right;
  font-size: calc(12px / 1.5 * $pdf-scale);
  font-weight: 400;
  letter-spacing: calc(0.07px * $pdf-scale);

  .focused {
    color: #414042;
    text-align: right;
    font-size: calc(12px / 1.5 * $pdf-scale);
    font-family: Pretendard;
    font-weight: 700;
    letter-spacing: calc(0.07px * $pdf-scale);
    text-decoration-line: underline;
  }
  .left-list {
    position: absolute;
    /* width: 90px; */
    left: 0;
    padding-top: calc(60px / 1.5 * $pdf-scale);
    padding-bottom: calc(60px / 1.5 * $pdf-scale);
    margin-left: calc(28px / 1.5 * $pdf-scale);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    height: 100%;
    /* height: calc(100% - calc(136.5px * $pdf-scale)); */
  }
  span {
    display: inline-block;
    text-align: left;
    white-space: pre-wrap;

    padding: calc(7px / 1.5 * $pdf-scale) calc(13px / 1.5 * $pdf-scale);

    border-radius: calc(8px / 1.5 * $pdf-scale);
    background: rgba(204, 204, 204, 0.2);
  }

  .right-list {
    position: absolute;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    text-align: right;
    /* margin-top: calc(30px * $pdf-scale); */
    margin-right: calc(28px / 1.5 * $pdf-scale);
    padding-top: calc(60px / 1.5 * $pdf-scale);
    padding-bottom: calc(60px / 1.5 * $pdf-scale);
    height: 100%;
    /* height: calc(100% - calc(136.5px * $pdf-scale)); */
  }

  .danger {
    /* border-radius: calc(8px / 1.5 * $pdf-scale);
    border: calc(0.5px / 1.5 * $pdf-scale) solid #c0373f;
    background: rgba(192, 55, 63, 0.4);

    color: #414042; */
    background-color: transparent;
    color: #e95371;
    font-size: calc(8px * $pdf-scale);
    font-weight: 500;
    letter-spacing: calc(0.07px * $pdf-scale);
  }

  .warn {
    /* border-radius: calc(8px / 1.5 * $pdf-scale); */
    /* border: calc(0.5px / 1.5 * $pdf-scale) solid #fdc840; */
    /* background: rgba(253, 200, 64, 0.4); */

    /* color: #414042; */
    background-color: transparent;
    color: #f8b500;
    font-size: calc(8px * $pdf-scale);
    font-weight: 500;
    letter-spacing: calc(0.07px * $pdf-scale);
  }

  .safe {
    /* color: #414042;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.07px; */
    background-color: transparent;
    color: #717171;
    font-size: calc(8px * $pdf-scale);
    font-weight: 500;
    letter-spacing: calc(0.07px * $pdf-scale);
  }

  .interest {
    /* border-radius: calc(8px / 1.5 * $pdf-scale);
    border: calc(0.5px / 1.5 * $pdf-scale) solid #73c0eb;

    background: rgba(115, 192, 235, 0.4); */

    background-color: transparent;
    color: #00afec;
    font-size: calc(12px / 1.5 * $pdf-scale);
    font-weight: 700;
    letter-spacing: calc(0.07px * $pdf-scale);
  }
}

.on {
  // bottom: 409px !important;
  transition: bottom 0.5s;
  bottom: 0px !important;
}
.recommend-list {
  opacity: 0.5;
  pointer-events: none;
  z-index: 1000;
  position: absolute;
  width: 100%;
  transition: bottom 0.5s;
  /* bottom: -409px; */
  bottom: 0px;
  background-color: #f3f3f3;

  color: #414042;

  .header {
    //@include flex(flex-start, center);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 6px;

    padding-top: 28px;
    height: calc(85px * $pdf-scale);

    font-weight: 500;
    font-size: calc(16px * $pdf-scale);
    line-height: 19px;
    /* identical to box height */

    letter-spacing: 0.0703846px;
    border-top: calc(1px * $pdf-scale) solid #d9d9d9;

    span {
      font-weight: 400;
      font-size: calc(12px * $pdf-scale);
      line-height: calc(14px * $pdf-scale);
      text-align: center;
      letter-spacing: 0.0703846px;

      color: #db621e;
    }

    .btn {
      //@include flex(center, center);
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0px;
      width: 33px;
      height: 13px;
      background-color: black;
      border-top-right-radius: 0px;
      border-top-left-radius: 0px;
      border-bottom-right-radius: 6px;
      border-bottom-left-radius: 6px;

      img {
        width: 9px;
        height: auto;
      }

      .down {
        rotate: 180deg;
      }
    }
  }

  .list {
    width: 100%;
    height: 409px;
    background-color: #f3f3f3;
  }

  .control_product {
    // position: absolute;
    display: flex;
    // gap: 10px;
    flex-direction: column;
    height: 409px;
    overflow: scroll;
    background-color: #e6e6e6;

    .product-item {
      width: 100%;
      height: 96px;
      font-size: 20px !important;
      gap: 10px;
      flex-direction: row;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin: 0 16px;

      font-size: 15px;
      .text {
        //@include flex(center, flex-start);
        display: flex;
      justify-content: center;
      align-items: flex-start;
        flex-direction: column;
        gap: 5px;
      }
      span {
        font-weight: 300;
        font-size: 14px;
        line-height: 17px;
        letter-spacing: 0.0703846px;

        color: rgba(65, 64, 66, 0.8);
      }
      p {
        font-weight: 400;
        font-size: 16px;
        line-height: 19px;
        letter-spacing: 0.0703846px;

        color: #414042;
      }
    }
    hr {
      border-top: 1px solid white;

      margin: 0 16px;
      &:last-child {
        display: none;
      }
    }

    .icon {
      width: 72px;
      height: 72px;
    }
    img {
      width: 72px;
      height: 72px;
      background-color: white;
      border-radius: 10px;
    }

    .unselected {
      opacity: 0.5;
    }
  }
}

.chk_box {
  display: block;
  position: relative;
  //   padding-left: 25px;
  //   margin-bottom: 10px;
  font-size: 14px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  width: 19px;
  height: 19px;
}
label {
  width: 19px;
  z-index: 1000;
}
.chk_box input[type="checkbox"] {
  display: none;
  width: 19px;
  height: 19px;
}
.chk-on {
  z-index: 1000;
  margin-left: 5px;
  margin-top: 5px;

  width: 19px;
  height: 19px;
  background: white;
  border: 1px solid #707070;
  border-radius: 3px;
  position: absolute;
  top: 0;
  left: 0;
}
.chk_box input[type="checkbox"]:checked + .chk-on {
  background: #c4926d;
  border: 1px solid #c4926d;
}
.chk-on:after {
  content: "";
  position: absolute;
  display: none;
}
.chk_box input[type="checkbox"]:checked + .chk-on:after {
  display: block;
}
.chk-on:after {
  width: 6px;
  height: 10px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
  position: absolute;
  left: 5px;
  top: 0px;
}

.graph-wrapper {
  width: 80%;
  height: 100%;
}
</style>
