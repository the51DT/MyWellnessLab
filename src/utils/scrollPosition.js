/** 맨 위 근처로 보는 범위. BtnTop 의 기본 노출 기준과 같다. */
export const TOP_OFFSET = 100

/**
 * 페이지 맨 아래까지 스크롤했는지.
 * 내용이 짧아 스크롤이 없는 화면도 "맨 아래" 로 계산되므로, TOP_OFFSET 을 넘게 내려온 경우만 참으로 본다.
 * 그래야 목록이 한 화면에 들어올 때 팀 만들기 버튼이 위로 가기 버튼으로 바뀌지 않는다.
 */
export const isScrolledToBottom = () => {
  const scrollY = window.scrollY
  if (scrollY <= TOP_OFFSET) return false
  /* 모바일 브라우저는 소수점 오차가 있어 2px 여유를 둔다 */
  return Math.ceil(scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2
}
