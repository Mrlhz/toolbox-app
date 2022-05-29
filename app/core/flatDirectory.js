const path = require('path')
const fs = require('fs-extra')

function readdirSync(dir) {
  let files = fs.readdirSync(dir, { encoding: 'utf-8' })
  return files
}

function readDirectorySync(dir) {
  let files = readdirSync(dir)
  return files.length === 1 ? path.resolve(dir, files[0]) : files.map(item => path.resolve(dir, item))
}

async function move (src, dest, options = {}) {
  try {
    await fs.move(src, dest, options)
    console.log('success')
  } catch (err) {
    console.error(err)
  }
}

function findDirectorySync(dirs) {
  if (!fs.pathExistsSync(dirs)) {
    return 'none'
  }
  let file = readDirectorySync(dirs)
  while(!Array.isArray(file)) {
    if (fs.statSync(file).isDirectory()) {
      file = readDirectorySync(file)
    }
    if (Array.isArray(file) && file.length) {
      return path.dirname(file[0])
    }
    if (typeof file === 'string' && fs.statSync(file).isFile()) {
      return file
    } else {
      console.log('else', file) // file 空数组
      // break
    }
  }
}

function genOutputPath(src, dest) {
  // 过滤掉文件和已经提取出来的文件夹
  const files = readDirectorySync(src).filter(item => fs.statSync(item).isDirectory() && readdirSync(item).length === 1)
  const list = files.map(item => {
    const file = findDirectorySync(item)
    if (!file) return { src: file, dest: '' } // 空目录返回输出路径为空，用于判断过滤
    const { base } = path.parse(file)
    return {
      src: file,
      dest: path.resolve(dest, base)
    }
  })
  return list
}

async function moveOutNextLevelDirectory({ src, dest, remove }) {
  if (!fs.pathExistsSync(src) || !fs.pathExistsSync(dest)) return
  const list = genOutputPath(src, dest)
  console.log({ list })
  // 过滤掉空目录
  const tasks = list.filter(item => item.dest).map(item => move(item.src, item.dest, { overwrite: false }))
  const result = await Promise.allSettled(tasks)
  await removeEmptyDirectory(src, remove)
  return result
}

// 删除空目录
async function removeEmptyDirectory(pathLike, remove = false) {
  if (!remove) return
  const emptyDirs = fs.readdirSync(pathLike)
    .map(file => path.resolve(pathLike, file))
    .filter(file => fs.statSync(file).isDirectory())
    .filter(file => !fs.readdirSync(file).length)

  const tasks = emptyDirs.map(dir => fs.remove(dir).then(() => dir))
  const result = await Promise.allSettled(tasks)
  console.log(`success deleted the following empty directory: `)
  console.log(result)
  return result
}

module.exports = {
  flatDirectory: moveOutNextLevelDirectory,
  moveOutNextLevelDirectory
}
