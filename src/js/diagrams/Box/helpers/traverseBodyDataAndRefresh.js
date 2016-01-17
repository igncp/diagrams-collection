import { each } from "lodash"

import d from 'diagrams'
import addBodyItemsAndUpdateHeights from './addBodyItemsAndUpdateHeights'

const recursiveFn = ({ cb, items, opts, parents }) => {
  each(items, (item) => {
    if (cb) cb(item, parents)

    if (item.items) recursiveFn({ cb, items: item.items, opts, parents: parents.concat(item) })

    if (opts.withCollapsedItems && item.collapsedItems)
      recursiveFn({ cb, items: item.collapsedItems, opts, parents: parents.concat(item) })
  })
}

export default (creationId, opts, cb) => {
  const conf = d.Diagram.getDataWithCreationId(creationId)[1]
  const bodyData = conf.body

  opts = opts || {}

  opts.withCollapsedItems = opts.withCollapsedItems || false
  recursiveFn({ cb, items: bodyData, opts, parents: [] })
  addBodyItemsAndUpdateHeights.get()()
}
