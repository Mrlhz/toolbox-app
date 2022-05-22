const path = require('path')
const yargs = require('yargs')

const clearAdsFiles = require('./clearAdsFiles')

function initClearAdsFile(argvs) {
  yargs(argvs)
  .command({
    command: 'clear',
    aliases: ['clearAd', 'clearad', 'c'],
    desc: 'Using the toolbox',
    builder: (yargs) => yargs.default('dirname', path.resolve('./')),
    handler: (argv) => {
      console.log(argv)
      const { dirname, recycleBin } = argv
      clearAdsFiles({
        dirname,
        recycleBin,
      })
    }
  })
  .option('dirname', {
    alias: 'd',
    describe: '清理路径',
    default: './'
  })
  .option('recycleBin', {
    alias: 'r',
    describe: '回收路径'
  })
  // provide a minimum demand and a minimum demand message
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .argv
}

module.exports = initClearAdsFile

// test
// clearAdsFiles({
//   dirname: 'F:\\SSA丝社\\[SSA丝社] 超清写真 No.207 阳阳 邻家阳光少女 [113P1.36G]',
//   // recycleBin: 'F:\\SSA丝社\\[SSA丝社] 超清写真 No.207 阳阳 邻家阳光少女 [113P1.36G]'
// })

/**
 * global
 * t g
 * t clearAd
*/

// local
// node .\index.js c -r='F:\森罗财团\RecycleBin'
