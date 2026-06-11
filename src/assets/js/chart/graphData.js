import { useI18n } from 'vue-i18n'

export const useClusterData = () => {
  const { t } = useI18n()

  const cluster_data = [
    // 0
    {
      top: 0,
      left: -10,
      zoomTop: -250,
      zoomLeft: 0,
      zoomScale: 1.5,
      scale: 0.26,
      symbol: 'triangle'
    },
    // 1
    {
      top: 280,
      left: -55,
      scale: 0.37,
      zoomTop: -460,
      zoomLeft: 5,
      zoomScale: 1.3,
      symbol: 'triangle'
    },
    // 2
    {
      top: 327,
      left: -55,
      scale: 0.18,
      zoomTop: -560,
      zoomLeft: 20,
      zoomScale: 2,
      symbol: 'triangle'
    },
    // 3
    {
      top: 270,
      left: 0,
      scale: 0.24,
      zoomTop: -470,
      zoomLeft: -70,
      zoomScale: 2,
      symbol: 'triangle'
    },
    // 4
    {
      top: -324,
      left: 33,
      scale: 0.2,
      zoomTop: -70,
      zoomLeft: -90,
      zoomScale: 2.75,
      symbol: 'triangle'
    },
    // 5
    {
      top: -252,
      left: 28,
      scale: 0.16,
      zoomTop: -120,
      zoomLeft: -100,
      zoomScale: 3,
      symbol: 'triangle'
    },
    // 6
    {
      top: -272,
      left: -61,
      scale: 0.15,
      zoomTop: -120,
      zoomLeft: 20,
      zoomScale: 3,
      symbol: 'triangle'
    },
    // 7
    {
      top: -127,
      left: -51,
      scale: 0.1,
      zoomTop: -270,
      zoomLeft: -10,
      zoomScale: 3.75,
      symbol: 'triangle'
    },
    // 8
    {
      top: -165,
      left: -57,
      scale: 0.19,
      zoomTop: -200,
      zoomLeft: 15,
      zoomScale: 2.55,
      symbol: 'triangle'
    },
    // 9
    {
      top: -175,
      left: -50,
      scale: 0.23,
      zoomTop: -125,
      zoomLeft: 100,
      zoomScale: 3,
      symbol: 'triangle'
    },
    // 10
    {
      top: 157,
      left: -5,
      scale: 0.34,
      zoomTop: -350,
      zoomLeft: -10,
      zoomScale: 1.5,
      symbol: 'triangle'
    },
    // 11
    {
      top: 205,
      left: -55,
      scale: 0.19,
      zoomTop: -400,
      zoomLeft: 15,
      zoomScale: 1.75,
      symbol: 'triangle'
    },
    // 12
    {
      top: 270,
      left: -40,
      scale: 0.17,
      zoomTop: -520,
      zoomLeft: 20,
      zoomScale: 2,
      symbol: 'triangle'
    },
    // 13
    {
      top: 315,
      left: 50,
      scale: 0.195,
      zoomTop: -600,
      zoomLeft: -110,
      zoomScale: 2.75,
      symbol: 'triangle'
    },
    // 14
    {
      top: 15,
      left: 25,
      scale: 0.35,
      zoomTop: -280,
      zoomLeft: -55,
      zoomScale: 2,
      symbol: 'triangle'
    },
    // 15
    {
      top: 205,
      left: 22,
      scale: 0.15,
      zoomTop: -500,
      zoomLeft: -80,
      zoomScale: 2.75,
      symbol: 'triangle'
    },
    // 16
    {
      top: -80,
      left: -60,
      scale: 0.18,
      zoomTop: -270,
      zoomLeft: 15,
      zoomScale: 3,
      symbol: 'triangle'
    },
    // 17
    {
      top: -12,
      left: -55,
      scale: 0.21,
      zoomTop: -320,
      zoomLeft: 10,
      zoomScale: 2.55,
      symbol: 'triangle'
    },
    // 18
    {
      top: -93,
      left: 35,
      scale: 0.235,
      zoomTop: -250,
      zoomLeft: -70,
      zoomScale: 2.5,
      symbol: 'triangle'
    },
    // 19
    {
      top: -200,
      left: 47,
      scale: 0.19,
      zoomTop: -180,
      zoomLeft: -60,
      zoomScale: 2.25,
      symbol: 'triangle'
    },
    // 20
    {
      top: 22,
      left: 44,
      scale: 0.3,
      zoomTop: -320,
      zoomLeft: -70,
      zoomScale: 2.25,
      symbol: 'triangle'
    },
    // 21
    {
      top: -230,
      left: 31,
      scale: 0.225,
      zoomTop: -120,
      zoomLeft: -80,
      zoomScale: 2.6,
      symbol: 'triangle'
    },
    // 22
    {
      top: -330,
      left: -52,
      scale: 0.18,
      zoomTop: -100,
      zoomLeft: -10,
      zoomScale: 3.5,
      symbol: 'triangle'
    },
    // 23
    {
      top: -227,
      left: -65,
      scale: 0.17,
      zoomTop: -170,
      zoomLeft: 10,
      zoomScale: 3.5,
      symbol: 'triangle'
    }
  ]

  const cluster_name_left = [
    {
      name: t('GraphData.sleep_health'),
      index: 22
    },
    {
      name: t('GraphData.eye_health'),
      index: 6
    },
    {
      name: t('GraphData.nose_sensitivity'),
      index: 23
    },
    {
      name: t('GraphData.immune_function'),
      index: 8
    },
    {
      name: t('GraphData.sensitive_skin_improvement'),
      index: 7
    },
    {
      name: t('GraphData.skin_health'),
      index: 16
    },
    {
      name: t('GraphData.antioxidant'),
      index: 17
    },
    {
      name: t('GraphData.liver_health'),
      index: 0
    },
    {
      name: t('GraphData.stomach_health'),
      index: 11
    },
    {
      name: t('GraphData.intestinal_health'),
      index: 12
    },
    {
      name: t('GraphData.joint_bone_health'),
      index: 2
    }
  ]

  const cluster_name_right = [
    {
      name: t('GraphData.memory_improvement'),
      index: 4
    },
    {
      name: t('GraphData.tension_relief'),
      index: 5
    },
    {
      name: t('GraphData.blood_circulation'),
      index: 21
    },
    {
      name: t('GraphData.blood_pressure_control'),
      index: 19
    },
    {
      name: t('GraphData.blood_sugar_control'),
      index: 18
    },
    {
      name: t('GraphData.blood_lipid_improvement'),
      index: 20
    },
    {
      name: t('GraphData.body_fat_control'),
      index: 14
    },
    {
      name: t('GraphData.exercise_performance_endurance'),
      index: 10
    },
    {
      name: t('GraphData.fatigue_improvement'),
      index: 15
    },
    {
      name: t('GraphData.muscle_strength'),
      index: 3
    },
    {
      name: t('GraphData.prostate_health'),
      index: 13,
      sex: 1
    },
    {
      name: t('GraphData.menopause_women_health'),
      index: 1,
      sex: 2
    }
  ]

  return {
    cluster_data,
    cluster_name_left,
    cluster_name_right
  }
}