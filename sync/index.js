function* dummy() {}
const Generator = dummy().constructor

Generator.from = function*(iterable) {
  for (let item of iterable) {
      yield item
  }
}

Generator.of = (...args) => Generator.from(args)

Generator.prototype.toArray = function() {
  const array = []
  for (let item of this) {
    array.push(item)
  }
  return array
}
Generator.prototype.flatMap = function*(mapper) {
  let i = 0
  for (let item of this) {
    const mapped = mapper(item, i++, this)  
    if (mapped) {
      if (mapped[Symbol.iterator] || mapped[Symbol.Iterator]) {
        yield* mapped
      } else {
        throw new Error('Value returned to flatMap must be falsey or iterable.')
      }
    }
  }
}
Generator.prototype.flat = function*(depth = 1) {
  if (depth < 0) throw new Error('Depth must be greater than 0.')
  if (depth === 0) return yield* this
  if (depth === 1) return yield* this.flatMap(x => x)
  yield* this.flatMap(item => item).flat(depth - 1)
}
Generator.prototype.map = function*(mapper) {
  let i = 0;
  for (let item of this) {
    yield mapper(item, i++, this)
  }
}
Generator.prototype.entries = function*() {
  let i = 0;
  for (let item of this) {
    yield [i++, item]
  }
}
Generator.prototype.filter = function*(test) {
  let i = 0;
  for (let item of this) {
    if (test(item, i++, this)) yield item
  }
}
Generator.prototype.find = function(test) {
  let i = 0;
  for (let item of this) {
    if (test(item, i++, this)) return item
  }
}
Generator.prototype.findIndex = function(test) {
  let i = 0;
  for (let item of this) {
    if (test(item, i++, this)) return --i
  }
  return -1
}
Generator.prototype.keys = function*() {
  let i = 0
  for (let item of this) {
    yield i++
  }
}
Generator.prototype.reduce = function(reducer, initialValue) {
  let i = 0
  let acc
  if (arguments.length >= 2) {
    acc = initialValue
    for (let item of this) {
      acc = reducer(acc, item, i++, this)
    }
  } else {
    for (let item of this) {
      if (i++ === 0) acc = item
      else acc = reducer(acc, item, i++, this)
    }
    if (i === 0) throw new TypeError('Reduce of empty collection with no initial value')
  }
  return acc
}
Generator.prototype.some = function(test) {
  let i = 0;
  for (let item of this) {
    if (test(item, i++, this)) return true
  }
  return false
}
Generator.prototype.every = function(test) {
  let i = 0;
  for (let item of this) {
    if (!test(item, i++, this)) return false
  }
  return true
}
Generator.prototype.forEach = function(fn) {
  let i = 0;
  for (let item of this) {
    fn(item, i++, this)
  }
}
Generator.prototype.take = function*(n) {
  if (n <= 0) return
  let i = 0
  for (let item of this) {
    if (i++ >= n) return
    yield item
  }
}
Generator.prototype.drop = function*(n) {
  let i = 0;
  for (let item of this) {
    if (i++ >= n) yield item
  }
}

module.exports = {
    Generator
}