import Grid from "../Grid"

describeStd(__filename, () => {
  it("Creates the expected fields.", () => {
    const width = 15
    const grid = new Grid(width)

    expect(grid.position).not.to.be.undefined
    expect(grid.position.x).to.eql(0)
    expect(grid.position.y).to.eql(0)
    expect(grid.width).to.eql(width)
    expect(grid.cells.length).to.eql(0)
  })

  it("Adds items at new row.", () => {
    const width = 15
    const item = { height: 1, width: 2 }
    const item2 = { height: 3, width: 4 }
    const grid = new Grid(width)

    grid.addItemAtNewRow(item)

    expect(item.x).to.eql(0)
    expect(item.y).to.eql(1)
    expect(grid.position.x).to.eql(2)
    expect(grid.position.y).to.eql(1)

    grid.addItemAtNewRow(item2)

    expect(item2.x).to.eql(0)
    expect(item2.y).to.eql(2)
    expect(grid.position.x).to.eql(4)
    expect(grid.position.y).to.eql(2)
  })

  it("Adds items at the current position.", () => {
    const width = 15
    const item = { height: 1, width: 2 }
    const item2 = { height: 3, width: 4 }
    const grid = new Grid(width)

    grid.addItemAtCurrentPos(item)

    expect(item.x).to.eql(0)
    expect(item.y).to.eql(0)
    expect(grid.position.x).to.eql(2)
    expect(grid.position.y).to.eql(0)

    grid.addItemAtCurrentPos(item2)

    expect(item2.x).to.eql(2)
    expect(item2.y).to.eql(0)
    expect(grid.position.x).to.eql(6)
    expect(grid.position.y).to.eql(0)
  })

  it("Checks if item fits at current position.", () => {
    const width = 5
    const item = { height: 1, width: 4 }
    const item2 = { height: 1, width: 4 }
    const grid = new Grid(width)

    expect(grid.itemFitsAtCurrentPos(item)).to.eql(true)

    grid.addItemAtCurrentPos(item)

    expect(grid.itemFitsAtCurrentPos(item2)).to.eql(false)
  })

  it("Moves position to next row without checking if it is empty.", () => {
    const width = 5
    const item = { height: 5, width: 4 }
    const grid = new Grid(width)

    expect(grid.position.x).to.eql(0)
    expect(grid.position.y).to.eql(0)

    grid.addItemAtCurrentPos(item)

    expect(grid.position.x).to.eql(4)
    expect(grid.position.y).to.eql(0)

    grid.movePositionToNextRow()

    expect(grid.position.x).to.eql(0)
    expect(grid.position.y).to.eql(1)
  })

  it("Gets the size of the grid.", () => {
    const width = 5
    const item = { height: 5, width: 4 }
    const grid = new Grid(width)

    expect(grid.getSize()).to.eql({ height: 0, width })

    grid.addItemAtCurrentPos(item)

    expect(grid.getSize()).to.eql({ height: 5, width })

  })
})
