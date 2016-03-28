import { forEach } from "ramda"

import { Diagram } from "../../../diagram"
import addBodyItemsAndUpdateHeights from './addBodyItemsAndUpdateHeights'

const recursiveFn = ({ cb, items, opts, parents }) => {
  forEach((item) => {
    if (cb) cb(item, parents)

    if (item.items) recursiveFn({ cb, items: item.items, opts, parents: parents.concat(item) })

    if (opts.withCollapsedItems && item.collapsedItems)
      recursiveFn({ cb, items: item.collapsedItems, opts, parents: parents.concat(item) })
  }, items)
}

export default (creationId, opts, cb) => {
  const conf = Diagram.getDataWithCreationId(creationId)[1]
  const bodyData = conf.body

  opts = opts || {}
  opts.withCollapsedItems = opts.withCollapsedItems || false

  recursiveFn({ cb, items: bodyData, opts, parents: [] })
  addBodyItemsAndUpdateHeights.run()
}
