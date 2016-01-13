import generateItem from './generateItem'

export default (text, url) => generateItem({ description: url, items: null, options: {
  isLink: true,
}, text })
