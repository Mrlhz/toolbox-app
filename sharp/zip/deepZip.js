const path = require('path')

const fs = require('fs-extra')
const { deepTraverse } = require('./deepTraverse')
const { zipOne } = require('./zipOne')
const { isImage, sleep } = require('../../app/utils/index')

function defaultOutputPath(pathLike, output) {
  const { dir, name } = path.parse(pathLike)
  if (output === pathLike || !output) {
    return path.resolve(dir, `${name}[zip]`)
  }

  return path.resolve(output, `${name}[zip]`)
}

function filterImage(allFiles = [], outputPath) {
  if (!allFiles) return []
  const filterFiles = [] // { file, fileOut }
  const existTasks = []
  for (let k = 0, len = allFiles.length; k < len; k++) {
    const file = allFiles[k]
    if (!isImage(file)) {
      continue
    }
    // { dir: 'F:\\物恋传媒\\菜菜\\xxx', name: '001' } = path.parse(file)
    const { dir, name } = path.parse(file)
    const { base } = path.parse(dir) // base: 'xxx'
    const o = path.resolve(outputPath, base) // 

    // o: 'F:\\物恋传媒\\菜菜[zip]\\xxx'
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

  return { filterFiles, existTasks }
}


async function deepZip(pathLike, output) {
  console.time('Done in ')
  const outputPath = defaultOutputPath(pathLike, output)

  if (!fs.pathExistsSync(outputPath)) {
    fs.ensureDirSync(outputPath)
  }
  const allFiles = deepTraverse(pathLike)
  // filter non-image, copied image
  const { filterFiles, existTasks } = filterImage(allFiles, outputPath) // // { file, fileOut }
  // filter end
  const failTasks = []
  let tasks = []
  const copyTasks = []

  const resultList = []
  for (let i = 0, l = filterFiles.length; i < l; i++) {
    const { file, fileOut, name } = filterFiles[i]
    console.log(name)

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
      const failTaskList = res.filter(({ status, reason, value }) => [status, value && value.status && value.status].includes('rejected')).map(({ status, value, reason }) => {
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
deepZip('F:\\森罗财团\\有料')

// console.log('F:\\物恋传媒\\菜菜\\xxx'.split(path.sep))
