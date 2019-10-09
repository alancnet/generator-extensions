require('.')

async function* test() {
  yield 1
  yield 2
  yield 3
}

async function main() {
  let a = await test()
  a = a.flatMap(x => [x,x])
  a = a.toArray()
  expect(a).to.deep.equal([1,1,2,2,3,3])
}

main()
