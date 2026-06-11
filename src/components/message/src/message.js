import { h, render, getCurrentInstance } from 'vue'
import Message from './Message.vue'
import { MESSAGE_TYPE, MESSAGE_BUTTON_TYPE } from './types'

// 앱 인스턴스 저장
let appContext = null

// 앱 컨텍스트 설정 함수 (main.js에서 호출)
export const setAppContext = (app) => {
  appContext = app._context
}

const createMessage = (vnode) => {
  const container = document.createElement('div')
  
  // ✅ 앱 컨텍스트 전달
  if (appContext) {
    vnode.appContext = appContext
  }
  
  render(vnode, container)
  document.body.appendChild(container.firstElementChild)
}

/**
 * promise 처리용
 * @param resolve
 * @param reject
 * @returns {(function(*): (*))|*}
 */
const handleAction = (resolve, reject) => {
  return (type) => {
    if (type === MESSAGE_BUTTON_TYPE.OK) {
      return resolve(true)
    } else if (type === MESSAGE_BUTTON_TYPE.CANCLE) {
      return resolve(false)
    }

    return reject()
  }
}

/**
 * promise 반환값에 따라 alert 노출
 * @param message
 * @returns {Promise<unknown>}
 */
export const alert = (message) => {
  return new Promise((resolve, reject) => {
    const vnode = h(Message, {
      type: MESSAGE_TYPE.ALERT,
      message,
      doAction: handleAction(resolve, reject)
    })

    createMessage(vnode)
  })
}

/**
 * confirm타입 메시지 생성
 * @param message
 * @returns {Promise<unknown>}
 */
export const confirm = (message) => {
  return new Promise((resolve, reject) => {
    const vnode = h(Message, {
      type: MESSAGE_TYPE.CONFIRM,
      message,
      doAction: handleAction(resolve, reject)
    })

    createMessage(vnode)
  })
}
