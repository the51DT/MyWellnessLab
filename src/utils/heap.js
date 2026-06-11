export const requestHeapAnalytics = (to, userInfo) => {
  if (!userInfo) {
    return
  }

  const params = {
    apr_variation: 'a-variation',
    site_country: 'kr',
    site_currencyCode: 'kpw',
    site_language: 'ko',
    site_prefix: 'amway',
    site_region: 'apac',
    site_subRegion: 'korea',
    site_type: 'responsive',
    site_type_short: '',
    site_webProperty: 'Business Tools - Korea',
    site_webProperty_mod: 'mywellnesslab.amway.co.kr | Business Tools - Korea',
    visitor_imcID: String(180 * 100000000000 + Number(userInfo?.customerId)),
    visitor_partyID: userInfo.uid,
    visitor_pinNumber: '',
    visitor_userProfile: '',
    tealium_datasource: 'none',
    page_section: to.name,
    page_name: to.fullPath,
    page_category: to.name,
    page_subCategory: ''
  }

  if (userInfo.accountTypeCode === 'AMWAYBUSINESSNATURE_1') {
    params.visitor_userProfile = 'abo'
  } else if (userInfo.accountTypeCode === 'AMWAYBUSINESSNATURE_2') {
    params.visitor_userProfile = 'member'
  } else if (userInfo.accountTypeCode === 'AMWAYBUSINESSNATURE_4') {
    params.visitor_userProfile = 'customer'
  }

  if (window.utag?.view) {
    window.utag.view(params)
  }
}
