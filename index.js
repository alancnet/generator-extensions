const async = require('./async')
const sync = require('./sync')

module.exports = {
  ...async,
  ...sync
}
