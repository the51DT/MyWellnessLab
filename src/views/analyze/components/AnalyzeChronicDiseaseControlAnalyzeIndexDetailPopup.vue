<script>
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default {
  name: 'AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup',
  data () {
    return {
      chartEl: '', /* 차트 */
      data: [ /* 실 데이터 */
        {
          year: '23.10.01',
          count: 80
        },
        {
          year: '23.10.02',
          count: 90
        },
        {
          year: '23.10.03',
          count: 70
        },
        {
          year: '23.10.04',
          count: 60
        },
        {
          year: '22.10.05',
          count: 80
        }
      ],
      averageData: [ /* 나이대 평균 데이터 */
        {
          year: '23.10.01',
          count: 80
        },
        {
          year: '23.10.02',
          count: 80
        },
        {
          year: '23.10.03',
          count: 80
        },
        {
          year: '23.10.04',
          count: 80
        },
        {
          year: '22.10.05',
          count: 80
        }
      ]
    }
  },
  mounted () {
    // Interaction.modes.myCustomMode = function(chart, e, options, useFinalPosition) {
    //   const position = getRelativePosition(e, chart);
    //
    //   const items = [];
    //   Interaction.evaluateInteractionItems(chart, 'x', position, (element, datasetIndex, index) => {
    //     // if (element.inXRange(position.x, useFinalPosition) && myCustomLogic(element)) {
    //     //   items.push({element, datasetIndex, index});
    //     // }
    //   console.log('aaaaaaaaaaaaa')
    //   });
    //   return items;
    // };

    /**
     * 차트 그리기
     */
    this.chartEl = new Chart(document.getElementById('chartDom'), {
      type: 'line',
      data: {
        labels: this.data.map(row => row.year),
        datasets: [
          {
            data: this.data.map(row => row.count),
            tension: 0.5,
            borderColor: '#ff0000'
          },
          {
            data: this.averageData.map(row => row.count),
            tension: 0.5,
            borderDash: [5, 5],
            borderColor: '#cccccc'
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: false
            // onClick: this.showValue,
            // onClick: (e) => {
            //   console.log('aaaaaaaaa')
            // }
          }
        },
        scales: {
          y: {
            min: 0,
            max: 100
            // ticks: {
            //   onClick: function(value, index, ticks) {
            //     console.log(value)
            //     // return '$' + value;
            //   }
            //   // onClick: this.showValue,
            // },
            // labels: {
            //   onClick: function(value, index, ticks) {
            //     console.log(value)
            //     // return '$' + value;
            //   },
            //   callback: function(value, index, ticks) {
            //     console.log(value)
            //     // return '$' + value;
            //   }
            // }
          }
          // x: {
          //   onClick: (e) => {
          //     console.log('bbbbb')
          //   }
          // }
        },
        // events: ["click"]
        // interaction: {
        //   mode: 'myCustomMode'
        // }
        onClick: function (event, elements) {
          if (elements.length && elements[0].element) {
            if (elements[0].element instanceof Chart.elements.ScaleLabel) {
              // const datasetIndex = elements[0].datasetIndex;
              // const index = elements[0].index;
              // const clickedValue = this.data.datasets[datasetIndex].data[index];
              // console.log('aaaaaaaaaaa')
            }
          }
        }
      }
    })
  },
  methods: {
    /**
     * 팝업 닫기
     */
    close () {
      this.$emit('popupClose')
    }
    // showValue(e, legendItem, legend){
    //   console.log(e, legendItem, legend)
    // }
    // func (event, el){
    //   if(el.length){
    //     const datasetIndex = el[0].datasetIndex;
    //     const index = el[0].index;
    //     const clickedValue = this.data.datasets[datasetIndex].data[index];
    //     console.log(clickedValue)
    //   }
    // }
  }
}
</script>

<template>
  <div class="popup AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup">
    <div class="popup--wrap tit AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--popup-wrap">
      <div class="align--between popup--header AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--header">
        <div />
        <div class="popup--tit-wrap AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--tit-wrap">
          <span class="popup--tit AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--tit">{{ $t('AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup.text1')}}</span>
        </div>
        <div class="popup--close AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--close">
          <button @click="close" type="button" class="popup--close AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--close-btn">X</button>
        </div>
      </div>
      <div class="popup--space AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--space">
        <canvas id="chartDom" class="AnalyzeChronicDiseaseControlAnalyzeIndexDetailPopup--chart" /> <!--그래프-->
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
