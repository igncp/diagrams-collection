const { isUndefined } = _

export default class Grid {
  constructor(fixedWidth) {
    this.position = {
      x: 0,
      y: 0,
    }
    this.width = fixedWidth
    this.cells = []
  }
  addItemAtNewRow(item) {
    const counter = 0

    this.position.x = 0
    while (counter < 1000) {
      this.position.y += 1

      if (this.itemFitsAtCurrentPos(item)) break
    }
    this.addItemAtCurrentPos(item)
  }
  addItemAtCurrentPos(item) {
    this.addItemAtPos(item, this.position)
  }
  createRowIfNecessary(posY) {
    if (isUndefined(this.cells[posY])) this.cells[posY] = []
  }
  addItemAtPos(item, pos) {
    let row

    item.x = pos.x
    item.y = pos.y

    for (let i = 0; i < item.height; i++) {
      this.createRowIfNecessary(i + pos.y)
      row = this.cells[i + pos.y]

      for (let j = 0; j < item.width; j++) {
        row[j + pos.x] = true
      }
    }
    this.updatePosition()
  }
  updatePosition() {
    let counter = 0

    while (counter < 1000) {
      this.position.x += 1

      if (this.position.x === this.width) {
        this.position.x = -1
        this.position.y += 1
        this.createRowIfNecessary(this.position.y)
      } else if (this.cells[this.position.y][this.position.x] !== true) {
        break
      }
      counter++
    }
  }
  itemFitsAtPos(item, pos) {
    let row

    for (let i = 0; i < item.height; i++) {
      row = this.cells[i + pos.y]

      if (isUndefined(row)) return true

      for (let j = 0; j < item.width; j++) {
        if (row[j + pos.x] === true) return false

        if ((j + pos.x + 1) > this.width) return false
      }
    }

    return true
  }
  itemFitsAtCurrentPos(item) {
    return this.itemFitsAtPos(item, this.position)
  }
  movePositionToNextRow() {
    this.position.y++
    this.position.x = 0
    this.createRowIfNecessary(this.position.y)
  }
  lastRowIsEmpty() {
    const rows = this.cells.length

    for (let i = 0; i < this.width; i++) {
      if (this.cells[rows - 1][i] === true) return false
    }

    return true
  }
  getSize() {
    const rows = this.cells.length

    return {
      height: (this.lastRowIsEmpty()) ? rows - 1 : rows,
      width: this.width,
    }
  }
}
