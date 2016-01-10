const { each } = _

import d from 'diagrams'
import addBodyItemsAndUpdateHeights from './addBodyItemsAndUpdateHeights'

export default (creationId, opts = {}, cb) => {
  const conf = d.Diagram.getDataWithCreationId(creationId)[1]
  const bodyData = conf.body
  const recursiveFn = (items, parents) => {
    each(items, (item) => {
      if (cb) cb(item, parents)

      if (item.items) recursiveFn(item.items, parents.concat(item))

      if (opts.withCollapsedItems && item.collapsedItems)
        recursiveFn(item.collapsedItems, parents.concat(item))
    })
  }

  opts.withCollapsedItems = opts.withCollapsedItems || false
  recursiveFn(bodyData, [])
  addBodyItemsAndUpdateHeights.get()()
}
