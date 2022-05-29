const { flatDirectory } = require('../core/flatDirectory')

function flatAction(program) {
  program.command('flat')
  .alias('f')
  .description('Flatten a directory')
  .option('-s, --src <string>', '要扁平的目录', './')
  .option('-d, --dest <string>', '扁平输出目录', './')
  .option('-re, --remove', '扁平后是否删除空文件夹', false)
  .action((argv, c) => {
    const { src, dest, remove } = argv
    console.log(argv)
    flatDirectory({ src, dest, remove })
  })
}

module.exports = flatAction
