#!/usr/bin/env node
// require('newrelic')
require('heapdump')
const stackimpact = require('stackimpact')
const server = require('./server.compiled')

const agentKey = process.env.STACK_IMPACT_AGENT_KEY
const appName = process.env.NEW_RELIC_APP_NAME

if (agentKey && appName) {
	global.siAgent = stackimpact.start({
		agentKey,
		appName
	});
}

server()
