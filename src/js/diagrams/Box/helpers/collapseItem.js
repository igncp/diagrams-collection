export default (item) => {
  if (item.items.length > 0) {
    item.collapsedItems = item.items
    item.collapsed = true
    item.items = []
  }
}
