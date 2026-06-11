import LayoutAnalyze from '@/layouts/LayoutAnalyze.vue'
import store from '@/store'

const analyzeRouter = {
  path: '/analyze',
  name: 'Analyze',
  component: LayoutAnalyze,
  redirect: { name: 'AnalyzeList' },
  children: [
    {
      path: 'list',
      name: 'AnalyzeList',
      component: () => import('@/views/analyze/Analyze.vue'),
      meta: {
        title: 'Router.analyze.text1',
        class: 'wide'
      }
    },
    {
      path: 'detail',
      name: 'AnalyzeDetail',
      component: () => import('@/views/analyze/detail/AnalyzeDetail.vue'),
      meta: {
        title: 'Router.analyze.text2',
        class: 'whiteHeader wide'
      },

    },
    {
      path: 'aging',
      name: 'AnalyzeAging',
      component: () => import('@/views/analyze/AnalyzeScorecomAnalyzeIndexDetail.vue'),
      meta: {
        title: 'Router.analyze.text3',
        class: 'wide'
      }
    },
    {
      path: 'chronic-disease',
      name: 'AnalyzeChronicDisease',
      component: () => import('@/views/analyze/AnalyzeScorecomAnalyzeIndexDetail.vue'),
      meta: {
        title: 'Router.analyze.text4',
        class: 'wide'
      }
    },
    {
      path: 'aging-speed',
      name: 'AnalyzeAgingSpeed',
      component: () => import('@/views/analyze/AnalyzeAgingSpeedDetail.vue'),
      meta: {
        title: 'Router.analyze.text5',
        class: 'wide'
      }
    },
    {
      path: 'health-light',
      name: 'AnalyzeHealthLight',
      component: () => import('@/views/analyze/AnalyzeHealthLightDetail.vue'),
      meta: {
        title: 'Router.analyze.text6',
        class: 'wide'
      }
    },
    {
      path: 'major-health-risk',
      name: 'AnalyzeMajorHealthRisk',
      component: () => import('@/views/analyze/components/analyzeMajorHealthRisk/AnalyzeMajorHealthRisk.vue'),
      meta: {
        title: 'Router.analyze.text9',
        class: 'wide'
      },
      beforeEnter: (to, from, next) => {
        // detailId를 store에서 가져와서 컴포넌트에 전달
        const healthLightParams = store.getters['analyze/getHealthLightParams']
        if (healthLightParams && healthLightParams.detailId) {
          to.params.detailId = healthLightParams.detailId
        }
        next()
      }
    },
    {
      // 근육 밸런스 분석 지수
      path: 'muscle-balance',
      name: 'AnalyzeMuscleBalance',
      component: () => import('@/views/analyze/AnalyzeMuscleBalanceDetail.vue'),
      meta: {
        title: 'Router.checkup.text22',
        class: 'wide'
      }
    },
    {
      // 식사
      path: 'diet',
      name: 'AnalyzeDiet',
      component: () => import('@/views/analyze/AnalyzeDietDetail.vue'),
      meta: {
        title: 'Router.checkup.text25',
        class: 'wide'
      }
    },
    {
      // 운동
      path: 'exercise',
      name: 'AnalyzeExercise',
      component: () => import('@/views/analyze/AnalyzeExerciseDetail.vue'),
      meta: {
        title: 'Router.checkup.text27',
        class: 'wide'
      }
    },
    {
      // 수면
      path: 'sleep',
      name: 'AnalyzeSleep',
      component: () => import('@/views/analyze/AnalyzeSleepDetail.vue'),
      meta: {
        title: 'Router.checkup.text29',
        class: 'wide'
      }
    },
    {
      // 검진 데이터 이력
      path: 'checkup-data-record',
      name: 'AnalyzeCheckupDataRecord',
      component: () => import('@/views/analyze/components/AnalyzeCheckupDataRecord.vue'),
      meta: {
        title: 'Router.analyze.text8',
        class: 'wide'
      }
    },
    {
      path: 'report',
      name: 'AnalyzeReportView',
      component: () => import('@/util/pdf/ResultDocumentChangeLibrary.vue'),
      meta: {
        title: 'Router.analyze.text7',
        class: 'wide'
      }
    }
  ]
}

export default analyzeRouter
