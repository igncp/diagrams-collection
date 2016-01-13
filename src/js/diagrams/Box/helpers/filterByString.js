const { any, debounce, each, partial } = _

import traverseBodyDataAndRefresh from './traverseBodyDataAndRefresh'

const setItemVisibility = ({ isHidden }, item) => item.hidden = isHidden
const showItem = partial(setItemVisibility, { isHidden: false })
const hideItem = partial(setItemVisibility, { isHidden: true })

const anyParentIsShown = parents => any(parents, parent => parent.hidden !== true)

const handleDisplayOfItem = (opts, item, parents) => {
  const shouldShowItemBecauseOtherReasonsThanAMatch = opts.showChildren === true
    && anyParentIsShown(parents) === true

  if (shouldShowItemBecauseOtherReasonsThanAMatch) showItem(item)
  else handleDisplayOfItemDependingOnAMatch(opts, item, parents)
}

const handleDisplayOfItemDependingOnAMatch = (opts, item, parents) => {
  const isThereAMatch = new RegExp(opts.str, 'i').test(item.text)

  if (isThereAMatch === false) hideItem(item)
  else {
    each(parents, showItem)
    showItem(item)
  }
}

export default debounce((opts, creationId) => {
  traverseBodyDataAndRefresh(creationId, null, partial(handleDisplayOfItem, opts))
}, 500)
