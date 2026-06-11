import LayoutNormal from '@/layouts/LayoutNormal.vue'

const myPageRouter = {
  path: '/my-page',
  name: 'myPage',
  component: LayoutNormal,
  children: [
    {
      path: 'detail',
      name: 'MyPage',
      component: () => import('@/views/mypage/MyPage.vue'),
      meta: {
        title: 'Router.myPage.text1',
        class: 'short'
      }
    },
    {
      path: 'checkup-list',
      name: 'MyPageCheckupList',
      component: () => import('@/views/mypage/MyPageCheckupDataRecord.vue'),
      meta: {
        title: 'Router.myPage.text2',
        class: 'middle'
      }
    },
    {
      path: 'body-composition-list',
      name: 'MyPageBodyCompositionList',
      component: () => import('@/views/mypage/MyPageBodyCompositionDataRecord.vue'),
      meta: {
        title: '체성분 데이터 이력',
        class: 'middle'
      }
    },
    {
      path: 'checkup-detail/:id/complete-type/:completeType',
      name: 'MyPageCheckupDetail',
      component: () => import('@/views/mypage/MyPageCheckupDataRecordDetail.vue'),
      meta: {
        title: 'Router.myPage.text3',
        class: 'wide'
      },
      props: true
    },
                         {
           path: 'body-composition-detail',
           name: 'MyPageBodyCompositionDetail',
           component: () => import('@/views/mypage/MyPageBodyCompositionDataRecordDetail.vue'),
           meta: {
             title: '체성분 데이터 이력',
             class: 'wide'
           }
         },
    {
      path: 'print-list',
      name: 'MyPagePrintList',
      component: () => import('@/views/mypage/ReportRequestHistory.vue'),
      meta: {
        title: 'Router.myPage.text4',
        class: 'middle'
      }
    }
  ]
}

export default myPageRouter
