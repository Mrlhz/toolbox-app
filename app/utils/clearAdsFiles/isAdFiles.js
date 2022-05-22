const path = require('path')
const fs = require('fs-extra')

const adFileList = require('../../config/index')
const { isImage } = require('../isImage')

function isAdFiles(file) {
  const { base, ext } = path.parse(file)
  if (['.7z', '.zip', '.rar', '.js', '.json', '.ts'].includes(ext)) {
    return false
  }
  if (isImage(file) && fs.statSync(file).size <= 42 * 1024) {
    return true
  }
  if (adFileList.includes(base)) {
    return true
  }
}

module.exports = isAdFiles
