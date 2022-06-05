const { Generator } = require('..')
const { expect } = require('chai')

function* test() {
  yield 1
  yield 2
  yield 3
}

describe('generator', () => {
  it('should .toArray()', () => {
    const a = test().toArray()
    expect(a).to.deep.equal([1,2,3])
  })
  it('should .flatMap()', () => {
    const a = test().flatMap(x => [x,x]).toArray()
    expect(a).to.deep.equal([1,1,2,2,3,3])
    const b = test().flatMap(x => null).toArray()
    expect(b).to.deep.equal([])
  })
  it('should .flat()', () => {
    const a = Generator.from([[1,2,3], [4,5,6]]).flat().toArray()
    expect(a).to.deep.equal([1,2,3,4,5,6])
    const b = Generator.from([[[1,2],[3,4]], [[5,6],[7,8]]]).flat(2).toArray()
    expect(b).to.deep.equal([1,2,3,4,5,6,7,8])
  })
  it('should .map()', () => {
    expect(test().map(x => x * 2).toArray())
    .to.deep.equal([2,4,6])
  })
  it('should .entries()', () => {
    expect(test().entries().toArray())
    .to.deep.equal([[0,1], [1,2], [2,3]])
  })
  it('should .filter()', () => {
    expect(test().filter(x => x > 1).toArray())
    .to.deep.equal([2,3])
  })
  it('should .find()', () => {
    expect(test().find(x => x > 1)).to.equal(2)
    expect(test().find(x => x < 0)).to.equal(undefined)
  })
  it('should .findIndex()', () => {
    expect(test().findIndex(x => x > 1)).to.equal(1)
    expect(test().findIndex(x => x < 0)).to.equal(-1)
  })
  it('should .reduce()', () => {
    expect(test().reduce((a, b) => a + b)).to.equal(6)
    expect(test().reduce((a, b) => a + b, 2)).to.equal(8)
  })
  it('should .some()', () => {
    expect(test().some(x => x === 1)).to.equal(true)
    expect(test().some(x => x === -1)).to.equal(false)
  })
  it('should .every()', () => {
    expect(test().every(x => x > 0)).to.equal(true)
    expect(test().every(x => x > 1)).to.equal(false)
  })
  it('should .forEach()', () => {
    let i = 0
    test().forEach(x => i += x)
    expect(i).to.equal(6)
  })
  it('should .take()', async () => {
    expect(test().take(2).toArray())
    .to.deep.equal([1,2])
  })
  it('should .drop()', async () => {
    expect(test().drop(1).toArray())
    .to.deep.equal([2,3])
  })
})