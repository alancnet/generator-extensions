# Generator Extensions

_Like Reactive Extensions for Generators_

### Installation

Add the library to your project

```
npm install --save generator-extensions
```

Activate the extensions

```javascript
require('generator-extensions')
```

Use the synchronous extensions

```javascript
function* range(a, b) {
    for (let i = a; i < b; i++) {
        yield i
    }
}

const zero = range(10,20)
    .flatMap(x => [x, -x])
    .map(x => x * 2)
    .reduce((a, b) => a + b)
```

Use the asynchronous extensions

```javascript
async function* range(a, b) {
    for (let i = a; i < b; i++) {
        yield i
    }
}

const zero = range(10,20)
    .flatMap(x => [x, -x])
    .map(x => x * 2)
    .reduce((a, b) => a + b)
```

## Operators

### toArray
Collects the generator into a single array.

<p style="font-size: 18pt">
➊──➋──➌<br />
.toArray()<br />
[➊, ➋, ➌]
</p>

### flatMap
The flatMap() method first maps each element using a mapping function, then flattens the result into a new generator.

<p style="font-size: 18pt">
➊────➋────➌<br />
.flatMap(x => [x, x + 10])<br />
➊─⓫─➋─⓬─➌─⓭
</p>

### map
The map() method creates a new generator with the results of calling a provided function on every element in the calling generator.

<p style="font-size: 18pt">
➊────➋────➌<br />
.map(x => x * 2)<br />
➋────➍────➏
</p>

### entries
The entries() method returns a new generator that contains the key/value pairs for each index in the generator.

<p style="font-size: 18pt">
➊────➋────➌<br />
.entries()<br />
[0,➊]──[1,➋]──[2,➌]
</p>

### filter
The filter() method creates a new generator with all elements that pass the test implemented by the provided function.

<p style="font-size: 18pt">
➊────➋────➌<br />
.filter(x => x < 2)<br />
➊────➋
</p>

### find
The find() method returns the value of the first element in the provided generator that satisfies the provided testing function.

<p style="font-size: 18pt">
➊────➋────➌<br />
.find(x => x > 1)<br />
➋
</p>

### findIndex
The findIndex() method returns the index of the first element in the generator that satisfies the provided testing function. Otherwise, it returns -1, indicating that no element passed the test.
<p style="font-size: 18pt">
➊────➋────➌<br />
.findIndex(x => === 2)<br />
1
</p>

### keys
The keys() method returns a new generator that contains the keys for each index in the generator.
<p style="font-size: 18pt">
➊────➋────➌<br />
.keys()<br />
0────1────2
</p>

### reduce
The reduce() method executes a reducer function (that you provide) on each element of the generator, resulting in a single output value.
<p style="font-size: 18pt">
➊────➋────➌<br />
.reduce((a, b) => a + b, 0)<br />
6
</p>

### some
The some() method tests whether at least one element in the generator passes the test implemented by the provided function. It returns a Boolean value.
<p style="font-size: 18pt">
➊────➋────➌<br />
.some(x => x > 2)<br />
true
</p>

### every
The every() method tests whether all elements in the generator pass the test implemented by the provided function. It returns a Boolean value. 
<p style="font-size: 18pt">
➊────➋────➌<br />
.every(x => x > 2)<br />
false
</p>

### forEach
The forEach() method executes a provided function once for each generator element.

### parallel (async only)
The parallel() method executes a provided async function in parallel with other elements, up to a limit provided by the second parameter (default: Infinity). The resulting generator may be in a different order than the source generator. 

<p style="font-size: 18pt">
➊─➋─➌─➍─➎─➏─➐─➑─➒<br />
.parallel(async x => x, 3)<br />
➊───➍───➐<br />
───➋───➎───➑<br />
──────➌───➏───➒<br />
...<br />
➊─➋─➍─➌─➎─➐─➏─➑─➒<br />
</p>

<!-- 🄌 ➊ ➋ ➌ ➍ ➎ ➏ ➐ ➑ ➒ ➓ ⓫ ⓬ ⓭ ⓮ ⓯ ⓰ ⓱ ⓲ ⓳ ⓴ -->
