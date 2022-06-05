const { AsyncGenerator } = require('..')
const { expect } = require('chai')

async function* test() {
  yield 1
  yield 2
  yield 3
  return 4
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
  it('should .flat()', async () => {
    const a = await AsyncGenerator.from([[1,2,3], [4,5,6]]).flat().toArray()
    expect(a).to.deep.equal([1,2,3,4,5,6])
    const b = await AsyncGenerator.from([[[1,2],[3,4]], [[5,6],[7,8]]]).flat(2).toArray()
    expect(b).to.deep.equal([1,2,3,4,5,6,7,8])
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
  it('should parallel', async () => {
    let i = 0
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

    let order = ''
    let result = ''
    let fns = [
      async () => {
        await sleep(100)
        order += '1'
        return '1'
      },
      async () => {
        await sleep(80)
        order += '2'
        return '2'
      },
      async () => {
        await sleep(60)
        order += '3'
        return '3'
      },
      async () => {
        await sleep(40)
        order += '4'
        return '4'
      },
      async () => {
        await sleep(20)
        order += '5'
        return '5'
      },
      async () => {
        await sleep(0)
        order += '6'
        return '6'
      }
    ]

    order = ''
    result = (await AsyncGenerator.from(fns).parallel(x => x()).toArray()).join('')
    expect(order).to.equal('654321')
    expect(order).to.equal('654321')
    order = ''
    result = (await AsyncGenerator.from(fns).parallel(x => x(), 1).toArray()).join('')
    expect(order).to.equal('123456')
    expect(order).to.equal('123456')
  })
})