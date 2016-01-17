import { defer, each, isNull, isString } from "lodash"

export default (target, conf) => {
  let targetFound = null
  const recursiveFindTarget = (items) => {
    each(items, (item) => {
      if (isNull(targetFound)) {
        if (isString(item.text) && item.text.indexOf(target) > -1) targetFound = item
        else if (item.items) recursiveFindTarget(item.items)
      }
    })
  }
  let currentScroll, scrollElTop

  recursiveFindTarget(conf.body)

  if (targetFound) {
    currentScroll = (window.pageYOffset || document.documentElement.scrollTop)
      - (document.documentElement.clientTop || 0)
    scrollElTop = targetFound.textG[0][0].getBoundingClientRect().top
    defer(() => {
      window.scrollTo(0, scrollElTop + currentScroll)
    })
  }
  console.log("targetFound", targetFound)
}
