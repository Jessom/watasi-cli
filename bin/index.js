#!/usr/bin/env node
const program = require('commander')
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const ora = require('ora')
const { version } = require('../package.json')
const utils = require('../utils/index')
const { promptList } = require('../config/index')
const { exec } = require('child_process')

const { green, yellow, blue, red, checkDir } = utils

program.version(version)

/**
 * create a project
 */
program
.command('create <projectName>')
.description('create a project')
.action(async (projectName, cmd) => {
  green(`ð ð ð æ¬¢è¿ä½¿ç¨@watasi/cliï¼è½»æ¾æå»ºé¡¹ç®æ¨¡çï¼`)
  // æ£æµæ¯å¦å­å¨ååæä»¶å¤¹
  await checkDir(path.join(process.cwd(), projectName), projectName)

  inquirer.prompt(promptList).then(result => {
    const { url, gitName, name, val } = result.type
    // green(`======å¼å§æå»º${name}======`)
    const spinner = ora(`å¼å§æå»º${name}`).start()
    if(!url) {
      red(`æä¸æ¯æ${name}...`)
      process.exit(1)
    }

    exec('git clone ' + url, function(error, stdout, stderr) {
      if(error !== null) {
        spinner.stop()
        red(`clone fail, ${error}`)
        return;
      }

      fs.rename(gitName, projectName, err => {
        if(err) {
          exec(`rm -rf ` + gitName, function(err, out) {});
          spinner.stop()
          red(`${projectName}é¡¹ç®å·²å­å¨`)
        } else {
          spinner.stop()
          green(`â é¡¹ç®æ¨¡çåå»ºæï¼ððð`)
        }
      })
    })
  })
})

program.parse(process.argv)
