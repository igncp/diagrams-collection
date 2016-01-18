export default (el) => {
  el.attr('transform', d => `translate(${d.x},${d.y})`)
}
