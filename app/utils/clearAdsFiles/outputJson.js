const fs = require('fs-extra')

// dest, data, options = {}
async function outputJson (...args) {
  try {
    await fs.outputJson(...args)
    console.log('success: outputJson')
  } catch (err) {
    console.error(err)
  }
}

module.exports = outputJson
