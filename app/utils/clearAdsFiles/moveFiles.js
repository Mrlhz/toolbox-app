const path = require('path')
const { move } = require('fs-extra')

/**
 * @description 移动数组files中的文件到 dest目录
 * @param {*} [files=[]]
 * @param {*} dest
 * @returns
 */
async function moveFiles(files = [], dest) {
  const list = files.map(file => {
    const { base } = path.parse(file)
    const output = path.resolve(dest, base)
    return move(file, output, { overwrite: true })
  })
  return Promise.allSettled(list)
}

module.exports = moveFiles
