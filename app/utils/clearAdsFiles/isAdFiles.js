const path = require('path')
const fs = require('fs-extra')

const adFileList = require('../../config/index')

function isAdFiles(file) {
  const { base, ext } = path.parse(file)
  if (['.7z', '.zip', '.rar', '.js', '.json'].includes(ext)) {
    return false
  }
  if (fs.statSync(file).size <= 42 * 1024) {
    return true
  }
  if (adFileList.includes(base)) {
    return true
  }
}

module.exports = isAdFiles
