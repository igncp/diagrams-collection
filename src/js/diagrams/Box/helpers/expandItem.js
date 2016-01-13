export default (item) => {
  if (item.collapsedItems) {
    item.items = item.collapsedItems
    delete item.collapsedItems
    item.collapsed = false
  }
}
