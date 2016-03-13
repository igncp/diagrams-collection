export default (fn) => {
  if (document.readyState === 'complete') fn()
  else window.onload = fn
}
