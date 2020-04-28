#!/usr/bin/env babel-node --

'use strict'

const program = require('commander')
const spawn = require('child_process').spawn
const fs = require('fs')
const path = require('path')

async function __main__() {
	// parse command line
	program
		.version('1.0.0')
		.usage('[app root]')
		.option('--game-root-url <p>', '游戏跟路径url')
		.option('--channel-id <p>', '渠道id')
		.parse(process.argv)

	// check params
	if(!program.channelId || program.channelId.length <= 0 ||
		!program.gameRootUrl || program.gameRootUrl.length <= 0) {
		console.log(`you should provide channel id and game root url`)
		process.exit(1)
	}

	// get index.vue and replace
	let indexPath = path.resolve(__dirname, '../pages/index.vue')
	let indexVue = fs.readFileSync(indexPath, 'utf-8')
	indexVue = indexVue.replace(/\/\/ XXX - MGC REPLACE START[\s\S]*\/\/ XXX - MGC REPLACE END/, `// XXX - MGC REPLACE START
		mgc.setJSGameRootUrl('${program.gameRootUrl}')
		mgc.setChannelId('${program.channelId}')
		// XXX - MGC REPLACE END`)
	fs.writeFileSync(indexPath, indexVue, 'utf-8')

	// build
	let child = spawn('npm', ['run', 'build'])
	child.stdout.on('data', function (data) { process.stdout.write(data.toString()) })
	child.stderr.on('data', function (data) { process.stdout.write(data.toString()) })
	child.on('close', function (code) {
		process.exit(code)
	})
}

__main__()
