function layerClose (type) {

  // 나의 미션 활동 > badges_reward 툴팁 이벤트
  if(type == 'badges_reward') {
    const openButtons = document.querySelectorAll('.badges_reward_btn__open')
    const popups = document.querySelectorAll('.badges_reward_btn__pop')
    const closeButtons = document.querySelectorAll('.badges_reward_btn__pop__close')

    openButtons.forEach((button) => {
      if (button.dataset.layerCloseBound === 'true') return

      button.dataset.layerCloseBound = 'true'
      button.addEventListener('click', (event) => {
        event.preventDefault()
        popups.forEach((popup) => popup.classList.remove('on'))

        const badgeContainer = button.closest('.badge__container')
        const rewardWrap = badgeContainer ? badgeContainer.querySelector('.badges_reward') : null
        const targetPopup = rewardWrap ? rewardWrap.querySelector('.badges_reward_btn__pop') : null
        const popArrow = rewardWrap ? rewardWrap.querySelector('.badges_reward_btn__arrow') : null

        if (targetPopup && rewardWrap && popArrow) {
          const buttonRect = button.getBoundingClientRect()
          const rewardRect = rewardWrap.getBoundingClientRect()
          const arrowLeft = buttonRect.left - rewardRect.left + (buttonRect.width / 2)

          rewardWrap.style.setProperty('--reward-arrow-left', `${arrowLeft}px`)
          targetPopup.classList.add('on')
          popArrow.classList.add('on')
          // document.querySelector("body").style.overflow = "hidden";
        }
      })    
    })

    closeButtons.forEach((button) => {
      if (button.dataset.layerCloseBound === 'true') return

      button.dataset.layerCloseBound = 'true'
      button.addEventListener('click', (event) => {
        event.preventDefault()
        const popup = button.closest('.badges_reward_btn__pop')

        if (popup) {
          popup.classList.remove('on')
          const rewardWrap = popup.closest('.badges_reward')
          const popArrow = rewardWrap ? rewardWrap.querySelector('.badges_reward_btn__arrow') : null

          if (popArrow) {
            popArrow.classList.remove('on')
          }
          // document.querySelector("body").style.overflow = "auto";
        }
      })
    })
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    layerClose('badges_reward')
  }, { once: true })
} else {
  layerClose('badges_reward')
}

export default {
  layerClose,
}
