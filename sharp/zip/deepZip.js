const path = require('path')

const fs = require('fs-extra')
const { deepTraverse } = require('./deepTraverse')
const { zipOne } = require('./zipOne')
const { isImage, sleep } = require('../../app/utils/index')

/**
 * @description 如果输入路径跟输出路径一样或者 输出路径为空，返回 pathLike + '[zip]'，否则返回填入的输出路径
 * @param {path} pathLike 输入路径
 * @param {*} output 输出路径
 * @returns {string} output + '[zip]'
 * @example
 * defaultOutputPath('F:\\x1\\x2')
 * => 'F:\\x1\\x2[zip]'
 * 
 * defaultOutputPath('F:\\x1\\x2', 'F:\\x1\\x2')
 * => 'F:\\x1\\x2[zip]'
 *
 * defaultOutputPath('F:\\x1\\x2', 'F:\\')
 * => 'F:\\x2[zip]'
 */
function defaultOutputPath(pathLike, output) {
  const { dir, name } = path.parse(pathLike)
  if (output === pathLike || !output) {
    return path.resolve(dir, `${name}[zip]`)
  }

  return path.resolve(output, `${name}[zip]`)
}

/**
 * @description 将输入路径split成数组，获取最后一个路径片段的下标 index
 * @param {path} pathLike A path to a file.
 * @returns {number} Returns the index of the last element, else `-1`.
 * @example
 * getTargetPathIndex('F:\\x1\\x2\\x3')
 * ['F:', 'x1', 'x2', 'x3']
 * return 3
 */
function getTargetPathIndex(pathLike) {
  const pathLikeArray = pathLike.split(path.sep)
  return pathLikeArray.length - 1
}

function getImageList({ allFiles = [], outputPath, start }) {
  if (!allFiles) return []
  const filterFiles = [] // { file, fileOut }
  const existTasks = []
  for (let k = 0, len = allFiles.length; k < len; k++) {
    const file = allFiles[k]
    if (!isImage(file)) {
      continue
    }
    // { dir: 'F:\\x1\\x2\\x3', name: '001' } = path.parse(file)
    const { dir, name } = path.parse(file)

    const filePathArray = file.split(path.sep) // ['F:', 'x1', 'x2', 'x3', '001.jpg']
    const filePartPath = filePathArray.slice(start + 1, filePathArray.length - 1).join(path.sep) // => ['x3'].join('\\')
    const o = path.resolve(outputPath, filePartPath) // pathLike 'F:\\x1\\x2', if output has value 'D:\\x2[zip]\\x3', else 'F:\\x1\\x2[zip]\\x3'
    if (!fs.pathExistsSync(o)) {
      fs.ensureDirSync(o)
    }
    const fileOut = path.resolve(o, `${name}.jpeg`)
    if (fs.pathExistsSync(fileOut)) {
      existTasks.push(fileOut)
      continue
    }
    
    filterFiles.push({ file, fileOut, name })
  }

  fs.outputJsonSync(`${outputPath}/filterFiles-${Date.now()}.json`, { filterFiles, length: filterFiles.length })
  return { filterFiles, existTasks }
}


async function deepZip(pathLike, output) {
  if (!fs.pathExistsSync(pathLike)) return
  console.time('Done in ')
  const outputPath = defaultOutputPath(pathLike, output)

  if (!fs.pathExistsSync(outputPath)) {
    fs.ensureDirSync(outputPath)
  }
  const allFiles = deepTraverse(pathLike)
  const start = getTargetPathIndex(pathLike)
  // filter non-image, copied image
  const { filterFiles, existTasks } = getImageList({ allFiles, outputPath, start }) // { file, fileOut }
  // filter end
  const failTasks = []
  let tasks = []
  const copyTasks = []

  const resultList = []
  for (let i = 0, l = filterFiles.length; i < l; i++) {
    const { file, fileOut, name } = filterFiles[i]
    console.log(name, `i: ${i.toString().padStart(4, ' ')}/${l}`)

    // 1.
    // try {
    //   await zipOne({ input: file, fileOut, format: 'jpeg', options: {} })
    // } catch(e) {
    //   console.log(e)
    //   failTasks.push(file)
    //   copyTasks.push({ oldFile: file, newFile: fileOut })
    //   continue
    // }
    // await sleep(1500)

    // 2.
    // 触发任务
    const isLastOne = i === l - 1
    tasks.push(zipOne({ input: file, fileOut, format: 'jpeg', options: {} }))
    console.log(tasks.length, 'len', i, l)
    if (tasks.length >= 50 || isLastOne) {
      // 提成方法
      const res = await Promise.allSettled(tasks)
      resultList.push(...res)
      const failTaskList = res.filter(({ status, reason, value }) => [status].includes('rejected')).map(({ status, value, reason }) => {
        copyTasks.push({ oldFile: file, newFile: fileOut })
        return { status, reason, file }
      })
      failTasks.push(...failTaskList)
      if (!isLastOne) {
        await sleep(3000)
      }
      tasks = []
    }

  }

  console.timeEnd('Done in ')
  console.log('exist', existTasks.length)
  console.log({ failTasks }, failTasks.length, copyTasks.length)
  // fs.outputJsonSync(`${outputPath}/failTasks-${Date.now()}.json`, { failTasks })
  // fs.outputJsonSync(`${outputPath}/copyTasks-${Date.now()}.json`, { copyTasks })
  await fs.outputJson(`${outputPath}/failTasks-${Date.now()}.json`, { failTasks })
  await fs.outputJson(`${outputPath}/copyTasks-${Date.now()}.json`, { copyTasks })

  fs.outputJsonSync(`${outputPath}/result-${Date.now()}.json`, { resultList })

}


// deepZip('F:\\物恋传媒\\心心')
// deepZip('F:\\物恋传媒\\菜菜\\xxx')
// deepZip('F:\\物恋传媒\\菜菜')
// deepZip('F:\\森罗财团\\森萝财团 JKFUN 《GG-03》JK制服 希晨 [96P1V2.54G]')
// deepZip('F:\\森罗财团\\有料')
deepZip('F:\\微博COSER 木绵绵系列合集')

// e.g. 
// deepZip('F:\\x1\\x2')
