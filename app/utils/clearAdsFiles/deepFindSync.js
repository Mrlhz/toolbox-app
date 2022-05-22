const path = require('path')

const fs = require('fs-extra')
const { readdirSync, statSync } = fs

const isAdFiles = require('./isAdFiles')

/**
 * @description 递归遍历搜索文件
 * @param {*} dir 
 * @param {*} adFiles 
 */
function deepFindSync(dir, adFiles = []) {
  const { base } = path.parse(dir)
  if (base.includes('RecycleBin')) return // 跳过 RecycleBin 目录
  readdirSync(dir).forEach(file => {
    let child = path.resolve(dir, file)
    let stat = statSync(child)
    if (stat.isDirectory()) {
      deepFindSync(child, adFiles)
    } else {
      isAdFiles(child) && adFiles.push(child)
      isAdFiles(child) && console.log('ad File: ', child)
    }
  })
}

module.exports = deepFindSync
