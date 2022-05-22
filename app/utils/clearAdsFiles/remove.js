const fs = require('fs-extra')

async function remove (src) {
  try {
    await fs.remove(src)
    console.log('success: remove')
  } catch (err) {
    console.error(err)
  }
}

module.exports = remove
