import generateNode from './generateNode'

export default () => {
  const args = Array.prototype.slice.call(arguments)

  args[2] += '<br><strong>PRIVATE</strong>'
  args[3] = 's-t'

  return generateNode(...args)
}
