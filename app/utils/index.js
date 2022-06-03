const clearAdsFileUtil = require('./clearAdsFiles/index')
const { isImage } = require('./isImage')
const { sleep } = require('./sleep')

module.exports = {
  ...clearAdsFileUtil,
  isImage,
  sleep
}
