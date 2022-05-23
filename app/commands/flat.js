const { flatDirectory } = require('../core/flatDirectory')

function flatAction(program) {
  program.command('flat')
  .alias('f')
  .description('Flatten a directory')
  .option('-s, --src <string>', '要扁平的目录', './')
  .option('-d, --dest <string>', '扁平输出目录', './')
  .action((argv, c) => {
    const { src, dest } = argv
    flatDirectory({ src, dest })
  })
}

module.exports = flatAction
