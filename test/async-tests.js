require('..')
const { expect } = require('chai')

async function* test() {
  yield 1
  yield 2
  yield 3
}

describe('async generator', () => {
  it('should .toArray()', async () => {
    const a = await test().toArray()
    expect(a).to.deep.equal([1,2,3])
  })
  it('should .flatMap()', async () => {
    const a = await test().flatMap(x => [x,x]).toArray()
    expect(a).to.deep.equal([1,1,2,2,3,3])
    const b = await test().flatMap(x => null).toArray()
    expect(b).to.deep.equal([])
  })
  it('should .map()', async () => {
    expect(await test().map(x => x * 2).toArray())
    .to.deep.equal([2,4,6])
  })
  it('should .entries()', async () => {
    expect(await test().entries().toArray())
    .to.deep.equal([[0,1], [1,2], [2,3]])
  })
  it('should .filter()', async () => {
    expect(await test().filter(x => x > 1).toArray())
    .to.deep.equal([2,3])
  })
  it('should .find()', async () => {
    expect(await test().find(x => x > 1)).to.equal(2)
    expect(await test().find(x => x < 0)).to.equal(undefined)
  })
  it('should .findIndex()', async () => {
    expect(await test().findIndex(x => x > 1)).to.equal(1)
    expect(await test().findIndex(x => x < 0)).to.equal(-1)
  })
  it('should .reduce()', async () => {
    expect(await test().reduce((a, b) => a + b)).to.equal(6)
    expect(await test().reduce((a, b) => a + b, 2)).to.equal(8)
  })
  it('should .some()', async () => {
    expect(await test().some(x => x === 1)).to.equal(true)
    expect(await test().some(x => x === -1)).to.equal(false)
  })
  it('should .every()', async () => {
    expect(await test().every(x => x > 0)).to.equal(true)
    expect(await test().every(x => x > 1)).to.equal(false)
  })
  it('should .forEach()', async () => {
    let i = 0
    await test().forEach(x => i += x)
    expect(i).to.equal(6)
  })
  it('should .take()', async () => {
    expect(await test().take(2).toArray())
    .to.deep.equal([1,2])
  })
  it('should .drop()', async () => {
    expect(await test().drop(1).toArray())
    .to.deep.equal([2,3])
  })
})