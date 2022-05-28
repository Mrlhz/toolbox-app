const path = require('path')

const fs = require('fs-extra')
const { deepTraverse } = require('./deepTraverse')
const { isImage } = require('../../app/utils/index')

// 清理size === 0 损坏的图片
async function remove(pathLike) {
  const result = []
  const allFiles = deepTraverse(pathLike)
  for (let i = 0, l = allFiles.length; i < l; i++) {
    const file = allFiles[i]

    const { size } = fs.statSync(file)
    if (isImage(file) && size < 1) {
      result.push(file)
      await fs.remove(file)
    }
  }

  console.log(result, result.length)
}
