const path = require('path')
const fs = require('fs-extra')
const { readdir } = fs.promises

/**
 * 1. 遍历目录下所有文件夹
 * 2. 循环文件夹下的对应子目录，找到并复制xml文件到目标文件夹(output)
 * todo
 */
async function main(source, output) {
  if (!fs.pathExistsSync(source)) { return }
  await fs.ensureDir(output)
  const list = await getDirs(source)
  console.log(list)
  copyFiles(source, output, list)
}

// 过滤出文件夹和 ini文件
async function getDirs(source) {
  const list = await readdir(source)
  return list.filter(item => {
    if (['弹幕'].includes(item)) return false

    const itemPath = path.resolve(source, item)
    return fs.statSync(itemPath).isDirectory() || item.includes('desktop.ini')
  })
}

async function copyFiles(source, output, list) {
  const customPath = path.resolve(source, list[0], '1', `${list[0]}_1.xml`)
  const isCustomPath = fs.pathExistsSync(customPath)
  console.log({ customPath, isCustomPath, source, output })
  let result = isCustomPath ? customizeCopy(source, output, list) : originalCopy(source, output, list)

  await Promise.allSettled(result)
  console.log(result)
}

// 单个下载到自定义目录
function customizeCopy(source, output, list) {
  const result = []
  list.forEach(file => {
    const xmlFile = path.resolve(source, file, '1', `${file}_1.xml`)
    const outputFile = path.resolve(output, `${file}_1.xml`)
    const iniFile = path.resolve(source, file, 'desktop.ini')
    const iniOutputFile = path.resolve(source, file, 'desktop.txt')
    fs.pathExistsSync(xmlFile) && result.push(copyFile(xmlFile, outputFile))
    fs.pathExistsSync(iniFile) && result.push(copyFile(iniFile, iniOutputFile))
  })
  return result
}

// 合集下载 Operation Collection Directory
function originalCopy(source, output, list) {
  const result = list.map(file => {
    let files = []
    const filePath = path.resolve(source, file)
    if (fs.statSync(filePath).isDirectory()) {
      files = fs.readdirSync(filePath, { encoding: 'utf8' }) //
    }
    const xmlFile = files.find(item => item.includes('.xml'))
    if (xmlFile) {
      const xmlFilePath = path.resolve(source, file, xmlFile)
      const xmlFileOutputPath = path.resolve(output, xmlFile)
      return copyFile(xmlFilePath, xmlFileOutputPath)
    }
    return Promise.resolve(1) // desktop.ini
  })
  const iniFile = path.resolve(source, 'desktop.ini')
  const iniOutputFile = path.resolve(source, 'desktop.txt')
  if (fs.pathExistsSync(iniFile)) {
    fs.copySync(iniFile, iniOutputFile)
  }
  return result
}

async function copyFile(...args) {
  return fs.copy(...args).then(() => 'success').catch(() => 'fail')
}

function init(filePath = path.resolve('.')) {
  main(filePath, path.resolve(filePath, '弹幕'))
}

module.exports = {
  init
}
