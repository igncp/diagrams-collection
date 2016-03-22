import { any, curry, forEach } from "ramda"
import { debounce } from "lodash"

import traverseBodyDataAndRefresh from './traverseBodyDataAndRefresh'

const setItemVisibility = curry((isHidden, item) => item.hidden = isHidden)
const showItem = setItemVisibility({ isHidden: false })
const hideItem = setItemVisibility({ isHidden: true })

const isShown = item => item.hidden !== true
const anyParentIsShown = parents => any(parents, isShown)

const handleDisplayOfItem = curry((opts, item, parents) => {
  const shouldShowItemBecauseOtherReasonsThanAMatch = ((opts.showChildren === true)
    && (anyParentIsShown(parents) === true))

  if (shouldShowItemBecauseOtherReasonsThanAMatch) showItem(item)
  else handleDisplayOfItemDependingOnAMatch(opts, item, parents)
})

const handleDisplayOfItemDependingOnAMatch = (opts, item, parents) => {
  const isThereAMatch = new RegExp(opts.str, 'i').test(item.text)

  if (isThereAMatch === false) hideItem(item)
  else {
    forEach(showItem)(parents)
    showItem(item)
  }
}

export default debounce((opts, creationId) => {
  traverseBodyDataAndRefresh(creationId, null, handleDisplayOfItem(opts))
}, 500)
