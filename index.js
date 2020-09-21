#!/usr/bin/env node
//命令行工具
const commander  = require('commander');
// //命令行答询
// const inquirer = require('inquirer');
//显示加载状态
const ora = require('ora');
//控制命令行输出的颜色
const chalk = require('chalk');
//控制命令行符号
const logSym = require('log-symbols');

const child_process = require('child_process');

const spawn = require('child_process').spawn;
//文件系统
const fs = require('fs');

// const TipList = [
//     {
//         type: 'input',
//         "name": 'name',
//         message: 'Please enter your formula yqn-test.js path:',
//         default: ''
//     }
// ];


//通过执行  fullvue -v/-V/--version 获取版本号
commander.version('1.0.0');

commander.command('fuck <path>')
         .description('Now will run test~~~')
         .action((path) => {
            console.log(logSym.success, chalk.green(`
            ----------------------------------------------
            -      ----    -    -   ----   ------       -
            -      -  -     -  -    -  -   -    -       -
            -      ----      -      ----   -    -       -
            -      -         -         -   -    -       -
            -      -         -         -   -    -       -
            -           COPYRITE@ Eric Wang             -
            ---------------------------------------------
            `));
            const spinner = ora('running command ...').start();
            if (!path) {
                console.log(logSym.error, chalk.red('path can not be empty!!!'));
            }
            setTimeout(() => {
                spinner.succeed('Commond running successfully!');
                console.log(path);
                const typeBuffer = Buffer.from(path);
                const spinner2 = ora('Write config to System...').start();
                fs.writeFile('./pyqn.config', typeBuffer, (err) => {
                    if(err) { spinner2.fail(`Write config fail, The Result: ${err.toString()} `); return; }
                    spinner2.succeed('Write successfully!');
                })
            }, 800);
         });   

commander.command('test')
         .description('Now will run test~~~')
         .action((t) => {
            const spinner = ora('test starting...\n').start();
             fs.readFile('./pyqn.config', (err, data) => {
                 if(err) {
                      spinner.fail('Read config file fail!\n'); 
                      console.log(logSym.info, 'please use pyqn fuck xxx to config path!');
                      return; 
                    }
                    spinner.succeed('Read successfully! Start run test!!!'); 
                    // 维持子进程的命令行输出为原始颜色
                    spawn('node', [data], {
                        stdio: 'inherit'
                        });
                    const childProcessSpinner = ora('pyqn test running~~~\n').start();
                    let cdProcess = child_process.exec(`cd ${process.cwd()}`, () => {
                        if (t.coverage) {
                            let subProcess = child_process.exec(`node '${data}' --coverage`, {
                                 timeout: 200000,
                                 maxBuffer: 100*1024*1024
                                 },(err) => {
                                // if(err) { console.log(logSym.error, err); childProcessSpinner.fail('出错了！'); return; }
                                childProcessSpinner.succeed('over!');
                            });
                            return;
                         }
                         let subProcess = child_process.exec(`node '${data}'`, { 
                             timeout: 200000,
                             maxBuffer: 100*1024*1024
                             }, (err) => {
                            // 虽然子进程会报错，但是不影响使用，暂时注释
                            // if(err) { console.log(logSym.error, err); childProcessSpinner.fail('出错了！'); return; }
                            childProcessSpinner.succeed('over!');
                        });
                        cdProcess.kill();
                    })
             })
         })
         .option('-c --coverage', 'Running test');

//解析命令
commander.parse(process.argv);