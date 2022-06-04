const { init } = require('../core/copy')

function copyAction(program) {
  program.command('copy')
  // .aliases(['copy'])
  .description('备份bilibili弹幕')
  .option('-d, --dirname <string>', '路径', './')
  .action((argv, c) => {
    const { dirname } = argv
    console.log({ dirname })
    init(dirname)
  })
}

module.exports = copyAction
