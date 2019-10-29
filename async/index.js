const gefer = require('gefer')
async function* dummy() {}
const AsyncGenerator = dummy().constructor

AsyncGenerator.from = async function*(iterable) {
  if (iterable[Symbol.asyncIterator]) {
    yield* iterable
  } else {
    for (let item of iterable) {
        yield item
    }
  }
}

AsyncGenerator.prototype.toArray = async function() {
  const array = []
  for await (let item of this) {
    array.push(item)
  }
  return array
}
AsyncGenerator.prototype.flatMap = async function*(mapper) {
  let i = 0
  for await (let item of this) {
    const mapped = mapper(item, i++, this)  
    if (mapped) {
      if (mapped[Symbol.iterator] || mapped[Symbol.asyncIterator]) {
        yield* mapped
      } else {
        throw new Error('Value returned to flatMap must be falsey or iterable.')
      }
    }
  }
}
AsyncGenerator.prototype.map = async function*(mapper) {
  let i = 0;
  for await (let item of this) {
    yield mapper(item, i++, this)
  }
}
AsyncGenerator.prototype.entries = async function*() {
  let i = 0;
  for await (let item of this) {
    yield [i++, item]
  }
}
AsyncGenerator.prototype.filter = async function*(test) {
  let i = 0;
  for await (let item of this) {
    if (test(item, i++, this)) yield item
  }
}
AsyncGenerator.prototype.find = async function(test) {
  let i = 0;
  for await (let item of this) {
    if (test(item, i++, this)) return item
  }
}
AsyncGenerator.prototype.findIndex = async function(test) {
  let i = 0;
  for await (let item of this) {
    if (test(item, i++, this)) return --i
  }
  return -1
}
AsyncGenerator.prototype.keys = async function*() {
  let i = 0
  for await (let item of this) {
    yield i++
  }
}
AsyncGenerator.prototype.reduce = async function(reducer, initialValue) {
  let i = 0
  let acc
  if (arguments.length >= 2) {
    acc = initialValue
    for await (let item of this) {
      acc = reducer(acc, item, i++, this)
    }
  } else {
    for await (let item of this) {
      if (i++ === 0) acc = item
      else acc = reducer(acc, item, i++, this)
    }
    if (i === 0) throw new TypeError('Reduce of empty collection with no initial value')
  }
  return acc
}
AsyncGenerator.prototype.some = async function(test) {
  let i = 0;
  for await (let item of this) {
    if (test(item, i++, this)) return true
  }
  return false
}
AsyncGenerator.prototype.every = async function(test) {
  let i = 0;
  for await (let item of this) {
    if (!test(item, i++, this)) return false
  }
  return true
}
AsyncGenerator.prototype.forEach = async function(fn) {
  let i = 0;
  for await (let item of this) {
    await fn(item, i++, this)
  }
}
AsyncGenerator.prototype.take = async function*(n) {
  if (n <= 0) return
  let i = 0
  for await (let item of this) {
    if (i++ >= n) return
    yield item
  }
}
AsyncGenerator.prototype.drop = async function*(n) {
  let i = 0;
  for await (let item of this) {
    if (i++ >= n) yield item
  }
}

// Async only
AsyncGenerator.prototype.then = async function(resolve, reject) {
  let ret
  try {
    while (true) {
      const next = await this.next()
      if (next.done) {
        ret = next.value
        break
      }
    }
  } catch (err) {
    if (reject) return reject(err)
  }
  return resolve && resolve(ret)
}
AsyncGenerator.prototype.then = async function(resolve, reject) {
  let ret
  try {
    while (true) {
      const next = await this.next()
      if (next.done) {
        ret = next.value
        break
      }
    }
  } catch (err) {
    if (reject) return reject(err)
  }
  return resolve && resolve(ret)
}

AsyncGenerator.prototype.parallel = function(fn, threads = Infinity) {
  const subject = gefer.subject()
  let concurrent = 0
  let errored = false
  let done = false
  let completed = false
  const check = () => {
    // Checking...
    if (!errored) {
      //   Not errored
      if (concurrent < threads && !done) {
        //   Ready for more! ${concurrent} < ${threads} && !${done}
        concurrent++
        this.next().then(next => {
          //   Next:
          if (next.done) {
            //   Next says done.
            done = true
            concurrent--
            check()
          } else {
            //   Next says emit.
            let result
            try {
              result = fn(next.value)
              //   Result:
              if (result && result.then) {
                //   Result is a promise
                result.then(
                  (val) => {
                    //   Result resolved
                    subject.next(val)
                    concurrent--
                    check()
                  },
                  (err) => {
                    //   Result rejected
                    errored = true
                    subject.error(err)
                  }
                )
                check()
              } else {
                //   Result is not a promise
                subject.next(result)
                concurrent--
                check()
              }
            } catch (err) {
              //   Fn errored
              errored = true
              subject.error(err)
            }
          }
        })
      } else if (concurrent === 0 && !completed) {
        // ... And we're done!
        completed = true
        subject.return()
      } else {
        // Not ready for more :(
      }
    }
  }
  check()
  return subject()
}
module.exports = {
    AsyncGenerator
}