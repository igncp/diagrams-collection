import { equals, is, reduce } from "ramda"

const isNull = equals(null)
const isString = is(String)
const recursiveFindTarget = (target, items) => {
  return reduce((foundTarget, item) => {
    if (isNull(foundTarget)) {
      if (isString(item.text) && item.text.indexOf(target) > -1) return item
      else if (item.items) return recursiveFindTarget(target, item.items)

      return null
    }

    return foundTarget
  }, null, items)
}

export default (target, conf) => {
  const targetFound = recursiveFindTarget(target, conf.body)

  if (targetFound) {
    const currentScroll = (window.pageYOffset || document.documentElement.scrollTop)
      - (document.documentElement.clientTop || 0)
    const scrollElTop = targetFound.textG[0][0].getBoundingClientRect().top

    setTimeout(() => {
      window.scrollTo(0, scrollElTop + currentScroll)
    }, 0)
  }
}
