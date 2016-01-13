import generateNodeWithSharedGet from './generateNodeWithSharedGet'

export default (file) => {
  return () => {
    let opts = ''
    let preffix = ''

    if (arguments[0].split('@')[0] === file) opts = 'b'

    if (arguments.length > 2) preffix = arguments[2]

    if (arguments.length > 3) opts = `${arguments[3]} ${opts}`

    return generateNodeWithSharedGet(arguments[0], arguments[1], preffix, opts)
  }
}
