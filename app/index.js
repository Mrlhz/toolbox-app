// import { hideBin } from 'yargs/helpers' // hideBin是 process.argv.slice(2) 的简写

// const __dirname = path.resolve() // http://nodejs.cn/api-v16/modules.html#__dirname

const { initClearAdsFile, initFlat } = require('./core/index')
console.log('----------------------------')
const argvs = process.argv.slice(2)

initClearAdsFile(argvs)
initFlat(argvs)
