const { Command } = require('commander')
const program = new Command()

const pkg = require('../../package.json')

const clearAction = require('./clear')
const flatAction = require('./flat')
const renameAction = require('./rename')
const copyAction = require('./copy')

function init() {
  program
    .name('toolbox-app')
    .description('A toolbox util app')
    .version(pkg.version, '-v, --version')


  clearAction(program)
  flatAction(program)
  renameAction(program)
  copyAction(program)

  program
    .option('-l, --log', 'output argv')

  program.parse()
}

module.exports = init
