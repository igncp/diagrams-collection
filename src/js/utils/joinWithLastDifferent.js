export default (arr, separator, lastSeparator) => {
  return arr.slice(0, -1).join(separator) + lastSeparator + arr[arr.length - 1]
}
