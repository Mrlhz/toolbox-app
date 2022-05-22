const path = require('path')
const yargs = require('yargs')

const { flatDirectory } = require('./flatDirectory')

function initFlat(argvs) {
  yargs(argvs)
  .command({
    command: 'flat',
    aliases: ['f', 'flatdirs'],
    desc: 'Flatten a directory using the toolbox',
    builder: (yargs) => {
      yargs.default('src', path.resolve('./'))
      yargs.default('dest', path.resolve('./'))
    },
    handler: (argv) => {
      console.log(argv)
      const { src, dest } = argv
      flatDirectory({ src, dest })
    }
  })
  .option('src', {
    alias: 's',
    describe: '要展平的目录',
    default: './'
  })
  .option('dest', {
    alias: 'd',
    describe: '展平输出目录'
  })
  // provide a minimum demand and a minimum demand message
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .argv
}

module.exports = initFlat


// test
/**
 * global
 * t flat
 * t f
 * 
*/

// local
// node initFlat.js t f
// ===
// node initFlat.js t flat
