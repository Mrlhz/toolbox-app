const path = require('path')

const { ensureDirSync } = require('fs-extra')

const { deepFindSync, outputJson, moveFiles } = require('../utils')

 async function initClear(adFiles, RecycleBin) {
  const res = await moveFiles(adFiles, RecycleBin)
  console.log('initClear', res)
}

/**
 * @description 清除文件夹中的广告文件
 */
async function clearAdsFiles(options = {}) {
  const {
    dirname = './', // 要清理文件的路径
  } = options

  let {
    jsonOutput = '', // 广告、垃圾文件json列表路径
    recycleBin, // 广告、垃圾文件存放路径
  } = options

  // const RecycleBin = path.resolve(dirname, 'RecycleBin')
  // const recycleBinBase = path.parse(dirname).base
  // const not = recycleBinBase.includes('RecycleBin')
  if (!recycleBin || dirname === recycleBin) recycleBin = path.resolve(dirname, 'RecycleBin')
  if (dirname === recycleBin) {
    console.log({ msg: 'Source and destination must not be the same.' })
    return
  }

  if (!jsonOutput) {
    jsonOutput = path.resolve(recycleBin, `${path.parse(dirname).name}-${Date.now()}.json`)
    console.log({ jsonOutput })
  }

  let adFiles = []
  deepFindSync(dirname, adFiles) // 1. 递归搜索广告文件

  if (adFiles.length) {
    ensureDirSync(recycleBin) // 2. 创建广告回收路径
    outputJson(jsonOutput, { dirname, recycleBin, adFiles }, { replacer: null, spaces: ' ' }) // 3. 生成广告json list文件 JSON.stringify(adFiles, null, ' ')
    initClear(adFiles, recycleBin) // 4. 移动广告文件到 RecycleBin 文件夹
  }

  if (!adFiles.length) {
    console.log('Ad file not found')
  }
}

module.exports = clearAdsFiles
