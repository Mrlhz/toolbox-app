const path = require('path')

const fs = require('fs-extra')
const { deepTraverse } = require('./deepTraverse')
const { zipOne } = require('./zipOne')
const { isImage, sleep } = require('../../app/utils/index')

function defaultOutputPath(pathLike, output) {
  const { dir, name } = path.parse(pathLike)
  if (output === pathLike || !output) {
    // return { outputPath: dir, name }
    // todo
    return path.resolve(dir, `${name}[zip]`)
  }

  return path.resolve(output, `${name}[zip]`)
}


async function deepZip(pathLike, output) {
  console.time('Done in ')
  const outputPath = defaultOutputPath(pathLike, output)

  if (!fs.pathExistsSync(outputPath)) {
    fs.ensureDirSync(outputPath)
  }
  const allFiles = deepTraverse(pathLike)
  // const tasks = []
  const failTasks = []
  const existTasks = []
  for (let i = 0, l = allFiles.length; i < l; i++) {
    const file = allFiles[i]
    if (!isImage(file)) {
      continue
    }
    const { dir, name } = path.parse(file) // dir: '' name: 0001
    const { base } = path.parse(dir) // base: ''
    const o = path.resolve(outputPath, base) // 

    // console.log({o}, name)
    // o: ''
    if (!fs.pathExistsSync(o)) {
      fs.ensureDirSync(o)
    }
    const fileOut = path.resolve(o, `${name}.jpeg`)
    if (fs.pathExistsSync(fileOut)) {
      existTasks.push(fileOut)
      continue
    }
    console.log(name)
    try {
      await zipOne({ input: file, fileOut, format: 'jpeg', options: {} })
    } catch(e) {
      console.log(e)
      failTasks.push(file)
      continue
    }

    await sleep(2000)

  }

  // const result = await Promise.allSettled(tasks)
  console.timeEnd('Done in ')
  console.log('exist', existTasks.length)
  console.log({ failTasks })
  await fs.outputJson(`${outputPath}/failTasks-${Date.now()}.json`, { failTasks })
}


deepZip('F:\\xx\\xx')
