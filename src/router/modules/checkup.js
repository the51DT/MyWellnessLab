import LayoutCheckup from '@/layouts/LayoutCheckup.vue'

const checkupRouter = {
  path: '/checkup',
  name: 'Checkup',
  component: LayoutCheckup,
  children: [
    {
      path: 'basics',
      name: 'CheckupBasics',
      component: () => import('@/views/checkup/basics/CheckupBasics.vue'),
      meta: {
        title: 'Router.checkup.text17',
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'blood',
      name: 'CheckupBlood',
      component: () => import('@/views/checkup/blood/CheckupBlood.vue'),
      meta: {
        title: 'Router.checkup.text17',
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'body-guide',
      name: 'CheckupBodyGuide',
      component: () => import('@/views/checkup/body/CheckupBodyGuide.vue'),
      meta: {
        title: 'Router.checkup.text18',
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'body',
      name: 'CheckupBody',
      component: () => import('@/views/checkup/body/CheckupBody.vue'),
      meta: {
        title: 'Router.checkup.text18',  // i18n 메시지키
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'body-key-login',
      name: 'CheckupBodyKeyLogin',
      component: () => import('@/views/checkup/body/CheckupBodyKeyLogin.vue'),
      meta: {
        title: 'Router.checkup.text18',
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'body-key-data-list',
      name: 'CheckupBodyKeyDataList',
      component: () => import('@/views/checkup/body/CheckupBodyKeyDataList.vue'),
      meta: {
        title: 'Router.checkup.text18',
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'body-date-select',
      name: 'CheckupBodyDateSelect',
      component: () => import('@/views/checkup/body/CheckupBodyDateSelect.vue'),
      meta: {
        title: 'Router.checkup.text18',
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'body-direct-input',
      name: 'CheckupBodyDirectInput',
      component: () => import('@/views/checkup/body/CheckupBodyDirectInput.vue'),
      meta: {
        title: 'Router.checkup.text18',
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'interests',
      name: 'CheckupInterestHealth',
      component: () => import('@/views/checkup/interests/CheckupInterestHealth.vue'),
      meta: {
        title: 'Router.checkup.text19',
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'memory',
      name: 'CheckupMemory',
      component: () => import('@/views/checkup/memory/CheckupMemory.vue'),
      meta: {
        title: 'Router.checkup.text19',
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'eye',
      name: 'CheckupEye',
      component: () => import('@/views/checkup/eye/CheckupEye.vue'),
      meta: {
        title: 'Router.checkup.text19',
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'nose',
      name: 'CheckupNoseHypersensitivity',
      component: () => import('@/views/checkup/nose/CheckupNoseHypersensitivity.vue'),
      meta: {
        title: 'Router.checkup.text19',
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'stomach',
      name: 'CheckupStomach',
      component: () => import('@/views/checkup/stomach/CheckupStomach.vue'),
      meta: {
        title: 'Router.checkup.text19',
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'intestine',
      name: 'CheckupIntestine',
      component: () => import('@/views/checkup/intestine/CheckupIntestine.vue'),
      meta: {
        title: 'Router.checkup.text19',
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'joint-bone',
      name: 'CheckupJointAndBone',
      component: () => import('@/views/checkup/joint-bone/CheckupJointAndBone.vue'),
      meta: {
        title: 'Router.checkup.text19',
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'immunity',
      name: 'CheckupImmunity',
      component: () => import('@/views/checkup/immunity/CheckupImmunity.vue'),
      meta: {
        title: 'Router.checkup.text19',
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'menopause',
      name: 'CheckupMenopause',
      component: () => import('@/views/checkup/menopause/CheckupMenopause.vue'),
      meta: {
        title: 'Router.checkup.text19',
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'prostate',
      name: 'CheckupProstate',
      component: () => import('@/views/checkup/prostate/CheckupProstate.vue'),
      meta: {
        title: 'Router.checkup.text19',
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'menstrual',
      name: 'CheckupMenstrual',
      component: () => import('@/views/checkup/menstrual/CheckupMenstrual.vue'),
      meta: {
        title: 'Router.checkup.text19',
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'medication',
      name: 'CheckupMedication',
      component: () => import('@/views/checkup/medication/CheckupMedication.vue'),
      meta: {
        title: 'Router.checkup.text20',
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'diet',
      name: 'CheckupDiet',
      component: () => import('@/views/checkup/diet/CheckupDiet.vue'),
      meta: {
        title: 'Router.checkup.text20',
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'sleep',
      name: 'CheckupSleep',
      component: () => import('@/views/checkup/sleep/CheckupSleep.vue'),
      meta: {
        title: 'Router.checkup.text20',
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'physical',
      name: 'CheckupPhysicalActivity',
      component: () => import('@/views/checkup/physical/CheckupPhysicalActivity.vue'),
      meta: {
        title: 'Router.checkup.text20',
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'drink-smoke-sleep',
      name: 'CheckupDrinkSmokeSleep',
      component: () => import('@/views/checkup/drink-smoke-sleep/CheckupDrinkSmokeSleep.vue'),
      meta: {
        title: 'Router.checkup.text20',
        class: 'middle checkup-arrow'
      }
    },
    {
      path: 'life',
      name: 'CheckupEq5d',
      component: () => import('@/views/checkup/life/CheckupEq5d.vue'),
      meta: {
        title: 'Router.checkup.text20',
        class: 'middle checkup-arrow'
      }
    }
  ]
}

export default checkupRouter
